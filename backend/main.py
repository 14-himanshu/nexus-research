import json
import asyncio
import logging
from fastapi import FastAPI, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, field_validator
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
import os

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

load_dotenv()

from graph import research_graph
from auth import get_current_user, create_access_token, get_password_hash, verify_password
from database import (
    create_user, get_user_by_username, get_user_by_id, update_user_settings,
    save_report, get_history, get_report, delete_report, update_rating
)

app = FastAPI(title="Multi-Agent Research API")

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserCreate(BaseModel):
    username: str
    password: str

class SettingsUpdate(BaseModel):
    gemini_api_key: str

class ChatMessage(BaseModel):
    role: str
    content: str

class ResearchRequest(BaseModel):
    query: str
    depth: str = "standard"
    chat_history: list[ChatMessage] = []

    @field_validator('query')
    @classmethod
    def query_not_empty(cls, v):
        if len(v.strip()) < 3:
            raise ValueError('Query too short')
        if len(v) > 2000:
            raise ValueError('Query too long (max 2000 chars)')
        return v.strip()

    @field_validator('depth')
    @classmethod
    def valid_depth(cls, v):
        if v not in ['quick', 'standard', 'deep']:
            raise ValueError('depth must be quick, standard, or deep')
        return v

@app.post("/signup")
async def signup(user: UserCreate):
    hashed = get_password_hash(user.password)
    user_id = create_user(user.username, hashed)
    if not user_id:
        raise HTTPException(status_code=400, detail="Username already exists")
    token = create_access_token({"sub": user_id})
    return {"access_token": token, "token_type": "bearer"}

@app.post("/login")
async def login(user: UserCreate):
    db_user = get_user_by_username(user.username)
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    token = create_access_token({"sub": db_user["id"]})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/me")
async def get_me(user_id: int = Depends(get_current_user)):
    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404)
    return user

@app.post("/me/settings")
async def update_settings(settings: SettingsUpdate, user_id: int = Depends(get_current_user)):
    update_user_settings(user_id, settings.gemini_api_key)
    return {"status": "success"}

async def generate_sse_events(user_id: int, query: str, depth: str, chat_history: list = []):
    try:
        user = get_user_by_id(user_id)
        user_api_key = user.get("gemini_api_key") if user else None

        initial_state = {
            "user_query": query,
            "depth": depth,
            "messages": chat_history,
            "user_api_key": user_api_key or ""
        }
        
        async for event in research_graph.astream_events(initial_state, version="v1"):
            kind = event["event"]
            
            if kind == "on_chain_start":
                node_name = event.get("name")
                if node_name in ["planner", "researcher", "fact_checker", "writer"]:
                    status_msg = f"Agent {node_name} is thinking..."
                    try:
                        input_data = event.get("data", {}).get("input", {})
                        if isinstance(input_data, dict):
                            if node_name == "planner":
                                status_msg = "Formulating step-by-step research plan..."
                            elif node_name == "researcher":
                                plan = input_data.get("research_plan", [])
                                current_iter = input_data.get("iteration_count", 0)
                                if plan and current_iter < len(plan):
                                    status_msg = f'Searching web for: "{plan[current_iter]}"'
                                else:
                                    status_msg = "Finalizing research..."
                            elif node_name == "fact_checker":
                                status_msg = "Cross-referencing and verifying extracted data..."
                            elif node_name == "writer":
                                status_msg = "Synthesizing verified facts into final report..."
                    except Exception as e:
                        logger.error(f"Error parsing event input: {e}")

                    data = json.dumps({"agent": node_name, "status": status_msg})
                    yield f"event: agent_update\ndata: {data}\n\n"
                    
            elif kind == "on_chat_model_stream":
                tags = event.get("tags", [])
                node_name = event.get("metadata", {}).get("langgraph_node")
                
                if node_name == "writer":
                    chunk = event["data"]["chunk"].content
                    if chunk:
                        data = json.dumps({"token": chunk})
                        yield f"event: token\ndata: {data}\n\n"
            
            elif kind == "on_chain_end":
                if event.get("name") == "writer":
                    final_report = event.get("data", {}).get("output", {}).get("final_report", "")
                    if final_report:
                        report_id = save_report(user_id, query, final_report, depth)
                        data = json.dumps({"report": final_report, "id": report_id})
                        yield f"event: done\ndata: {data}\n\n"
                        
    except asyncio.CancelledError:
        logger.info("Client disconnected, cancelling research task.")
        raise
    except Exception as e:
        logger.error(f"Error in research graph: {e}")
        error_data = json.dumps({"error": str(e)})
        yield f"event: error\ndata: {error_data}\n\n"

@app.get("/")
async def root():
    return {"message": "Multi-Agent Research API", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok", "version": "2.0"}

@app.get("/history")
async def fetch_history(user_id: int = Depends(get_current_user)):
    return get_history(user_id=user_id, limit=20)

@app.get("/history/{report_id}")
async def fetch_report(report_id: int, user_id: int = Depends(get_current_user)):
    report = get_report(user_id, report_id)
    if report:
        return report
    raise HTTPException(status_code=404, detail="Report not found")

@app.delete("/history/{report_id}")
async def delete_history_report(report_id: int, user_id: int = Depends(get_current_user)):
    delete_report(user_id, report_id)
    return {"status": "success"}

@app.post("/history/{report_id}/rate")
async def rate_report(report_id: int, request: Request, user_id: int = Depends(get_current_user)):
    data = await request.json()
    rating = data.get("rating", 0)
    update_rating(user_id, report_id, rating)
    return {"status": "success"}

@app.post("/research")
@limiter.limit("10/minute")
async def research_endpoint(request: Request, body: ResearchRequest, user_id: int = Depends(get_current_user)):
    return StreamingResponse(generate_sse_events(user_id, body.query, body.depth, body.chat_history), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

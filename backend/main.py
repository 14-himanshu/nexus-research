import json
import asyncio
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from dotenv import load_dotenv

# Load env before importing graph so API keys are ready
load_dotenv()

from graph import research_graph

import os

app = FastAPI(title="Multi-Agent Research API")

FRONTEND_URL = os.getenv("FRONTEND_URL", "*")

# Setup CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL] if FRONTEND_URL != "*" else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ResearchRequest(BaseModel):
    query: str
    depth: str = "standard"
    chat_history: list = []  # For future follow-up support

async def generate_sse_events(query: str, depth: str, chat_history: list = []):
    """
    Generator that runs the LangGraph pipeline and yields Server-Sent Events.
    """
    try:
        # Setup initial state
        initial_state = {
            "user_query": query,
            "depth": depth,
            "messages": chat_history
        }
        
        # We use astream_events to get granular updates
        async for event in research_graph.astream_events(initial_state, version="v1"):
            kind = event["event"]
            
            # 1. Capture node transitions (e.g. planner -> researcher)
            if kind == "on_chain_start":
                node_name = event.get("name")
                # Filter out internal langgraph nodes
                if node_name in ["planner", "researcher", "fact_checker", "writer"]:
                    status_msg = f"Agent {node_name} is thinking..."
                    
                    # Try to extract detailed context from the input state
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
                        print(f"Error parsing event input: {e}")

                    data = json.dumps({"agent": node_name, "status": status_msg})
                    yield f"event: agent_update\ndata: {data}\n\n"
                    
            # 2. Capture LLM streaming tokens (specifically from the writer for the final report)
            elif kind == "on_chat_model_stream":
                # Only stream the writer's tokens to the UI (the rest happens in background)
                tags = event.get("tags", [])
                node_name = event.get("metadata", {}).get("langgraph_node")
                
                if node_name == "writer":
                    chunk = event["data"]["chunk"].content
                    if chunk:
                        # Yield token
                        data = json.dumps({"token": chunk})
                        yield f"event: token\ndata: {data}\n\n"
            
            # 3. Capture the final output
            elif kind == "on_chain_end":
                if event.get("name") == "writer":
                    final_report = event.get("data", {}).get("output", {}).get("final_report", "")
                    if final_report:
                        # Save to database
                        from database import save_report
                        report_id = save_report(query, final_report, depth)
                        
                        data = json.dumps({"report": final_report, "id": report_id})
                        yield f"event: done\ndata: {data}\n\n"
                        
    except asyncio.CancelledError:
        print("Client disconnected, cancelling research task.")
        raise
    except Exception as e:
        print(f"Error in research graph: {e}")
        error_data = json.dumps({"error": str(e)})
        yield f"event: error\ndata: {error_data}\n\n"

@app.get("/")
async def root():
    return {"message": "Multi-Agent Research API", "docs": "/docs"}

@app.get("/health")
async def health():
    return {"status": "ok", "version": "1.0"}

@app.get("/history")
async def fetch_history():
    from database import get_history
    return get_history(limit=20)

@app.get("/history/{report_id}")
async def fetch_report(report_id: int):
    from database import get_report
    report = get_report(report_id)
    if report:
        return report
    return {"error": "Report not found"}

@app.delete("/history/{report_id}")
async def delete_history_report(report_id: int):
    from database import delete_report
    delete_report(report_id)
    return {"status": "success"}

@app.post("/history/{report_id}/rate")
async def rate_report(report_id: int, request: Request):
    data = await request.json()
    rating = data.get("rating", 0)
    from database import update_rating
    update_rating(report_id, rating)
    return {"status": "success"}

@app.post("/research")
async def research_endpoint(request: ResearchRequest):
    return StreamingResponse(generate_sse_events(request.query, request.depth, request.chat_history), media_type="text/event-stream")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

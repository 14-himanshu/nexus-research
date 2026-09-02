import json
import logging
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
from .state import AgentState

logger = logging.getLogger(__name__)

PLANNER_PROMPT = """You are an expert Research Director. Your job is to break down the user's research goal into exactly 3 to 5 highly specific, targeted search queries.

Output MUST be a JSON array of strings. No markdown formatting, no explanation. Just the raw JSON array.
Example: ["query 1", "query 2", "query 3"]
"""


async def planner_node(state: AgentState):
    history = state.get("messages", [])
    history_str = ""
    if history:
        history_str = "\n\nPrevious Chat Context:\n"
        for msg in history:
            role = msg.get("role", "unknown")
            content = msg.get("content", "")
            history_str += f"{role.upper()}: {content}\n"
            
    messages = [
        SystemMessage(content=PLANNER_PROMPT),
        HumanMessage(content=f"Research Goal: {state.get('user_query')}{history_str}")
    ]
    
    api_key = state.get("user_api_key")
    if api_key:
        llm = ChatGroq(api_key=api_key, model="llama3-70b-8192", temperature=0)
    else:
        llm = ChatGroq(model="llama3-70b-8192", temperature=0)
        
    response = await llm.ainvoke(messages)
    
    try:
        clean_text = response.content.replace("```json", "").replace("```", "").strip()
        plan = json.loads(clean_text)
        if not isinstance(plan, list):
            plan = [str(plan)]
    except Exception as e:
        logger.error(f"Planner failed to parse JSON: {e}. Raw output: {response.content}")
        # Smarter fallback: split query roughly into 2 terms if possible
        words = state.get('user_query', '').split()
        if len(words) > 3:
            plan = [" ".join(words[:len(words)//2]), " ".join(words[len(words)//2:])]
        else:
            plan = [state.get('user_query')]
        
    return {
        "research_plan": plan,
        "agent_status": "planner",
        "iteration_count": 0, 
        "raw_search_results": [],
        "verified_facts": []
    }

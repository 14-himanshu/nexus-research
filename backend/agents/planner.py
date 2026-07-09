import json
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
from .state import AgentState

# Pydantic is great, but we can also just instruct the model to output a simple JSON list
PLANNER_PROMPT = """You are an expert Research Director. Your job is to break down the user's research goal into exactly 3 to 5 highly specific, targeted search queries.

Output MUST be a JSON array of strings. No markdown formatting, no explanation. Just the raw JSON array.
Example: ["query 1", "query 2", "query 3"]
"""

# Module-level singleton to save cold-start latency
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

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
    
    response = await llm.ainvoke(messages)
    
    try:
        # We strip markdown backticks in case the model ignored instructions
        clean_text = response.content.replace("```json", "").replace("```", "").strip()
        plan = json.loads(clean_text)
        if not isinstance(plan, list):
            plan = [str(plan)]
    except Exception as e:
        print(f"Planner failed to parse JSON: {e}. Raw output: {response.content}")
        # Fallback plan
        plan = [state.get('user_query')]
        
    # We update the state.
    # The planner always resets the plan, raw_search_results, and verified_facts for a fresh run
    return {
        "research_plan": plan,
        "agent_status": "planner",
        # We set iteration_count to 0 here to begin the loop
        "iteration_count": 0, 
        "raw_search_results": [],
        "verified_facts": []
    }

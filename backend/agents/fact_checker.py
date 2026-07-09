import json
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
from .state import AgentState

FACT_CHECKER_PROMPT = """You are a rigorous Fact-Checker. Review the raw search results below.
Extract the most important, relevant facts answering the user's original query.
Output a JSON array of objects representing the verified facts along with their source URLs.
Example: [{"fact": "Tesla revenue was $25B in Q1", "source_url": "https://example.com/tesla"}, {"fact": "Rivian delivered 13k vehicles in Q1", "source_url": "https://example.com/rivian"}]

User Query: {user_query}
"""
# Module-level singleton
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0)

async def fact_checker_node(state: AgentState):
    # We only look at the most recently added raw results to save tokens
    raw_results = state.get("raw_search_results", [])
    if not raw_results:
        return {"agent_status": "fact_checker"}
        
    # Get the latest batch added by the researcher (up to 5)
    newest_results = raw_results[-5:]
    results_str = json.dumps(newest_results, indent=2)
    
    prompt = FACT_CHECKER_PROMPT.replace("{user_query}", state.get("user_query", ""))
    
    messages = [
        SystemMessage(content=prompt),
        HumanMessage(content=f"Raw Results:\n{results_str}")
    ]
    
    response = await llm.ainvoke(messages)
    
    try:
        clean_text = response.content.replace("```json", "").replace("```", "").strip()
        facts = json.loads(clean_text)
        if not isinstance(facts, list):
            facts = [str(facts)]
    except Exception as e:
        print(f"Fact Checker failed to parse JSON: {e}")
        facts = [response.content] # Fallback to raw text
        
    current_iter = state.get("iteration_count", 0)
    
    return {
        "verified_facts": facts,
        "agent_status": "fact_checker",
        "iteration_count": current_iter + 1 # Increment the loop counter!
    }

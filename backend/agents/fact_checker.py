import json
import logging
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
from .state import AgentState

logger = logging.getLogger(__name__)

FACT_CHECKER_PROMPT = """You are a rigorous Fact-Checker. Review the raw search results below.
Extract the most important, relevant facts answering the user's original query.
Output a JSON array of objects representing the verified facts along with their source URLs.
Example: [{"fact": "Tesla revenue was $25B in Q1", "source_url": "https://example.com/tesla"}, {"fact": "Rivian delivered 13k vehicles in Q1", "source_url": "https://example.com/rivian"}]

User Query: {user_query}
"""


async def fact_checker_node(state: AgentState):
    raw_results = state.get("raw_search_results", [])
    if not raw_results:
        return {"agent_status": "fact_checker"}
        
    current_iter = state.get("iteration_count", 0)
    results_per_iter = 5
    start_idx = current_iter * results_per_iter
    newest_results = raw_results[start_idx:start_idx + results_per_iter]
    results_str = json.dumps(newest_results, indent=2)
    
    prompt = FACT_CHECKER_PROMPT.replace("{user_query}", state.get("user_query", ""))
    
    messages = [
        SystemMessage(content=prompt),
        HumanMessage(content=f"Raw Results:\n{results_str}")
    ]
    
    api_key = state.get("user_api_key")
    if api_key:
        llm = ChatGroq(api_key=api_key, model="openai/gpt-oss-120b", temperature=0.1)
    else:
        llm = ChatGroq(model="openai/gpt-oss-120b", temperature=0.1)
        
    response = await llm.ainvoke(messages)
    
    try:
        clean_text = response.content.replace("```json", "").replace("```", "").strip()
        facts = json.loads(clean_text)
        if not isinstance(facts, list):
            facts = [str(facts)]
    except Exception as e:
        logger.error(f"Fact Checker failed to parse JSON: {e}")
        facts = [response.content]
        
    current_iter = state.get("iteration_count", 0)
    
    return {
        "verified_facts": facts,
        "agent_status": "fact_checker",
        "iteration_count": current_iter + 1
    }

from typing import TypedDict, Annotated, List, Any
from langchain_core.messages import BaseMessage
import operator

# Reducer function to append to lists in the state instead of overwriting them
def append_results(existing: list, new: list | str):
    if not existing:
        existing = []
    if isinstance(new, list):
        return existing + new
    if isinstance(new, str) and new:
        return existing + [new]
    return existing

class AgentState(TypedDict):
    user_query: str                  # The original question from the user
    user_api_key: str                # User's BYOK API Key (can be empty string)
    depth: str                       # Search depth (quick, standard, deep)
    research_plan: List[str]         # Planner's list of sub-questions
    
    # Use Annotated with a reducer so each agent can safely append to these lists
    raw_search_results: Annotated[List[dict], append_results]
    verified_facts: Annotated[List[Any], append_results]
    
    final_report: str                # Writer's final Markdown output
    agent_status: str                # e.g. "planning", "researching", "writing"
    iteration_count: int             # Loop guard
    
    # Standard LangGraph message history (we use append_results for simplicity here, though add_messages is typical)
    messages: Annotated[List[BaseMessage], operator.add]

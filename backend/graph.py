import os
import logging
from langgraph.graph import StateGraph, START, END
from agents.state import AgentState
from agents.planner import planner_node
from agents.researcher import researcher_node
from agents.fact_checker import fact_checker_node
from agents.writer import writer_node

logger = logging.getLogger(__name__)

MAX_RESEARCH_ITERATIONS = int(os.getenv("MAX_RESEARCH_ITERATIONS", "3"))

def should_continue_research(state: AgentState):
    """
    Routing logic to decide whether to research more or write the report.
    """
    plan = state.get("research_plan", [])
    current_iter = state.get("iteration_count", 0)
    depth = state.get("depth", "standard")
    
    max_iters = MAX_RESEARCH_ITERATIONS
    if depth == "quick": max_iters = 1
    elif depth == "deep": max_iters = 5
    
    if current_iter >= max_iters or current_iter >= len(plan):
        logger.info("Routing to Writer (Limit reached or Plan exhausted)")
        return "writer"
        
    logger.info("Routing back to Researcher (Continuing Plan)")
    return "researcher"

def create_research_graph():
    graph = StateGraph(AgentState)
    
    graph.add_node("planner", planner_node)
    graph.add_node("researcher", researcher_node)
    graph.add_node("fact_checker", fact_checker_node)
    graph.add_node("writer", writer_node)
    
    graph.set_entry_point("planner")
    
    graph.add_edge("planner", "researcher")
    graph.add_edge("researcher", "fact_checker")
    graph.add_conditional_edges("fact_checker", should_continue_research)
    graph.add_edge("writer", END)
    
    return graph.compile()

research_graph = create_research_graph()

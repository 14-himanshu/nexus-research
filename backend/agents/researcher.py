import asyncio
import logging
from .state import AgentState
from tools.web_search import web_search
from tools.web_scraper import web_scraper

logger = logging.getLogger(__name__)

async def researcher_node(state: AgentState):
    current_iter = state.get("iteration_count", 0)
    plan = state.get("research_plan", [])
    
    if not plan or current_iter >= len(plan):
        return {"agent_status": "researcher"}
        
    current_query = plan[current_iter]
    depth = state.get("depth", "standard")
    
    max_res = 5
    if depth == "quick": max_res = 3
    elif depth == "deep": max_res = 10
    
    logger.info(f"Researcher executing query: {current_query} (depth: {depth})")
    results = await asyncio.to_thread(web_search, current_query, max_results=max_res)
    
    formatted_results = []
    for r in results:
        url = r.get("url", "")
        content = r.get("content", "")
        
        if url and len(formatted_results) < 2:
            logger.info(f"Scraping deep content from: {url}")
            scraped_content = await web_scraper(url, max_length=5000)
            if scraped_content and not scraped_content.startswith("Failed to scrape"):
                content = scraped_content
                
        formatted_results.append({
            "query": current_query,
            "title": r.get("title", ""),
            "url": url,
            "content": content
        })
        
    return {
        "raw_search_results": formatted_results,
        "agent_status": "researcher",
    }

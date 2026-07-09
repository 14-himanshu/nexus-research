import asyncio
from .state import AgentState
from tools.web_search import web_search
from tools.web_scraper import web_scraper

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
    
    print(f"Researcher executing query: {current_query} (depth: {depth})")
    # Call Tavily search in a thread so it doesn't block the async event loop
    results = await asyncio.to_thread(web_search, current_query, max_results=max_res)
    
    formatted_results = []
    for r in results:
        # We will attempt to scrape the top 2 results for deeper content
        url = r.get("url", "")
        content = r.get("content", "")
        
        # Scrape only if we don't have enough content and it's one of the top 2
        if url and len(formatted_results) < 2:
            print(f"Scraping deep content from: {url}")
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

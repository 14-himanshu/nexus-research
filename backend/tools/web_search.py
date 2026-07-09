import os
import time
import logging
from tavily import TavilyClient

logger = logging.getLogger(__name__)

_TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

_client = None
if _TAVILY_API_KEY:
    _client = TavilyClient(api_key=_TAVILY_API_KEY)

def web_search(query: str, max_results: int = 5) -> list[dict]:
    """
    Searches the web using Tavily API.
    Returns a list of dictionaries containing title, url, and content.
    """
    if not _client:
        logger.warning("TAVILY_API_KEY not set. Returning empty results.")
        return []
        
    retries = 3
    for attempt in range(retries):
        try:
            response = _client.search(
                query=query,
                search_depth="advanced",
                max_results=max_results,
                include_answer=True,
                include_raw_content=True
            )
            return response.get("results", [])
        except Exception as e:
            logger.error(f"Error during web search (Attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                time.sleep(2 ** attempt) # Exponential backoff: 1s, 2s
            else:
                return []
    return []

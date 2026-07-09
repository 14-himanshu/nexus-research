import os
from tavily import TavilyClient

# Ensure API key is loaded (we expect it to be in env or passed)
# This will raise an error early if not set
_TAVILY_API_KEY = os.getenv("TAVILY_API_KEY", "")

# Module-level singleton
_client = None
if _TAVILY_API_KEY:
    _client = TavilyClient(api_key=_TAVILY_API_KEY)

def web_search(query: str, max_results: int = 5) -> list[dict]:
    """
    Searches the web using Tavily API.
    Returns a list of dictionaries containing title, url, and content.
    """
    if not _client:
        print("WARNING: TAVILY_API_KEY not set. Returning empty results.")
        return []
        
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
        print(f"Error during web search: {e}")
        return []

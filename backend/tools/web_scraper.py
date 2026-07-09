import httpx
import os

_JINA_API_KEY = os.getenv("JINA_API_KEY", "")

async def web_scraper(url: str, max_length: int = 10000) -> str:
    """
    Scrapes a website and returns clean markdown text using Jina Reader API.
    """
    jina_url = f"https://r.jina.ai/{url}"
    
    headers = {
        "Accept": "text/markdown",
        "X-Return-Format": "markdown",
        "User-Agent": "MultiAgentResearchBot/1.0"
    }
    
    if _JINA_API_KEY:
        headers["Authorization"] = f"Bearer {_JINA_API_KEY}"
    
    # We use a reasonably generous timeout since scraping takes time
    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            response = await client.get(jina_url, headers=headers)
            response.raise_for_status()
            
            content = response.text
            # Truncate to prevent context overflow in LLMs
            if len(content) > max_length:
                return content[:max_length] + "\n\n...[Content Truncated]..."
            return content
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return f"Failed to scrape {url}. Error: {str(e)}"

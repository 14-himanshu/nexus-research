import httpx
import os
import asyncio
import logging

logger = logging.getLogger(__name__)

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
    
    retries = 3
    for attempt in range(retries):
        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                response = await client.get(jina_url, headers=headers)
                response.raise_for_status()
                
                content = response.text
                if len(content) > max_length:
                    return content[:max_length] + "\n\n...[Content Truncated]..."
                return content
        except Exception as e:
            logger.error(f"Error scraping {url} (Attempt {attempt + 1}/{retries}): {e}")
            if attempt < retries - 1:
                await asyncio.sleep(2 ** attempt)
            else:
                return f"Failed to scrape {url}. Error: {str(e)}"
    return ""

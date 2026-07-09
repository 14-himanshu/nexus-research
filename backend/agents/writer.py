from langchain_core.messages import SystemMessage, HumanMessage
from langchain_groq import ChatGroq
from .state import AgentState

WRITER_PROMPT = """You are an expert technical writer and analyst.
Using ONLY the provided verified facts, write a comprehensive, beautifully formatted Markdown report that fully answers the user's query.

REQUIREMENTS:
- Use H2 and H3 markdown headers.
- Use bullet points and bold text for readability.
- If the verified facts contain data, format it into a Markdown table if appropriate.
- DO NOT hallucinate any information. If the facts don't contain the answer, say so.
- Report Structure: Executive Summary -> Key Findings -> Deep Dive -> Conclusion -> References -> Suggested Follow-up Research.
- CITATIONS: Every claim must be followed by a Wikipedia-style inline citation that links directly to the source URL. Format: `[[1]](source_url)`.
- For the "References" section at the end, list the full source URLs provided with the facts in a numbered list corresponding to your inline citations.
- At the very end of the report, under a heading "### Suggested Follow-up Research", provide 3 highly relevant follow-up questions the user might want to explore next.
"""
# Module-level singleton
llm = ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3)

async def writer_node(state: AgentState):
    facts = state.get("verified_facts", [])
    formatted_facts = []
    for f in facts:
        if isinstance(f, dict):
            fact_text = f.get("fact", "")
            source = f.get("source_url", "")
            if fact_text and source:
                formatted_facts.append(f"- {fact_text} (Source: {source})")
            elif fact_text:
                formatted_facts.append(f"- {fact_text}")
        else:
            formatted_facts.append(f"- {f}")
            
    facts_str = "\n".join(formatted_facts)
    
    messages = [
        SystemMessage(content=WRITER_PROMPT),
        HumanMessage(content=f"User Query: {state.get('user_query')}\n\nVerified Facts:\n{facts_str}")
    ]
    
    # We could stream this to the frontend, but LangGraph handles that via astream_events at the API level
    response = await llm.ainvoke(messages)
    
    return {
        "final_report": response.content,
        "agent_status": "writer"
    }

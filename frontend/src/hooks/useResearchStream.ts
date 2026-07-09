import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export type AgentStatus = 'idle' | 'working' | 'done' | 'error';

export interface AgentState {
  name: string;
  statusText: string;
  state: AgentStatus;
}

export function useResearchStream() {
  const [reportTokens, setReportTokens] = useState<string>(() => sessionStorage.getItem('reportTokens') || '');
  const [finalReport, setFinalReport] = useState<string | null>(() => sessionStorage.getItem('finalReport') || null);

  const [agents, setAgents] = useState<Record<string, AgentState>>(() => {
    const hasReport = !!sessionStorage.getItem('finalReport') || !!sessionStorage.getItem('reportTokens');
    return {
      planner: { name: 'Planner', statusText: hasReport ? 'Finished.' : 'Waiting...', state: hasReport ? 'done' : 'idle' },
      researcher: { name: 'Researcher', statusText: hasReport ? 'Finished.' : 'Waiting...', state: hasReport ? 'done' : 'idle' },
      fact_checker: { name: 'Fact-Checker', statusText: hasReport ? 'Finished.' : 'Waiting...', state: hasReport ? 'done' : 'idle' },
      writer: { name: 'Writer', statusText: hasReport ? 'Finished.' : 'Waiting...', state: hasReport ? 'done' : 'idle' },
    };
  });
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportId, setReportId] = useState<number | null>(() => {
    const saved = sessionStorage.getItem('reportId');
    return saved ? parseInt(saved, 10) : null;
  });
  
  const [backendStatus, setBackendStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [totalTime, setTotalTime] = useState<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const [lastQuery, setLastQuery] = useState<string>('');
  
  // Health check polling
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const res = await fetch(`${baseUrl}/health`);
        if (res.ok) setBackendStatus('online');
        else setBackendStatus('offline');
      } catch {
        setBackendStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    sessionStorage.setItem('reportTokens', reportTokens);
  }, [reportTokens]);

  useEffect(() => {
    if (finalReport) {
      sessionStorage.setItem('finalReport', finalReport);
    } else {
      sessionStorage.removeItem('finalReport');
    }
  }, [finalReport]);

  useEffect(() => {
    if (reportId) {
      sessionStorage.setItem('reportId', reportId.toString());
    } else {
      sessionStorage.removeItem('reportId');
    }
  }, [reportId]);
  
  const abortControllerRef = useRef<AbortController | null>(null);

  const startResearch = useCallback(async (query: string, depth: string = 'standard') => {
    // Reset states
    setIsSearching(true);
    setError(null);
    setReportTokens('');
    setFinalReport(null);
    setReportId(null);
    setTotalTime(null);
    setLastQuery(query);
    startTimeRef.current = Date.now();
    setAgents(prev => {
      const reset = { ...prev };
      for (const k in reset) {
        reset[k] = { ...reset[k], state: 'idle', statusText: 'Waiting...' };
      }
      return reset;
    });

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    try {
      const chatHistory = finalReport ? [
        { role: 'user', content: lastQuery },
        { role: 'assistant', content: finalReport }
      ] : [];

      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const response = await fetch(`${baseUrl}/research`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, depth, chat_history: chatHistory }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process SSE lines
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the last incomplete chunk in buffer
        
        for (const chunk of lines) {
          if (!chunk.trim()) continue;
          
          const eventMatch = chunk.match(/event: (.*)\n/);
          const dataMatch = chunk.match(/data: (.*)/);
          
          if (eventMatch && dataMatch) {
            const eventType = eventMatch[1].trim();
            const dataStr = dataMatch[1].trim();
            
            try {
              const data = JSON.parse(dataStr);
              
              if (eventType === 'agent_update') {
                const { agent, status } = data;
                setAgents(prev => {
                  const newState = { ...prev };
                  for (const k in newState) {
                    if (newState[k].state === 'working') {
                        newState[k].state = 'done';
                        if (k === 'planner') newState[k].statusText = 'Created step-by-step research plan.';
                        else if (k === 'researcher') newState[k].statusText = 'Gathered information from web sources.';
                        else if (k === 'fact_checker') newState[k].statusText = 'Verified claims and cross-referenced facts.';
                        else if (k === 'writer') newState[k].statusText = 'Report synthesis complete.';
                        else newState[k].statusText = 'Completed.';
                    }
                  }
                  if (newState[agent]) {
                    newState[agent] = { ...newState[agent], state: 'working', statusText: status };
                  }
                  return newState;
                });
              } else if (eventType === 'token') {
                setReportTokens(prev => prev + data.token);
              } else if (eventType === 'done') {
                setFinalReport(data.report);
                if (data.id) {
                    setReportId(data.id);
                }
                if (startTimeRef.current) {
                  setTotalTime((Date.now() - startTimeRef.current) / 1000);
                }
                setAgents(prev => {
                  const newState = { ...prev };
                  if (newState['planner']) newState['planner'].statusText = 'Created step-by-step research plan.';
                  if (newState['researcher']) newState['researcher'].statusText = 'Gathered information from web sources.';
                  if (newState['fact_checker']) newState['fact_checker'].statusText = 'Verified claims and cross-referenced facts.';
                  if (newState['writer']) newState['writer'].statusText = 'Report synthesis complete.';
                  for (const k in newState) {
                    newState[k].state = 'done';
                  }
                  return newState;
                });
                setIsSearching(false);
              } else if (eventType === 'error') {
                setError(data.error);
                setIsSearching(false);
              }
            } catch (e) {
              console.error("Failed to parse SSE data", e, dataStr);
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error(err);
      setError(err.message || 'An error occurred');
      toast.error('Research pipeline failed');
      setIsSearching(false);
    }
  }, []);

  const stopResearch = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsSearching(false);
      if (startTimeRef.current) {
        setTotalTime((Date.now() - startTimeRef.current) / 1000);
      }
    }
  }, []);

  const restoreReport = useCallback((query: string, report: string, depth: string, id?: number) => {
    setIsSearching(false);
    setError(null);
    setReportTokens('');
    setFinalReport(report);
    if (id) setReportId(id);
    setTotalTime(null);
    setLastQuery(query);
    setAgents(prev => {
      const newState = { ...prev };
      for (const k in newState) {
        newState[k].state = 'done';
        newState[k].statusText = 'Finished.';
      }
      return newState;
    });
  }, []);

  return {
    agents,
    reportTokens,
    finalReport,
    isSearching,
    error,
    lastQuery,
    reportId,
    startResearch,
    stopResearch,
    restoreReport,
    backendStatus,
    totalTime
  };
}

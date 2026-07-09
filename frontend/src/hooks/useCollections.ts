import { useState, useEffect, useCallback } from 'react';
import { API_BASE } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export interface Collection {
  id: number;
  name: string;
}

export function useCollections() {
  const { token } = useAuth();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [activeCollectionId, setActiveCollectionId] = useState<number | null>(null);

  const fetchCollections = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/collections`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCollections(data);
      }
    } catch (e) {
      console.error("Failed to load collections", e);
    }
  }, [token]);

  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  const createCollection = async (name: string) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/collections`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name })
      });
      if (res.ok) {
        const data = await res.json();
        setCollections(prev => [data, ...prev]);
        toast.success("Project created");
      }
    } catch (e) {
      toast.error("Failed to create project");
    }
  };

  const deleteCollection = async (id: number) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/collections/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCollections(prev => prev.filter(c => c.id !== id));
        if (activeCollectionId === id) setActiveCollectionId(null);
        toast.success("Project deleted");
      }
    } catch (e) {
      toast.error("Failed to delete project");
    }
  };

  return {
    collections,
    activeCollectionId,
    setActiveCollectionId,
    createCollection,
    deleteCollection
  };
}

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { X, Key } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, token, updateUser } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user?.gemini_api_key) {
      setApiKey(user.gemini_api_key);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/me/settings`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gemini_api_key: apiKey })
      });
      
      if (!res.ok) throw new Error('Failed to update settings');
      
      updateUser({ ...user!, gemini_api_key: apiKey });
      toast.success('Settings updated successfully!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-md glass-panel rounded-3xl overflow-hidden relative"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Key size={16} />
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors font-mono text-sm"
                placeholder="AIzaSy..."
              />
            </div>
            <p className="text-xs text-zinc-500">
              Provide your own Google Gemini API key to avoid rate limits. It is stored securely in your private workspace.
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-zinc-400 hover:text-white transition-colors text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="ml-3 px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center text-sm"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                'Save Settings'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

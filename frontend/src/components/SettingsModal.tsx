import React, { useState, useEffect } from 'react';
import { API_BASE } from '../lib/api';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { X, Key, Eye, EyeOff } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export function SettingsModal({ onClose }: SettingsModalProps) {
  const { user, token, updateUser } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (user?.gemini_api_key) setApiKey(user.gemini_api_key);
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/me/settings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ gemini_api_key: apiKey }),
      });
      if (!res.ok) throw new Error('Failed to update settings');
      updateUser({ ...user!, gemini_api_key: apiKey });
      toast.success('Settings saved!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="w-full max-w-md bg-[#111118] border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.07]">
          <div>
            <h2 className="text-base font-semibold text-white">Settings</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Configure your workspace</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-500 hover:text-white hover:bg-white/[0.07] transition-all duration-200"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* API Key */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Key size={14} className="text-zinc-500" />
              <label className="text-[13px] font-medium text-zinc-300">Groq API Key</label>
            </div>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={e => setApiKey(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 px-4 pr-11 text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/40 focus:bg-white/[0.06] transition-all duration-200 font-mono text-[13px]"
                placeholder="gsk_..."
              />
              <button
                type="button"
                onClick={() => setShowKey(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                {showKey ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
            <p className="text-[12px] text-zinc-600 leading-relaxed">
              Your Groq API key is encrypted and stored securely. It's used only for your research requests and never shared.
            </p>
          </div>

          {/* Info box */}
          <div className="rounded-xl bg-indigo-500/[0.08] border border-indigo-500/20 px-4 py-3">
            <p className="text-[12px] text-indigo-300/80 leading-relaxed">
              <span className="font-semibold text-indigo-300">BYOK Mode:</span> Providing your own API key bypasses rate limits and enables unlimited research. Get your key at{' '}
              <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-indigo-200">
                console.groq.com
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn-ghost"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : null}
              Save Settings
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

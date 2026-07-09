import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Lock, User as UserIcon, LogIn, UserPlus } from 'lucide-react';

export function AuthModal() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;

    setIsLoading(true);
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const endpoint = isLogin ? '/login' : '/signup';
      
      const res = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed');
      }

      // Fetch user profile
      const userRes = await fetch(`${baseUrl}/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      const userData = await userRes.json();
      
      login(data.access_token, userData);
      toast.success(isLogin ? 'Welcome back!' : 'Account created successfully!');
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
        className="w-full max-w-md p-8 glass-panel rounded-3xl"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10">
            {isLogin ? <LogIn size={28} className="text-white" /> : <UserPlus size={28} className="text-white" />}
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {isLogin ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-zinc-400 text-sm">
            {isLogin ? 'Enter your details to access your workspace.' : 'Start your autonomous research journey.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Username</label>
            <div className="relative">
              <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="Enter username"
                autoComplete="off"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-zinc-300">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !username || !password}
            className="w-full py-3 mt-6 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              isLogin ? 'Sign In' : 'Sign Up'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-white font-medium hover:underline"
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

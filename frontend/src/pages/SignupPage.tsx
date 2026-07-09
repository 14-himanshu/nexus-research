import { useState } from 'react';
import { API_BASE } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Lock, User as UserIcon, Mail, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !email) return;

    if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
    }

    setIsLoading(true);
    try {
      const baseUrl = API_BASE;
      const res = await fetch(`${baseUrl}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }) // Note: Backend might not support email yet, but we collect it in frontend UI for SaaS completeness
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.detail || 'Signup failed');
      }

      // Fetch user profile
      const userRes = await fetch(`${baseUrl}/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` }
      });
      const userData = await userRes.json();
      
      login(data.access_token, userData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex font-sans selection:bg-zinc-800">
      
      {/* Left Column (Brand/Value Prop) */}
      <div className="hidden lg:flex flex-col flex-1 bg-zinc-900 border-r border-zinc-800 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent" />
        
        <div className="relative z-10 flex items-center gap-3 mb-16">
          <div className="w-10 h-10 bg-white text-black rounded-xl flex items-center justify-center font-bold text-xl">
            N
          </div>
          <span className="text-xl font-bold tracking-tight text-white">Nexus</span>
        </div>

        <div className="relative z-10 mt-auto">
          <h2 className="text-4xl font-bold tracking-tight text-white mb-6 leading-tight">
            Start researching <br/>at the speed of thought
          </h2>
          <div className="space-y-4">
            {[
              "Deploy autonomous AI research agents",
              "Bypass rate limits with BYOK architecture",
              "Export beautifully formatted Markdown reports",
              "Enterprise-grade SQLite privacy"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-zinc-400">
                <CheckCircle2 size={20} className="text-purple-500" />
                <span className="font-medium text-[15px]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Form) */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <Link to="/" className="absolute top-8 left-8 text-zinc-500 hover:text-white flex items-center gap-2 transition-colors text-sm font-medium">
          <ChevronLeft size={16} />
          Back to home
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create an account</h1>
            <p className="text-zinc-400">Join Nexus to start your autonomous research journey.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Email address</label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-zinc-300">Username</label>
              <div className="relative">
                <UserIcon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="Choose a username"
                  autoComplete="off"
                  required
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
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>
              {password && password.length < 8 && (
                  <p className="text-xs text-red-400 mt-1">Password must be at least 8 characters.</p>
              )}
            </div>

            <div className="flex items-start mt-4">
              <label className="flex items-start gap-3 text-sm text-zinc-400 cursor-pointer">
                <input type="checkbox" required className="mt-1 rounded border-zinc-800 bg-zinc-900 text-white focus:ring-0" />
                <span>
                    I agree to the <a href="#" className="text-white hover:underline">Terms of Service</a> and <a href="#" className="text-white hover:underline">Privacy Policy</a>.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading || !username || !password || !email}
              className="w-full py-3 mt-6 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create account'
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-zinc-400">
            Already have an account?{' '}
            <Link to="/login" className="text-white font-medium hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

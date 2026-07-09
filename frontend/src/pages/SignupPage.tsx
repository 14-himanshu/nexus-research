import React, { useState } from 'react';
import { API_BASE } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';
import { Lock, User as UserIcon, Mail, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const FEATURES = [
  'Multi-agent research pipeline',
  'BYOK — bring your own API key',
  'Export to Markdown & PDF',
  'Organize reports into projects',
];

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
      toast.error('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Signup failed');

      const userRes = await fetch(`${API_BASE}/me`, {
        headers: { 'Authorization': `Bearer ${data.access_token}` },
      });
      const userData = await userRes.json();

      login(data.access_token, userData);
      toast.success('Account created!');
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center relative overflow-hidden py-12">
      {/* Background glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-600/8 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-600/8 blur-[100px] rounded-full pointer-events-none" />

      {/* Back link */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-[13px] font-medium text-zinc-500 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft size={15} />
        Back
      </Link>

      <div className="w-full max-w-[420px] mx-4">
        {/* Brand */}
        <div className="text-center mb-8">
          <img src="/favicon.svg" alt="Nexus Logo" className="w-12 h-12 mb-5 mx-auto drop-shadow-lg" />
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">Create your account</h1>
          <p className="text-zinc-500 text-[14px]">Start researching at the speed of thought</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-7 backdrop-blur-xl shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">Email address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-200"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">Username</label>
              <div className="relative">
                <UserIcon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-200"
                  placeholder="choose_a_username"
                  autoComplete="off"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-zinc-400">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-[14px] text-white placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all duration-200"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
              </div>
              {password && password.length < 8 && (
                <p className="text-[12px] text-red-400 mt-1">Password must be at least 8 characters</p>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer mt-2">
              <input type="checkbox" required className="mt-0.5 accent-indigo-500 w-4 h-4 shrink-0" />
              <span className="text-[12px] text-zinc-500 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="text-zinc-300 hover:text-white transition-colors">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-zinc-300 hover:text-white transition-colors">Privacy Policy</a>
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !username || !password || !email}
              className="w-full py-3 mt-2 bg-white text-black font-semibold rounded-xl hover:bg-zinc-100 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[14px] shadow-lg shadow-white/10"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Features */}
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <p className="text-[11px] font-medium text-zinc-600 uppercase tracking-widest mb-3">What's included</p>
            <div className="grid grid-cols-2 gap-2">
              {FEATURES.map(f => (
                <div key={f} className="flex items-start gap-2">
                  <CheckCircle2 size={13} className="text-emerald-500 mt-0.5 shrink-0" />
                  <span className="text-[12px] text-zinc-500">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[13px] text-zinc-600 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-zinc-300 hover:text-white font-medium transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}

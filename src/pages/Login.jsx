import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react';

/**
 * Login Component
 * Highly aesthetic, responsive sign-in screen featuring glassmorphism and validation status states.
 */
const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error('Login submission failed:', err);
      // Retrieve the structured message from backend response if available
      const data = err.response?.data;
      const errMsg = data?.message
        || (data?.errors && data.errors.map(e => e.message).join('. '))
        || 'Invalid email or password. Please try again.';
      setError(errMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 dark:bg-[#09090a] p-4 font-roboto">
      {/* Background visual decorations */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-indigo-500/10 dark:bg-indigo-500/5 rounded-full filter blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/10 dark:bg-violet-500/5 rounded-full filter blur-3xl pointer-events-none"></div>

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-800/50 p-8 shadow-2xl transition-all duration-300">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-2 mb-8">
          <div className="p-3 bg-gradient-to-tr from-indigo-500 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/25">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your Startup CRM Lite dashboard
          </p>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="flex items-center gap-2.5 p-4 mb-6 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-450 border border-rose-100 dark:border-rose-950/30 text-sm font-semibold">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-450 dark:text-slate-550">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 text-sm transition-all"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-650 dark:text-slate-400 uppercase tracking-wider">
                Password
              </label>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-450 dark:text-slate-550">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 text-sm transition-all"
              />
            </div>
          </div>

          {/* Submission Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-indigo-600 hover:bg-indigo-550 active:scale-98 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4.5 w-4.5 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Footer Redirect Link */}
        <div className="mt-8 text-center border-t border-slate-100 dark:border-slate-850/65 pt-6">
          <p className="text-sm text-slate-500 dark:text-slate-450">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              Sign up now
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;

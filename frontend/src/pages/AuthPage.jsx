import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Github, ArrowRight, Check } from 'lucide-react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? 'http://127.0.0.1:8000/login' : 'http://127.0.0.1:8000/register';
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token', data.access_token);
            navigate('/input'); // Corrected navigation to existing route
        } else {
            alert(data.detail || 'Authentication failed');
        }
    } catch (error) {
        alert('Failed to connect to server. Ensure backend is running.');
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-20 px-4 md:px-0 flex items-center justify-center bg-background relative overflow-hidden">
        {/* Static Background Grid */}
        <div className="absolute inset-0 static-grid pointer-events-none opacity-[0.3]"></div>

        <div className="container max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Left Side - Product Details */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="hidden lg:block space-y-8"
            >
                <div>
                    <span className="inline-block px-3 py-1 mb-4 text-xs font-semibold text-primary bg-primary/10 rounded-full">
                        AI-Powered Career Audits
                    </span>
                    <h1 className="text-5xl font-extrabold leading-tight tracking-tight">
                        Join the Top 1% of <br />
                        <span className="text-primary">Professionals.</span>
                    </h1>
                </div>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                    Stop submitting resumes into the black hole. Get the insights you need to beat the ATS and impress hiring managers.
                </p>

                <div className="space-y-4">
                    {[
                        "Instant Resume Scoring vs. Market Leaders",
                        "Personalized Upskilling Roadmap",
                        "Mock Interviews with AI Persona"
                    ].map((item, i) => (
                        <div key={i} className="flex items-center gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                            <div className="bg-primary/20 text-primary p-2 rounded-full">
                                <Check className="w-5 h-5" />
                            </div>
                            <span className="font-semibold text-lg">{item}</span>
                        </div>
                    ))}
                </div>
                
                <div className="pt-8 flex items-center gap-4 border-t border-border mt-8">
                     <div className="flex -space-x-4">
                        {[1,2,3,4].map(i => (
                            <div key={i} className="w-12 h-12 rounded-full border-2 border-background bg-zinc-200 flex items-center justify-center overflow-hidden">
                                <span className="text-xs font-bold text-zinc-500">U{i}</span>
                            </div>
                        ))}
                     </div>
                     <div>
                         <p className="font-bold">10,000+ Users</p>
                         <p className="text-sm text-muted-foreground">Trusted by devs from FAANG</p>
                     </div>
                </div>
            </motion.div>

            {/* Right Side - Auth Form */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-card p-8 md:p-12 rounded-3xl border border-border shadow-sm"
            >
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold mb-2">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-muted-foreground">
                        {isLogin ? 'Enter your details to access your dashboard' : 'Start your journey to career layout excellence'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {!isLogin && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium ml-1">Full Name</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <input 
                                    type="text" 
                                    placeholder="John Doe"
                                    className="w-full bg-secondary/30 border border-input focus:border-primary focus:bg-background rounded-xl px-12 py-3 outline-none transition-colors"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="email" 
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-secondary/30 border border-input focus:border-primary focus:bg-background rounded-xl px-12 py-3 outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium ml-1">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <input 
                                type="password" 
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-secondary/30 border border-input focus:border-primary focus:bg-background rounded-xl px-12 py-3 outline-none transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg py-3 rounded-xl shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Free Account')}
                    </button>
                </form>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
                    <div className="relative flex justify-center text-xs uppercase"><span className="bg-background px-2 text-muted-foreground">Or continue with</span></div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary border border-border rounded-xl py-3 transition-colors font-medium text-sm">
                        <Github className="w-5 h-5" /> GitHub
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-secondary/30 hover:bg-secondary border border-border rounded-xl py-3 transition-colors font-medium text-sm">
                        <span className="font-bold text-lg">G</span> Google
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <button 
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-muted-foreground hover:text-foreground font-medium transition-colors flex items-center justify-center gap-1 mx-auto"
                    >
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>

        </div>
    </div>
  );
};

export default AuthPage;

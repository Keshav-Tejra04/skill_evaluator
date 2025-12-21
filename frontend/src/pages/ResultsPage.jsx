import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { AlertTriangle, Brain, Users, Zap, CheckCircle, TrendingUp, ChevronRight, Trophy, Code, Briefcase, Award, ScrollText, Frown, ClipboardCheck } from 'lucide-react';
import { clsx } from 'clsx';

// Radar Chart Data - Resume Derivable Metrics
const SKILL_DATA = [
  { subject: 'Tech Stack', A: 40, B: 150, fullMark: 150 }, 
  { subject: 'Complexity', A: 30, B: 140, fullMark: 150 },     
  { subject: 'Experience', A: 50, B: 150, fullMark: 150 },     
  { subject: 'ATS Score', A: 60, B: 100, fullMark: 100 },              
  { subject: 'Buzzwords', A: 70, B: 120, fullMark: 150 },         
  { subject: 'Pedigree', A: 40, B: 150, fullMark: 150 },     
];

// Direct Comparison - Resume Derivable Data Points
const COMPARISON_METRICS = [
  { 
    label: 'Hardest Project', 
    you: 'Weather App', 
    sharma: 'Custom Kernel', 
    icon: Code,
    status: 'critical' 
  },
  { 
    label: 'Internships', 
    you: '1 (Unpaid)', 
    sharma: '3 (MNCs)', 
    icon: Briefcase,
    status: 'critical' 
  },
  { 
    label: 'Certifications', 
    you: 'Udemy PDF', 
    sharma: 'AWS Architect', 
    icon: Award,
    status: 'warning' 
  },
  { 
    label: 'Resume Length', 
    you: '2 Pages', 
    sharma: '1 Page', 
    icon: ScrollText,
    status: 'warning' 
  },
];

const FEEDBACK_CARDS = [
  {
    title: "Project Choice",
    score: "Basic",
    insight: "You built a 'Calculator'. Sharma Ji's son built a decentralized exchange.",
    type: "critical"
  },
  {
    title: "Skill Proficiency",
    score: "Surface Level",
    insight: "You listed 'Microsoft Word'. He is contributing to the Linux Kernel.",
    type: "critical"
  },
  {
    title: "Experience Gap",
    score: "Concerning",
    insight: "There is a 6-month gap. He launched a startup in his summer break.",
    type: "warning"
  }
];

const ResultsPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate complex analysis
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background relative overflow-hidden">
        <div className="w-16 h-16 border-4 border-muted border-t-primary rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-bold mb-2">Analyzing your worth...</h2>
        <p className="text-muted-foreground">Asking neighbor's son for his resume to compare...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-background flex flex-col overflow-hidden relative"> 
      
      {/* Header - Fixed Height, No Scroll */}
      <header className="z-40 bg-background/80 backdrop-blur-md border-b border-border transition-all duration-300 shrink-0">
        <div className="w-full px-6 md:px-12 py-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-red-600 dark:text-red-400">REALITY CHECK REPORT</h1>
            </div>
            <button 
                onClick={() => navigate('/chat')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-lg font-bold flex items-center gap-2 shadow-sm transition-colors text-xs"
              >
                <Zap className="w-3 h-3" /> Explain Yourself (Chat)
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Flex Grow, No Scroll on Main, Fit Content */}
      <main className="w-full px-6 md:px-12 py-4 flex-1 h-full overflow-hidden flex flex-col gap-4">
        
        {/* Row 1: Hero Score & Alert - Restored Height for Breathing Room */}
        <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 shrink-0 h-32"
        >
            {/* Score Card (3/12) */}
            <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4 flex flex-col justify-between shadow-sm relative overflow-hidden h-full">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                    <Frown className="w-20 h-20" />
                </div>
                <div>
                     <h3 className="text-muted-foreground font-medium uppercase tracking-wider text-[11px]">Parental Satisfaction</h3>
                     <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-extrabold text-red-500 tracking-tighter">12</span>
                        <span className="text-sm text-muted-foreground font-medium">/100</span>
                     </div>
                </div>
                <div className="mt-auto">
                    <p className="text-xs text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2.5 py-1 rounded-md inline-block">
                        Status: "Log Kya Kahenge?"
                    </p>
                </div>
            </div>

            {/* Main Alert Text (9/12) */}
            <div className="lg:col-span-9 bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-900/30 rounded-xl p-5 flex items-center gap-5 shadow-sm h-full">
                <div className="bg-red-100 dark:bg-red-900/20 p-3.5 rounded-full shrink-0">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex flex-col justify-center">
                     <h2 className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                        We found significant gaps in your profile.
                     </h2>
                     <p className="text-red-800 dark:text-red-200 text-sm italic leading-snug">
                        "Look at Sharma Ji's son. He knows Kubernetes. You are still Googling 'how to center a div'. What will I tell your uncle at the wedding? He just bought a 3BHK in Bangalore!"
                     </p>
                </div>
            </div>
        </motion.div>

        {/* Row 2: 3-Column Dashboard Grid - Balanced 4-3-5 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 min-h-0 pb-2">
          
          {/* Column 1: Radar Chart (4/12) */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-4 bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col h-full overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2 shrink-0">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" /> Career Potential
              </h3>
            </div>
            
            <div className="flex-1 w-full relative min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={SKILL_DATA}>
                  <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
                  <Radar
                    name="You"
                    dataKey="A"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Sharma Ji"
                    dataKey="B"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '13px' }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            {/* Legend Footer */}
            <div className="flex items-center justify-center gap-4 text-xs font-medium text-muted-foreground mt-2 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span> You
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Sharma Ji
                </div>
            </div>
          </motion.div>

          {/* Column 2: Comparison List (3/12) */}
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col h-full overflow-hidden"
          >
            <h3 className="text-base font-bold flex items-center gap-2 mb-4 shrink-0">
              <Trophy className="w-5 h-5 text-yellow-500" /> Resume Face-Off
            </h3>
            <div className="space-y-3 flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar min-h-0">
              {COMPARISON_METRICS.map((metric, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 mb-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                     <metric.icon className="w-3.5 h-3.5" /> {metric.label}
                  </div>
                  
                  <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-xs text-muted-foreground w-8">You</span>
                          <span className="font-bold text-red-600 truncate text-right flex-1">{metric.you}</span>
                      </div>
                      <div className="w-full h-px bg-border/50"></div>
                      <div className="flex justify-between items-center text-sm">
                          <span className="text-xs text-muted-foreground w-8">Him</span>
                          <span className="font-bold text-emerald-600 truncate text-right flex-1">{metric.sharma}</span>
                      </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        
          {/* Column 3: Detailed Analysis (5/12) */}
          <motion.div 
             initial={{ y: 10, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="lg:col-span-5 flex flex-col gap-4 h-full overflow-hidden"
          >
             <div className="bg-card border border-border p-4 rounded-xl shadow-sm h-full overflow-hidden flex flex-col">
                 <h3 className="text-base font-bold flex items-center gap-2 mb-4 shrink-0">
                    <ClipboardCheck className="w-5 h-5 text-blue-500" /> Analysis
                 </h3>
                 <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1 min-h-0">
                    {FEEDBACK_CARDS.map((card, idx) => (
                        <div key={idx} className="relative p-4 rounded-lg border border-border bg-secondary/10 hover:bg-secondary/30 transition-colors group">
                             <div className={clsx(
                                "absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full",
                                card.type === 'critical' ? 'bg-red-500' : 'bg-amber-500'
                             )}></div>
                             <div className="pl-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-base">{card.title}</h4>
                                    <span className={clsx(
                                        "text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider",
                                        card.type === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    )}>{card.score}</span>
                                </div>
                                <p className="text-sm text-muted-foreground italic leading-relaxed">
                                    "{card.insight}"
                                </p>
                             </div>
                        </div>
                    ))}
                 </div>
                 <div className="mt-3 shrink-0">
                    <button className="w-full py-2.5 text-sm font-bold text-primary bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors flex items-center justify-center gap-1">
                        View 10-Page Report <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
             </div>
          </motion.div>

        </div>

      </main>
    </div>
  );
};

export default ResultsPage;

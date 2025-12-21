import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';
import { AlertTriangle, Brain, CheckCircle, Trophy, Code, Briefcase, Award, ScrollText, Frown, ClipboardCheck, Zap } from 'lucide-react';
import { clsx } from 'clsx';

// Icon Helper
const getIconForMetric = (label) => {
    const l = label.toLowerCase();
    if (l.includes('code') || l.includes('project')) return Code;
    if (l.includes('experience') || l.includes('internship')) return Briefcase;
    if (l.includes('cert') || l.includes('award')) return Award;
    if (l.includes('len') || l.includes('format')) return ScrollText;
    return CheckCircle; 
};

const ResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { analysisResult } = location.state || {}; // Get data passed from InputPage

  // Redirect if no data (e.g. user refreshed page or came directly)
  useEffect(() => {
    if (!analysisResult) {
        navigate('/input');
    }
  }, [analysisResult, navigate]);

  if (!analysisResult) return null; // Or a loading spinner while redirecting

  // Destructure Data from Intelligence API
  const { 
      score, 
      score_status, 
      alert_title, 
      alert_message, 
      radar_data, 
      comparison_metrics, 
      feedback_cards,
      growth_verdict 
  } = analysisResult;

  return (
    <div className="h-full w-full bg-background flex flex-col overflow-hidden relative"> 
      
      {/* Header - Fixed Height, No Scroll */}
      <header className="z-40 bg-background/80 backdrop-blur-md transition-all duration-300 shrink-0">
        <div className="w-full px-6 md:px-12 py-2">
          <div className="flex items-center justify-between">
            <div className="bg-red-500/5 backdrop-blur-xl border border-red-500/10 shadow-[0_20px_50px_rgba(0,0,0,0.2)] rounded-2xl px-6 py-2 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000"></div>
              <h1 className="text-xl font-black tracking-tight text-red-600 dark:text-red-400 drop-shadow-sm">REALITY CHECK REPORT</h1>
            </div>
            
            <button 
                onClick={() => navigate('/input')}
                className="text-xs font-bold text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 border px-4 py-2 rounded-lg hover:border-primary/50"
            >
                <ClipboardCheck className="w-4 h-4" /> Update Info & Retry
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
                <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-15">
                    <Frown className="w-24 h-24" />
                </div>
                <div>
                     <h3 className="text-muted-foreground font-medium uppercase tracking-wider text-[11px]">Parental Satisfaction</h3>
                     <div className="flex items-baseline gap-2 mt-1">
                        <span className="text-4xl font-extrabold text-red-500 tracking-tighter">{score}</span>
                        <span className="text-sm text-muted-foreground font-medium">/100</span>
                     </div>
                </div>
                <div className="mt-auto">
                    <p className="text-xs text-red-600 font-bold bg-red-100 dark:bg-red-900/30 px-2.5 py-1 rounded-md inline-block">
                        {score_status}
                    </p>
                </div>
            </div>

            {/* Main Alert Text (9/12) */}
            <div className="lg:col-span-9 bg-red-50 border border-red-200 dark:bg-red-900/10 dark:border-red-900/30 rounded-xl p-5 flex items-center gap-5 shadow-sm h-full overflow-y-auto custom-scrollbar">
                <div className="bg-red-100 dark:bg-red-900/20 p-3.5 rounded-full shrink-0">
                    <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex flex-col justify-center">
                     <h2 className="text-lg font-bold text-red-900 dark:text-red-100 mb-1">
                        {alert_title}
                     </h2>
                     <p className="text-red-800 dark:text-red-200 text-sm italic leading-snug">
                        "{alert_message}"
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
            <div className="flex items-center justify-between mb-2 shrink-0 group relative">
              <h3 className="text-base font-bold flex items-center gap-2 cursor-help">
                <Brain className="w-5 h-5 text-primary" /> Career Potential
              </h3>
               {/* Tooltip on Hover */}
               <div className="absolute left-0 top-6 bg-popover text-popover-foreground text-xs p-2 rounded border shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-64">
                   Compares your profile against "Sharma Ji's Beta" (The Perfect Candidate for this Role) across 6 key dimensions.
               </div>
            </div>
            
            <div className="flex-1 w-full relative min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radar_data}>
                  <PolarGrid stroke="hsl(var(--border))" strokeDasharray="3 3" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 700 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                  <Radar
                    name="You"
                    dataKey="A"
                    stroke="#6366f1"
                    strokeWidth={3}
                    fill="#6366f1"
                    fillOpacity={0.2}
                  />
                  <Radar
                    name="Sharma Ji Ka Beta"
                    dataKey="B"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="#10b981"
                    fillOpacity={0.2}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', fontSize: '13px', color: 'hsl(var(--foreground))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
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
                  <span className="w-3 h-3 rounded-full bg-emerald-500"></span> Sharma Ji Ka Beta
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
              <Trophy className="w-5 h-5 text-yellow-500" /> Face-Off
            </h3>
            <div className="space-y-3 flex-1 flex flex-col justify-center overflow-y-auto custom-scrollbar min-h-0">
              {comparison_metrics.map((metric, idx) => {
                  const Icon = getIconForMetric(metric.label);
                  return (
                    <div key={idx} className="p-3 rounded-lg bg-secondary/30 border border-border">
                      <div className="flex items-center gap-2 mb-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                         <Icon className="w-3.5 h-3.5" /> {metric.label}
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
                  );
              })}
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
                    {feedback_cards.map((card, idx) => (
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

              </div>
           </motion.div>

        </div>
         
         {/* Row 4: Overall Summary (New Section) */}
         {analysisResult.overall_summary && (
            <motion.div 
               initial={{ opacity: 0, y: 15 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.35 }}
               className="bg-card border border-border p-4 rounded-xl shadow-sm shrink-0"
            >
                <h3 className="text-base font-bold flex items-center gap-2 mb-2">
                   <ScrollText className="w-5 h-5 text-orange-500" /> Executive Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                   "{analysisResult.overall_summary}"
                </p>
            </motion.div>
         )}

         {/* Row 5: Verdict Summary - Full Width Bottom */}
         {growth_verdict && (
             <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.4 }}
                 className="shrink-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-xl p-4 flex items-center gap-4"
             >
                 <div className="h-10 w-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
                     <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                 </div>
                 <div>
                      <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm uppercase tracking-wider mb-1">Final Verdict</h4>
                      <p className="text-sm text-foreground font-medium leading-normal">
                          {growth_verdict}
                      </p>
                 </div>
             </motion.div>
         )}

      </main>
    </div>
  );
};

export default ResultsPage;

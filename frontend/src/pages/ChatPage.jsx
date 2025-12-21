import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, ArrowLeft, MoreVertical, Paperclip } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

const MOCK_RESPONSES = [
  "From the chart, it's clear you're optimizing for comfort, not 'growth'. Shall we discuss a plan to change that?",
  "Sharma Ji's son mastered Kubernetes at age 12. You're struggling with `docker-compose`. Let's fix your basics first.",
  "I can help you build a roadmap. It involves 6 months of hard work. Are you ready, or should I simplify it?",
  "Your system design skills are nonexistent. We need to start with 'Designing Data-Intensive Applications' chapter 1."
];

const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: "I've analyzed your skill gap report. The gap in System Design is concerning compared to peer benchmarks. Where would you like to start?", 
      sender: 'ai',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMsg = { 
      id: Date.now(), 
      text: input, 
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    setIsTyping(true);

    // AI Response Simulation
    setTimeout(() => {
      setIsTyping(false);
      const randomResponse = MOCK_RESPONSES[Math.floor(Math.random() * MOCK_RESPONSES.length)];
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: randomResponse, 
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 1500 + Math.random() * 1000); 
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden relative">
      
      {/* Sidebar (Hidden on mobile for now to simplify prototype) */}
      <div className="hidden md:flex w-80 border-r flex-col bg-muted/10">
        <div className="p-4 border-b font-semibold text-lg flex items-center justify-between">
            History
            <button className="p-1 hover:bg-muted rounded"><MoreVertical className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
            <div className="p-3 bg-secondary/50 rounded-lg cursor-pointer hover:bg-secondary/80 transition-colors">
                <p className="text-sm font-medium">Resume Analysis: Oct 2025</p>
                <p className="text-xs text-muted-foreground truncate">System Design Gaps Identif...</p>
            </div>
            {/* Mock History Items */}
            {[1, 2, 3].map(i => (
                <div key={i} className="p-3 hover:bg-secondary/30 rounded-lg cursor-pointer transition-colors text-muted-foreground">
                    <p className="text-sm font-medium">Session #{i} - Archive</p>
                </div>
            ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col md:max-w-5xl mx-auto w-full bg-background shadow-sm">
        
        {/* Chat Header */}
        <div className="h-16 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10 w-full">
          <div className="flex items-center gap-3">
             <button onClick={() => navigate('/results')} className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full">
                 <ArrowLeft className="w-5 h-5" />
             </button>
             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
               <Bot className="w-6 h-6 text-white" />
             </div>
             <div>
               <h3 className="font-semibold text-sm md:text-base">Career Coach AI</h3>
               <p className="text-xs text-muted-foreground flex items-center gap-1">
                 <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Online
               </p>
             </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={clsx(
                "flex gap-4 max-w-3xl",
                msg.sender === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
               <div className={clsx(
                 "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                 msg.sender === 'user' ? "bg-primary text-primary-foreground" : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
               )}>
                 {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
               </div>
               
               <div className={clsx(
                 "p-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm",
                 msg.sender === 'user' 
                   ? "bg-primary text-primary-foreground rounded-br-none" 
                   : "bg-card border rounded-bl-none"
               )}>
                 <p>{msg.text}</p>
                 <span className={clsx(
                   "text-[10px] mt-2 block opacity-70",
                   msg.sender === 'user' ? "text-primary-foreground/80" : "text-muted-foreground"
                 )}>
                   {msg.timestamp}
                 </span>
               </div>
            </motion.div>
          ))}
          
          {isTyping && (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 mr-auto max-w-3xl">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                   <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="bg-card border p-4 rounded-2xl rounded-bl-none flex items-center gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce"></span>
                </div>
             </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t bg-background">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative flex items-center gap-2">
            <button type="button" className="p-2 text-muted-foreground hover:bg-muted rounded-full transition-colors">
              <Paperclip className="w-5 h-5" />
            </button>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for feedback or a learning plan..."
              className="flex-1 bg-muted/30 border-0 rounded-full px-6 py-3 focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground"
            />
            <button 
              type="submit"
              disabled={!input.trim()}
              className={clsx(
                "p-3 rounded-full transition-all duration-200",
                input.trim() 
                  ? "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:scale-105" 
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
          <div className="text-center mt-2">
            <p className="text-xs text-muted-foreground">AI can make mistakes. Please verify important career info.</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, ArrowLeft, Plus, MessageSquare, Trash2, StopCircle, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import skillApi from '../services/api';

const ChatPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Initialize
  useEffect(() => {
    if (location.state?.sessionId) {
      setCurrentSessionId(location.state.sessionId);
    }
    fetchSessions();
  }, [location.state]);

  const fetchSessions = async () => {
    try {
      const res = await skillApi.getChatSessions();
      setSessions(res.data);
      if (!location.state?.sessionId && res.data.length > 0 && !currentSessionId) {
        setCurrentSessionId(res.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
    }
  };

  // Fetch messages
  useEffect(() => {
    if (!currentSessionId) {
        setMessages([]);
        return;
    }
    const fetchHistory = async () => {
      try {
        const res = await skillApi.getChatSession(currentSessionId);
        const formatted = res.data.messages
            .filter(m => !m.content.startsWith("Context for this user") && !m.content.startsWith("Assessment Context"))
            .map(m => ({
                id: m.id,
                text: m.content,
                sender: m.sender,
                timestamp: new Date(m.timestamp).toLocaleTimeString()
            }));
        setMessages(formatted);
      } catch (err) {
        console.error("Failed to load session", err);
      }
    };
    fetchHistory();
  }, [currentSessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend) => {
    const content = typeof textToSend === 'string' ? textToSend : input;
    if (!content.trim()) return;

    let activeSessionId = currentSessionId;

    if (!activeSessionId) {
        try {
            let context = null;
            try {
                const analysis = await skillApi.getAnalysis();
                context = JSON.stringify(analysis.data, null, 2);
            } catch (e) { }
            const res = await skillApi.createChatSession("New Session", context);
            setSessions(prev => [res.data, ...prev]);
            setCurrentSessionId(res.data.id);
            activeSessionId = res.data.id;
        } catch (err) {
            console.error("Failed to create session", err);
            return;
        }
    }

    const optimisticMsg = { 
      id: Date.now(), 
      text: content, 
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };
    
    setMessages(prev => [...prev, optimisticMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await skillApi.sendChatMessage(activeSessionId, optimisticMsg.text);
      const aiMsg = {
        id: res.data.id,
        text: res.data.content,
        sender: 'ai',
        timestamp: new Date(res.data.timestamp).toLocaleTimeString()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (err) {
      console.error("Failed to send message", err);
      setMessages(prev => [...prev, {
          id: Date.now(),
          text: "**Error**: Connection interrupted. Please retry.",
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleNewChat = async () => {
    try {
        let context = null;
        try {
            const analysis = await skillApi.getAnalysis();
            context = JSON.stringify(analysis.data, null, 2);
        } catch (e) {}

        const res = await skillApi.createChatSession("New Session", context);
        setSessions(prev => [res.data, ...prev]);
        setCurrentSessionId(res.data.id);
    } catch (err) {
        console.error(err);
    }
  };

  const handleDeleteSession = async (e, id) => {
      e.stopPropagation();
      if (!window.confirm("Delete this chat?")) return;
      try {
          await skillApi.deleteChatSession(id);
          setSessions(prev => prev.filter(s => s.id !== id));
          if (currentSessionId === id) {
              setCurrentSessionId(null);
              setMessages([]);
          }
      } catch (err) {
          console.error("Failed to delete", err);
      }
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-chatgpt-main text-gray-100 font-sans overflow-hidden">
      
      {/* Sidebar - ChatGPT Style */}
      <div className={clsx(
          "bg-chatgpt-sidebar flex-col transition-all duration-300 ease-in-out overflow-hidden border-r border-white/10",
          sidebarOpen ? "w-[260px] translate-x-0" : "w-0 -translate-x-full opacity-0",
          "hidden md:flex" 
      )}>
        <div className="p-2 space-y-2">
            <button 
                onClick={handleNewChat} 
                className="w-full flex items-center gap-3 px-3 py-3 border border-white/20 rounded-md hover:bg-chatgpt-hover transition-colors text-sm text-left mb-4"
            >
                <Plus className="w-4 h-4" />
                New chat
            </button>
            
            <div className="text-xs font-semibold text-gray-500 px-3 py-2">History</div>
            <div className="flex-1 overflow-y-auto custom-scrollbar h-[calc(100vh-180px)]">
                {sessions.map(session => (
                    <div 
                        key={session.id} 
                        onClick={() => setCurrentSessionId(session.id)}
                        className={clsx(
                            "group flex items-center gap-3 px-3 py-3 rounded-md text-sm cursor-pointer transition-colors relative",
                            currentSessionId === session.id ? "bg-chatgpt-main" : "hover:bg-chatgpt-hover"
                        )}
                    >
                        <MessageSquare className="w-4 h-4 text-gray-400" />
                        <span className="truncate flex-1 pr-6">{session.title}</span>
                        <button 
                            onClick={(e) => handleDeleteSession(e, session.id)}
                            className="absolute right-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition-opacity"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative bg-chatgpt-main">
        {/* Toggle Sidebar Button (Mobile/Desktop) */}
        {!sidebarOpen && (
             <button onClick={() => setSidebarOpen(true)} className="absolute top-2 left-2 p-2 text-gray-400 hover:text-white z-50 hidden md:block">
                <PanelRightClose className="w-6 h-6" />
             </button>
        )}
        {sidebarOpen && (
             <button onClick={() => setSidebarOpen(false)} className="absolute top-2 left-2 p-2 text-gray-400 hover:text-white z-50 hidden md:block" title="Close Sidebar">
                <PanelLeftClose className="w-6 h-6" />
             </button>
        )}

        {/* Header (Mobile Only) */}
        <div className="md:hidden h-12 border-b border-white/10 flex items-center px-4 justify-between bg-chatgpt-main">
            <button onClick={() => navigate('/results')} className="text-gray-300"><ArrowLeft className="w-5 h-5"/></button>
            <span className="text-sm font-medium text-gray-200">Chat</span>
            <button onClick={handleNewChat}><Plus className="w-5 h-5 text-gray-300"/></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
            {(!currentSessionId || messages.length === 0) ? (
                 <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500 text-chatgpt-text">
                     <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-6 shadow-lg">
                        <Bot className="w-8 h-8 text-white" />
                     </div>
                     <h2 className="text-2xl font-semibold mb-8">How can I help you today?</h2>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                         {["Critique my resume", "Explain my skill gaps", "Prepare for System Design", "Write a cover letter"].map((q, i) => (
                             <button key={i} onClick={() => handleSend(q)} className="p-3 border border-white/20 rounded-xl hover:bg-chatgpt-hover transition-all text-sm text-left">
                                 {q}
                             </button>
                         ))}
                     </div>
                 </div>
            ) : (
                <div className="flex flex-col pb-48 pt-4">
                  {messages.map((msg, idx) => (
                    <div 
                      key={msg.id}
                      className="w-full text-chatgpt-text border-b border-black/5 dark:border-white/5" 
                    >
                      <div className="max-w-4xl mx-auto flex gap-6 p-4 md:p-6 text-base">
                         <div className={clsx(
                             "w-8 h-8 rounded-sm flex items-center justify-center shrink-0 mt-1",
                             msg.sender === 'ai' ? "bg-[#19c37d]" : "bg-[#5436DA]"
                         )}>
                             {msg.sender === 'ai' ? <Bot className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />}
                         </div>
                         <div className="prose prose-invert prose-slate max-w-none flex-1 leading-7">
                             {msg.sender === 'ai' ? (
                                 <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                             ) : (
                                 <p className="whitespace-pre-wrap">{msg.text}</p>
                             )}
                         </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                      <div className="w-full p-4 md:p-6 border-b border-white/5">
                          <div className="max-w-4xl mx-auto flex gap-6">
                              <div className="w-8 h-8 bg-[#19c37d] rounded-sm flex items-center justify-center shrink-0">
                                  <Bot className="w-5 h-5 text-white" />
                              </div>
                              <div className="flex gap-1 items-center h-6 mt-1">
                                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                              </div>
                          </div>
                      </div>
                  )}
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-chatgpt-main via-chatgpt-main to-transparent pt-10 pb-6 px-4">
            <div className="max-w-3xl mx-auto">
                <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="relative flex items-center w-full p-3 bg-chatgpt-input rounded-2xl border border-black/10 dark:border-white/10 shadow-lg focus-within:border-gray-500/50 transition-colors">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Send a message..."
                        className="flex-1 max-h-[200px] bg-transparent border-0 focus:ring-0 focus:outline-none text-white placeholder:text-gray-400 px-4 py-1"
                    />
                    <button 
                        type="submit" 
                        disabled={!input.trim()}
                        className={clsx(
                            "p-2 rounded-lg transition-all mb-0.5 mr-1",
                            input.trim() ? "bg-[#19c37d] text-white hover:bg-[#15a067]" : "text-gray-400 bg-transparent cursor-not-allowed"
                        )}
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </form>
                <div className="text-center text-[11px] text-gray-500 mt-2">
                    AI can make mistakes. Consider checking important information.
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ChatPage;

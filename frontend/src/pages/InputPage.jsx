import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Briefcase, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';

const InputPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('');
    const [isDragging, setIsDragging] = useState(false);
  
    const handleDragOver = (e) => {
      e.preventDefault();
      setIsDragging(true);
    };
  
    const handleDragLeave = () => {
      setIsDragging(false);
    };
  
    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
        setFile(e.dataTransfer.files[0]);
      }
    };
  
    const handleFileChange = (e) => {
      if (e.target.files && e.target.files[0]) {
        setFile(e.target.files[0]);
      }
    };
  
    const handleAnalyze = () => {
      if (file && role) {
        navigate('/results');
      }
    };
  
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-background relative">
        {/* Static Background Grid */}
        <div className="absolute inset-0 static-grid pointer-events-none opacity-[0.3]"></div>
        
        <div className="container max-w-4xl relative z-10">
          <div className="text-center mb-12">
            <motion.div
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.3 }}
            >
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">
                  Let's <span className="text-primary">Audit</span> Your Career
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Upload your resume. Select your target. Prepare for reality.
                </p>
            </motion.div>
          </div>
  
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="bg-card p-8 md:p-12 rounded-3xl border border-border shadow-sm"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                
                {/* Left: Job Selection */}
                <div className="space-y-6">
                    <div>
                        <label className="text-lg font-bold flex items-center gap-2 mb-4">
                            <Briefcase className="w-5 h-5 text-primary" />
                            Target Job Title
                        </label>
                        <div className="relative">
                            <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                className="w-full bg-secondary/30 border border-input focus:border-primary focus:bg-background rounded-xl px-4 py-4 text-lg outline-none transition-colors appearance-none cursor-pointer"
                            >
                                <option value="">Select your dream role...</option>
                                <option value="frontend-dev">Frontend Developer</option>
                                <option value="backend-dev">Backend Developer</option>
                                <option value="data-scientist">Data Scientist</option>
                                <option value="product-manager">Product Manager</option>
                                <option value="designer">UI/UX Designer</option>
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                                ▼
                            </div>
                        </div>
                    </div>
  
                    <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-500" /> Analysis Points
                        </h4>
                        <ul className="space-y-2 text-sm text-muted-foreground ml-6 list-disc">
                             <li>Skill Keyword Matching (ATS Check)</li>
                             <li>Experience vs. Market Expectations</li>
                             <li>Project Complexity Scoring</li>
                             <li>Formatting & Readability Score</li>
                        </ul>
                    </div>
                </div>
  
                {/* Right: File Upload */}
                <div className="space-y-4">
                    <label className="text-lg font-bold flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Upload Resume
                    </label>
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={clsx(
                        "h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-colors cursor-pointer relative overflow-hidden",
                        isDragging 
                            ? "border-primary bg-primary/5" 
                            : "border-border hover:border-primary/50 hover:bg-secondary/30"
                        )}
                        onClick={() => document.getElementById('file-upload').click()}
                    >
                        <input
                        id="file-upload"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileChange}
                        className="hidden"
                        />
                        
                        {file ? (
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-primary">
                                <FileText className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-lg mb-1">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready to analyze</p>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setFile(null); }}
                                className="mt-4 text-xs font-semibold text-red-500 hover:underline"
                            >
                                Remove File
                            </button>
                        </div>
                        ) : (
                        <div className="relative z-10">
                            <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <UploadCloud className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="font-bold text-lg mb-2">Drag & Drop or Click to Upload</p>
                            <p className="text-sm text-muted-foreground">Supports PDF, DOCX (Max 10MB)</p>
                        </div>
                        )}
                    </div>
                </div>
            </div>
  
            <div className="mt-12 flex justify-center">
                 <button
                    onClick={handleAnalyze}
                    disabled={!file || !role}
                    className={clsx(
                        "group relative px-10 py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-200 w-full md:w-auto",
                        !file || !role 
                        ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                        : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5"
                    )}
                 >
                    <span className="relative z-10 flex items-center gap-2">
                        Generate Analysis Report <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                 </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

export default InputPage;

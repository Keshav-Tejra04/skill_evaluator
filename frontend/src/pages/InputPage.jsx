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
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manual'
  const [loading, setLoading] = useState(false);
  const [manualData, setManualData] = useState({
    skills: '',
    experience: '',
    projects: '',
    custom_field: ''
  });

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

  const handleManualChange = (e) => {
    setManualData({ ...manualData, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    if (!role) { alert('Please select a target role'); return; }
    
    setLoading(true);
    const formData = new FormData();
    formData.append('target_role', role);

    if (activeTab === 'upload') {
        if (!file) { alert('Please upload a file'); setLoading(false); return; }
        formData.append('file', file);
    } else {
        // Build the manual data string/json
        const jsonPayload = JSON.stringify({
            target_role: role,
            ...manualData
        });
        formData.append('manual_data', jsonPayload);
    }

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in!");
            navigate('/');
            return;
        }

        const response = await fetch('http://127.0.0.1:8000/analyze', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || 'Analysis failed');
        }

        const result = await response.json();
        navigate('/results', { state: { analysisResult: result } });

    } catch (error) {
        alert(error.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-background relative">
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
                Upload your resume or tell us who you pretend to be. Prepare for reality.
              </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="bg-card p-6 md:p-10 rounded-3xl border border-border shadow-sm"
        >
          {/* Tab Switcher */}
          <div className="flex justify-center mb-8">
              <div className="bg-secondary/50 p-1 rounded-xl flex gap-1">
                  <button 
                    onClick={() => setActiveTab('upload')}
                    className={clsx(
                        "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === 'upload' ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Upload Resume
                  </button>
                  <button 
                    onClick={() => setActiveTab('manual')}
                    className={clsx(
                        "px-6 py-2 rounded-lg text-sm font-bold transition-all",
                        activeTab === 'manual' ? "bg-background shadow text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Manual Entry
                  </button>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              
              {/* Left Side: Common Job Role Selection */}
              <div className="space-y-6">
                  <div>
                      <label className="text-lg font-bold flex items-center gap-2 mb-4">
                          <Briefcase className="w-5 h-5 text-primary" />
                          Target Job Title / Field
                      </label>
                      <div className="relative">
                          {/* If manual, allow typing raw job role to leverage 'Universal' AI */}
                          {activeTab === 'manual' ? (
                              <input 
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                placeholder="e.g. Potter, Rocket Scientist, Influencer..."
                                className="w-full bg-secondary/30 border border-input focus:border-primary focus:bg-background rounded-xl px-4 py-4 text-lg outline-none transition-colors"
                              />
                          ) : (
                              <select
                                  value={role}
                                  onChange={(e) => setRole(e.target.value)}
                                  className="w-full bg-secondary/30 border border-input focus:border-primary focus:bg-background rounded-xl px-4 py-4 text-lg outline-none transition-colors appearance-none cursor-pointer"
                              >
                                  <option value="">Select target role...</option>
                                  <option value="frontend-dev">Frontend Developer</option>
                                  <option value="backend-dev">Backend Developer</option>
                                  <option value="data-scientist">Data Scientist</option>
                                  <option value="product-manager">Product Manager</option>
                                  <option value="financial-analyst">Financial Analyst</option>
                              </select>
                          )}
                      </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> Analysis Points
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-6 list-disc">
                           <li>Skill Gap Analysis</li>
                           <li>"Sharma Ji" Comparative Logic</li>
                           <li>Growth Trajectory Check</li>
                           <li>Brutal Reality Feedback</li>
                      </ul>
                  </div>
              </div>

              {/* Right Side: Dynamic Input (Upload OR Form) */}
              <div className="space-y-4">
                  {activeTab === 'upload' ? (
                    <>
                        <label className="text-lg font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Upload Resume
                        </label>
                        <div
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            className={clsx(
                            "h-80 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-colors cursor-pointer relative overflow-hidden",
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
                                <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB • Ready</p>
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
                                <p className="font-bold text-lg mb-2">Drag & Drop</p>
                                <p className="text-sm text-muted-foreground">PDF, DOCX (Max 10MB)</p>
                            </div>
                            )}
                        </div>
                    </>
                  ) : (
                    <>
                        <label className="text-lg font-bold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-primary" />
                            Core Details
                        </label>
                        <div className="flex flex-col gap-3 h-80 overflow-y-auto pr-2 custom-scrollbar">
                           <input 
                               name="skills"
                               placeholder="Skills (Comma separated, e.g. React, Python)"
                               value={manualData.skills}
                               onChange={handleManualChange}
                               className="bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary"
                           />
                           <textarea 
                               name="experience"
                               placeholder="Experience (e.g. 2 years at Google as Senior Eng...)"
                               value={manualData.experience}
                               onChange={handleManualChange}
                               className="bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary h-24 resize-none"
                           />
                           <textarea 
                               name="projects"
                               placeholder="Key Projects (e.g. Built a clone of Uber...)"
                               value={manualData.projects}
                               onChange={handleManualChange}
                               className="bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary h-24 resize-none"
                           />
                           <input 
                               name="custom_field"
                               placeholder="Anything else? (Hobbies, specific niche context...)"
                               value={manualData.custom_field}
                               onChange={handleManualChange}
                               className="bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary"
                           />
                        </div>
                    </>
                  )}
              </div>
          </div>

          <div className="mt-12 flex justify-center">
               <button
                  onClick={handleAnalyze}
                  disabled={loading || (!role)}
                  className={clsx(
                      "group relative px-10 py-4 rounded-xl font-bold text-lg shadow-md transition-all duration-200 w-full md:w-auto",
                      loading || (!role)
                      ? "bg-muted text-muted-foreground cursor-not-allowed opacity-50" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5"
                  )}
               >
                  <span className="relative z-10 flex items-center gap-2">
                      {loading ? 'Analyzing your worth...' : 'Generate Analysis Report'} 
                      {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                  </span>
               </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default InputPage;

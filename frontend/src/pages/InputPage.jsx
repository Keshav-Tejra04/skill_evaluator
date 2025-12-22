import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, Briefcase, FileText, CheckCircle2, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import userService from '../services/user.service';
import analysisService from '../services/analysis.service';

const InputPage = () => {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [role, setRole] = useState('');
    const [customRole, setCustomRole] = useState('');
    const [age, setAge] = useState('');
    const [status, setStatus] = useState('');
    
    const [isDragging, setIsDragging] = useState(false);
    const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manual'
    const [loading, setLoading] = useState(false);
    const [manualData, setManualData] = useState({
        skills: '',
        experience: '',
        projects: '',
        custom_field: ''
    });

    React.useEffect(() => {
        // Fetch User Profile on mount to pre-fill
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const data = await userService.getProfile();
                if (data.age) setAge(data.age);
                if (data.current_status) setStatus(data.current_status);
                
                // Handle pre-filling role
                if (data.target_role) {
                    const defaultRoles = ["frontend-dev", "backend-dev", "data-scientist", "product-manager", "financial-analyst"];
                    if (defaultRoles.includes(data.target_role)) {
                        setRole(data.target_role);
                    } else {
                        setRole("other");
                        setCustomRole(data.target_role);
                    }
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        };
        fetchProfile();
    }, []);

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
        if (role === 'other' && !customRole) { alert('Please enter your custom role'); return; }
        if (!age) { alert('Please enter your age'); return; }
        if (!status) { alert('Please select your current status'); return; }
        
        setLoading(true);
        const formData = new FormData();
        
        // Final Role Logic
        const finalRole = role === 'other' ? customRole : role;
        formData.append('target_role', finalRole);
        formData.append('age', age);
        formData.append('current_status', status);

        if (activeTab === 'upload') {
            if (!file) { alert('Please upload a file'); setLoading(false); return; }
            formData.append('file', file);
        } else {
            // Build the manual data string/json
            const jsonPayload = JSON.stringify({
                target_role: finalRole,
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

            const result = await analysisService.analyzeProfile(formData);
            navigate('/results', { state: { analysisResult: result } });

        } catch (error) {
            alert(error.detail || error.message || 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center bg-background relative">
            <div className="absolute inset-0 static-grid pointer-events-none opacity-[0.3]"></div>
            
            <div className="container max-w-5xl relative z-10">
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
                            Let's <span className="text-primary">Audit</span> Your Career
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Upload your resume or tell us who you pretend to be. Prepare for reality.
                        </p>
                    </motion.div>
                </div>

                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                    className="bg-card p-6 md:p-8 rounded-3xl border border-border shadow-sm"
                >
                    {/* Tab Switcher */}
                    <div className="flex justify-center mb-6">
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
              
              {/* Left Side: Detail Selection */}
              <div className="space-y-6">
                  
                  {/* Age & Status Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-bold block mb-2">Age</label>
                        <input 
                            type="number"
                            value={age}
                            onChange={(e) => setAge(e.target.value)}
                            placeholder="e.g. 24"
                            className="w-full bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary transition-colors"
                        />
                    </div>
                    <div>
                         <label className="text-sm font-bold block mb-2">Status</label>
                         <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary appearance-none cursor-pointer"
                         >
                             <option value="">Select...</option>
                             <option value="Student">Student</option>
                             <option value="Professional">Professional</option>
                             <option value="Freelancer">Freelancer</option>
                             <option value="Unemployed">Unemployed</option>
                             <option value="Founder">Founder</option>
                         </select>
                    </div>
                  </div>

                  <div>
                      <label className="text-lg font-bold flex items-center gap-2 mb-4">
                          <Briefcase className="w-5 h-5 text-primary" />
                          Target Job Title
                      </label>
                      <div className="space-y-3">
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
                                <option value="other">Other (Enter Custom)</option>
                            </select>

                            {/* Custom Role Input */}
                            {role === 'other' && (
                                <motion.input 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    value={customRole}
                                    onChange={(e) => setCustomRole(e.target.value)}
                                    placeholder="Enter your specific role (e.g. AI Ethics Officer)"
                                    className="w-full bg-secondary/30 border border-input focus:border-primary focus:bg-background rounded-xl px-4 py-3 text-base outline-none transition-colors"
                                />
                            )}
                      </div>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-xl border border-primary/10">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" /> New Analysis V2
                      </h4>
                      <ul className="space-y-2 text-sm text-muted-foreground ml-6 list-disc">
                           <li>Constructive Satire Mode</li>
                           <li>Age-Appropriate Expectations</li>
                           <li>Context-Aware Roasts</li>
                           <li>Detailed Metrics</li>
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

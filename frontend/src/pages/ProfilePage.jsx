import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Save, User, ArrowLeft, LogOut } from 'lucide-react';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        age: '',
        current_status: '',
        target_role: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem('token');
        if (!token) { navigate('/'); return; }
        
        try {
            const res = await fetch('http://127.0.0.1:8000/profile', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setFormData({
                    age: data.age || '',
                    current_status: data.current_status || '',
                    target_role: data.target_role || ''
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem('token');
        try {
            // Convert age to int if present
            const payload = {
                ...formData,
                age: formData.age ? parseInt(formData.age) : null
            };
            
            const res = await fetch('http://127.0.0.1:8000/profile', {
                method: 'PUT',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            
            if (res.ok) {
                alert("Profile Saved!");
            } else {
                alert("Failed to save");
            }
        } catch (e) {
            console.error(e);
            alert("Error saving profile");
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center bg-background relative">
            <div className="absolute inset-0 static-grid pointer-events-none opacity-[0.3]"></div>
            
            <div className="container max-w-2xl relative z-10">
                <div className="mb-8 flex items-center justify-between">
                    <button 
                        onClick={() => navigate('/input')}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" /> Back to Analysis
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <User className="w-8 h-8 text-primary" /> Your Profile
                    </h1>
                    <button 
                         onClick={handleLogout}
                         className="text-red-500 hover:text-red-400 text-sm font-semibold flex items-center gap-1"
                    >
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card border border-border rounded-3xl p-8 shadow-sm"
                >
                    {loading ? (
                        <div className="text-center py-10">Loading profile...</div>
                    ) : (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Default Age</label>
                                <input 
                                    type="number"
                                    value={formData.age}
                                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                                    className="w-full bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary"
                                    placeholder="e.g. 25"
                                />
                                <p className="text-xs text-muted-foreground ml-1">Used to contextualize the analysis.</p>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Current Status</label>
                                <select 
                                    value={formData.current_status}
                                    onChange={(e) => setFormData({...formData, current_status: e.target.value})}
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

                            <div className="space-y-2">
                                <label className="text-sm font-bold ml-1">Default Title / Role</label>
                                <input 
                                    type="text"
                                    value={formData.target_role}
                                    onChange={(e) => setFormData({...formData, target_role: e.target.value})}
                                    className="w-full bg-secondary/30 border border-input rounded-xl px-4 py-3 outline-none focus:border-primary"
                                    placeholder="e.g. Senior Software Engineer"
                                />
                            </div>

                            <div className="pt-4 flex gap-4">
                                <button
                                    onClick={handleSave}
                                    disabled={saving}
                                    className="flex-1 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    {saving ? 'Saving...' : <><Save className="w-5 h-5" /> Save Changes</>}
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProfilePage;

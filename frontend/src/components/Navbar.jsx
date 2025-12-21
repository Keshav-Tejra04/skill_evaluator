import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LogOut, User, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  // Determine if user is "logged in" based on route
  // Simple check: if not on login page
  const isLoggedIn = location.pathname !== '/' && location.pathname !== '/auth';

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
    setIsDropdownOpen(false);
  };

  return (
    <nav className="h-16 bg-background/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300 w-full shrink-0">
      <div className="w-full h-full flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl bg-primary text-primary-foreground px-3 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
          <Zap className="w-5 h-5 fill-current" />
          <span>SkillEval</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
               {/* User Dropdown */}
               <div className="relative">
                  <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                  >
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                          <User className="w-4 h-4" />
                        </div>
                        <span className="text-foreground font-semibold text-xs">Menu</span>
                        <ChevronDown className="w-3 h-3 text-muted-foreground" />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                      <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                         <Link 
                            to="/profile" 
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-secondary/50 flex items-center gap-2"
                            onClick={() => setIsDropdownOpen(false)}
                        >
                            <User className="w-4 h-4" /> Profile
                        </Link>
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 flex items-center gap-2 font-medium"
                        >
                            <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    </>
                  )}
               </div>
               <ThemeToggle />
            </div>
          ) : (
            <>
              <ThemeToggle />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

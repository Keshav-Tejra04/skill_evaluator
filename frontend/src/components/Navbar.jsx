import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Zap, LogOut, User } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Determine if user is "logged in" based on route
  const isLoggedIn = ['/upload', '/results', '/chat'].includes(location.pathname);

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <nav className="h-16 border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-300 w-full shrink-0">
      <div className="w-full h-full flex items-center justify-between px-6 md:px-12">
        <Link to="/" className="flex items-center gap-2 font-extrabold text-xl">
          <Zap className="text-primary w-6 h-6" />
          <span className="text-foreground">SkillEval</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-muted-foreground">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-foreground font-semibold text-xs">Guest User</span>
               </div>
               <button 
                onClick={handleLogout}
                className="flex items-center gap-2 hover:text-destructive transition-colors"
               >
                 <LogOut className="w-4 h-4" /> Logout
               </button>
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

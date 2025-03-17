
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { CalendarIcon, CheckSquareIcon, HomeIcon, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, isActive }) => {
  return (
    <Link
      to={to}
      className={cn(
        'relative flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200',
        isActive 
          ? 'text-primary font-medium' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
      )}
    >
      {icon}
      <span>{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeIndicator"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </Link>
  );
};

const Navbar: React.FC<{ onNewTask: () => void }> = ({ onNewTask }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'py-3 bg-background/80 backdrop-blur-lg shadow-sm' : 'py-5'
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="font-semibold text-xl tracking-tight">Aligner</div>
          <nav className="hidden md:flex items-center space-x-1">
            <NavItem 
              icon={<HomeIcon className="w-5 h-5" />} 
              label="Dashboard" 
              to="/" 
              isActive={location.pathname === '/'} 
            />
            <NavItem 
              icon={<CheckSquareIcon className="w-5 h-5" />} 
              label="Tasks" 
              to="/tasks" 
              isActive={location.pathname === '/tasks'} 
            />
            <NavItem 
              icon={<CalendarIcon className="w-5 h-5" />} 
              label="Calendar" 
              to="/calendar" 
              isActive={location.pathname === '/calendar'} 
            />
          </nav>
        </div>
        
        <Button onClick={onNewTask} className="flex items-center gap-2 rounded-full">
          <PlusIcon className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </Button>
      </div>
      
      {/* Mobile navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t flex justify-around py-2">
        <Link 
          to="/" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md",
            location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <HomeIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Dashboard</span>
        </Link>
        
        <Link 
          to="/tasks" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md",
            location.pathname === '/tasks' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <CheckSquareIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Tasks</span>
        </Link>
        
        <Button 
          onClick={onNewTask}
          className="flex flex-col items-center justify-center p-2 rounded-full w-12 h-12 -mt-8 shadow-md"
        >
          <PlusIcon className="w-6 h-6" />
        </Button>
        
        <Link 
          to="/calendar" 
          className={cn(
            "flex flex-col items-center p-2 rounded-md",
            location.pathname === '/calendar' ? 'text-primary' : 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="w-5 h-5" />
          <span className="text-xs mt-1">Calendar</span>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;

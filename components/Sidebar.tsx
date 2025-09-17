import React from 'react';
import { NeXaGuideLogo, ExcitedIcon, ConfusedIcon, StressedIcon, AssessmentIcon, CareersIcon, ResourcesIcon, CloseIcon } from './icons';
import ThemeToggle from './ThemeToggle';

interface SidebarProps {
  onSendMessage: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const SidebarButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md transition-colors"
  >
    <span className="w-5 h-5">{icon}</span>
    <span>{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ onSendMessage, isOpen, onClose }) => {
  const sidebarClasses = `
    fixed inset-y-0 left-0 z-30
    w-64 bg-white dark:bg-gray-800 
    text-gray-900 dark:text-white 
    p-4 flex flex-col 
    border-r border-gray-200 dark:border-gray-700
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:relative md:translate-x-0 md:flex
  `;

  return (
    <aside className={sidebarClasses}>
      <div className="flex items-center justify-between px-2 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <NeXaGuideLogo className="w-8 h-8 flex-shrink-0" />
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">NeXaGuide</h1>
            <p className="text-xs text-gray-500 dark:text-slate-400">Let’s plan your future together…</p>
          </div>
        </div>
        <button onClick={onClose} className="md:hidden p-1 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" aria-label="Close menu">
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <nav className="flex-1 mt-6 space-y-6">
        <div>
          <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 dark:text-slate-400 uppercase">How are you feeling?</h2>
          <div className="space-y-1">
            <SidebarButton 
              icon={<ExcitedIcon />} 
              label="Excited" 
              onClick={() => onSendMessage("I'm excited about my career but not sure where to start.")} 
            />
            <SidebarButton 
              icon={<ConfusedIcon />} 
              label="Confused" 
              onClick={() => onSendMessage("I'm feeling confused about my career options.")} 
            />
            <SidebarButton 
              icon={<StressedIcon />} 
              label="Stressed" 
              onClick={() => onSendMessage("I'm stressed about finding a job.")} 
            />
          </div>
        </div>
        <div>
          <h2 className="px-4 mb-2 text-xs font-semibold tracking-wider text-gray-500 dark:text-slate-400 uppercase">Quick Actions</h2>
          <div className="space-y-1">
            <SidebarButton 
              icon={<AssessmentIcon />} 
              label="Career Assessment" 
              onClick={() => onSendMessage("Help me with a career assessment.")}
            />
            <SidebarButton 
              icon={<CareersIcon />} 
              label="Browse Careers" 
              onClick={() => onSendMessage("Show me some career paths I could explore.")}
            />
            <SidebarButton 
              icon={<ResourcesIcon />} 
              label="Learning Resources" 
              onClick={() => onSendMessage("What are some good resources for learning new skills?")}
            />
          </div>
        </div>
      </nav>
      <div className="mt-auto">
        <div className="mb-4">
          <ThemeToggle />
        </div>
        <div className="text-center text-xs text-gray-400 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} NeXaGuide</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
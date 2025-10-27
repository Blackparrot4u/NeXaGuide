import React, { useState } from 'react';
import { AssessmentIcon, ResourcesIcon, CareersIcon, SendIcon } from './icons';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const ActionCard: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-blue-500/20 hover:shadow-2xl hover:-translate-y-1 transition-all transform duration-300 ease-in-out w-full text-left border border-transparent hover:border-blue-500/30"
  >
    <div className="flex items-center gap-4">
      <div className="text-blue-600 dark:text-blue-400">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">{title}</h3>
    </div>
  </button>
);

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSendMessage }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-white dark:bg-slate-800/50">
            <div className="absolute bottom-0 left-[-20%] right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(100,150,255,.15),rgba(255,255,255,0))]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] top-[10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(100,150,255,.15),rgba(255,255,255,0))]"></div>
        </div>
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
          NeXaGuide
        </h1>
        <p className="text-md text-gray-500 dark:text-slate-400 mb-8">
          Let’s plan your future together…
        </p>

        <form onSubmit={handleSubmit} className="relative mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about careers, courses, or resumes..."
            className="w-full pl-6 pr-16 py-4 text-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-200 border border-gray-300 dark:border-slate-700 rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white bg-blue-600 rounded-full hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors" aria-label="Send">
            <SendIcon className="w-6 h-6" />
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionCard 
            icon={<AssessmentIcon className="w-8 h-8" />} 
            title="Career Assessment"
            onClick={() => onSendMessage('Can you help me with a career assessment?')}
          />
          <ActionCard 
            icon={<ResourcesIcon className="w-8 h-8" />} 
            title="Course Recommendations"
            onClick={() => onSendMessage('Can you recommend some courses for me?')}
          />
          <ActionCard 
            icon={<CareersIcon className="w-8 h-8" />} 
            title="Internship Help"
            onClick={() => onSendMessage('I need help finding an internship.')}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;

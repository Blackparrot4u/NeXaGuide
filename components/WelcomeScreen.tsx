import React, { useState } from 'react';
import { AssessmentIcon, ResourcesIcon, CareersIcon, SendIcon } from './icons';

interface WelcomeScreenProps {
  onSendMessage: (message: string) => void;
}

const ActionCard: React.FC<{ icon: React.ReactNode; title: string; onClick: () => void }> = ({ icon, title, onClick }) => (
  <button
    onClick={onClick}
    className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all transform duration-300 ease-in-out w-full text-left"
  >
    <div className="flex items-center gap-4">
      <div className="text-gray-800 dark:text-gray-200">{icon}</div>
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
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
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
            className="w-full pl-4 pr-12 py-4 text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-200 border border-gray-300 dark:border-gray-700 rounded-full shadow-inner focus:ring-2 focus:ring-gray-500 focus:outline-none"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white bg-gray-900 rounded-full hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors" aria-label="Send">
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
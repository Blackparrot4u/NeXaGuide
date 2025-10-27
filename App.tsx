import React, { useState, useEffect, useRef, useCallback } from 'react';
import { type Chat } from "@google/genai";
import { type Message, Role } from './types';
import { createCareerCounselorChat } from './services/geminiService';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import WelcomeScreen from './components/WelcomeScreen';
import Sidebar from './components/Sidebar';
import { MenuIcon, NeXaGuideLogo } from './components/icons';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load chat history from localStorage and initialize the chat session on mount
  useEffect(() => {
    let initialMessages: Message[] = [];
    try {
      const savedHistory = localStorage.getItem('nexaguide-chat-history');
      if (savedHistory) {
        const parsedHistory = JSON.parse(savedHistory);
        if (Array.isArray(parsedHistory)) {
          initialMessages = parsedHistory;
        }
      }
    } catch (e) {
      console.error("Failed to parse chat history from localStorage", e);
      // If history is corrupted, clear it and start fresh
      localStorage.removeItem('nexaguide-chat-history');
    }

    setMessages(initialMessages);

    try {
      // Pass the loaded history to the chat creation function to maintain context
      chatRef.current = createCareerCounselorChat(initialMessages);
    } catch (e) {
      setError("Failed to initialize the AI service. Please check your API key and refresh the page.");
      console.error(e);
    }
  }, []);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    try {
      localStorage.setItem('nexaguide-chat-history', JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history to localStorage", e);
    }
  }, [messages]);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || isLoading || !chatRef.current) return;

    setIsLoading(true);
    setError(null);
    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: userInput,
    };
    
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userInput });
      
      let fullResponse = '';
      const modelMessageId = Date.now().toString() + '-model';
      
      setMessages(prev => [...prev, {id: modelMessageId, role: Role.MODEL, content: ''}]);

      for await (const chunk of stream) {
        fullResponse += chunk.text;
        setMessages(prev =>
          prev.map(m =>
            m.id === modelMessageId ? { ...m, content: fullResponse } : m
          )
        );
      }
    } catch (e: unknown) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Sorry, I encountered an error. ${errorMessage}`);
      setMessages(prev => prev.slice(0, -1)); // Remove the empty model message on error
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);
  
  const handleSendMessageAndCloseSidebar = (message: string) => {
    handleSendMessage(message);
    setIsSidebarOpen(false);
  };

  const handleNewChat = () => {
    setMessages([]);
    localStorage.removeItem('nexaguide-chat-history');
    try {
      chatRef.current = createCareerCounselorChat();
    } catch (e) {
      setError("Failed to initialize the AI service. Please check your API key and refresh the page.");
      console.error(e);
    }
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen font-['Poppins',_sans-serif] bg-gray-100 dark:bg-slate-900 text-gray-800 dark:text-slate-200">
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        ></div>
      )}
      <Sidebar 
        onSendMessage={handleSendMessageAndCloseSidebar}
        onNewChat={handleNewChat}
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
      />
      <div className="flex flex-col flex-1">
        <header className="md:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center gap-2">
             <NeXaGuideLogo className="w-8 h-8" />
             <h1 className="text-lg font-bold text-gray-900 dark:text-white">NeXaGuide</h1>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-1 text-gray-600 dark:text-slate-300" aria-label="Open menu">
            <MenuIcon className="w-6 h-6" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto relative bg-white dark:bg-slate-800/50">
          {messages.length === 0 ? (
            <WelcomeScreen onSendMessage={handleSendMessage} />
          ) : (
            <div className="p-4 md:p-6 space-y-4">
              {messages.map((msg, index) => (
                <ChatMessage 
                  key={msg.id} 
                  message={msg} 
                  isLoading={isLoading && msg.content === ''}
                  isStreaming={isLoading && index === messages.length - 1 && msg.role === Role.MODEL && msg.content !== ''}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </main>
        {error && (
          <div className="px-4 py-2 text-center text-red-500 bg-red-100 dark:bg-red-900/30">
            {error}
          </div>
        )}
        {messages.length > 0 && <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />}
      </div>
    </div>
  );
};

export default App;

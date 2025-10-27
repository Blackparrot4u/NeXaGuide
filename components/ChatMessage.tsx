import React, { useState, useEffect, useRef } from 'react';
import { type Message, Role } from '../types';
import { NeXaGuideLogo, UserIcon, CopyIcon, CheckIcon } from './icons';

interface ChatMessageProps {
  message: Message;
  isLoading?: boolean; // True only for the empty model message placeholder ("thinking")
  isStreaming?: boolean; // True for the model message while streaming ("typing")
}

const LoadingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.3s]" style={{ animationName: 'pulse-dot', animationDuration: '1.4s' }}></span>
    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse [animation-delay:-0.15s]" style={{ animationName: 'pulse-dot', animationDuration: '1.4s' }}></span>
    <span className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-pulse" style={{ animationName: 'pulse-dot', animationDuration: '1.4s' }}></span>
  </div>
);

const blinkingCursor = `<span class="inline-block w-2 h-4 bg-gray-800 dark:bg-slate-300 animate-pulse ml-1" style="animation-duration: 1.2s;"></span>`;

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLoading = false, isStreaming = false }) => {
  const isModel = message.role === Role.MODEL;
  const [visibleContent, setVisibleContent] = useState('');
  const [copied, setCopied] = useState(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Effect to manage the visible content, resetting or showing it instantly based on context.
  useEffect(() => {
    // Always clear any running animations when the core message object changes.
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    if (isModel) {
      // For model messages that aren't streaming (i.e., from history), show content immediately.
      // Otherwise, start with empty content to allow for animation.
      setVisibleContent(isStreaming ? '' : message.content);
    } else {
      // For user messages, display content immediately.
      setVisibleContent(message.content);
    }
  }, [message.id, isModel, isStreaming]); // Dependencies ensure this runs for new messages or mode changes.

  // Effect to handle the word-by-word typing animation for streaming model messages.
  useEffect(() => {
    if (!isModel || !isStreaming) return;

    // Animate only the new part of the text.
    if (message.content.length > visibleContent.length) {
      const newText = message.content.slice(visibleContent.length);
      const words = newText.match(/\S+\s*/g) || [];
      
      let delay = 0;
      words.forEach(word => {
        const timeout = setTimeout(() => {
          setVisibleContent(prev => prev + word);
        }, delay);
        timeoutsRef.current.push(timeout);
        delay += 85; // Stagger each word's appearance for a natural typing feel.
      });
    }

    // Cleanup function to clear timeouts if component unmounts or dependencies change mid-animation.
    return () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
    };
  }, [message.content, isModel, isStreaming, visibleContent]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const wrapperClasses = `flex items-start gap-3 md:gap-4 ${isModel ? '' : 'justify-end'} animate-fade-in-up`;
  const bubbleWrapperClasses = `flex items-start gap-3 md:gap-4 ${isModel ? 'flex-row' : 'flex-row-reverse'}`;
  
  const bubbleClasses = `relative group w-full max-w-xl xl:max-w-2xl px-4 py-3 rounded-2xl shadow-md break-words ${
    isModel
      ? 'bg-white dark:bg-slate-800 rounded-bl-none'
      : 'bg-blue-600 dark:bg-blue-700 text-white rounded-br-none'
  }`;
  
  let contentHtml = visibleContent.replace(/\n/g, '<br />');
  
  // Show cursor if streaming is active and the animation is fully caught up with the stream buffer.
  if (isStreaming && visibleContent === message.content) {
    contentHtml += blinkingCursor;
  }

  const Avatar = isModel ? (
    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
      <NeXaGuideLogo className="w-full h-full rounded-full" />
    </div>
  ) : (
    <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
      <UserIcon className="w-5 h-5 md:w-6 md:h-6" />
    </div>
  );

  return (
    <div className={wrapperClasses}>
      <div className={bubbleWrapperClasses}>
        {Avatar}
        <div className={bubbleClasses}>
          {isLoading ? <LoadingIndicator /> : (
            <>
              <div
                className="prose prose-sm dark:prose-invert max-w-none prose-p:my-2 prose-headings:my-2"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />
              {isModel && !isLoading && message.content && (
                <button
                  onClick={handleCopy}
                  className="absolute top-2 right-2 p-1 text-gray-500 dark:text-gray-400 bg-gray-100/50 dark:bg-slate-700/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Copy message"
                >
                  {copied ? <CheckIcon className="w-4 h-4 text-green-500" /> : <CopyIcon className="w-4 h-4" />}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

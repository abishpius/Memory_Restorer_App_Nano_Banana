import React, { useState, useEffect } from 'react';

const messages = [
  "Traveling back in time...",
  "Dusting off old photographs...",
  "Adding vibrant colors to memories...",
  "Reuniting family members...",
  "The AI is carefully restoring details...",
  "Crafting your new memory...",
  "This can take a moment, thank you for your patience.",
];

export const Loader: React.FC = () => {
  const [currentMessage, setCurrentMessage] = useState(messages[0]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentMessage(prevMessage => {
        const currentIndex = messages.indexOf(prevMessage);
        const nextIndex = (currentIndex + 1) % messages.length;
        return messages[nextIndex];
      });
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex flex-col justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-slate-300 rounded-full animate-spin"></div>
      <p className="mt-4 text-white text-lg font-semibold transition-opacity duration-500">{currentMessage}</p>
    </div>
  );
};

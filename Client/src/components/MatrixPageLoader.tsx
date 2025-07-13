import React, { useState, useEffect } from 'react';

interface MatrixPageLoaderProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  className?: string;
}

const MatrixPageLoader: React.FC<MatrixPageLoaderProps> = ({ 
  title = "Loading", 
  subtitle = "Initializing system...",
  progress,
  className = '' 
}) => {
  const [dots, setDots] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  // Animated dots for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Typewriter effect for loading messages
  useEffect(() => {
    const messages = [
      "Connecting to servers...",
      "Fetching data streams...",
      "Analyzing patterns...",
      "Preparing interface...",
      subtitle
    ];

    const typeMessage = (message: string, callback?: () => void) => {
      let index = 0;
      const timer = setInterval(() => {
        if (index <= message.length) {
          setCurrentText(message.slice(0, index));
          index++;
        } else {
          clearInterval(timer);
          setTimeout(() => {
            if (callback) callback();
          }, 1000);
        }
      }, 50);
      return timer;
    };

    const cycleMessages = () => {
      if (textIndex < messages.length - 1) {
        typeMessage(messages[textIndex], () => {
          setTextIndex(prev => prev + 1);
        });
      } else {
        typeMessage(messages[textIndex]);
      }
    };

    const timer = setTimeout(cycleMessages, 500);
    return () => clearTimeout(timer);
  }, [textIndex, subtitle]);

  return (
    <div className={`fixed inset-0 bg-gradient-to-br from-hacker-black via-hacker-green-dark/20 to-hacker-black flex items-center justify-center z-50 ${className}`}>
      {/* Matrix rain background effect */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-hacker-green text-xs font-mono animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          >
            {Math.random().toString(36).substring(2, 4)}
          </div>
        ))}
      </div>

      {/* Main loader content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {/* Central loading animation */}
        <div className="relative mb-8">
          {/* Outer rotating rings */}
          <div className="relative w-32 h-32 mx-auto">
            <div className="absolute inset-0 border-4 border-transparent border-t-hacker-green border-r-hacker-green-bright rounded-full animate-spin"></div>
            <div className="absolute inset-2 border-2 border-transparent border-b-hacker-green-bright border-l-hacker-green rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
            <div className="absolute inset-6 border-2 border-transparent border-t-hacker-green-muted border-r-hacker-green-muted rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
            
            {/* Central core */}
            <div className="absolute inset-10 bg-hacker-green rounded-full animate-pulse opacity-80 flex items-center justify-center">
              <div className="w-4 h-4 bg-hacker-green-bright rounded-full animate-ping"></div>
            </div>

            {/* Data streams */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-1/2 w-px h-8 bg-gradient-to-b from-hacker-green to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-1/2 w-px h-8 bg-gradient-to-t from-hacker-green to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute left-0 top-1/2 h-px w-8 bg-gradient-to-r from-hacker-green to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute right-0 top-1/2 h-px w-8 bg-gradient-to-l from-hacker-green to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>

          {/* Matrix-style corner brackets */}
          <div className="absolute -top-6 -left-6 text-hacker-green-bright text-2xl font-mono animate-pulse">⌈</div>
          <div className="absolute -top-6 -right-6 text-hacker-green-bright text-2xl font-mono animate-pulse" style={{ animationDelay: '0.25s' }}>⌉</div>
          <div className="absolute -bottom-6 -left-6 text-hacker-green-bright text-2xl font-mono animate-pulse" style={{ animationDelay: '0.5s' }}>⌊</div>
          <div className="absolute -bottom-6 -right-6 text-hacker-green-bright text-2xl font-mono animate-pulse" style={{ animationDelay: '0.75s' }}>⌋</div>
        </div>

        {/* Loading title */}
        <h2 className="text-3xl font-bold text-hacker-green-bright mb-4 font-mono">
          <span className="terminal-text">&gt; {title}</span>
          <span className="animate-pulse ml-1">|</span>
        </h2>

        {/* Dynamic loading message */}
        <div className="mb-6 h-6">
          <p className="text-hacker-green font-mono text-sm">
            {currentText}<span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Progress bar (if provided) */}
        {progress !== undefined && (
          <div className="mb-6">
            <div className="w-full bg-hacker-green-dark/30 rounded-full h-2 mb-2">
              <div 
                className="bg-gradient-to-r from-hacker-green to-hacker-green-bright h-2 rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-hacker-green-muted text-xs font-mono">{Math.round(progress)}% complete</p>
          </div>
        )}

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-hacker-green-muted text-xs font-mono">
          <div className="w-2 h-2 bg-hacker-green rounded-full animate-ping"></div>
          <span>System Status: ACTIVE{dots}</span>
        </div>

        {/* Matrix-style decoration */}
        <div className="mt-8 flex justify-center gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={i}
              className="w-1 h-6 bg-hacker-green opacity-60 animate-pulse"
              style={{ 
                animationDelay: `${i * 0.2}s`,
                height: `${Math.random() * 20 + 10}px`
              }}
            />
          ))}
        </div>
      </div>

      {/* Scanning line effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-hacker-green to-transparent opacity-50 animate-pulse top-1/3"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-hacker-green-bright to-transparent opacity-30 animate-pulse bottom-1/3" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

// Specialized loaders for different sections
export const AnalyticsLoader: React.FC<{ progress?: number }> = ({ progress }) => (
  <MatrixPageLoader 
    title="Analytics"
    subtitle="Processing performance data..."
    progress={progress}
  />
);

export const AICoachLoader: React.FC<{ progress?: number }> = ({ progress }) => (
  <MatrixPageLoader 
    title="AI Coach"
    subtitle="Activating neural networks..."
    progress={progress}
  />
);

export const SettingsLoader: React.FC<{ progress?: number }> = ({ progress }) => (
  <MatrixPageLoader 
    title="Settings"
    subtitle="Loading configuration..."
    progress={progress}
  />
);

export const DashboardLoader: React.FC<{ progress?: number }> = ({ progress }) => (
  <MatrixPageLoader 
    title="Dashboard"
    subtitle="Synchronizing data streams..."
    progress={progress}
  />
);

export default MatrixPageLoader;

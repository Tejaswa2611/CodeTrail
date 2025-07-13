import React, { useState, useEffect } from 'react';

interface MatrixContentLoaderProps {
  title?: string;
  subtitle?: string;
  progress?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MatrixContentLoader: React.FC<MatrixContentLoaderProps> = ({ 
  title = "Loading", 
  subtitle = "Processing data...",
  progress,
  className = '',
  size = 'md'
}) => {
  const [dots, setDots] = useState('');
  const [currentText, setCurrentText] = useState('');
  const [textIndex, setTextIndex] = useState(0);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'h-48',
      loader: 'w-16 h-16',
      title: 'text-xl',
      subtitle: 'text-sm',
      padding: 'p-6'
    },
    md: {
      container: 'h-64',
      loader: 'w-24 h-24',
      title: 'text-2xl',
      subtitle: 'text-base',
      padding: 'p-8'
    },
    lg: {
      container: 'h-80',
      loader: 'w-32 h-32',
      title: 'text-3xl',
      subtitle: 'text-lg',
      padding: 'p-12'
    }
  };

  const config = sizeConfig[size];

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
    <div className={`${config.container} ${config.padding} flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-hacker-black/20 via-hacker-green-dark/10 to-hacker-black/20 rounded-xl border border-hacker-green-dark/30 ${className}`}>
      {/* Matrix background effect */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute text-hacker-green text-xs font-mono animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          >
            {Math.random().toString(36).substring(2, 3)}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-sm mx-auto">
        {/* Central loading animation */}
        <div className="relative mb-6">
          <div className={`relative ${config.loader} mx-auto`}>
            {/* Outer rotating rings */}
            <div className="absolute inset-0 border-2 border-transparent border-t-hacker-green border-r-hacker-green-bright rounded-full animate-spin"></div>
            <div className="absolute inset-1 border border-transparent border-b-hacker-green-bright border-l-hacker-green rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
            
            {/* Central core */}
            <div className="absolute inset-6 bg-hacker-green rounded-full animate-pulse opacity-80 flex items-center justify-center">
              <div className="w-2 h-2 bg-hacker-green-bright rounded-full animate-ping"></div>
            </div>

            {/* Data streams */}
            <div className="absolute inset-0 opacity-60">
              <div className="absolute top-0 left-1/2 w-px h-4 bg-gradient-to-b from-hacker-green to-transparent animate-pulse"></div>
              <div className="absolute bottom-0 left-1/2 w-px h-4 bg-gradient-to-t from-hacker-green to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute left-0 top-1/2 h-px w-4 bg-gradient-to-r from-hacker-green to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
              <div className="absolute right-0 top-1/2 h-px w-4 bg-gradient-to-l from-hacker-green to-transparent animate-pulse" style={{ animationDelay: '1.5s' }}></div>
            </div>
          </div>

          {/* Corner brackets */}
          <div className="absolute -top-3 -left-3 text-hacker-green-bright text-lg font-mono animate-pulse">⌈</div>
          <div className="absolute -top-3 -right-3 text-hacker-green-bright text-lg font-mono animate-pulse" style={{ animationDelay: '0.25s' }}>⌉</div>
          <div className="absolute -bottom-3 -left-3 text-hacker-green-bright text-lg font-mono animate-pulse" style={{ animationDelay: '0.5s' }}>⌊</div>
          <div className="absolute -bottom-3 -right-3 text-hacker-green-bright text-lg font-mono animate-pulse" style={{ animationDelay: '0.75s' }}>⌋</div>
        </div>

        {/* Loading title */}
        <h3 className={`${config.title} font-bold text-hacker-green-bright mb-3 font-mono`}>
          <span className="terminal-text">&gt; {title}</span>
          <span className="animate-pulse ml-1">|</span>
        </h3>

        {/* Dynamic loading message */}
        <div className="mb-4 h-5">
          <p className={`${config.subtitle} text-hacker-green font-mono`}>
            {currentText}<span className="animate-pulse">|</span>
          </p>
        </div>

        {/* Progress bar (if provided) */}
        {progress !== undefined && (
          <div className="mb-4">
            <div className="w-full bg-hacker-green-dark/30 rounded-full h-1 mb-1">
              <div 
                className="bg-gradient-to-r from-hacker-green to-hacker-green-bright h-1 rounded-full transition-all duration-300 relative overflow-hidden"
                style={{ width: `${Math.min(progress, 100)}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
              </div>
            </div>
            <p className="text-hacker-green-muted text-xs font-mono">{Math.round(progress)}%</p>
          </div>
        )}

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-hacker-green-muted text-xs font-mono">
          <div className="w-1 h-1 bg-hacker-green rounded-full animate-ping"></div>
          <span>Status: ACTIVE{dots}</span>
        </div>
      </div>

      {/* Scanning lines */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-hacker-green to-transparent top-1/3 animate-pulse"></div>
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-hacker-green-bright to-transparent bottom-1/3 animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>
    </div>
  );
};

// Specialized content loaders for different sections
export const AnalyticsContentLoader: React.FC<{ progress?: number; size?: 'sm' | 'md' | 'lg' }> = ({ progress, size = 'md' }) => (
  <MatrixContentLoader 
    title="Loading Analytics"
    subtitle="Analyzing your coding progress..."
    progress={progress}
    size={size}
  />
);

export const AICoachContentLoader: React.FC<{ progress?: number; size?: 'sm' | 'md' | 'lg' }> = ({ progress, size = 'md' }) => (
  <MatrixContentLoader 
    title="Loading AI Coach"
    subtitle="Activating neural networks..."
    progress={progress}
    size={size}
  />
);

export const SettingsContentLoader: React.FC<{ progress?: number; size?: 'sm' | 'md' | 'lg' }> = ({ progress, size = 'md' }) => (
  <MatrixContentLoader 
    title="Loading Settings"
    subtitle="Loading configuration..."
    progress={progress}
    size={size}
  />
);

export const DashboardContentLoader: React.FC<{ progress?: number; size?: 'sm' | 'md' | 'lg' }> = ({ progress, size = 'md' }) => (
  <MatrixContentLoader 
    title="Loading Dashboard"
    subtitle="Synchronizing data streams..."
    progress={progress}
    size={size}
  />
);

export default MatrixContentLoader;

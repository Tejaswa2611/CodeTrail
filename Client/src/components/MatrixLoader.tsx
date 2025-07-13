import React from 'react';

interface MatrixLoaderProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  text?: string;
  className?: string;
}

const MatrixLoader: React.FC<MatrixLoaderProps> = ({ 
  size = 'md', 
  text,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      {/* Matrix-style loading animation */}
      <div className={`relative ${sizeClasses[size]}`}>
        {/* Outer rotating ring */}
        <div className="absolute inset-0 border-2 border-transparent border-t-hacker-green border-r-hacker-green-bright rounded-full animate-spin"></div>
        
        {/* Inner pulsing core */}
        <div className="absolute inset-2 bg-hacker-green rounded-full animate-pulse opacity-60"></div>
        
        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-1 h-1 bg-hacker-green-bright rounded-full animate-ping"></div>
        </div>
        
        {/* Matrix-style data streams */}
        <div className="absolute -inset-2 opacity-30">
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-transparent via-hacker-green to-transparent animate-pulse"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-hacker-green to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        </div>
      </div>

      {/* Loading text with typewriter effect */}
      {text && (
        <div className={`${textSizeClasses[size]} text-hacker-green font-mono flex items-center gap-1`}>
          <span>{text}</span>
          <span className="animate-pulse">|</span>
        </div>
      )}
    </div>
  );
};

// Matrix-style skeleton loader for content
export const MatrixSkeleton: React.FC<{ 
  lines?: number; 
  className?: string; 
  animated?: boolean;
}> = ({ 
  lines = 3, 
  className = '', 
  animated = true 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`h-3 bg-hacker-green-dark/30 rounded-sm ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{
            width: `${Math.random() * 40 + 60}%`,
            animationDelay: animated ? `${index * 0.2}s` : '0s'
          }}
        />
      ))}
    </div>
  );
};

// Matrix-style loading spinner for inline use
export const MatrixSpinner: React.FC<{ 
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <div className="absolute inset-0 border border-transparent border-t-hacker-green border-r-hacker-green-bright rounded-full animate-spin"></div>
      <div className="absolute inset-1 bg-hacker-green/30 rounded-full animate-pulse"></div>
    </div>
  );
};

export default MatrixLoader;

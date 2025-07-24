import React from 'react';

interface LoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Brand gradient pulse loader
export const BrandPulseLoader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12"
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative w-full h-full">
        <div className="absolute inset-0 bg-gradient-to-r from-[#E64373] to-[#644EC9] rounded-full animate-pulse opacity-75"></div>
        <div className="absolute inset-1 bg-gradient-to-r from-[#644EC9] to-[#5D3B87] rounded-full animate-pulse opacity-50 animation-delay-200"></div>
        <div className="absolute inset-2 bg-gradient-to-r from-[#5D3B87] to-[#E64373] rounded-full animate-pulse opacity-25 animation-delay-400"></div>
      </div>
    </div>
  );
};

// Code-themed spinner with brackets
export const CodeSpinLoader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-6 h-6 text-sm",
    lg: "w-8 h-8 text-base",
    xl: "w-12 h-12 text-lg"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative flex items-center justify-center`}>
      <div className="absolute inset-0 animate-spin">
        <div className="w-full h-full border-2 border-transparent border-t-[#E64373] border-r-[#644EC9] rounded-full"></div>
      </div>
      <span className="text-[#5D3B87] font-mono font-bold animate-pulse">
        &lt;/&gt;
      </span>
    </div>
  );
};

// Matrix-style dots loader
export const MatrixDotsLoader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "gap-1",
    md: "gap-1.5",
    lg: "gap-2",
    xl: "gap-3"
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
    xl: "w-3 h-3"
  };

  return (
    <div className={`flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className={`${dotSizes[size]} bg-[#E64373] rounded-full animate-bounce`}></div>
      <div className={`${dotSizes[size]} bg-[#644EC9] rounded-full animate-bounce animation-delay-150`}></div>
      <div className={`${dotSizes[size]} bg-[#5D3B87] rounded-full animate-bounce animation-delay-300`}></div>
    </div>
  );
};

// Gradient wave loader
export const WaveLoader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2",
    xl: "h-3"
  };

  const widthClasses = {
    sm: "w-12",
    md: "w-16",
    lg: "w-20",
    xl: "w-24"
  };

  return (
    <div className={`${widthClasses[size]} ${sizeClasses[size]} ${className} relative overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700`}>
      <div className="absolute inset-0 bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] animate-wave"></div>
    </div>
  );
};

// Orbit loader with brand colors
export const OrbitLoader: React.FC<LoaderProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20"
  };

  const dotSizes = {
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
    xl: "w-4 h-4"
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <div className="absolute inset-0 animate-spin">
        <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${dotSizes[size]} bg-[#E64373] rounded-full`}></div>
      </div>
      <div className="absolute inset-0 animate-spin animation-delay-300" style={{ animationDirection: 'reverse' }}>
        <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${dotSizes[size]} bg-[#644EC9] rounded-full`}></div>
      </div>
      <div className="absolute inset-0 animate-spin animation-delay-600">
        <div className={`absolute right-0 top-1/2 transform -translate-y-1/2 ${dotSizes[size]} bg-[#5D3B87] rounded-full`}></div>
      </div>
    </div>
  );
};

// Text loader with typing effect
export const TypingLoader: React.FC<{ text?: string; className?: string }> = ({ 
  text = "Loading", 
  className = "" 
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="bg-gradient-to-r from-[#E64373] via-[#644EC9] to-[#5D3B87] bg-clip-text text-transparent font-mono font-medium">
        {text}
      </span>
      <div className="flex gap-1">
        <div className="w-1 h-1 bg-[#E64373] rounded-full animate-bounce"></div>
        <div className="w-1 h-1 bg-[#644EC9] rounded-full animate-bounce animation-delay-150"></div>
        <div className="w-1 h-1 bg-[#5D3B87] rounded-full animate-bounce animation-delay-300"></div>
      </div>
    </div>
  );
};

// Card skeleton loader with brand gradient
export const CardSkeletonLoader: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-4 bg-gradient-to-r from-[#E64373]/20 via-[#644EC9]/20 to-[#5D3B87]/20 rounded-md mb-3"></div>
      <div className="h-8 bg-gradient-to-r from-[#5D3B87]/20 via-[#E64373]/20 to-[#644EC9]/20 rounded-md mb-2"></div>
      <div className="h-3 bg-gradient-to-r from-[#644EC9]/20 via-[#5D3B87]/20 to-[#E64373]/20 rounded-md w-3/4"></div>
    </div>
  );
};

// Main theme-aware loader component
export const ThemeLoader: React.FC<LoaderProps & { 
  variant?: "pulse" | "code" | "dots" | "wave" | "orbit";
  text?: string;
}> = ({ 
  size = "md", 
  variant = "pulse", 
  className = "",
  text 
}) => {
  const loaderComponents = {
    pulse: BrandPulseLoader,
    code: CodeSpinLoader,
    dots: MatrixDotsLoader,
    wave: WaveLoader,
    orbit: OrbitLoader
  };

  const LoaderComponent = loaderComponents[variant];

  return (
    <div className="flex flex-col items-center gap-2">
      <LoaderComponent size={size} className={className} />
      {text && <TypingLoader text={text} />}
    </div>
  );
}; 
import React, { useState, useEffect } from 'react';
import ScrambleLogo from './ScrambleLogo';

interface LogoFaviconProps {
    size?: number;
}

// Enhanced SVG-based favicon logo with improved animations
export const LogoFavicon: React.FC<LogoFaviconProps> = ({ size = 32 }) => {
    const [currentChar, setCurrentChar] = useState(0);
    const [isGlitching, setIsGlitching] = useState(false);

    useEffect(() => {
        const chars = ['<', '/', '>', '{', '}', '[', ']', 'C'];
        const interval = setInterval(() => {
            // Add occasional glitch effect
            if (Math.random() > 0.85) {
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 150);
            }
            
            setCurrentChar(prev => (prev + 1) % chars.length);
        }, 800);

        return () => clearInterval(interval);
    }, []);

    const getCurrentChar = () => {
        const chars = ['<', '/', '>', '{', '}', '[', ']', 'C'];
        return chars[currentChar];
    };

    return (
        <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ff41" />
                    <stop offset="30%" stopColor="#00cc33" />
                    <stop offset="70%" stopColor="#00ff88" />
                    <stop offset="100%" stopColor="#00ff41" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <filter id="glitch">
                    <feOffset in="SourceGraphic" dx={isGlitching ? "1" : "0"} dy={isGlitching ? "0.5" : "0"} result="offset" />
                    <feFlood floodColor="#ff0040" result="flood1" />
                    <feComposite in="flood1" in2="offset" operator="in" result="comp1" />
                    <feOffset in="SourceGraphic" dx={isGlitching ? "-1" : "0"} dy={isGlitching ? "-0.5" : "0"} result="offset2" />
                    <feFlood floodColor="#00ffff" result="flood2" />
                    <feComposite in="flood2" in2="offset2" operator="in" result="comp2" />
                    <feMerge>
                        <feMergeNode in="comp1" />
                        <feMergeNode in="comp2" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background with subtle gradient */}
            <rect width="32" height="32" rx="6" fill="#0d1117" />
            <rect width="32" height="32" rx="6" fill="url(#logoGradient)" opacity="0.05" />

            {/* Enhanced matrix grid */}
            <line x1="16" y1="0" x2="16" y2="32" stroke="#00ff41" strokeWidth="0.5" opacity="0.4" />
            <line x1="0" y1="16" x2="32" y2="16" stroke="#00ff41" strokeWidth="0.5" opacity="0.4" />
            <line x1="8" y1="0" x2="8" y2="32" stroke="#00ff41" strokeWidth="0.25" opacity="0.2" />
            <line x1="24" y1="0" x2="24" y2="32" stroke="#00ff41" strokeWidth="0.25" opacity="0.2" />
            <line x1="0" y1="8" x2="32" y2="8" stroke="#00ff41" strokeWidth="0.25" opacity="0.2" />
            <line x1="0" y1="24" x2="32" y2="24" stroke="#00ff41" strokeWidth="0.25" opacity="0.2" />

            {/* Main character with enhanced effects */}
            <text
                x="16"
                y="22"
                fontFamily="'JetBrains Mono', 'Courier New', monospace"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                fill="url(#logoGradient)"
                filter={isGlitching ? "url(#glitch)" : "url(#glow)"}
                opacity={isGlitching ? "0.8" : "1"}
            >
                {getCurrentChar()}
            </text>

            {/* Enhanced corner brackets with animation */}
            <text x="2" y="8" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.8">⌈</text>
            <text x="26" y="8" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.8">⌉</text>
            <text x="2" y="28" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.8">⌊</text>
            <text x="26" y="28" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.8">⌋</text>

            {/* Subtle corner dots */}
            <circle cx="4" cy="4" r="0.5" fill="#00ff41" opacity="0.6" />
            <circle cx="28" cy="4" r="0.5" fill="#00ff41" opacity="0.6" />
            <circle cx="4" cy="28" r="0.5" fill="#00ff41" opacity="0.6" />
            <circle cx="28" cy="28" r="0.5" fill="#00ff41" opacity="0.6" />
        </svg>
    );
};

// Enhanced loading screen logo with sophisticated animations
interface LogoLoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    message?: string;
}

export const LogoLoading: React.FC<LogoLoadingProps> = ({
    size = 'lg',
    message = 'Loading...'
}) => {
    const [dots, setDots] = useState('');
    const [scanLine, setScanLine] = useState(0);
    const [matrixChars, setMatrixChars] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setScanLine(prev => (prev + 1) % 100);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const chars = ['0', '1', '/', '<', '>', '{', '}', '[', ']', 'C', 'o', 'd', 'e'];
        const interval = setInterval(() => {
            setMatrixChars(prev => {
                const newChars = [...prev];
                const randomIndex = Math.floor(Math.random() * 10);
                newChars[randomIndex] = chars[Math.floor(Math.random() * chars.length)];
                return newChars.slice(0, 10);
            });
        }, 200);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-8 relative">
            {/* Background matrix effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-10">
                    {matrixChars.map((char, i) => (
                        <div
                            key={i}
                            className="absolute text-tech-primary-green font-mono text-sm animate-pulse"
                            style={{
                                left: `${(i * 10) % 100}%`,
                                top: `${(i * 15) % 100}%`,
                                animationDelay: `${i * 0.1}s`
                            }}
                        >
                            {char}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {/* Enhanced container with multiple effects */}
                <div className="relative">
                    <ScrambleLogo
                        size={size}
                        animated={true}
                        autoScramble={false}
                        variant="default"
                        className="justify-center relative z-10"
                    />

                    {/* Enhanced loading effects */}
                    <div className="absolute -inset-6 opacity-40">
                        <div className="absolute inset-0 border border-tech-primary-green rounded-lg animate-pulse"></div>
                        <div className="absolute -inset-2 border border-tech-accent-green rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                        <div className="absolute -inset-4 border border-tech-primary-green rounded-lg animate-pulse" style={{ animationDelay: '1s' }}></div>
                    </div>

                    {/* Advanced scanning lines */}
                    <div className="absolute inset-0 overflow-hidden">
                        <div 
                            className="absolute w-full h-px bg-gradient-to-r from-transparent via-tech-primary-green to-transparent"
                            style={{ 
                                top: `${scanLine}%`,
                                boxShadow: '0 0 10px #00ff41',
                                transition: 'top 0.05s linear'
                            }}
                        />
                        <div 
                            className="absolute w-full h-px bg-gradient-to-r from-transparent via-tech-accent-green to-transparent opacity-60"
                            style={{ 
                                top: `${(scanLine + 30) % 100}%`,
                                boxShadow: '0 0 5px #00cc33',
                                transition: 'top 0.05s linear'
                            }}
                        />
                    </div>

                    {/* Corner indicators */}
                    <div className="absolute -inset-2 pointer-events-none">
                        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-tech-primary-green opacity-70"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-tech-primary-green opacity-70"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-tech-primary-green opacity-70"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-tech-primary-green opacity-70"></div>
                    </div>
                </div>

                {/* Enhanced text section */}
                <div className="text-center mt-8">
                    <p className="text-tech-primary-green font-mono text-lg mb-4 relative">
                        <span className="relative z-10">
                            {'>'} {message}{dots}
                        </span>
                        <span className="absolute inset-0 text-tech-accent-green opacity-30 blur-sm">
                            {'>'} {message}{dots}
                        </span>
                    </p>
                    
                    {/* Enhanced loading bars */}
                    <div className="flex justify-center gap-1 mb-4">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div
                                key={i}
                                className="w-1 bg-tech-primary-green rounded-full animate-pulse"
                                style={{
                                    height: `${Math.sin((Date.now() * 0.002) + (i * 0.5)) * 8 + 16}px`,
                                    animationDelay: `${i * 0.1}s`,
                                    boxShadow: '0 0 4px #00ff41'
                                }}
                            />
                        ))}
                    </div>

                    {/* CodeTrail text with typewriter effect */}
                    <div className="font-mono text-sm text-tech-accent-green">
                        <span className="opacity-70">Initializing </span>
                        <span className="text-tech-primary-green font-bold">CodeTrail</span>
                        <span className="animate-pulse">_</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Enhanced 404 Error page logo with advanced glitch effects
export const Logo404: React.FC = () => {
    const [glitchText, setGlitchText] = useState('404');
    const [isGlitching, setIsGlitching] = useState(false);
    const [errorMessage, setErrorMessage] = useState('Page Not Found');

    useEffect(() => {
        const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░', '◆', '◇', '▲', '▼'];
        const errorMessages = [
            'Page Not Found',
            'Resource Disconnected',
            'Matrix Error',
            'Code Path Lost',
            'Trail Broken'
        ];
        
        let glitchIndex = 0;

        const interval = setInterval(() => {
            if (Math.random() > 0.6) {
                setIsGlitching(true);
                
                // Randomize 404 text
                const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                setGlitchText(prev => {
                    const chars = prev.split('');
                    chars[glitchIndex % 3] = randomChar;
                    return chars.join('');
                });

                // Occasionally change error message
                if (Math.random() > 0.8) {
                    setErrorMessage(errorMessages[Math.floor(Math.random() * errorMessages.length)]);
                }

                setTimeout(() => {
                    setGlitchText('404');
                    setIsGlitching(false);
                    setErrorMessage('Page Not Found');
                }, 150);
            }
            glitchIndex++;
        }, 400);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-8 relative">
            {/* Background static effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute inset-0 opacity-5">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute text-red-500 font-mono text-xs animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 2}s`
                            }}
                        >
                            {Math.random() > 0.5 ? '█' : '▓'}
                        </div>
                    ))}
                </div>
            </div>

            <div className="relative z-10">
                {/* Enhanced logo with glitch overlay */}
                <div className="relative">
                    <ScrambleLogo
                        size="xl"
                        animated={true}
                        autoScramble={false}
                        variant="default"
                        className="justify-center opacity-60 blur-sm"
                    />

                    {/* Enhanced 404 glitch overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`relative font-mono text-6xl font-bold transition-all duration-150 ${
                            isGlitching ? 'text-red-400' : 'text-red-500'
                        }`}>
                            <span className="relative z-10">{glitchText}</span>
                            {isGlitching && (
                                <>
                                    <span className="absolute inset-0 text-cyan-400 translate-x-1 -translate-y-0.5 opacity-60">
                                        {glitchText}
                                    </span>
                                    <span className="absolute inset-0 text-yellow-400 -translate-x-1 translate-y-0.5 opacity-40">
                                        {glitchText}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Error frame effect */}
                    <div className="absolute -inset-4 border-2 border-red-500 opacity-30 animate-pulse"></div>
                    <div className="absolute -inset-2 border border-red-400 opacity-20"></div>
                </div>

                {/* Enhanced error message */}
                <div className="text-center mt-8">
                    <h2 className="text-2xl font-bold text-tech-primary-green font-mono mb-4 relative">
                        <span className="relative z-10">
                            {'>'} {errorMessage}
                        </span>
                        {isGlitching && (
                            <span className="absolute inset-0 text-red-400 translate-x-0.5 opacity-60">
                                {'>'} {errorMessage}
                            </span>
                        )}
                    </h2>
                    
                    <div className="font-mono text-tech-gray space-y-2">
                        <p>The requested resource has been disconnected from the matrix.</p>
                        <p className="text-sm opacity-70">
                            <span className="text-tech-primary-green">CodeTrail</span> | Error Code: 404
                        </p>
                    </div>

                    {/* Navigation hint */}
                    <div className="mt-6 p-4 border border-tech-primary-green rounded bg-tech-primary-green bg-opacity-5">
                        <p className="text-tech-primary-green font-mono text-sm">
                            {'>'} Try navigating back to the main <span className="text-tech-accent-green font-bold">CodeTrail</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default { LogoFavicon, LogoLoading, Logo404 };
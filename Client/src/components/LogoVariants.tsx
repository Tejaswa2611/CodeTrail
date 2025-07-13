import React, { useState, useEffect } from 'react';
import CodeTrailLogo from './CodeTrailLogo';

interface LogoFaviconProps {
    size?: number;
}

// SVG-based favicon logo that matches our animated logo
export const LogoFavicon: React.FC<LogoFaviconProps> = ({ size = 32 }) => {
    const [currentChar, setCurrentChar] = useState(0);

    useEffect(() => {
        const chars = ['<', '/', '>', '{', '}', '[', ']', 'C'];
        const interval = setInterval(() => {
            setCurrentChar(prev => (prev + 1) % chars.length);
        }, 500);

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
                    <stop offset="50%" stopColor="#00cc33" />
                    <stop offset="100%" stopColor="#00ff41" />
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Background */}
            <rect width="32" height="32" rx="6" fill="#0d1117" />

            {/* Matrix grid lines */}
            <line x1="16" y1="0" x2="16" y2="32" stroke="#00ff41" strokeWidth="0.5" opacity="0.3" />
            <line x1="0" y1="16" x2="32" y2="16" stroke="#00ff41" strokeWidth="0.5" opacity="0.3" />

            {/* Main character */}
            <text
                x="16"
                y="22"
                fontFamily="'JetBrains Mono', monospace"
                fontSize="16"
                fontWeight="bold"
                textAnchor="middle"
                fill="url(#logoGradient)"
                filter="url(#glow)"
            >
                {getCurrentChar()}
            </text>

            {/* Corner brackets */}
            <text x="2" y="8" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.7">⌈</text>
            <text x="26" y="8" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.7">⌉</text>
            <text x="2" y="28" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.7">⌊</text>
            <text x="26" y="28" fontFamily="monospace" fontSize="8" fill="#00ff41" opacity="0.7">⌋</text>
        </svg>
    );
};

// Loading screen logo with enhanced animations
interface LogoLoadingProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    message?: string;
}

export const LogoLoading: React.FC<LogoLoadingProps> = ({
    size = 'lg',
    message = 'Loading...'
}) => {
    const [dots, setDots] = useState('');

    useEffect(() => {
        const interval = setInterval(() => {
            setDots(prev => prev.length >= 3 ? '' : prev + '.');
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-6 p-8">
            <div className="relative">
                <CodeTrailLogo
                    size={size}
                    animated={true}
                    showText={true}
                    variant="default"
                    className="justify-center"
                />

                {/* Enhanced loading effects */}
                <div className="absolute -inset-4 opacity-30">
                    <div className="absolute inset-0 border border-tech-primary-green rounded-lg animate-pulse"></div>
                    <div className="absolute -inset-2 border border-tech-accent-green rounded-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>

                {/* Scanning lines */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-tech-primary-green to-transparent animate-pulse top-1/3"></div>
                    <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-tech-accent-green to-transparent animate-pulse bottom-1/3" style={{ animationDelay: '1s' }}></div>
                </div>
            </div>

            <div className="text-center">
                <p className="text-tech-primary-green font-mono text-lg mb-2">
                    {message}{dots}
                </p>
                <div className="flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1 h-4 bg-tech-primary-green rounded-full animate-pulse"
                            style={{
                                animationDelay: `${i * 0.2}s`,
                                height: `${Math.random() * 16 + 8}px`
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

// 404 Error page logo
export const Logo404: React.FC = () => {
    const [glitchText, setGlitchText] = useState('404');

    useEffect(() => {
        const glitchChars = ['4', '0', '4', '█', '▓', '▒', '░'];
        let glitchIndex = 0;

        const interval = setInterval(() => {
            if (Math.random() > 0.7) {
                const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
                setGlitchText(prev => {
                    const chars = prev.split('');
                    chars[glitchIndex % 3] = randomChar;
                    return chars.join('');
                });

                setTimeout(() => setGlitchText('404'), 100);
            }
            glitchIndex++;
        }, 300);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-8 p-8">
            <div className="relative">
                <CodeTrailLogo
                    size="xl"
                    animated={true}
                    showText={true}
                    variant="default"
                    className="justify-center opacity-75"
                />

                {/* Glitch overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-red-500 font-mono text-4xl font-bold animate-pulse">
                        {glitchText}
                    </div>
                </div>
            </div>

            <div className="text-center">
                <h2 className="text-2xl font-bold text-tech-primary-green font-mono mb-2">
                    {'>'} Page Not Found
                </h2>
                <p className="text-tech-gray font-mono">
                    The requested resource has been disconnected from the matrix.
                </p>
            </div>
        </div>
    );
};

export default { LogoFavicon, LogoLoading, Logo404 };

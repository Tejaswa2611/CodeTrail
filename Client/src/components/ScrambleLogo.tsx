import React, { useState, useEffect, useRef, useCallback } from 'react';

interface ScrambleLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
    variant?: 'default' | 'navbar' | 'compact';
    animated?: boolean;
    autoScramble?: boolean;
    className?: string;
    onClick?: () => void;
}

const ScrambleLogo: React.FC<ScrambleLogoProps> = ({
    size = 'md',
    variant = 'default',
    animated = true,
    autoScramble = true,
    className = '',
    onClick
}) => {
    const [isScrambling, setIsScrambling] = useState(false);
    const [letters, setLetters] = useState('CODETRAIL'.split(''));
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const autoScrambleRef = useRef<NodeJS.Timeout | null>(null);

    const originalText = 'CODETRAIL';
    const scrambleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/<>';

    // Size configurations
    const sizeConfig = {
        sm: {
            text: 'text-lg',
            subtitle: 'text-xs',
            letterSpacing: 'tracking-wider',
            container: 'p-2'
        },
        md: {
            text: 'text-2xl md:text-3xl',
            subtitle: 'text-sm',
            letterSpacing: 'tracking-widest',
            container: 'p-4'
        },
        lg: {
            text: 'text-3xl md:text-4xl',
            subtitle: 'text-base',
            letterSpacing: 'tracking-widest',
            container: 'p-6'
        },
        xl: {
            text: 'text-4xl md:text-5xl',
            subtitle: 'text-lg',
            letterSpacing: 'tracking-widest',
            container: 'p-8'
        },
        hero: {
            text: 'text-5xl md:text-6xl lg:text-7xl',
            subtitle: 'text-lg md:text-xl',
            letterSpacing: 'tracking-widest',
            container: 'p-8 md:p-12'
        }
    };

    const config = sizeConfig[size];

    const triggerScramble = useCallback(() => {
        if (isScrambling || !animated) return;

        setIsScrambling(true);
        const scrambleDuration = 1000;
        const iterations = 20;
        const intervalTime = scrambleDuration / iterations;

        let currentIteration = 0;

        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setLetters(prevLetters => {
                return prevLetters.map((_, index) => {
                    const progress = currentIteration / iterations;
                    const letterProgress = Math.max(0, (progress - (index * 0.1)) * 1.5);

                    if (letterProgress < 1) {
                        return scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                    } else {
                        return originalText[index];
                    }
                });
            });

            currentIteration++;

            if (currentIteration > iterations) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setLetters(originalText.split(''));
                setIsScrambling(false);
            }
        }, intervalTime);
    }, [isScrambling, animated, scrambleChars, originalText]);

    // Auto-scramble effect
    useEffect(() => {
        if (!autoScramble || !animated) return;

        const scheduleNextScramble = () => {
            const delay = Math.random() * 5000 + 7000; // 7-12 seconds
            autoScrambleRef.current = setTimeout(() => {
                triggerScramble();
                scheduleNextScramble();
            }, delay);
        };

        // Initial scramble after 2 seconds
        const initialTimeout = setTimeout(() => {
            triggerScramble();
            scheduleNextScramble();
        }, 2000);

        return () => {
            clearTimeout(initialTimeout);
            if (autoScrambleRef.current) clearTimeout(autoScrambleRef.current);
        };
    }, [autoScramble, animated, triggerScramble]);

    // Cleanup
    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (autoScrambleRef.current) clearTimeout(autoScrambleRef.current);
        };
    }, []);

    const handleClick = () => {
        triggerScramble();
        onClick?.();
    };

    const renderLogo = () => (
        <div 
            className={`
                relative text-center cursor-pointer group
                ${config.container} ${className}
                ${variant === 'navbar' ? 'scale-50 origin-left' : ''}
                ${variant === 'compact' ? 'flex items-center gap-4' : ''}
            `}
            onClick={handleClick}
            style={{ fontFamily: "'JetBrains Mono', 'Orbitron', monospace" }}
        >
            {/* Scan line effect */}
            {animated && (
                <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-tech-primary-green to-transparent opacity-30 animate-pulse"></div>
            )}

            {/* Main logo text */}
            <div className={`
                ${config.text} font-black
                ${size === 'hero' ? 'text-slate-800 dark:text-slate-200' : 'text-tech-primary-green'}
                ${config.letterSpacing} relative inline-block
                transition-all duration-200 group-hover:scale-105
            `}
                style={{
                    textShadow: size === 'hero' 
                        ? '0 0 8px rgba(59, 130, 246, 0.3), 0 0 16px rgba(99, 102, 241, 0.2), 0 0 24px rgba(168, 85, 247, 0.1)'
                        : '0 0 10px rgba(0, 255, 65, 0.8), 0 0 20px rgba(0, 255, 65, 0.4)',
                    filter: size === 'hero'
                        ? 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.4))'
                        : 'drop-shadow(0 0 5px rgba(0, 255, 65, 0.3))'
                }}
            >
                <span className={`font-bold ${size === 'hero' ? 'text-blue-500 dark:text-blue-400' : 'text-tech-accent-green'} animate-pulse`}>[</span>
                {letters.map((letter, index) => (
                    <span
                        key={index}
                        className={`
                            inline-block transition-all duration-100 hover:scale-110
                            ${isScrambling ? 'animate-pulse scale-105' : ''}
                        `}
                        style={{
                            textShadow: isScrambling 
                                ? (size === 'hero' 
                                    ? '0 0 12px rgba(59, 130, 246, 0.8), 0 0 20px rgba(99, 102, 241, 0.5), 0 0 28px rgba(168, 85, 247, 0.3)'
                                    : '0 0 20px rgba(0, 255, 65, 1), 0 0 30px rgba(0, 255, 65, 0.5)')
                                : (size === 'hero'
                                    ? '0 0 8px rgba(59, 130, 246, 0.4), 0 0 16px rgba(99, 102, 241, 0.2)'
                                    : '0 0 10px rgba(0, 255, 65, 0.8)')
                        }}
                    >
                        {letter}
                    </span>
                ))}
                <span className={`font-bold ${size === 'hero' ? 'text-blue-500 dark:text-blue-400' : 'text-tech-accent-green'} animate-pulse`}>]</span>
            </div>

            {/* Subtitle */}
            {variant !== 'navbar' && (
                <div className={`
                    ${config.subtitle} ${size === 'hero' ? 'text-slate-600 dark:text-slate-400' : 'text-tech-gray'} tracking-wider mt-2
                    ${variant === 'compact' ? 'mt-0' : ''}
                `}
                    style={{ fontFamily: "'JetBrains Mono', monospace" }}
                >
                    <span className={`font-bold ${size === 'hero' ? 'text-indigo-500 dark:text-indigo-400' : 'text-tech-accent-green'} animate-pulse`}>{'>'}</span>
                    <span className="mx-2">AI powered Code tracker</span>
                    <span className={`${size === 'hero' ? 'text-purple-500 dark:text-purple-400' : 'text-red-400'} animate-pulse`}>.</span>
                    <span className={`${size === 'hero' ? 'text-slate-700 dark:text-slate-300' : 'text-tech-primary-green'}`}>exe</span>
                    <span className={`font-bold ${size === 'hero' ? 'text-indigo-500 dark:text-indigo-400' : 'text-tech-accent-green'} animate-pulse ml-2`}>{'<'}</span>
                </div>
            )}

            {/* Enhanced effects for hero size */}
            {size === 'hero' && animated && (
                <>
                    {/* Floating particles effect (keep for subtle flair) */}
                    <div className="absolute -top-1 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping"></div>
                    <div className="absolute top-1/4 -right-1 w-1 h-1 bg-purple-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
                    <div className="absolute -bottom-1 right-1/4 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute bottom-1/4 -left-1 w-1 h-1 bg-violet-400 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
                </>
            )}

        
        </div>
    );

    return renderLogo();
};

export default ScrambleLogo;

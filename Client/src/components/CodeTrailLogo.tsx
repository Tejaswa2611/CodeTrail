import React, { useState, useEffect, useRef } from 'react';

interface CodeTrailLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'default' | 'compact' | 'icon-only';
    animated?: boolean;
    showText?: boolean;
    className?: string;
}

const CodeTrailLogo: React.FC<CodeTrailLogoProps> = ({
    size = 'md',
    variant = 'default',
    animated = true,
    showText = true,
    className = ''
}) => {
    const [currentChar, setCurrentChar] = useState(0);
    const [displayText, setDisplayText] = useState('CodeTrail');
    const [isTyping, setIsTyping] = useState(false);
    const [glitchActive, setGlitchActive] = useState(false);
    const [particleKey, setParticleKey] = useState(0);
    
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const textIntervalRef = useRef<NodeJS.Timeout | null>(null);

    // Size configurations
    const sizeConfig = {
        sm: {
            container: 'gap-2',
            icon: 'w-8 h-8',
            text: 'text-sm'
        },
        md: {
            container: 'gap-3',
            icon: 'w-12 h-12',
            text: 'text-lg'
        },
        lg: {
            container: 'gap-4',
            icon: 'w-16 h-16',
            text: 'text-2xl'
        },
        xl: {
            container: 'gap-6',
            icon: 'w-20 h-20',
            text: 'text-3xl'
        }
    };

    const config = sizeConfig[size];

    // Enhanced icon character cycling with glitch effects
    useEffect(() => {
        if (!animated) return;

        const chars = ['<', '/', '>', '{', '}', '[', ']', 'C', 'T', '⚡', '∞', '◆', '▲', '●'];

        const startAnimation = () => {
            if (intervalRef.current) clearInterval(intervalRef.current);

            intervalRef.current = setInterval(() => {
                setCurrentChar(prev => (prev + 1) % chars.length);
                
                // Random glitch effect
                if (Math.random() < 0.15) {
                    setGlitchActive(true);
                    setTimeout(() => setGlitchActive(false), 100);
                }
            }, 400);
        };

        startAnimation();

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [animated]);

    // Enhanced text scrambling animation
    useEffect(() => {
        if (!animated) {
            setDisplayText('CodeTrail');
            return;
        }

        const fullText = 'CodeTrail';
        const scrambledChars = '01<>/{}[]()!@#$%^&*~`+=|\\:;?.,';

        const startScramble = () => {
            setIsTyping(true);
            let cycles = 0;
            const maxCycles = 8;

            const scrambleInterval = setInterval(() => {
                if (cycles < maxCycles) {
                    // Full scramble phase
                    const scrambled = Array.from({ length: fullText.length }, () => 
                        scrambledChars[Math.floor(Math.random() * scrambledChars.length)]
                    ).join('');
                    setDisplayText(scrambled);
                    cycles++;
                } else {
                    // Progressive reveal phase
                    clearInterval(scrambleInterval);
                    let revealIndex = 0;
                    
                    const revealInterval = setInterval(() => {
                        if (revealIndex <= fullText.length) {
                            const revealed = fullText.slice(0, revealIndex);
                            const remaining = fullText.length - revealIndex;
                            const scrambled = Array.from({ length: remaining }, () => 
                                scrambledChars[Math.floor(Math.random() * scrambledChars.length)]
                            ).join('');
                            
                            setDisplayText(revealed + scrambled);
                            revealIndex++;
                        } else {
                            setDisplayText(fullText);
                            setIsTyping(false);
                            clearInterval(revealInterval);
                            
                            // Restart cycle
                            setTimeout(() => {
                                startScramble();
                            }, 3000);
                        }
                    }, 120);
                }
            }, 100);
        };

        const initialDelay = setTimeout(startScramble, 200);

        return () => {
            clearTimeout(initialDelay);
        };
    }, [animated]);

    const getCurrentChar = () => {
        const chars = ['<', '/', '>', '{', '}', '[', ']', 'C', 'T', '⚡', '∞', '◆', '▲', '●'];
        const glitchChars = ['█', '▓', '▒', '░', '▄', '▀', '■', '□'];
        
        if (glitchActive) {
            return glitchChars[Math.floor(Math.random() * glitchChars.length)];
        }
        return chars[currentChar];
    };

    // Particle effect component
    const ParticleEffect = () => (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
                <div
                    key={`${particleKey}-${i}`}
                    className="absolute w-1 h-1 bg-green-400 rounded-full opacity-0 animate-pulse"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '2s'
                    }}
                />
            ))}
        </div>
    );

    // Enhanced logo icon component
    const LogoIcon = () => (
        <div
            className={`
                relative ${config.icon} rounded-lg overflow-hidden
                bg-gradient-to-br from-green-400 via-green-500 to-green-400
                border border-green-500 flex items-center justify-center
                ${animated ? 'transition-all duration-200' : ''}
                shadow-lg shadow-green-400/30
                ${glitchActive ? 'animate-pulse' : ''}
            `}
            style={{
                boxShadow: '0 0 20px rgba(34, 197, 94, 0.4), inset 0 0 20px rgba(34, 197, 94, 0.2)',
                transform: glitchActive ? 'scale(1.05) rotate(0.5deg)' : ''
            }}
        >
            {/* Animated grid background */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-gray-900/20 to-transparent"></div>
                {animated && (
                    <>
                        {/* Scanning lines */}
                        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse"></div>
                        <div className="absolute top-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                        <div className="absolute bottom-1/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-500 to-transparent animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent animate-pulse" style={{ animationDelay: '0.9s' }}></div>
                        
                        {/* Vertical lines */}
                        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse" style={{ animationDelay: '0.15s' }}></div>
                        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-green-400 to-transparent animate-pulse" style={{ animationDelay: '0.45s' }}></div>
                    </>
                )}
            </div>

            {/* Main character with glitch effect */}
            <span
                className={`
                    relative z-10 font-bold text-gray-900 font-mono
                    ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-2xl'}
                    ${animated ? 'transition-all duration-100' : ''}
                    ${glitchActive ? 'text-white' : ''}
                `}
                style={{
                    textShadow: glitchActive ? '0 0 10px rgba(255, 255, 255, 0.8)' : '',
                    filter: glitchActive ? 'hue-rotate(180deg)' : ''
                }}
            >
                {animated ? getCurrentChar() : 'C'}
            </span>

            {/* Enhanced corner brackets with pulsing */}
            {animated && (
                <>
                    <div className="absolute -top-1 -left-1 text-green-400 text-xs font-mono animate-pulse opacity-70">⌈</div>
                    <div className="absolute -top-1 -right-1 text-green-400 text-xs font-mono animate-pulse opacity-70" style={{ animationDelay: '0.1s' }}>⌉</div>
                    <div className="absolute -bottom-1 -left-1 text-green-400 text-xs font-mono animate-pulse opacity-70" style={{ animationDelay: '0.2s' }}>⌊</div>
                    <div className="absolute -bottom-1 -right-1 text-green-400 text-xs font-mono animate-pulse opacity-70" style={{ animationDelay: '0.3s' }}>⌋</div>
                </>
            )}
        </div>
    );

    // Enhanced text component
    const LogoText = () => (
        <span
            className={`
                ${config.text} font-bold text-green-400 font-mono
                ${animated ? 'transition-all duration-200' : ''}
            `}
            style={{
                fontFamily: "'JetBrains Mono', 'Courier New', monospace",
                textShadow: '0 0 10px rgba(34, 197, 94, 0.5)',
                filter: isTyping ? 'hue-rotate(30deg)' : ''
            }}
        >
            {displayText}
            {animated && isTyping && (
                <span 
                    className="animate-pulse ml-1 text-green-500"
                    style={{
                        textShadow: '0 0 10px rgba(34, 197, 94, 1)'
                    }}
                >
                    |
                </span>
            )}
        </span>
    );

    // Status indicator
    const StatusIndicator = () => (
        <div className="flex items-center gap-2 text-xs text-green-400/80 font-mono">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="animate-pulse">
                AI-POWERED_CODING_TRACKER
            </span>
        </div>
    );

    // Render based on variant
    if (variant === 'icon-only') {
        return (
            <div className={`inline-flex ${className}`}>
                <LogoIcon />
            </div>
        );
    }

    if (variant === 'compact') {
        return (
            <div
                className={`inline-flex items-start ${config.container} ${className}`}
            >
                <LogoIcon />
                {showText && <LogoText />}
            </div>
        );
    }

    // Default variant with full effects
    return (
        <div
            className={`
                inline-flex items-start ${config.container} ${className}
                ${animated ? 'group cursor-pointer' : ''}
            `}
        >
            <LogoIcon />
            {showText && (
                <div className="flex flex-col">
                    <LogoText />
                    {animated && (
                        <StatusIndicator />
                    )}
                </div>
            )}
        </div>
    );
};

export default CodeTrailLogo;

// CodeTrailHero.tsx
// Reusable animated hero/logo component for CODETRAIL
// Usage: Import and use <CodeTrailHero /> in your React app. Requires Tailwind CSS or similar utility classes for best appearance.
// For the blinking cursor, add the CSS from the comment at the bottom to your global styles.

import React, { useState, useEffect, useRef } from 'react';

// Optional: Replace these with your own SVGs or icons if lucide-react is not available
const TerminalIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" /></svg>
);
const CodeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6" /><polyline points="8 6 2 12 8 18" /></svg>
);
const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const ActivityIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>
);

const MatrixRain = () => {
    const [drops, setDrops] = useState<Array<{ id: number; left: number; delay: number; duration: number; char: string }>>([]);
    useEffect(() => {
        const characters = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
        const newDrops = Array.from({ length: 40 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            duration: 2 + Math.random() * 2,
            char: characters[Math.floor(Math.random() * characters.length)]
        }));
        setDrops(newDrops);
    }, []);
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {drops.map((drop) => (
                <div
                    key={drop.id}
                    className="absolute text-green-400 font-mono text-sm animate-matrix-rain"
                    style={{
                        left: `${drop.left}%`,
                        animationDelay: `${drop.delay}s`,
                        animationDuration: `${drop.duration}s`,
                    }}
                >
                    {drop.char}
                </div>
            ))}
        </div>
    );
};

const GlitchText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    const [isGlitching, setIsGlitching] = useState(false);
    useEffect(() => {
        const glitchInterval = setInterval(() => {
            setIsGlitching(true);
            setTimeout(() => setIsGlitching(false), 300);
        }, 3000 + Math.random() * 2000);
        return () => clearInterval(glitchInterval);
    }, []);
    return (
        <span className={`${className} ${isGlitching ? 'animate-glitch' : ''}`}>{children}</span>
    );
};

const CircuitPattern = () => (
    <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" viewBox="0 0 400 400" className="absolute inset-0">
            <defs>
                <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M0,20 L40,20 M20,0 L20,40 M10,10 L30,10 M10,30 L30,30" stroke="#22d3ee" strokeWidth="0.5" fill="none" opacity="0.3" />
                    <circle cx="20" cy="20" r="2" fill="#22d3ee" opacity="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
    </div>
);

const CodeTrailHero: React.FC = () => {
    const [typedText, setTypedText] = useState('');
    const [fadeOut, setFadeOut] = useState(false);
    const fullText = 'CODETRAIL';
    const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const fadeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        let currentIndex = 0;
        function startTyping() {
            setTypedText('');
            setFadeOut(false);
            typingIntervalRef.current = setInterval(() => {
                setTypedText(prev => {
                    if (currentIndex < fullText.length) {
                        const next = prev + fullText[currentIndex];
                        currentIndex++;
                        return next;
                    } else {
                        clearInterval(typingIntervalRef.current!);
                        fadeTimeoutRef.current = setTimeout(() => {
                            setFadeOut(true);
                            resetTimeoutRef.current = setTimeout(() => {
                                currentIndex = 0;
                                setTypedText('');
                                setFadeOut(false);
                                startTyping();
                            }, 800);
                        }, 2000);
                        return prev;
                    }
                });
            }, 150);
        }
        startTyping();
        return () => {
            if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
            if (fadeTimeoutRef.current) clearTimeout(fadeTimeoutRef.current);
            if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 flex items-center justify-center overflow-hidden">
            <MatrixRain />
            <CircuitPattern />
            <div className="relative z-10 text-center">
                <div className="relative p-8 border border-green-400 rounded-lg bg-black/40 backdrop-blur-sm shadow-2xl">
                    <div className="flex items-center justify-center mb-6 text-green-400">
                        <TerminalIcon className="w-6 h-6 mr-2" />
                        <span className="font-mono text-sm">root@cybercore:~$</span>
                    </div>
                    <div className="mb-8">
                        <GlitchText className={`text-6xl md:text-8xl font-bold font-mono text-green-300 animate-pulse transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
                            {typedText || '\u00A0'}
                            <span className={`ml-1 inline-block w-3 h-12 align-middle bg-green-400 animate-flicker ${fadeOut ? 'opacity-0' : 'opacity-100'} blink-cursor`}></span>
                        </GlitchText>
                    </div>
                    <div className="text-xl md:text-2xl font-mono text-green-400 mb-6">
                        <span className="opacity-70">{'< '}</span>
                        <GlitchText>SECURE • CODE • HACK</GlitchText>
                        <span className="opacity-70">{' />'}</span>
                    </div>
                    <div className="flex items-center justify-center space-x-8 mb-6">
                        <div className="relative">
                            <CodeIcon className="w-8 h-8 text-green-400 animate-pulse" />
                            <div className="absolute -inset-2 bg-green-400/20 rounded-full blur-sm"></div>
                        </div>
                        <div className="relative">
                            <ZapIcon className="w-8 h-8 text-blue-400 animate-pulse" />
                            <div className="absolute -inset-2 bg-blue-400/20 rounded-full blur-sm"></div>
                        </div>
                        <div className="relative">
                            <ActivityIcon className="w-8 h-8 text-green-400 animate-pulse" />
                            <div className="absolute -inset-2 bg-green-400/20 rounded-full blur-sm"></div>
                        </div>
                    </div>
                    <div className="font-mono text-xs text-green-400/50 overflow-hidden">
                        <div className="whitespace-nowrap">
                            01001000 01100001 01100011 01101011 01100101 01110010
                        </div>
                    </div>
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-400"></div>
                    <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-400"></div>
                    <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-400"></div>
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-400"></div>
                </div>
                <div className="mt-8 text-green-400/70 font-mono text-sm">
                    <span className="animate-flicker">●</span> System Status: <span className="text-green-400">ONLINE</span>
                    <span className="mx-4">|</span>
                    <span className="animate-flicker">●</span> Security Level: <span className="text-blue-400">MAXIMUM</span>
                </div>
            </div>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-400/5 to-transparent animate-pulse"></div>
            </div>
        </div>
    );
};

export default CodeTrailHero;

/*
Add this CSS to your global styles (e.g., App.css):

.blink-cursor {
  animation: blink-cursor 1s steps(1) infinite;
}
@keyframes blink-cursor {
  0%, 49% {
    opacity: 1;
  }
  50%, 100% {
    opacity: 0;
  }
}
*/
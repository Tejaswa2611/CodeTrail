import React, { useState, useEffect, useRef } from 'react';
import { Send, Loader2, Bot, User, Lightbulb, MessageCircle, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { chatbotApi, ChatMessage } from '@/services/apiService';
import { useToast } from '@/hooks/use-toast';
import { getErrorToastConfig, logError } from '@/utils/errorHandling';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface AIChatbotProps {
    className?: string;
}

export const AIChatbot: React.FC<AIChatbotProps> = ({ className = '' }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(true);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]");
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load suggested questions on component mount
    useEffect(() => {
        loadSuggestedQuestions();
        
        // Add welcome message
        const welcomeMessage: Message = {
            id: 'welcome',
            role: 'assistant',
            content: `Hi! I'm your AI Mentor. I'm here to help you improve your coding skills and competitive programming performance.

I can help you with:
• Analyzing your progress and identifying areas for improvement
• Providing personalized study recommendations
• Suggesting problem-solving strategies
• Motivating you through challenges
• Answering questions about algorithms and data structures

What would you like to discuss today?`
        };
        setMessages([welcomeMessage]);
    }, []);

    const loadSuggestedQuestions = async () => {
        try {
            setIsLoadingSuggestions(true);
            const response = await chatbotApi.getSuggestedQuestions();
            if (response?.suggestions) {
                setSuggestedQuestions(response.suggestions);
            }
        } catch (error) {
            console.error('Failed to load suggested questions:', error);
            logError(error as Error, 'AIChatbot.loadSuggestedQuestions');
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/chatbot/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    message: input.trim(),
                    messages: [...messages, userMessage].map(msg => ({
                        role: msg.role,
                        content: msg.content,
                    })),
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const reader = response.body?.getReader();
            const decoder = new TextDecoder();

            if (!reader) {
                throw new Error('No response body');
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '',
            };

            setMessages(prev => [...prev, assistantMessage]);

            let accumulatedContent = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        if (data === '[DONE]') continue;

                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices?.[0]?.delta?.content;
                            if (content) {
                                accumulatedContent += content;
                                setMessages(prev =>
                                    prev.map(msg =>
                                        msg.id === assistantMessage.id 
                                            ? { ...msg, content: accumulatedContent } 
                                            : msg
                                    )
                                );
                            }
                        } catch (e) {
                            // Skip invalid JSON
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error:', error);
            logError(error as Error, 'AIChatbot.handleSubmit');
            
            setMessages(prev => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ]);
            
            toast(getErrorToastConfig(error as Error));
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedClick = (question: string) => {
        setInput(question);
    };

    const clearChat = () => {
        const welcomeMessage: Message = {
            id: 'welcome',
            role: 'assistant',
            content: `Hi! I'm your AI Mentor. I'm here to help you improve your coding skills and competitive programming performance.

I can help you with:
• Analyzing your progress and identifying areas for improvement
• Providing personalized study recommendations
• Suggesting problem-solving strategies
• Motivating you through challenges
• Answering questions about algorithms and data structures

What would you like to discuss today?`
        };
        setMessages([welcomeMessage]);
    };

    return (
        <Card className={`w-full h-full flex flex-col shadow-xl ${className}`}>
            <CardHeader className="border-b bg-card/50 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Bot className="h-6 w-6 text-primary" />
                    AI Mentor
                    <span className="text-sm font-normal text-muted-foreground ml-auto">
                        Powered by DeepSeek via OpenRouter
                    </span>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0 flex flex-col">
                {/* Suggested Questions */}
                {suggestedQuestions.length > 0 && messages.length <= 1 && (
                    <div className="p-4 border-b">
                        <div className="flex items-center gap-2 mb-3">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium">Suggested Questions</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {isLoadingSuggestions ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Loading suggestions...
                                </div>
                            ) : (
                                suggestedQuestions.map((question, index) => (
                                    <Badge
                                        key={index}
                                        variant="secondary"
                                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                                        onClick={() => handleSuggestedClick(question)}
                                    >
                                        {question}
                                    </Badge>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Chat Messages */}
                <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            <div className="text-center">
                                <Bot className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                                <p className="text-lg font-medium">Welcome to AI Mentor</p>
                                <p className="text-sm">Start a conversation by typing a message below</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${
                                        message.role === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    {message.role === 'assistant' && (
                                        <Avatar className="h-8 w-8 bg-primary/10">
                                            <AvatarFallback>
                                                <Bot className="h-4 w-4 text-primary" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                            message.role === 'user'
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-muted text-muted-foreground'
                                        }`}
                                    >
                                        <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {message.content}
                                        </p>
                                    </div>

                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8 bg-muted">
                                            <AvatarFallback>
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <Avatar className="h-8 w-8 bg-primary/10">
                                        <AvatarFallback>
                                            <Bot className="h-4 w-4 text-primary" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-muted rounded-lg px-4 py-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.1s' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </CardContent>

            <CardFooter className="border-t bg-card/50 backdrop-blur-sm p-4">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1"
                        disabled={isLoading}
                        maxLength={1000}
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                    {messages.length > 1 && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={clearChat}
                            title="Clear chat"
                        >
                            <RotateCcw className="h-4 w-4" />
                        </Button>
                    )}
                </form>
                {input.length > 800 && (
                    <div className="text-xs text-muted-foreground mt-1">
                        {input.length}/1000 characters
                    </div>
                )}
            </CardFooter>
        </Card>
    );
};

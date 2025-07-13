import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

interface AIChatbotProps {
    suggestedQuestions?: string[];
}

export default function AIChatbot({ suggestedQuestions = [] }: AIChatbotProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot/message-stream', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({
                    message: input,
                    chatHistory: messages.map((msg) => ({
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

            setMessages((prev) => [...prev, assistantMessage]);

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
                                setMessages((prev) =>
                                    prev.map((msg) =>
                                        msg.id === assistantMessage.id ? { ...msg, content: accumulatedContent } : msg
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
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: 'Sorry, I encountered an error. Please try again.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedClick = (question: string) => {
        setInput(question);
    };

    return (
        <Card className="w-full max-w-4xl h-[80vh] flex flex-col shadow-xl">
            <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
                <CardTitle className="flex items-center gap-2 text-xl">
                    <Bot className="h-6 w-6 text-blue-600" />
                    AI Mentor
                    <span className="text-sm font-normal text-gray-500 ml-auto">Powered by DeepSeek via OpenRouter</span>
                </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 p-0">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-500">
                            <div className="text-center mb-8">
                                <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <p className="text-lg font-medium">Welcome to your AI Mentor</p>
                                <p className="text-sm">I can help you improve your coding skills and analyze your progress</p>
                            </div>

                            {suggestedQuestions.length > 0 && (
                                <div className="w-full max-w-md">
                                    <p className="text-sm font-medium mb-3">Try asking:</p>
                                    <div className="grid gap-2">
                                        {suggestedQuestions.slice(0, 4).map((question, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                className="justify-start text-left h-auto p-3 whitespace-normal"
                                                onClick={() => handleSuggestedClick(question)}
                                            >
                                                {question}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <Avatar className="h-8 w-8 bg-blue-100">
                                            <AvatarFallback>
                                                <Bot className="h-4 w-4 text-blue-600" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}

                                    <div
                                        className={`max-w-[70%] rounded-lg px-4 py-2 ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-900'
                                            }`}
                                    >
                                        {message.role === 'assistant' ? (
                                            <div className="chatbot-markdown">
                                                <ReactMarkdown 
                                                    components={{
                                                        p: ({ children }) => <p>{children}</p>,
                                                        ul: ({ children }) => <ul>{children}</ul>,
                                                        ol: ({ children }) => <ol>{children}</ol>,
                                                        li: ({ children }) => <li>{children}</li>,
                                                        strong: ({ children }) => <strong>{children}</strong>,
                                                        em: ({ children }) => <em>{children}</em>,
                                                        h1: ({ children }) => <h1>{children}</h1>,
                                                        h2: ({ children }) => <h2>{children}</h2>,
                                                        h3: ({ children }) => <h3>{children}</h3>,
                                                        code: ({ children }) => <code>{children}</code>,
                                                        pre: ({ children }) => <pre>{children}</pre>,
                                                    }}
                                                >
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                        ) : (
                                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                                        )}
                                    </div>

                                    {message.role === 'user' && (
                                        <Avatar className="h-8 w-8 bg-gray-100">
                                            <AvatarFallback>
                                                <User className="h-4 w-4 text-gray-600" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <Avatar className="h-8 w-8 bg-blue-100">
                                        <AvatarFallback>
                                            <Bot className="h-4 w-4 text-blue-600" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-gray-100 rounded-lg px-4 py-2">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.1s' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
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

            <CardFooter className="border-t bg-white/50 backdrop-blur-sm p-4">
                <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message here..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" disabled={isLoading || !input.trim()} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </CardFooter>
        </Card>
    );
}

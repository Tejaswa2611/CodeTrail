import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
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
                // Try to get the error message from the response
                let errorMessage = 'Failed to get response';
                try {
                    const errorData = await response.json();
                    console.error('Server error response:', errorData);
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    console.error('Could not parse error response:', e);
                }
                throw new Error(errorMessage);
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
            console.error('Chatbot Error Details:', error);
            
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            // Try to extract specific error message from response
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                errorMessage = error.message || errorMessage;
            }
            
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: errorMessage,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedClick = async (question: string) => {
        if (isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: question,
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
                    message: question,
                    chatHistory: messages.map(msg => ({
                        role: msg.role,
                        content: msg.content,
                        timestamp: new Date()
                    }))
                }),
            });

            if (!response.ok) {
                // Try to get the error message from the response
                let errorMessage = 'Failed to send message';
                try {
                    const errorData = await response.json();
                    console.error('Server error response:', errorData);
                    if (errorData.message) {
                        errorMessage = errorData.message;
                    }
                } catch (e) {
                    console.error('Could not parse error response:', e);
                }
                throw new Error(errorMessage);
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '',
            };

            setMessages((prev) => [...prev, assistantMessage]);

            const reader = response.body?.getReader();
            if (reader) {
                let accumulatedContent = '';

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = new TextDecoder().decode(value);
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
            }
        } catch (error) {
            console.error('Suggested Question Error Details:', error);
            
            let errorMessage = 'Sorry, I encountered an error. Please try again.';
            
            // Try to extract specific error message from response
            if (error instanceof Error) {
                console.error('Error message:', error.message);
                errorMessage = error.message || errorMessage;
            }
            
            setMessages((prev) => [
                ...prev,
                {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: errorMessage,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full flex flex-col bg-transparent">
            {/* Chat Area */}
            <div className="flex-1 overflow-hidden bg-card/30 rounded-xl border border-border/50">
                <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                            <div className="text-center mb-8">
                                <div className="h-16 w-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center">
                                    <Bot className="h-8 w-8 text-primary" />
                                </div>
                                <p className="text-lg font-medium text-foreground mb-2">Ready to help you improve</p>
                                <p className="text-sm text-muted-foreground">Ask me anything about your coding progress and skills</p>
                            </div>

                            {suggestedQuestions.length > 0 && (
                                <div className="w-full max-w-md">
                                    <p className="text-sm font-medium mb-3 text-foreground">Quick start:</p>
                                    <div className="grid gap-2">
                                        {suggestedQuestions.slice(0, 4).map((question, index) => (
                                            <Button
                                                key={index}
                                                variant="outline"
                                                className="justify-start text-left h-auto p-3 whitespace-normal bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 text-muted-foreground hover:text-foreground"
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
                        <div className="space-y-6">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0">
                                            <Bot className="h-4 w-4 text-primary" />
                                        </div>
                                    )}

                                    <div
                                        className={`max-w-[75%] rounded-xl px-4 py-3 ${
                                            message.role === 'user' 
                                                ? 'bg-primary text-primary-foreground' 
                                                : 'bg-card/80 text-card-foreground border border-border/50'
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
                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-secondary/30 to-secondary/50 flex items-center justify-center flex-shrink-0">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    )}
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="bg-card/80 border border-border/50 rounded-xl px-4 py-3">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                                            <div
                                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.1s' }}
                                            ></div>
                                            <div
                                                className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                                                style={{ animationDelay: '0.2s' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </ScrollArea>
            </div>

            {/* Input Area */}
            <div className="mt-4 flex-shrink-0">
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask me about your coding progress..."
                        className="flex-1 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20"
                        disabled={isLoading}
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading || !input.trim()} 
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-3"
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </div>
    );
}

import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendChatMessage, ChatMessage } from '@/lib/ai';
import { useLocation } from 'react-router-dom';

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'assistant',
            content: 'Cześć! Jestem Twoim asystentem Mocni60+. Jak mogę Ci dzisiaj pomóc? 🌟',
            suggestedActions: [
                { label: 'Jak znaleźć pracę?', action: 'Jak mogę znaleźć pracę dorywczą?' },
                { label: 'Pokaż wycieczki', action: 'Jakie wycieczki są dostępne?' },
                { label: 'Znajdź grupę', action: 'Jak dołączyć do grupy tematycznej?' },
            ],
        },
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const getPageContext = () => {
        const path = location.pathname;
        if (path === '/') return 'strona główna';
        if (path === '/gigs') return 'strona z ofertami pracy';
        if (path === '/travel') return 'strona z wycieczkami';
        if (path === '/community') return 'strona społeczności';
        if (path === '/health') return 'strona zdrowia';
        return 'aplikacja Mocni60+';
    };

    const handleSend = async (messageText?: string) => {
        const text = messageText || inputValue.trim();
        if (!text || isLoading) return;

        // Add user message
        const userMessage: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await sendChatMessage(text, getPageContext());
            const assistantMessage: ChatMessage = {
                role: 'assistant',
                content: response.response,
                suggestedActions: response.suggestedActions,
            };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'Przepraszam, wystąpił problem z połączeniem. Spróbuj ponownie za chwilę.',
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestedAction = (action: string) => {
        handleSend(action);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-4 z-50 h-16 w-16 rounded-full bg-gradient-to-br from-primary to-blue-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center active:scale-95"
                aria-label="Otwórz asystenta AI"
            >
                <MessageCircle className="h-8 w-8" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-accent flex items-center justify-center">
                    <Sparkles className="h-3 w-3" />
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-24 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-3xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary to-blue-600 text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Asystent Mocni60+</h3>
                        <p className="text-sm text-white/80">Zawsze chętnie pomogę!</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="h-10 w-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
                    aria-label="Zamknij"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px] min-h-[300px]">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 ${message.role === 'user'
                                    ? 'bg-primary text-white rounded-br-md'
                                    : 'bg-gray-100 text-foreground rounded-bl-md'
                                }`}
                        >
                            <p className="text-base leading-relaxed">{message.content}</p>

                            {/* Suggested actions */}
                            {message.suggestedActions && message.suggestedActions.length > 0 && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                    {message.suggestedActions.map((action, actionIndex) => (
                                        <button
                                            key={actionIndex}
                                            onClick={() => handleSuggestedAction(action.action)}
                                            className="text-sm bg-white text-primary px-3 py-2 rounded-full hover:bg-primary/10 transition-colors font-medium"
                                        >
                                            {action.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 rounded-2xl rounded-bl-md p-4">
                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border">
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSend();
                    }}
                    className="flex gap-2"
                >
                    <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Napisz wiadomość..."
                        className="flex-1 h-14 text-lg rounded-full px-5"
                        disabled={isLoading}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        className="h-14 w-14 rounded-full"
                        disabled={!inputValue.trim() || isLoading}
                    >
                        <Send className="h-6 w-6" />
                    </Button>
                </form>
            </div>
        </div>
    );
}

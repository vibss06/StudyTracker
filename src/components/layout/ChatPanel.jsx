import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../../lib/sarvamClient';

export default function ChatPanel() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSend = async () => {
        const text = input.trim();
        if (!text || isLoading) return;

        const userMsg = { role: 'user', content: text };
        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        try {
            const reply = await sendChatMessage(
                updatedMessages.map(({ role, content }) => ({ role, content }))
            );
            setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
        } catch (err) {
            console.error(err);
            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                id="chat-toggle-btn"
                onClick={() => setIsOpen((v) => !v)}
                className={`fixed z-50 bottom-20 md:bottom-6 right-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-all duration-300 ${
                    isOpen
                        ? 'bg-white/10 backdrop-blur-xl border border-white/10 rotate-90 scale-90'
                        : 'bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 hover:scale-110 hover:shadow-emerald-500/40'
                }`}
                aria-label="Toggle AI Chat"
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white/70" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}
            </button>

            {/* Backdrop on mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Chat panel */}
            <div
                className={`fixed z-40 top-0 right-0 h-full w-full sm:w-[400px] transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                <div className="h-full flex flex-col bg-[#0c0c0c]/95 backdrop-blur-2xl border-l border-white/5 shadow-2xl shadow-black/50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-emerald-400" />
                            </div>
                            <div>
                                <h2 className="text-sm font-semibold text-white/90">Study Assistant</h2>
                                <p className="text-[11px] text-emerald-400/70">Powered by Sarvam AI</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth">
                        {messages.length === 0 && !isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-6 gap-4 opacity-60">
                                <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
                                    <Bot className="w-8 h-8 text-emerald-400/70" />
                                </div>
                                <div>
                                    <p className="text-white/70 text-sm font-medium mb-1">
                                        Hi! I'm your study assistant.
                                    </p>
                                    <p className="text-white/40 text-xs leading-relaxed">
                                        Ask me anything — concepts, study tips, or help with tricky problems.
                                    </p>
                                </div>
                                <div className="flex flex-wrap justify-center gap-2 mt-2">
                                    {[
                                        'Explain photosynthesis',
                                        'Study tips for exams',
                                        'Help with math',
                                    ].map((suggestion) => (
                                        <button
                                            key={suggestion}
                                            onClick={() => {
                                                setInput(suggestion);
                                                inputRef.current?.focus();
                                            }}
                                            className="px-3 py-1.5 text-[11px] rounded-full border border-white/10 text-white/50 hover:text-white/80 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
                                        >
                                            {suggestion}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                {msg.role === 'assistant' && (
                                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                        <Bot className="w-3.5 h-3.5 text-emerald-400" />
                                    </div>
                                )}
                                <div
                                    className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed ${
                                        msg.role === 'user'
                                            ? 'bg-emerald-500/15 text-white/90 rounded-br-md border border-emerald-500/20'
                                            : 'bg-white/5 text-white/80 rounded-bl-md border border-white/5'
                                    }`}
                                >
                                    <p className="whitespace-pre-wrap">{msg.content}</p>
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex-shrink-0 flex items-center justify-center mt-0.5">
                                        <User className="w-3.5 h-3.5 text-white/50" />
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Typing indicator */}
                        {isLoading && (
                            <div className="flex gap-2.5 justify-start">
                                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex-shrink-0 flex items-center justify-center mt-0.5">
                                    <Bot className="w-3.5 h-3.5 text-emerald-400" />
                                </div>
                                <div className="bg-white/5 border border-white/5 px-4 py-3 rounded-2xl rounded-bl-md">
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:0ms]" />
                                        <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:150ms]" />
                                        <span className="w-1.5 h-1.5 bg-emerald-400/60 rounded-full animate-bounce [animation-delay:300ms]" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input area */}
                    <div className="p-3 border-t border-white/5">
                        <div className="flex items-end gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-emerald-500/30 transition-colors">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Ask anything..."
                                rows={1}
                                className="flex-1 bg-transparent text-white/90 text-sm placeholder:text-white/25 outline-none resize-none max-h-24 scrollbar-none"
                                disabled={isLoading}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className="w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-20 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 disabled:hover:bg-emerald-500/20"
                            >
                                {isLoading ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                    <Send className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        <p className="text-[10px] text-white/20 text-center mt-2">
                            AI can make mistakes. Verify important info.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

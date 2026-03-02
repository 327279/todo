"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { MessageSquare, Send, X, Bot, User, Loader2, Sparkles, RefreshCcw } from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    role: "user" | "bot";
    content: string;
}

export function AIChatSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const initialMessage: Message = { role: "bot", content: "Hi! I'm your AI Todo Assistant. You can ask me questions about your tasks." };
    const [messages, setMessages] = useState<Message[]>([initialMessage]);

    const handleSend = async () => {
        if (!query.trim() || isLoading) return;

        const userMsg = query.trim();
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setQuery("");
        setIsLoading(true);

        try {
            const res = await api.chat(userMsg);
            setMessages(prev => [...prev, { role: "bot", content: res.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: "bot", content: "Sorry, I had trouble connecting. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setMessages([initialMessage]);
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-8 right-8 bg-primary p-4 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-110 active:scale-95 transition-all z-40 group"
            >
                <div className="absolute -top-2 -right-2 bg-yellow-400 p-1.5 rounded-full shadow-lg">
                    <Sparkles className="w-3 h-3 text-slate-900" />
                </div>
                <MessageSquare className="w-6 h-6 text-slate-900" />
            </button>

            {/* Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md glass-premium border-l border-white/10 z-[60] flex flex-col shadow-[-20px_0_50px_rgba(0,0,0,0.5)]"
                        >
                            <header className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="p-3 bg-primary rounded-2xl shadow-[0_0_20px_rgba(56,189,248,0.3)]">
                                            <Bot className="w-6 h-6 text-black stroke-[2.5]" />
                                        </div>
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-4 border-slate-900 rounded-full" />
                                    </div>
                                    <div>
                                        <h2 className="font-black text-xl tracking-tight text-white uppercase">NEURAL ASSISTANT</h2>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-primary tracking-widest uppercase opacity-70">SYSTEM ONLINE</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleClear}
                                        className="p-2 hover:bg-white/5 rounded-xl transition-all text-slate-500 hover:text-white"
                                        title="Recalibrate Session"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-2 hover:bg-red-500/10 rounded-xl transition-all text-slate-500 hover:text-red-400"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>
                            </header>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                {messages.map((m, i) => (
                                    <div key={i} className={clsx("flex flex-col gap-2", m.role === "user" ? "items-end" : "items-start")}>
                                        <div className={clsx(
                                            "max-w-[85%] px-6 py-4 rounded-[1.5rem] text-sm leading-relaxed shadow-lg transition-all",
                                            m.role === "user"
                                                ? "bg-white text-black font-bold rounded-tr-none shadow-white/5"
                                                : "glass-premium border-white/5 text-slate-200 rounded-tl-none"
                                        )}>
                                            {m.content}
                                        </div>
                                        <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest px-1">
                                            {m.role === "user" ? "USER_INPUT" : "NEURAL_RESPONSE"}
                                        </span>
                                    </div>
                                ))}
                                {isLoading && (
                                    <div className="flex flex-col items-start gap-2">
                                        <div className="glass-premium border-white/5 p-6 rounded-[1.5rem] rounded-tl-none">
                                            <div className="flex gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]" />
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]" />
                                                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                        placeholder="Transmit query..."
                                        className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-6 pr-14 outline-none focus:ring-4 focus:ring-primary/10 transition-all text-white font-medium placeholder:text-slate-700"
                                    />
                                    <button
                                        onClick={handleSend}
                                        disabled={!query.trim() || isLoading}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-white text-black rounded-xl hover:bg-primary transition-all disabled:opacity-30 disabled:grayscale shadow-xl active:scale-90"
                                    >
                                        <Send className="w-4 h-4 stroke-[3]" />
                                    </button>
                                </div>
                                <p className="text-[10px] text-center text-slate-600 mt-4 font-bold tracking-widest uppercase">
                                    Powered by Panaversity Intelligence
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

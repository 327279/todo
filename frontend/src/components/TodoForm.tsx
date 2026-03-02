"use client";

import { useState } from "react";
import { Priority, TodoCreate } from "@/lib/types";
import { Plus, Tag as TagIcon, X, Wand2, Loader2, Filter } from "lucide-react";
import { clsx } from "clsx";
import { api } from "@/lib/api";

interface TodoFormProps {
    onSubmit: (todo: TodoCreate) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [tagName, setTagName] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [dueDate, setDueDate] = useState("");
    const [isMagicMode, setIsMagicMode] = useState(false);
    const [isParsing, setIsParsing] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        onSubmit({
            description,
            priority,
            tag_names: tags,
            due_date: dueDate || undefined,
        });

        setDescription("");
        setTags([]);
        setDueDate("");
    };

    const addTag = () => {
        if (tagName.trim() && !tags.includes(tagName.trim())) {
            setTags([...tags, tagName.trim()]);
            setTagName("");
        }
    };

    const handleMagicParse = async () => {
        if (!description.trim()) return;
        setIsParsing(true);
        try {
            const parsed = await api.magicParse(description);
            setDescription(parsed.description);
            setPriority(parsed.priority);
            setTags(parsed.tag_names);
            if (parsed.due_date) setDueDate(parsed.due_date.split("T")[0]);
            setIsMagicMode(false);
        } catch (error) {
            console.error("Magic parse failed:", error);
        } finally {
            setIsParsing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass-premium p-8 rounded-[2.5rem] mb-12 space-y-8 border-white/10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
            <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={isMagicMode ? "Describe your task naturally..." : "Enter your next evolution..."}
                            className={clsx(
                                "w-full bg-white/5 border rounded-2xl px-6 py-5 outline-none focus:ring-4 focus:ring-primary/10 text-xl transition-all placeholder:text-slate-600 font-medium",
                                isMagicMode ? "border-primary/40 shadow-[0_0_25px_rgba(56,189,248,0.15)]" : "border-white/5 group-hover:border-white/10"
                            )}
                        />
                        {isMagicMode && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-1 rounded">AI ACTIVE</span>
                            </div>
                        )}
                    </div>

                    {!isMagicMode && (
                        <button
                            type="submit"
                            className="bg-white text-black px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary hover:text-black transition-all active:scale-95 shadow-xl disabled:opacity-50"
                            disabled={!description.trim()}
                        >
                            <Plus className="w-6 h-6 stroke-[3]" />
                            ADD TASK
                        </button>
                    )}
                    {isMagicMode && (
                        <button
                            type="button"
                            onClick={handleMagicParse}
                            disabled={isParsing || !description.trim()}
                            className="bg-gradient-to-br from-primary via-blue-500 to-indigo-600 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 hover:brightness-110 active:scale-95 transition-all shadow-2xl shadow-primary/20 disabled:opacity-50"
                        >
                            {isParsing ? <Loader2 className="w-6 h-6 animate-spin" /> : <Wand2 className="w-6 h-6" />}
                            {isParsing ? "EVOLVING..." : "MAGIC ADD"}
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/5">
                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Wand2 className="w-3.5 h-3.5" />
                        Input Protocol
                    </label>
                    <button
                        type="button"
                        onClick={() => setIsMagicMode(!isMagicMode)}
                        className={clsx(
                            "w-full flex items-center justify-between px-5 py-3 rounded-xl text-sm font-bold transition-all border",
                            isMagicMode
                                ? "bg-primary/20 border-primary/50 text-primary shadow-[0_0_15px_rgba(56,189,248,0.1)]"
                                : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                        )}
                    >
                        <span>Natural Language</span>
                        <div className={clsx(
                            "w-10 h-5 rounded-full relative transition-colors bg-opacity-20",
                            isMagicMode ? "bg-primary" : "bg-slate-700"
                        )}>
                            <div className={clsx(
                                "absolute top-1 w-3 h-3 rounded-full bg-white transition-all",
                                isMagicMode ? "right-1" : "left-1"
                            )} />
                        </div>
                    </button>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Filter className="w-3.5 h-3.5" />
                        Priority Matrix
                    </label>
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
                        {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p)}
                                className={clsx(
                                    "flex-1 py-2 rounded-lg text-xs font-black transition-all",
                                    priority === p ? "bg-white text-black shadow-lg" : "text-slate-500 hover:text-white"
                                )}
                            >
                                {p.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <TagIcon className="w-3.5 h-3.5" />
                        Deadline Target
                    </label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full bg-white/5 border border-white/5 rounded-xl px-5 py-2 text-sm outline-none focus:border-primary/50 text-white font-bold cursor-pointer"
                    />
                </div>
            </div>

            <div className="space-y-3">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <TagIcon className="w-3.5 h-3.5" />
                    Classification Tags
                </label>
                <div className="flex flex-wrap items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                    {tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-[11px] font-black text-primary border border-primary/20 group animate-in fade-in zoom-in duration-300">
                            {tag.toUpperCase()}
                            <button onClick={() => setTags(tags.filter(t => t !== tag))} type="button" className="hover:text-white transition-colors">
                                <X className="w-3.5 h-3.5" />
                            </button>
                        </span>
                    ))}
                    <input
                        type="text"
                        value={tagName}
                        onChange={(e) => setTagName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                        placeholder="Add tag..."
                        className="bg-transparent border-none outline-none text-sm font-bold placeholder:text-slate-700 min-w-[80px]"
                    />
                </div>
            </div>
        </form>
    );
}

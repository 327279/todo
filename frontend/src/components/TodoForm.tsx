"use client";

import { useState } from "react";
import { Priority, TodoCreate } from "@/lib/types";
import { Plus, Tag as TagIcon, X } from "lucide-react";
import { clsx } from "clsx";

interface TodoFormProps {
    onSubmit: (todo: TodoCreate) => void;
}

export function TodoForm({ onSubmit }: TodoFormProps) {
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState<Priority>("Medium");
    const [tagName, setTagName] = useState("");
    const [tags, setTags] = useState<string[]>([]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description.trim()) return;

        onSubmit({
            description,
            priority,
            tag_names: tags,
        });

        setDescription("");
        setTags([]);
    };

    const addTag = () => {
        if (tagName.trim() && !tags.includes(tagName.trim())) {
            setTags([...tags, tagName.trim()]);
            setTagName("");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="glass p-6 rounded-3xl mb-8 space-y-4 border-2 border-primary/20 bg-primary/5">
            <div className="flex gap-4">
                <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What needs to be done?"
                    className="flex-1 bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 text-lg"
                />
                <button
                    type="submit"
                    className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                    <Plus className="w-5 h-5" />
                    Add
                </button>
            </div>

            <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-4">
                    <label className="text-sm font-semibold text-slate-400">Priority</label>
                    <div className="flex bg-slate-900/50 p-1 rounded-lg border border-white/5">
                        {(["Low", "Medium", "High"] as Priority[]).map((p) => (
                            <button
                                key={p}
                                type="button"
                                onClick={() => setPriority(p)}
                                className={clsx(
                                    "px-3 py-1 rounded-md text-sm font-medium transition-all",
                                    priority === p ? "bg-primary text-slate-900" : "text-slate-400 hover:text-white"
                                )}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 min-w-[200px] flex items-center gap-2">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            value={tagName}
                            onChange={(e) => setTagName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            placeholder="Add tags..."
                            className="w-full bg-slate-900/50 border border-white/10 rounded-lg px-3 py-1.5 text-sm outline-none focus:border-primary/50 pl-8"
                        />
                        <TagIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                    </div>
                </div>
            </div>

            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 text-xs text-primary border border-primary/20">
                            {tag}
                            <button onClick={() => setTags(tags.filter(t => t !== tag))} type="button" className="hover:text-white">
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </form>
    );
}

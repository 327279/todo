import { useState } from "react";
import { Todo, Priority } from "@/lib/types";
import { CheckCircle2, Circle, Trash2, Tag as TagIcon, Clock, Sparkles, Loader2, Calendar, ChevronDown, ChevronRight, Layers } from "lucide-react";
import { clsx } from "clsx";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onSuggest: (id: string) => void;
    isSubtask?: boolean;
}

const priorityColors: Record<Priority, string> = {
    Low: "text-blue-400 bg-blue-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    High: "text-red-400 bg-red-400/10",
};

export function TodoItem({ todo, onToggle, onDelete, onSuggest, isSubtask = false }: TodoItemProps) {
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const handleSuggest = async () => {
        setIsSuggesting(true);
        try {
            await onSuggest(todo.id);
        } finally {
            setIsSuggesting(false);
        }
    };

    const hasChildren = (todo as any).children && (todo as any).children.length > 0;

    return (
        <div className="flex flex-col gap-2">
            <div className={clsx(
                "glass-premium p-6 rounded-[2rem] flex flex-col md:flex-row items-center gap-6 group transition-all hover:scale-[1.01] border-white/5 shadow-xl relative overflow-hidden",
                !todo.is_completed && todo.priority === "High" && "shadow-[0_0_30px_rgba(239,68,68,0.15)] border-red-500/20",
                isSubtask && "ml-12 scale-95 opacity-90"
            )}>
                {/* Priority Indicator Glow */}
                <div className={clsx(
                    "absolute left-0 top-0 bottom-0 w-1 opacity-20 group-hover:opacity-100 transition-opacity",
                    todo.priority === "High" ? "bg-red-500" : todo.priority === "Medium" ? "bg-yellow-500" : "bg-blue-500"
                )} />

                <div className="flex items-center gap-4">
                    {hasChildren && (
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-2 hover:bg-white/5 rounded-xl transition-colors text-slate-500"
                        >
                            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        </button>
                    )}

                    <button
                        onClick={() => onToggle(todo.id, !todo.is_completed)}
                        className="relative z-10 transition-all active:scale-95 group/check"
                    >
                        <div className={clsx(
                            "w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all duration-500",
                            todo.is_completed
                                ? "bg-primary border-primary rotate-[360deg] shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                                : "bg-white/5 border-white/10 group-hover/check:border-primary/50 group-hover/check:bg-primary/10"
                        )}>
                            {todo.is_completed ? (
                                <CheckCircle2 className="w-6 h-6 text-black stroke-[3]" />
                            ) : (
                                <Circle className="w-6 h-6 text-slate-500" />
                            )}
                        </div>
                    </button>
                </div>

                <div className="flex-1 min-w-0 z-10">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                        {todo.priority && (
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
                                todo.priority === "High" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                    todo.priority === "Medium" ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" :
                                        "bg-blue-500/10 text-blue-400 border-blue-500/20"
                            )}>
                                RANK {todo.priority}
                            </span>
                        )}
                        {todo.parent_id && !isSubtask && (
                            <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Layers className="w-3 h-3" />
                                BLOCKED
                            </span>
                        )}
                        {todo.tags?.map(tag => (
                            <span key={tag.id} className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] bg-white/5 text-slate-400 font-bold border border-white/5 uppercase tracking-tighter">
                                <TagIcon className="w-2.5 h-2.5" />
                                {tag.name}
                            </span>
                        ))}
                    </div>

                    <p className={clsx(
                        "text-xl font-bold tracking-tight transition-all leading-tight",
                        todo.is_completed ? "line-through opacity-30 italic" : "text-white"
                    )}>
                        {todo.description}
                    </p>

                    <div className="flex items-center gap-4 mt-3 text-slate-500">
                        {todo.due_date && (
                            <div className="flex items-center gap-2 group/date">
                                <Calendar className="w-4 h-4 text-primary group-hover/date:animate-bounce" />
                                <span className="text-xs font-black text-primary/80 uppercase tracking-widest">
                                    {new Date(todo.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                            </div>
                        )}
                        {todo.assignee && (
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">
                                    {todo.assignee[0].toUpperCase()}
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    {todo.assignee}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span className="text-[10px] font-medium tracking-[0.1em] uppercase">
                                Captured {new Date(todo.created_at).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 relative z-10 md:ml-4">
                    {!isSubtask && (
                        <button
                            onClick={handleSuggest}
                            disabled={isSuggesting}
                            className="p-3 bg-white/5 text-primary hover:bg-primary hover:text-black transition-all rounded-2xl shadow-xl active:scale-90 flex items-center justify-center gap-2 group/ai font-black text-xs"
                            title="AI Optimize"
                        >
                            {isSuggesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            <span className="hidden group-hover:block transition-all animate-in slide-in-from-right-2">EVOLVE</span>
                        </button>
                    )}

                    <button
                        onClick={() => onDelete(todo.id)}
                        className="p-3 bg-white/5 text-slate-500 hover:bg-red-500 hover:text-white transition-all rounded-2xl shadow-xl active:scale-90"
                        title="Disintegrate"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {isExpanded && hasChildren && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                    {(todo as any).children.map((child: Todo) => (
                        <TodoItem
                            key={child.id}
                            todo={child}
                            onToggle={onToggle}
                            onDelete={onDelete}
                            onSuggest={onSuggest}
                            isSubtask
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

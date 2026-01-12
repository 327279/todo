"use client";

import { Todo, Priority } from "@/lib/types";
import { CheckCircle2, Circle, Trash2, Tag as TagIcon, Clock } from "lucide-react";
import { clsx } from "clsx";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
    Low: "text-blue-400 bg-blue-400/10",
    Medium: "text-yellow-400 bg-yellow-400/10",
    High: "text-red-400 bg-red-400/10",
};

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <div className="glass-card p-4 rounded-xl flex items-center gap-4 group transition-all hover:scale-[1.01] hover:bg-slate-800/60">
            <button
                onClick={() => onToggle(todo.id, !todo.is_completed)}
                className="text-primary transition-transform active:scale-95"
            >
                {todo.is_completed ? (
                    <CheckCircle2 className="w-6 h-6 fill-primary text-slate-900" />
                ) : (
                    <Circle className="w-6 h-6 opacity-50 group-hover:opacity-100" />
                )}
            </button>

            <div className="flex-1 min-w-0">
                <p className={clsx(
                    "text-lg font-medium truncate transition-all",
                    todo.is_completed && "line-through opacity-50"
                )}>
                    {todo.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-2 items-center">
                    <span className={clsx("px-2 py-0.5 rounded text-xs font-semibold", priorityColors[todo.priority])}>
                        {todo.priority}
                    </span>

                    {todo.tags.map(tag => (
                        <span key={tag.id} className="flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-slate-700/50 text-slate-300">
                            <TagIcon className="w-3 h-3" />
                            {tag.name}
                        </span>
                    ))}

                    <span className="flex items-center gap-1 text-[10px] text-slate-500 ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(todo.created_at).toLocaleDateString()}
                    </span>
                </div>
            </div>

            <button
                onClick={() => onDelete(todo.id)}
                className="p-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-400/10"
            >
                <Trash2 className="w-5 h-5" />
            </button>
        </div>
    );
}

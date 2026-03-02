"use client";

import { Todo } from "@/lib/types";
import { TodoItem } from "./TodoItem";
import { LayoutGrid, ListTodo, Sparkles } from "lucide-react";

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    onSuggest: (id: string) => void;
    isLoading: boolean;
}

export function TodoList({ todos, onToggle, onDelete, onSuggest, isLoading }: TodoListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-32 glass-premium rounded-[2rem] border-white/5 animate-pulse" />
                ))}
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-slate-600 glass-premium rounded-[3rem] border-dashed border-white/10">
                <div className="relative mb-8">
                    <ListTodo className="w-24 h-24 opacity-10" />
                    <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-primary/30 animate-pulse" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight uppercase">No Active Evolutions</h3>
                <p className="mt-2 text-slate-500 font-medium">Capture your thoughts to begin the process.</p>
            </div>
        );
    }

    const topLevelTodos = todos.filter(t => !t.parent_id);

    return (
        <div className="flex flex-col gap-6">
            {topLevelTodos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onSuggest={onSuggest}
                />
            ))}
        </div>
    );
}

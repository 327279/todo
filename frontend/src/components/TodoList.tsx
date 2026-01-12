"use client";

import { Todo } from "@/lib/types";
import { TodoItem } from "./TodoItem";
import { LayoutGrid, ListTodo } from "lucide-react";

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: string, completed: boolean) => void;
    onDelete: (id: string) => void;
    isLoading: boolean;
}

export function TodoList({ todos, onToggle, onDelete, isLoading }: TodoListProps) {
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-slate-800/40 rounded-xl border border-white/5" />
                ))}
            </div>
        );
    }

    if (todos.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/40 rounded-3xl border-2 border-dashed border-slate-800">
                <ListTodo className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-xl font-medium">No tasks found</p>
                <p className="text-sm">Start by adding a new task above.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4">
            {todos.map(todo => (
                <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={onToggle}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

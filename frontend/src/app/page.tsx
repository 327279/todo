"use client";

import { useEffect, useState } from "react";
import { Todo, TodoCreate, Priority } from "@/lib/types";
import { api } from "@/lib/api";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { Search, Filter, Rocket, Sparkles } from "lucide-react";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTodos({
        search: search || undefined,
        priority: priorityFilter || undefined
      });
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchTodos, 300);
    return () => clearTimeout(timeout);
  }, [search, priorityFilter]);

  const handleCreate = async (todo: TodoCreate) => {
    try {
      await api.createTodo(todo);
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  const handleToggle = async (id: string, is_completed: boolean) => {
    try {
      await api.updateTodo(id, { is_completed });
      setTodos(prev => prev.map(t => t.id === id ? { ...t, is_completed } : t));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteTodo(id);
      setTodos(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-primary/30">
      {/* Background patterns */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight flex items-center gap-3 bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
              <Rocket className="w-10 h-10 text-primary" />
              Evolution of Todo
            </h1>
            <p className="text-slate-400 mt-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              Phase II: Full-Stack Web App
            </p>
          </div>

          <div className="text-right">
            <div className="text-xs font-mono text-slate-500 uppercase tracking-widest">Panaversity Initiative</div>
            <div className="text-sm font-semibold text-primary">v0.2.0-beta</div>
          </div>
        </header>

        <TodoForm onSubmit={handleCreate} />

        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900/40 border border-white/5 rounded-2xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 transition-all glass"
            />
          </div>

          <div className="flex items-center gap-3">
            <Filter className="w-5 h-5 text-slate-500 hidden md:block" />
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
              className="bg-slate-900/40 border border-white/5 rounded-2xl py-3 px-6 outline-none focus:ring-2 focus:ring-primary/50 glass appearance-none"
            >
              <option value="">All Priorities</option>
              <option value="High">High Only</option>
              <option value="Medium">Medium Only</option>
              <option value="Low">Low Only</option>
            </select>
          </div>
        </div>

        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          isLoading={isLoading}
        />

        <footer className="mt-20 border-t border-white/5 pt-8 text-center text-slate-500 text-sm">
          <p>© 2026 Panaversity. Built with Spec-Kit Plus & Claude Code.</p>
        </footer>
      </div>
    </main>
  );
}

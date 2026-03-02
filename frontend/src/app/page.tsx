"use client";

import { useEffect, useState } from "react";
import { Todo, TodoCreate, Priority } from "@/lib/types";
import { api } from "@/lib/api";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { AIChatSidebar } from "@/components/AIChatSidebar";
import { Search, Filter, Rocket, Sparkles, Activity } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<Priority | "">("");
  const [sortByDueDate, setSortByDueDate] = useState(false);

  const fetchTodos = async () => {
    setIsLoading(true);
    try {
      const data = await api.getTodos({
        search: search || undefined,
        priority: priorityFilter || undefined,
        sort_by_due_date: sortByDueDate
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
  }, [search, priorityFilter, sortByDueDate]);

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

  const handleSuggest = async (id: string) => {
    try {
      const suggestion = await api.suggest(id);
      await api.updateTodo(id, suggestion);
      fetchTodos();
    } catch (error) {
      console.error("Error getting AI suggestions:", error);
    }
  };

  return (
    <main className="min-h-screen text-slate-200 selection:bg-primary/30 relative">
      <div className="max-w-4xl mx-auto px-6 py-16 relative">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-6xl font-black tracking-tighter flex items-center gap-4 bg-gradient-to-br from-white via-white to-primary/50 bg-clip-text text-transparent">
              進化
              <span className="text-primary tracking-normal">Todo</span>
            </h1>
            <p className="text-slate-400 mt-3 flex items-center justify-center md:justify-start gap-2 font-medium tracking-wide">
              <Sparkles className="w-5 h-5 text-primary animate-pulse" />
              INTELLIGENT TASK MANAGEMENT
            </p>
          </div>

          <div className="flex flex-col items-center md:items-end gap-3">
            <Link href="/dashboard" className="glass-premium px-6 py-3 rounded-2xl border-white/5 shadow-2xl flex items-center gap-3 group hover:bg-primary/10 transition-all active:scale-95">
              <Activity className="w-5 h-5 text-primary group-hover:animate-pulse" />
              <span className="font-black text-xs tracking-widest uppercase">Analytics Hub</span>
            </Link>

            <div className="flex flex-col items-center md:items-end glass-premium px-6 py-3 rounded-2xl border-white/5 shadow-2xl">
              <div className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-1">Panaversity Initiative</div>
              <div className="text-lg font-bold text-white flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                v0.4.0 <span className="text-slate-500 font-medium text-sm">BETA</span>
              </div>
            </div>
          </div>
        </header>

        <section className="space-y-8">
          <TodoForm onSubmit={handleCreate} />

          <div className="glass-premium rounded-[2rem] p-4 flex flex-col md:flex-row gap-4 shadow-2xl border-white/10">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                placeholder="Search your evolution..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-14 pr-4 outline-none focus:ring-2 focus:ring-primary/20 transition-all text-lg"
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value as Priority | "")}
                  className="bg-white/5 border border-white/5 rounded-2xl py-4 px-8 outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer font-semibold pr-12 min-w-[160px]"
                >
                  <option value="">All Ranks</option>
                  <option value="High">Priority S</option>
                  <option value="Medium">Priority A</option>
                  <option value="Low">Priority B</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Filter className="w-4 h-4" />
                </div>
              </div>

              <button
                onClick={() => setSortByDueDate(!sortByDueDate)}
                className={clsx(
                  "flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold transition-all border shrink-0",
                  sortByDueDate
                    ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(56,189,248,0.4)]"
                    : "bg-white/5 border-white/5 text-slate-400 hover:text-white hover:bg-white/10"
                )}
              >
                Time Sort
              </button>
            </div>
          </div>

          <TodoList
            todos={todos}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onSuggest={handleSuggest}
            isLoading={isLoading}
          />
        </section>

        <footer className="mt-24 border-t border-white/5 pt-12 text-center">
          <div className="flex justify-center gap-8 mb-6 opacity-30 grayscale hover:grayscale-0 transition-all">
            {/* Logo placeholders or small icons */}
          </div>
          <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
            Built with <span className="text-primary italic">Intelligence</span> at Panaversity
          </p>
          <p className="text-slate-600 text-[10px] mt-2">© 2026 SPECKIT-PLUS SYSTEMS</p>
        </footer>

        <AIChatSidebar />
      </div>
    </main>
  );
}

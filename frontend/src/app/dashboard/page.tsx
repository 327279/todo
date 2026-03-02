"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { Rocket, ArrowLeft, TrendingUp, CheckCircle2, ListTodo, Activity } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

export default function Dashboard() {
    const [summary, setSummary] = useState<any>(null);
    const [trends, setTrends] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const [summaryData, trendsData] = await Promise.all([
                    api.getAnalyticsSummary(),
                    api.getAnalyticsTrends()
                ]);
                setSummary(summaryData);
                setTrends(trendsData);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen text-slate-200 p-8 md:p-16">
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group">
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-xs">Back to Tasks</span>
                    </Link>
                    <div className="text-right">
                        <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-br from-white to-primary/50 bg-clip-text text-transparent">
                            ANALYTICS <span className="text-primary">CORE</span>
                        </h1>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard
                        title="Total Active"
                        value={summary?.total_tasks}
                        icon={<ListTodo className="w-6 h-6" />}
                        color="blue"
                    />
                    <StatCard
                        title="Completed"
                        value={summary?.completed_tasks}
                        icon={<CheckCircle2 className="w-6 h-6" />}
                        color="green"
                    />
                    <StatCard
                        title="Efficiency"
                        value={`${Math.round(summary?.completion_rate || 0)}%`}
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="purple"
                    />
                    <StatCard
                        title="Velocity"
                        value={summary?.velocity}
                        icon={<Activity className="w-6 h-6" />}
                        color="orange"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 shadow-2xl space-y-6">
                        <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500">Activity Timeline</h2>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trends}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#475569"
                                        fontSize={10}
                                        tickFormatter={(str) => new Date(str).toLocaleDateString(undefined, { weekday: 'short' })}
                                    />
                                    <YAxis stroke="#475569" fontSize={10} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem' }}
                                        itemStyle={{ color: '#38bdf8', fontWeight: 'bold' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="count"
                                        stroke="#38bdf8"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#38bdf8', strokeWidth: 0 }}
                                        activeDot={{ r: 8, strokeWidth: 0 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-premium p-8 rounded-[2.5rem] border-white/5 shadow-2xl space-y-6 text-center flex flex-col justify-center items-center">
                        <div className="relative">
                            <Rocket className="w-24 h-24 text-primary animate-bounce mb-6" />
                            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                        </div>
                        <h3 className="text-2xl font-black text-white italic">AI PRODUCTIVITY INSIGHT</h3>
                        <p className="text-slate-400 max-w-xs mt-4 leading-relaxed font-medium">
                            Your completion velocity is steady. Focus on <span className="text-primary">High Priority</span> tasks to maximize your progress today.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

function StatCard({ title, value, icon, color }: any) {
    const colors: any = {
        blue: "text-blue-400 bg-blue-400/10",
        green: "text-green-400 bg-green-400/10",
        purple: "text-purple-400 bg-purple-400/10",
        orange: "text-orange-400 bg-orange-400/10",
    };

    return (
        <div className="glass-premium p-8 rounded-[2rem] border-white/5 shadow-xl group hover:scale-105 transition-all">
            <div className={clsx("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", colors[color])}>
                {icon}
            </div>
            <div className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">{title}</div>
            <div className="text-4xl font-black text-white tracking-tighter">{value}</div>
        </div>
    );
}

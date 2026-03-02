import { Todo, TodoCreate, TodoUpdate } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

const handleResponse = async <T>(res: Response, errorMsg: string): Promise<T> => {
    if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || errorMsg);
    }
    return res.json();
};

export const api = {
    async getTodos(params: { search?: string; priority?: string; is_completed?: boolean; sort_by_due_date?: boolean } = {}) {
        const query = new URLSearchParams();
        if (params.search) query.append("search", params.search);
        if (params.priority) query.append("priority", params.priority);
        if (params.is_completed !== undefined) query.append("is_completed", String(params.is_completed));
        if (params.sort_by_due_date) query.append("sort_by_due_date", "true");

        const res = await fetch(`${API_URL}/todos/?${query.toString()}`);
        return handleResponse<Todo[]>(res, "Failed to fetch todos");
    },

    async createTodo(todo: TodoCreate) {
        const res = await fetch(`${API_URL}/todos/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo),
        });
        return handleResponse<Todo>(res, "Failed to create todo");
    },

    async updateTodo(id: string, todo: TodoUpdate) {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo),
        });
        return handleResponse<Todo>(res, "Failed to update todo");
    },

    async deleteTodo(id: string) {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE",
        });
        return handleResponse<{ ok: boolean }>(res, "Failed to delete todo");
    },

    async magicParse(text: string) {
        const res = await fetch(`${API_URL}/ai/magic-parse`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        return handleResponse<TodoCreate>(res, "AI Parsing failed. Check your description.");
    },

    async chat(query: string) {
        const res = await fetch(`${API_URL}/ai/chat?query=${encodeURIComponent(query)}`, {
            method: "POST",
        });
        return handleResponse<{ response: string }>(res, "AI Assistant is unavailable. Please try again later.");
    },

    async suggest(id: string) {
        const res = await fetch(`${API_URL}/ai/suggest/${id}`, {
            method: "POST",
        });
        return handleResponse<TodoCreate>(res, "Failed to get AI suggestions.");
    },

    async getAnalyticsSummary() {
        const res = await fetch(`${API_URL}/analytics/summary`);
        return handleResponse<{ total_tasks: number; completed_tasks: number; completion_rate: number; velocity: number }>(res, "Failed to fetch analytics summary");
    },

    async getAnalyticsTrends() {
        const res = await fetch(`${API_URL}/analytics/trends`);
        return handleResponse<{ date: string; count: number }[]>(res, "Failed to fetch analytics trends");
    },
};

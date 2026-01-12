import { Todo, TodoCreate, TodoUpdate } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const api = {
    async getTodos(params: { search?: string; priority?: string; is_completed?: boolean } = {}) {
        const query = new URLSearchParams();
        if (params.search) query.append("search", params.search);
        if (params.priority) query.append("priority", params.priority);
        if (params.is_completed !== undefined) query.append("is_completed", String(params.is_completed));

        const res = await fetch(`${API_URL}/todos/?${query.toString()}`);
        if (!res.ok) throw new Error("Failed to fetch todos");
        return res.json() as Promise<Todo[]>;
    },

    async createTodo(todo: TodoCreate) {
        const res = await fetch(`${API_URL}/todos/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo),
        });
        if (!res.ok) throw new Error("Failed to create todo");
        return res.json() as Promise<Todo>;
    },

    async updateTodo(id: string, todo: TodoUpdate) {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(todo),
        });
        if (!res.ok) throw new Error("Failed to update todo");
        return res.json() as Promise<Todo>;
    },

    async deleteTodo(id: string) {
        const res = await fetch(`${API_URL}/todos/${id}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete todo");
        return res.json();
    },
};

export type Priority = "Low" | "Medium" | "High";

export interface Tag {
    id: string;
    name: string;
}

export interface Todo {
    id: string;
    description: string;
    is_completed: boolean;
    priority: Priority;
    created_at: string;
    tags: Tag[];
}

export interface TodoCreate {
    description: string;
    priority: Priority;
    tag_names: string[];
}

export interface TodoUpdate {
    description?: string;
    is_completed?: boolean;
    priority?: Priority;
    tag_names?: string[];
}

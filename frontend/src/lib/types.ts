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
    due_date?: string;
    parent_id?: string;
    assignee?: string;
    tags: Tag[];
}

export interface TodoCreate {
    description: string;
    priority: Priority;
    due_date?: string;
    parent_id?: string;
    assignee?: string;
    tag_names: string[];
}

export interface TodoUpdate {
    description?: string;
    is_completed?: boolean;
    priority?: Priority;
    due_date?: string;
    parent_id?: string;
    assignee?: string;
    tag_names?: string[];
}

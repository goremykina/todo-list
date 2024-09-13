export type TodoItem = {
    id: string;
    title: string;
    status: TodoItemStatus;
}

export enum TodoItemStatus {
    NOT_STARTED = 'NOT_STARTED',
    IN_PROGRESS = 'IN_PROGRESS',
    DONE = 'DONE',
}



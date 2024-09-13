import { useHttp } from "../hooks/http.hook.tsx";
import { TodoItem } from "../models/todo-item.ts";

const useGetTodoItems = () => {
    const { loading, request, error } = useHttp();

    const getTodoItems = async () => {
        return await request<TodoItem[]>('http://localhost:3000', 'GET');
    }

    return {
        loading, error, getTodoItems
    };
};

const useCreateToDoItem = () => {
    const { loading, request, error } = useHttp();

    const createTodoItem = async (title: string) => {
        return await request<TodoItem>('http://localhost:3000', 'POST', { title });
    }

    return {
        loading, error, createTodoItem
    };
};

export { useGetTodoItems, useCreateToDoItem };

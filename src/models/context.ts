import { createContext } from "react";
import { TodoItem } from "./todo-item.ts";

export const ToDoItemContext = createContext<TodoItem | undefined>(undefined);

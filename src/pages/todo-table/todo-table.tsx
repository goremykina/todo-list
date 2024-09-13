import TodoList from "../../components/todo-list/todo-list.tsx";
import './style.scss'
import { useEffect, useState } from "react";
import { useGetTodoItems } from "../../api/todo-items.api.ts";
import { TodoItem, TodoItemStatus } from "../../models/todo-item.ts";

type GroupedTodoItems = {
    [K in TodoItemStatus]: TodoItem[];
};

const groupByStatus = (items: TodoItem[]): GroupedTodoItems => {
    const statuses = Object.values(TodoItemStatus);
    const result = statuses.reduce((acc, status) => {
        acc[status] = [];
        return acc;
    }, {} as GroupedTodoItems);

    for (const item of items) {
        result[item.status].push(item);
    }

    return result;
}

export default function TodoTable() {
    const [todoItems, setTodoItems] = useState<GroupedTodoItems>(groupByStatus([]));
    const { getTodoItems } = useGetTodoItems();

    useEffect(() => {
        getTodoItems()
            .then((todoItems) => {
                const groupedItems = groupByStatus(todoItems);
                setTodoItems(groupedItems)
            });
    }, []);

    const addItem = (item: TodoItem, status: TodoItemStatus) => {
        setTodoItems({
            ...todoItems,
            [status]: [...todoItems[status], item]
        });
    }

    console.log(todoItems.NOT_STARTED)

    return (
        <div className='todo-wrapper'>
            <TodoList title='To do' items={todoItems[TodoItemStatus.NOT_STARTED]} onTodoItemAdded={(item) => addItem(item, TodoItemStatus.NOT_STARTED)} />
            <TodoList title='In progress' items={todoItems[TodoItemStatus.IN_PROGRESS]} onTodoItemAdded={(item) => addItem(item, TodoItemStatus.IN_PROGRESS)} />
            <TodoList title='Done' items={todoItems[TodoItemStatus.DONE]} onTodoItemAdded={(item) => addItem(item, TodoItemStatus.DONE)} />
        </div>
    )
}

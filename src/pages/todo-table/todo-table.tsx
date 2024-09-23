import TodoList from "../../components/todo-list/todo-list.tsx";
import './style.scss'
import { useEffect, useState } from "react";
import { useGetTodoItems } from "../../api/todo-items.api.ts";
import { TodoItem, TodoItemStatus } from "../../models/todo-item.ts";
import { DragDropContext } from 'react-beautiful-dnd';

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

const statusDisplayNames = {
    [TodoItemStatus.NOT_STARTED]: 'Not started',
    [TodoItemStatus.IN_PROGRESS]: 'In progress',
    [TodoItemStatus.DONE]: 'Done',
};

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


    const deleteItem = (item: TodoItem, status: TodoItemStatus) => {
        const neededItems = todoItems[status]
        const indexEl = neededItems.findIndex((el) => el === item)

        const before = neededItems.slice(0, indexEl);
        const after = neededItems.slice(indexEl + 1);

        setTodoItems({
            ...todoItems,
            [status]: before.concat(after)
        })

        console.log(todoItems)
    }

    const updateItem = (item: TodoItem, oldStatus: TodoItemStatus) => {
        const neededItems = todoItems[oldStatus];
        const indexEl = neededItems.findIndex((el) => el.id === item.id);

        neededItems[indexEl] = item;

        setTodoItems({
            ...todoItems,
            [oldStatus]: neededItems
        });
    }

    const onDragEnd = () => {
        console.log('123')
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className='todo-wrapper'>
                {(Object.entries(todoItems) as [TodoItemStatus, TodoItem[]][]).map(([status, items]) => (
                    <TodoList
                        title={statusDisplayNames[status]}
                        items={items}
                        droppableId={status}
                        key={status}
                        onTodoItemAdded={(item) => addItem(item, status)}
                        onTodoItemDeleted={(item)=> deleteItem(item, status)}
                        onTodoItemUpdated={(item)=> updateItem(item, status)}
                    />
                ))}
                {/*<TodoList*/}
                {/*    title='To do'*/}
                {/*    items={todoItems[TodoItemStatus.NOT_STARTED]}*/}
                {/*    key={TodoItemStatus.NOT_STARTED}*/}
                {/*    droppableId={TodoItemStatus.NOT_STARTED}*/}
                {/*    onTodoItemAdded={(item) => addItem(item, TodoItemStatus.NOT_STARTED)}*/}
                {/*    onTodoItemDeleted={(item)=> deleteItem(item, TodoItemStatus.NOT_STARTED)}*/}
                {/*    onTodoItemUpdated={(item)=> updateItem(item, TodoItemStatus.NOT_STARTED)}*/}
                {/*/>*/}
                {/*<TodoList*/}
                {/*    title='In progress'*/}
                {/*    items={todoItems[TodoItemStatus.IN_PROGRESS]}*/}
                {/*    key={TodoItemStatus.IN_PROGRESS}*/}
                {/*    droppableId={TodoItemStatus.IN_PROGRESS}*/}
                {/*    onTodoItemAdded={(item) => addItem(item, TodoItemStatus.IN_PROGRESS)}*/}
                {/*    onTodoItemDeleted={(item)=> deleteItem(item, TodoItemStatus.IN_PROGRESS)}*/}
                {/*    onTodoItemUpdated={(item)=> updateItem(item, TodoItemStatus.IN_PROGRESS)}*/}
                {/*/>*/}
                {/*<TodoList*/}
                {/*    title='Done'*/}
                {/*    items={todoItems[TodoItemStatus.DONE]}*/}
                {/*    key={TodoItemStatus.DONE}*/}
                {/*    droppableId={TodoItemStatus.DONE}*/}
                {/*    onTodoItemAdded={(item) => addItem(item, TodoItemStatus.DONE)}*/}
                {/*    onTodoItemDeleted={(item)=> deleteItem(item, TodoItemStatus.DONE)}*/}
                {/*    onTodoItemUpdated={(item)=> updateItem(item, TodoItemStatus.IN_PROGRESS)}*/}
                {/*/>*/}
            </div>
        </DragDropContext>
    )
}

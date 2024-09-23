import './style.scss'
import { FormEvent, useState } from "react";
import Button from "../button/button.tsx";
import { TodoItem } from "../../models/todo-item.ts";
import { useCreateToDoItem, useGetTodoItems } from "../../api/todo-items.api.ts";
import { Droppable } from "react-beautiful-dnd";
import OneTodoItem from "../todo-item/todo-item.tsx";

type PropsType = {
    title: string,
    items:  TodoItem[],
    onTodoItemAdded: (todoItem: TodoItem) => void,
    onTodoItemDeleted: (todoItem: TodoItem) => void,
    onTodoItemUpdated: (todoItem: TodoItem) => void,
    droppableId: string
};

export default function TodoList(props: PropsType) {
    const { title , items, onTodoItemAdded, onTodoItemDeleted, onTodoItemUpdated, droppableId} = props;
    const [newItemTitle, setNewItemTitle] = useState('');
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    const { loading } = useGetTodoItems();
    const { createTodoItem } = useCreateToDoItem();


    const submitNewItem = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newItem = await createTodoItem(newItemTitle);
        onTodoItemAdded(newItem);

        setNewItemTitle('');
        setIsCreateMode(false);
    };

    const goToCreateMode = () => {
        setIsCreateMode(true)
    }


    if (loading) {
        return <span>Loading...</span>;
    }

    return (
        <div className="todo-list" >
            <h2 className='todo-section-title'>{title}</h2>
            <Droppable droppableId={droppableId}>
                {(provided) => (
                    <div
                        className="todo-list-container"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {items.map(((item: TodoItem, index) => (
                            <OneTodoItem
                                key={item.id}
                                item={item}
                                onTodoItemDeleted={onTodoItemDeleted}
                                onTodoItemUpdated={onTodoItemUpdated}
                                index={index} />
                        )))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>

            {isCreateMode && (
                <form onSubmit={submitNewItem} className='todo-create-form'>
                    <textarea
                        required
                        className="todo-item-header"
                        value={newItemTitle}
                        onChange={e => setNewItemTitle(e.target.value)}/>
                    <Button
                        text='Create'
                    />
                </form>
            )}

            {!isCreateMode && (
                <Button
                    text='Add Task'
                    onClick={() => goToCreateMode()}>
                </Button>
            )}
        </div>
    )
}

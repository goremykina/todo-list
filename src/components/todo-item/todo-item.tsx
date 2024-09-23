import Button from "../button/button.tsx";
import { useDeleteToDoItem, useUpdateToDoItemTitle } from "../../api/todo-items.api.ts";
import { TodoItem } from "../../models/todo-item.ts";
import { Draggable } from "react-beautiful-dnd";
import './style.scss'
import { useEffect, useState } from "react";
import { useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'


type PropsType = {
    item:  TodoItem,
    onTodoItemDeleted: (todoItem: TodoItem) => void,
    onTodoItemUpdated: (todoItem: TodoItem) => void,
    index: number
};

export default function OneTodoItem(props: PropsType) {
    const { item, onTodoItemDeleted, onTodoItemUpdated, index } = props;
    const [editMode, setEditMode] = useState<boolean>(false);
    const [itemTitle, setItemTitle] = useState('');
    const { deleteTodoItem } = useDeleteToDoItem();
    const { updateTodoItemTitle } = useUpdateToDoItemTitle();
    const inputRef = useRef(null);

    useEffect(() => {
        setItemTitle(item.title);
    }, [item.title]);

    const onDelete = async (item: TodoItem) => {
        await deleteTodoItem(item.id)
        onTodoItemDeleted(item)
    }

    const handleClickOutside = async () => {
        setEditMode(false)
        if (item.title !== itemTitle) {
            console.log(item, itemTitle)

            const newItem = await updateTodoItemTitle(item.id, itemTitle);
            onTodoItemUpdated(newItem)
        }
    }

    useOnClickOutside(inputRef, handleClickOutside)

    return (
        <Draggable draggableId={item.id} index={index}>
            {(provided) => (
                <div
                    className='todo-item'
                    key={item.id}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                >
                    {editMode
                        ? (<input
                            autoFocus
                            ref={inputRef}
                            value={itemTitle}
                            className='todo-item-input'
                            onChange={e => setItemTitle(e.target.value)}/>)
                        : (<div
                                className='todo-item-mode'
                                onClick={() => setEditMode(true)}>
                                {item.title}</div>)
                    }
                    <Button
                        text='Delete'
                        onClick={() => onDelete(item)}>
                    </Button>
                </div>
            )}
        </Draggable>
    )
}

import './style.scss'
import { FormEvent, useState } from "react";
import Button from "../button/button.tsx";
import { TodoItem } from "../../models/todo-item.ts";
import { useCreateToDoItem, useGetTodoItems } from "../../api/todo-items.api.ts";

type PropsType = {
    title: string,
    items:  TodoItem[],
    onTodoItemAdded: (todoItem: TodoItem) => void,
};

export default function TodoList(props: PropsType) {
    const { title , items, onTodoItemAdded} = props;
    console.log(items)
    const [newItemTitle, setNewItemTitle] = useState('');
    const [isCreateMode, setIsCreateMode] = useState<boolean>(false);
    const {
        loading,
        // getTodoItems,
    } = useGetTodoItems();
    const { createTodoItem } = useCreateToDoItem();

    // useEffect(() => {
    //     getTodoItems()
    //        .then(items => {
    //            console.log(items);
    //            setTodoItems(items)
    //        });
    // }, []);

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

    const onDelete = (id: string) => {
        // const before = todoItems.slice(0, indexEl);
        // const after = todoItems.slice(indexEl + 1);
        //
        // setTodoItems(before.concat(after))
        console.log(id)
    }

    if (loading) {
        return <span>Loading...</span>;
    }

    return (
        <div className="todo-list" >
            <h2 className='todo-section-title'>{title}</h2>
            <div className="todo-list-items">

                {items.map(((item: TodoItem) => (
                    <div className='todo-item'>
                        <input type='checkbox'/>
                        <textarea key={item.id} className='todo-item-header'>{item.title}</textarea>
                        <Button
                            text='Delete'
                            onClick={() => onDelete(item.id)}
                        ></Button>
                    </div>
                )))}
            </div>

            {isCreateMode && (
                <form onSubmit={submitNewItem} className='todo-create-form'>
                    <textarea
                        required
                        className="todo-item-header"
                        onChange={e => setNewItemTitle(e.target.value)}
                        value={newItemTitle}/>
                    <Button
                        text='Create'
                    />
                </form>
            )}

            {!isCreateMode && (
                <Button
                    text='Add Task'
                    onClick={() => goToCreateMode()}></Button>
            )}
        </div>
    )
}

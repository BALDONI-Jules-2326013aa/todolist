import { useState } from "react";
import TodoItem from "./TodoItem";
import AddTodoItemButton from "./AddTodoItemButton";
import data from "./data.json";

function TodoList({ addItemClick }) {
    const [todos, setTodos] = useState(data.taches);

    const handleAddTodo = () => {
        const newTodo = {
            id: Date.now(),
            title: "Nouvelle tâche",
            description: "",
            date_creation: new Date().toISOString().split("T")[0],
            date_echeance: new Date().toISOString().split("T")[0],
            done: false,
            urgent: false,
            contacts: [],
        };
        setTodos([...todos, newTodo]);
    };

    return (
        <div className="todo-list">
            <h2>Liste des tâches</h2>
            {todos.map((todo) => (
                <TodoItem key={todo.id} {...todo} />
            ))}
        </div>
    );
}

export default TodoList;

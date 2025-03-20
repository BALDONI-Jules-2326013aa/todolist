import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos, onUpdate }) {
    return (
        <div className="todo-list">
            <h2>Liste des tâches</h2>
            {todos.map((todo) => (
                <TodoItem key={todo.id} {...todo} onUpdate={onUpdate} />
            ))}
        </div>
    );
}

export default TodoList;

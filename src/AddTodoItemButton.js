import React from "react";

function AddTodoItemButton({ onClick }) {
    return (
        <button className="add-todo-button" onClick={onClick}>
            ➕ Ajouter une tâche
        </button>
    );
}

export default AddTodoItemButton;

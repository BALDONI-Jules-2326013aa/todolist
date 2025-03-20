import React, { useState } from "react";

function TodoItem({ id, title, description, date_echeance, done, urgent, contacts, onUpdate }) {
    const [editedTodo, setEditedTodo] = useState({
        title,
        description,
        date_echeance,
        done,
        urgent,
        contacts,
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setEditedTodo({
            ...editedTodo,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSave = () => {
        onUpdate(id, editedTodo);
    };

    return (
        <div className={`todo-item ${editedTodo.done ? "completed" : ""} ${editedTodo.urgent ? "urgent" : ""}`}>
            {/* ✅ Si la tâche est complétée, on affiche seulement le titre et la checkbox */}
            {editedTodo.done ? (
                <>
                    <h3 className="todo-title">{editedTodo.title}</h3>
                    <label>
                        <input
                            type="checkbox"
                            name="done"
                            checked={editedTodo.done}
                            onChange={handleChange}
                        />
                    </label>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        name="title"
                        value={editedTodo.title}
                        onChange={handleChange}
                        placeholder="Titre"
                        className="todo-item-title"
                    />
                    <textarea
                        name="description"
                        value={editedTodo.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className="todo-item-description"
                        resize="none"
                    />
                    <input
                        type="date"
                        name="date_echeance"
                        value={editedTodo.date_echeance}
                        onChange={handleChange}
                        className="todo-item-date"
                    />
                    <label>
                        <input
                            type="checkbox"
                            name="done"
                            checked={editedTodo.done}
                            onChange={handleChange}
                        />
                        Terminée ✅
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="urgent"
                            checked={editedTodo.urgent}
                            onChange={handleChange}
                        />
                        Urgent ❗
                    </label>
                </>
            )}
        </div>
    );
}

export default TodoItem;

import React, { useState } from "react";

function TodoItem({ id, title, description, date_creation, date_echeance, done, urgent, contacts, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
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
        setIsEditing(false);
    };

    return (
        <div className={`todo-item ${editedTodo.done ? "completed" : ""} ${editedTodo.urgent ? "urgent" : ""}`}>
            {isEditing ? (
                <>
                    <input
                        type="text"
                        name="title"
                        value={editedTodo.title}
                        onChange={handleChange}
                        placeholder="Titre"
                    />
                    <textarea
                        name="description"
                        value={editedTodo.description}
                        onChange={handleChange}
                        placeholder="Description"
                    />
                    <input
                        type="date"
                        name="date_echeance"
                        value={editedTodo.date_echeance}
                        onChange={handleChange}
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
                    <button onClick={handleSave}>💾 Enregistrer</button>
                </>
            ) : (
                <>
                    <h3>{editedTodo.title}</h3>
                    <p>{editedTodo.description}</p>
                    <p><strong>Créé le :</strong> {new Date(date_creation).toLocaleDateString()}</p>
                    <p><strong>Échéance :</strong> {new Date(editedTodo.date_echeance).toLocaleDateString()}</p>
                    <p><strong>Statut :</strong> {editedTodo.done ? "Terminée ✅" : "En cours ⏳"}</p>
                    <p><strong>Urgent :</strong> {editedTodo.urgent ? "Oui ❗" : "Non"}</p>
                    {contacts.length > 0 && (
                        <div>
                            <strong>Contacts :</strong>
                            <div className="contacts">
                                {contacts.map((contact, index) => (
                                    <span key={index}>{contact.name}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    <button onClick={() => setIsEditing(true)}>✏ Modifier</button>
                </>
            )}
        </div>
    );
}

export default TodoItem;

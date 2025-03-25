import React, { useState, useEffect } from "react";
import { formatDateForDisplay, formatDateForStorage } from "./DateUtils";
import "./TodoItem.css";

function TodoItem({ 
  id, 
  title, 
  description, 
  date_creation, 
  date_echeance, 
  done, 
  urgent, 
  contacts, 
  categories, 
  onUpdate,
  onFilterByCategory,
  allCategories,
  onAddCategory,
  onRemoveCategory 
}) {
    const [editedTodo, setEditedTodo] = useState({
        id,
        title,
        description,
        date_creation,
        date_echeance,
        done,
        urgent,
        contacts: contacts || [],
    });
    const [isExpanded, setIsExpanded] = useState(false);
    const [displayDueDate, setDisplayDueDate] = useState(formatDateForDisplay(date_echeance));
    const [selectedCategoryId, setSelectedCategoryId] = useState("");

    useEffect(() => {
        setDisplayDueDate(formatDateForDisplay(date_echeance));
    }, [date_echeance]);

    const taskCategories = categories ? categories.map(catId => 
        allCategories.find(cat => cat.id === catId)
    ).filter(Boolean) : [];

    const availableCategories = allCategories.filter(cat => 
        !categories || !categories.includes(cat.id)
    );

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        if (name === "date_echeance") {
            const storageDate = formatDateForStorage(value);
            setDisplayDueDate(value);
            
            const newEditedTodo = {
                ...editedTodo,
                date_echeance: storageDate
            };
            setEditedTodo(newEditedTodo);
            onUpdate(id, newEditedTodo);
        } else {
            const newEditedTodo = {
                ...editedTodo,
                [name]: type === "checkbox" ? checked : value,
            };
            setEditedTodo(newEditedTodo);
            onUpdate(id, newEditedTodo);
        }
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddCategory = () => {
        if (selectedCategoryId && onAddCategory) {
            onAddCategory(id, parseInt(selectedCategoryId, 10));
            setSelectedCategoryId("");
        }
    };

    const handleRemoveCategory = (categoryId) => {
        if (onRemoveCategory) {
            onRemoveCategory(id, categoryId);
        }
    };

    const firstTwoCategories = taskCategories.slice(0, 2);

    return (
        <div className={`todo-item ${editedTodo.done ? "completed" : ""} ${editedTodo.urgent ? "urgent" : ""}`}>
            {editedTodo.done ? (
                <>
                    <div className="task-header">
                        <h3 className="todo-title">{editedTodo.title}</h3>
                        <div className="date-info">
                            <span>Échéance: {editedTodo.date_echeance}</span>
                        </div>
                    </div>
                    
                    {taskCategories.length > 0 && (
                        <div className="category-tags">
                            {taskCategories.map(category => (
                                <span 
                                    key={category.id} 
                                    className="category-tag" 
                                    style={{backgroundColor: category.color}}
                                    onClick={() => onFilterByCategory && onFilterByCategory(category.id)}
                                >
                                    {category.title}
                                </span>
                            ))}
                        </div>
                    )}
                    
                    <div className="todo-options">
                        <label className={editedTodo.done ? "active" : ""}>
                            <input
                                type="checkbox"
                                name="done"
                                checked={editedTodo.done}
                                onChange={handleChange}
                            />
                            Terminée ✅
                        </label>
                    </div>
                </>
            ) : (
                <>
                    <div className="task-main">
                        <input
                            type="text"
                            name="title"
                            value={editedTodo.title}
                            onChange={handleChange}
                            placeholder="Titre"
                            className="todo-item-title"
                        />
                        
                        <div className="task-expand-toggle" onClick={toggleExpand}>
                            {isExpanded ? "▼" : "►"}
                        </div>
                    </div>
                    
                    {!isExpanded && taskCategories.length > 0 && (
                        <div className="category-tags">
                            {firstTwoCategories.map(category => (
                                <span 
                                    key={category.id} 
                                    className="category-tag" 
                                    style={{backgroundColor: category.color}}
                                    onClick={() => onFilterByCategory && onFilterByCategory(category.id)}
                                >
                                    {category.title}
                                </span>
                            ))}
                            
                            {taskCategories.length > 2 && (
                                <span className="category-more" onClick={toggleExpand}>
                                    +{taskCategories.length - 2}
                                </span>
                            )}
                        </div>
                    )}
                    
                    {isExpanded && (
                        <div className="expanded-content">
                            <textarea
                                name="description"
                                value={editedTodo.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="todo-item-description"
                            />
                            
                            <div className="date-container">
                                <div className="date-field">
                                    <label>Date de création:</label>
                                    <div className="date-value">{editedTodo.date_creation}</div>
                                </div>
                                
                                <div className="date-field">
                                    <label>Date d'échéance:</label>
                                    <input
                                        type="date"
                                        name="date_echeance"
                                        value={displayDueDate}
                                        onChange={handleChange}
                                        className="todo-item-date"
                                    />
                                </div>
                            </div>
                            
                            <div className="categories-manager">
                                <label>Catégories:</label>
                                
                                {taskCategories.length > 0 ? (
                                    <div className="category-tags">
                                        {taskCategories.map(category => (
                                            <span 
                                                key={category.id} 
                                                className="category-tag with-remove" 
                                                style={{backgroundColor: category.color}}
                                            >
                                                {category.title}
                                                <button 
                                                    className="remove-category"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveCategory(category.id);
                                                    }}
                                                >
                                                    ✕
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-categories">Aucune catégorie assignée</p>
                                )}
                                
                                {availableCategories.length > 0 && (
                                    <div className="add-category-form">
                                        <select 
                                            value={selectedCategoryId} 
                                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                                            className="category-select"
                                        >
                                            <option value="">Choisir une catégorie</option>
                                            {availableCategories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.title}
                                                </option>
                                            ))}
                                        </select>
                                        <button 
                                            className="add-category-button"
                                            onClick={handleAddCategory}
                                            disabled={!selectedCategoryId}
                                        >
                                            Ajouter
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {editedTodo.contacts && editedTodo.contacts.length > 0 && (
                                <div className="contacts-container">
                                    <label>Contacts:</label>
                                    <div className="contacts">
                                        {editedTodo.contacts.map((contact, index) => (
                                            <span key={index} className="contact-tag">
                                                {contact.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                    
                    <div className="todo-options">
                        <label className={editedTodo.done ? "active" : ""}>
                            <input
                                type="checkbox"
                                name="done"
                                checked={editedTodo.done}
                                onChange={handleChange}
                            />
                            Terminée ✅
                        </label>
                        <label className={editedTodo.urgent ? "active" : ""}>
                            <input
                                type="checkbox"
                                name="urgent"
                                checked={editedTodo.urgent}
                                onChange={handleChange}
                            />
                            Urgent ❗
                        </label>
                    </div>
                </>
            )}
        </div>
    );
}

export default TodoItem;
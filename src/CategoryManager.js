import React, { useState } from "react";
import "./CategoryManager.css";

function CategoryManager({ categories, onAddCategory, onUpdateCategory, onDeleteCategory, onClose }) {
    const [newCategory, setNewCategory] = useState({ title: '', description: '', color: '#3498db' });
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ title: '', description: '', color: '' });
    
    const colorOptions = [
        '#e74c3c', '#e67e22', '#f1c40f', '#2ecc71', '#3498db', 
        '#9b59b6', '#1abc9c', '#34495e', '#7f8c8d'
    ];
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!newCategory.title.trim()) return;
        
        onAddCategory({
            title: newCategory.title,
            description: newCategory.description,
            color: newCategory.color,
            icon: ''
        });
        
        setNewCategory({ title: '', description: '', color: '#3498db' });
    };
    
    const handleEdit = (category) => {
        setEditingId(category.id);
        setEditForm({
            title: category.title,
            description: category.description || '',
            color: category.color || '#3498db'
        });
    };
    
    const handleUpdate = (e) => {
        e.preventDefault();
        if (!editForm.title.trim() || !editingId) return;
        
        onUpdateCategory(editingId, {
            title: editForm.title,
            description: editForm.description,
            color: editForm.color
        });
        
        setEditingId(null);
    };
    
    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
            onDeleteCategory(id);
        }
    };

    return (
        <div className="category-manager">
            <div className="category-manager-content">
                <div className="category-manager-header">
                    <h2>Gérer les catégories</h2>
                    <button className="close-button" onClick={onClose}>✖</button>
                </div>
                
                <div className="category-manager-body">
                    <div className="category-list">
                        <h3>Catégories existantes</h3>
                        {categories.length === 0 ? (
                            <p className="no-items">Aucune catégorie créée</p>
                        ) : (
                            <ul>
                                {categories.map(category => (
                                    <li key={category.id} className="category-item">
                                        <div className="category-info">
                                            <span 
                                                className="category-color" 
                                                style={{ backgroundColor: category.color }}
                                            ></span>
                                            <span className="category-title">{category.title}</span>
                                        </div>
                                        <div className="category-actions">
                                            <button onClick={() => handleEdit(category)}>✏️</button>
                                            <button onClick={() => handleDelete(category.id)}>🗑️</button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    
                    {editingId ? (
                        <div className="category-edit-form">
                            <h3>Modifier la catégorie</h3>
                            <form onSubmit={handleUpdate}>
                                <div className="form-group">
                                    <label>Titre</label>
                                    <input 
                                        type="text" 
                                        value={editForm.title} 
                                        onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea 
                                        value={editForm.description}
                                        onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Couleur</label>
                                    <div className="color-picker">
                                        {colorOptions.map(color => (
                                            <div 
                                                key={color}
                                                className={`color-option ${editForm.color === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setEditForm({...editForm, color})}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <div className="form-actions">
                                    <button type="button" onClick={() => setEditingId(null)}>Annuler</button>
                                    <button type="submit">Mettre à jour</button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="category-add-form">
                            <h3>Ajouter une nouvelle catégorie</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Titre</label>
                                    <input 
                                        type="text" 
                                        value={newCategory.title} 
                                        onChange={(e) => setNewCategory({...newCategory, title: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea 
                                        value={newCategory.description}
                                        onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                                    ></textarea>
                                </div>
                                <div className="form-group">
                                    <label>Couleur</label>
                                    <div className="color-picker">
                                        {colorOptions.map(color => (
                                            <div 
                                                key={color}
                                                className={`color-option ${newCategory.color === color ? 'selected' : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => setNewCategory({...newCategory, color})}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <button type="submit">Ajouter</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CategoryManager;
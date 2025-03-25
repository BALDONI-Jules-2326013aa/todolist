import React, { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import "./TodoList.css";

function TodoList({ todos, categories, relations, onUpdate, onUpdateRelations }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortMethod, setSortMethod] = useState("due_date");
    const [showSortOptions, setShowSortOptions] = useState(false);
    const [viewMode, setViewMode] = useState("active");
    const [sortedTodos, setSortedTodos] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    
    const taskCategoriesMap = relations.reduce((map, relation) => {
        if (!map[relation.tache]) {
            map[relation.tache] = [];
        }
        map[relation.tache].push(relation.categorie);
        return map;
    }, {});
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    useEffect(() => {
        let result = [...todos];
        
        if (viewMode === "active") {
            result = result.filter(todo => !todo.done);
        } else if (viewMode === "completed") {
            result = result.filter(todo => todo.done);
        } else if (viewMode === "urgent") {
            result = result.filter(todo => todo.urgent);
        }
        
        if (selectedCategory) {
            result = result.filter(todo => {
                const taskCategories = taskCategoriesMap[todo.id] || [];
                return taskCategories.includes(selectedCategory);
            });
        }
        
        if (searchTerm && searchTerm.length >= 3) {
            result = result.filter(todo => 
                todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                todo.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        
        result.sort((a, b) => {
            switch (sortMethod) {
                case "alphabetical":
                    return a.title.localeCompare(b.title);
                    
                case "creation_date":
                    const [dayA, monthA, yearA] = a.date_creation.split('/');
                    const [dayB, monthB, yearB] = b.date_creation.split('/');
                    const dateA = new Date(yearA, monthA - 1, dayA);
                    const dateB = new Date(yearB, monthB - 1, dayB);
                    return dateB - dateA;
                    
                case "category":
                    const catA = taskCategoriesMap[a.id] ? taskCategoriesMap[a.id][0] : null;
                    const catB = taskCategoriesMap[b.id] ? taskCategoriesMap[b.id][0] : null;
                    
                    const catNameA = catA ? (categories.find(c => c.id === catA)?.title || '') : '';
                    const catNameB = catB ? (categories.find(c => c.id === catB)?.title || '') : '';
                    
                    return catNameA.localeCompare(catNameB);
                    
                case "due_date":
                default:
                    if (!a.date_echeance || !b.date_echeance) return 0;
                    
                    const [dayDueA, monthDueA, yearDueA] = a.date_echeance.split('/');
                    const [dayDueB, monthDueB, yearDueB] = b.date_echeance.split('/');
                    const dateDueA = new Date(yearDueA, monthDueA - 1, dayDueA);
                    const dateDueB = new Date(yearDueB, monthDueB - 1, dayDueB);
                    return dateDueA - dateDueB;
            }
        });
        
        setSortedTodos(result);
    }, [todos, searchTerm, sortMethod, viewMode, selectedCategory, taskCategoriesMap, categories]);
    
    const handleCategoryFilter = (categoryId) => {
        setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    };
    
    const toggleSortOptions = () => {
        setShowSortOptions(!showSortOptions);
    };
    
    const handleSortChange = (method) => {
        setSortMethod(method);
        setShowSortOptions(false);
    };
    
    const handleViewModeChange = (mode) => {
        setViewMode(mode);
    };
    
    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const getSortMethodDisplayName = () => {
        switch (sortMethod) {
            case "alphabetical": return "Ordre alphabétique";
            case "creation_date": return "Date de création";
            case "category": return "Catégorie";
            case "due_date": default: return "Date d'échéance";
        }
    };

    return (
        <div className="todo-list">
            <div className="todo-controls">
                <div className="filter-buttons">
                    <button 
                        className={`filter-button ${viewMode === "all" ? "active" : ""}`}
                        onClick={() => handleViewModeChange("all")}
                    >
                        Toutes
                    </button>
                    <button 
                        className={`filter-button ${viewMode === "active" ? "active" : ""}`}
                        onClick={() => handleViewModeChange("active")}
                    >
                        En cours
                    </button>
                    <button 
                        className={`filter-button ${viewMode === "completed" ? "active" : ""}`}
                        onClick={() => handleViewModeChange("completed")}
                    >
                        Complétées
                    </button>
                    <button 
                        className={`filter-button ${viewMode === "urgent" ? "active" : ""}`}
                        onClick={() => handleViewModeChange("urgent")}
                    >
                        Urgentes
                    </button>
                </div>
                
                {categories.length > 0 && (
                    <div className="category-filters">
                        {categories.map(category => (
                            <span 
                                key={category.id}
                                className={`category-filter ${selectedCategory === category.id ? 'active' : ''}`}
                                style={{
                                    backgroundColor: selectedCategory === category.id ? category.color : 'transparent',
                                    borderColor: category.color
                                }}
                                onClick={() => handleCategoryFilter(category.id)}
                            >
                                {category.title}
                            </span>
                        ))}
                    </div>
                )}
                
                <div className="search-sort-container">
                    <div className="sort-dropdown">
                        <button 
                            className="sort-button" 
                            onClick={toggleSortOptions}
                            title="Options de tri"
                        >
                            <span className="sort-icon">🔽</span> 
                            <span>Tri: {getSortMethodDisplayName()}</span>
                        </button>
                        
                        {showSortOptions && (
                            <div className="sort-options">
                                <button 
                                    className={sortMethod === "due_date" ? "active" : ""}
                                    onClick={() => handleSortChange("due_date")}
                                >
                                    Date d'échéance
                                </button>
                                <button 
                                    className={sortMethod === "alphabetical" ? "active" : ""}
                                    onClick={() => handleSortChange("alphabetical")}
                                >
                                    Ordre alphabétique
                                </button>
                                <button 
                                    className={sortMethod === "creation_date" ? "active" : ""}
                                    onClick={() => handleSortChange("creation_date")}
                                >
                                    Date de création
                                </button>
                                <button 
                                    className={sortMethod === "category" ? "active" : ""}
                                    onClick={() => handleSortChange("category")}
                                >
                                    Catégorie
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Rechercher (min. 3 caractères)"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="search-input"
                        />
                        {searchTerm && (
                            <button 
                                className="clear-search" 
                                onClick={() => setSearchTerm("")}
                            >
                                ✖
                            </button>
                        )}
                    </div>
                </div>
            </div>
            
            <h2>Liste des tâches ({sortedTodos.length})</h2>
            
            {sortedTodos.length === 0 ? (
                <p className="no-tasks">Aucune tâche à afficher</p>
            ) : (
                sortedTodos.map((todo) => (
                    <TodoItem 
                        key={todo.id} 
                        {...todo} 
                        categories={taskCategoriesMap[todo.id] || []}
                        allCategories={categories}
                        onUpdate={onUpdate}
                        onFilterByCategory={handleCategoryFilter}
                        onAddCategory={onUpdateRelations.add}
                        onRemoveCategory={onUpdateRelations.remove}
                    />
                ))
            )}
        </div>
    );
}

export default TodoList;
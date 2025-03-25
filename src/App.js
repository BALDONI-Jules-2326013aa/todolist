// App.js
import React, { useState, useEffect } from "react";
import HeaderTodoList from "./HeaderTodoList";
import TodoList from "./TodoList";
import FooterTodoList from "./FooterTodoList";
import InitialScreen from "./InitialScreen";
import ExportButton from "./ExportButton";
import { getCurrentDate } from "./DateUtils";
import CategoryManager from "./CategoryManager";
import "./App.css";

function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [todos, setTodos] = useState([]);
    const [categories, setCategories] = useState([]);
    const [relations, setRelations] = useState([]);
    const [showCategoryManager, setShowCategoryManager] = useState(false);

    const handleStartFresh = () => {
        setTodos([]);
        setCategories([]);
        setRelations([]);
        setIsInitialized(true);
    };

    const handleLoadBackup = (backupData) => {
        setTodos(backupData.taches || []);
        setCategories(backupData.categories || []);
        setRelations(backupData.relations || []);
        setIsInitialized(true);
    };


    const handleAddTodo = () => {
        const newTodo = {
            id: Date.now(),
            title: "Nouvelle tâche",
            description: "",
            date_creation: getCurrentDate(),
            date_echeance: getCurrentDate(),
            done: false,
            urgent: false,
            contacts: [],
        };
        setTodos([...todos, newTodo]);
    };

    const handleUpdateTodo = (id, updatedTodo) => {
        setTodos(todos.map(todo => {
            if (todo.id === id) {
                return {
                    ...todo,
                    ...updatedTodo,
                    id: todo.id,
                    date_creation: todo.date_creation,
                };
            }
            return todo;
        }));
    };

    const handleAddCategory = (newCategory) => {
        const categoryWithId = {
            ...newCategory,
            id: Date.now()
        };
        setCategories([...categories, categoryWithId]);
    };

    const handleUpdateCategory = (id, updatedCategory) => {
        setCategories(categories.map(category => 
            category.id === id ? { ...category, ...updatedCategory } : category
        ));
    };

    const handleDeleteCategory = (id) => {
        setCategories(categories.filter(category => category.id !== id));
        setRelations(relations.filter(relation => relation.categorie !== id));
    };

    const handleAddRelation = (taskId, categoryId) => {
        const relationExists = relations.some(
            rel => rel.tache === taskId && rel.categorie === categoryId
        );
        
        if (!relationExists) {
            setRelations([...relations, { tache: taskId, categorie: categoryId }]);
        }
    };

    const handleRemoveRelation = (taskId, categoryId) => {
        setRelations(relations.filter(
            rel => !(rel.tache === taskId && rel.categorie === categoryId)
        ));
    };

    const handleLoadLastList = () => {
        try {
            const savedData = localStorage.getItem('todoListData');
            if (savedData) {
                const parsedData = JSON.parse(savedData);
                setTodos(parsedData.taches || []);
                setCategories(parsedData.categories || []);
                setRelations(parsedData.relations || []);
                setIsInitialized(true);
            }
        } catch (error) {
            console.error("Erreur lors du chargement de la dernière liste:", error);
            alert("Impossible de charger la dernière liste. Erreur: " + error.message);
        }
    };
    
    useEffect(() => {
        if (isInitialized) {
            const dataToSave = {
                taches: todos,
                categories: categories,
                relations: relations
            };
            localStorage.setItem('todoListData', JSON.stringify(dataToSave));
        }
    }, [todos, categories, relations, isInitialized]);
    
    const handleExportData = () => {
        if (todos.length === 0 && categories.length === 0 && relations.length === 0) {
            alert("Aucune donnée à exporter. Veuillez d'abord créer des tâches ou des catégories.");
            return;
        }
        
        const defaultFilename = `todo-backup-${new Date().toISOString().split('T')[0]}`;
        let userFilename = prompt("Entrez un nom pour votre fichier de sauvegarde:", defaultFilename);
        
        if (userFilename === null) return;
        
        userFilename = userFilename.trim();
        if (userFilename === '') {
            userFilename = defaultFilename;
        }
        
        if (!userFilename.toLowerCase().endsWith('.json')) {
            userFilename += '.json';
        }
        
        userFilename = userFilename.replace(/[<>:"/\\|?*]/g, '_');
        
        const dataToExport = {
            taches: todos,
            categories: categories,
            relations: relations
        };
        
        const jsonString = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = userFilename;
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert(`Sauvegarde "${userFilename}" effectuée avec succès!`);
    };

    const toggleCategoryManager = () => {
        setShowCategoryManager(!showCategoryManager);
    };

    if (!isInitialized) {
        return <InitialScreen 
            onStartFresh={handleStartFresh} 
            onLoadBackup={handleLoadBackup}
            onLoadLastList={handleLoadLastList}
        />;
    }

    return (
        <div className="App">
            <HeaderTodoList />
            <div className="app-controls">
                <button 
                    className="category-manager-button" 
                    onClick={toggleCategoryManager}
                >
                    🏷️ Gérer les catégories
                </button>
                <ExportButton onClick={handleExportData} />
            </div>
            
            {showCategoryManager && (
                <CategoryManager 
                    categories={categories}
                    onAddCategory={handleAddCategory}
                    onUpdateCategory={handleUpdateCategory}
                    onDeleteCategory={handleDeleteCategory}
                    onClose={toggleCategoryManager}
                />
            )}
            
            <TodoList 
                todos={todos} 
                categories={categories}
                relations={relations}
                onUpdate={handleUpdateTodo}
                onUpdateRelations={{
                    add: handleAddRelation,
                    remove: handleRemoveRelation
                }}
            />
            <FooterTodoList onAddTodo={handleAddTodo}/>
        </div>
    );
}

export default App;
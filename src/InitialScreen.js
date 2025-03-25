import React, { useRef, useEffect, useState } from "react";
import './InitialScreen.css';

function InitialScreen({ onStartFresh, onLoadBackup, onLoadLastList }) {
  const fileInputRef = useRef(null);
  const [hasLastList, setHasLastList] = useState(false);
  
  useEffect(() => {
    const savedData = localStorage.getItem('todoListData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.taches && Array.isArray(parsedData.taches)) {
          setHasLastList(true);
        }
      } catch (error) {
        console.error("Erreur lors de la lecture de la dernière liste:", error);
        localStorage.removeItem('todoListData');
      }
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.taches && Array.isArray(data.taches)) {
            onLoadBackup(data);
          } else {
            alert("Le format du fichier JSON n'est pas valide. Il doit contenir un tableau 'taches'.");
          }
        } catch (error) {
          alert("Erreur lors de la lecture du fichier JSON: " + error.message);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleStartFresh = () => {
    const confirmed = window.confirm("Êtes-vous sûr de vouloir démarrer de zéro ? Cette action est irréversible.");
    if (confirmed) {
      onStartFresh();
    }
  };

  return (
    <div className="initial-screen">
      <div className="initial-screen-content">
        <h1>Bienvenue dans l'application Todo List</h1>
        <p>Comment souhaitez-vous commencer ?</p>
        
        <div className="initial-options">
          {hasLastList && (
            <button 
              className="option-button last-list"
              onClick={onLoadLastList}
            >
              ⏱️ Dernière liste ouverte
            </button>
          )}
          
          <button 
            className="option-button upload"
            onClick={() => fileInputRef.current.click()}
          >
            📁 Charger un backup (JSON)
          </button>
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            style={{ display: "none" }}
          />
          
          <button 
            className="option-button fresh"
            onClick={handleStartFresh}
          >
            ✨ Démarrer de zéro
          </button>
        </div>
      </div>
    </div>
  );
}

export default InitialScreen;
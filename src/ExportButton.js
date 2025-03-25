import React from "react";

function ExportButton({ onClick }) {
  return (
    <button className="export-button" onClick={onClick}>
      💾 Sauvegarder les données
    </button>
  );
}

export default ExportButton;
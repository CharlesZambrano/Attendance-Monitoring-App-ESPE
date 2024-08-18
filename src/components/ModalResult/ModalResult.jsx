import React from 'react';
import './ModalResult.scss'; // Importamos el archivo SCSS

const ModalResult = ({ identity, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{identity === "Desconocido" ? "No Reconocido" : `Hola, ${identity}`}</h2>
        <button onClick={onClose} className="button">
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalResult;

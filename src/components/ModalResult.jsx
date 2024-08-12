import React from 'react';

const ModalResult = ({ result }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <h4>Resultado del Reconocimiento</h4>
        <p>{result === "Desconocido" ? "No se reconoció la persona" : `Se reconoció a: ${result}`}</p>
        <button onClick={() => window.location.reload()}>Aceptar</button>
      </div>
    </div>
  );
};

export default ModalResult;

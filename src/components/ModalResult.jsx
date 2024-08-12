import React from 'react';

const ModalResult = ({ identity, onClose }) => {
  return (
    <div style={{
      position: 'fixed', top: '50%', left: '50%',
      transform: 'translate(-50%, -50%)', padding: '20px',
      backgroundColor: 'white', boxShadow: '0px 0px 10px rgba(0,0,0,0.5)',
      zIndex: 1000
    }}>
      <h2>{identity === "Desconocido" ? "No Reconocido" : `Hola, ${identity}`}</h2>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
};

export default ModalResult;

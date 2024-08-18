import React from 'react';

const ModalResult = ({ identity, onClose }) => {
  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="modal" style={{
        background: 'white',
        padding: '20px',
        borderRadius: '5px',
        width: '300px',
        textAlign: 'center'
      }}>
        <h2>{identity === "Desconocido" ? "No Reconocido" : `Hola, ${identity}`}</h2>
        <button onClick={onClose} style={{
          backgroundColor: '#00713d',
          color: 'white',
          border: 'none',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '1em',
          transition: 'background-color 0.3s ease'
        }}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalResult;

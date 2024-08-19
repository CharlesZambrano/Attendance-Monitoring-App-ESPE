import React from 'react';
import './ModalResult.scss';

const ModalResult = ({ professorInfo, errorMessage, onClose, onContinue }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {errorMessage ? (
          <h2>{errorMessage}</h2>
        ) : (
          <div>
            <h2>{`${professorInfo.FIRST_NAME} ${professorInfo.LAST_NAME}`}</h2>
            <p>{professorInfo.UNIVERSITY_ID}</p>
          </div>
        )}
        <div className={`modal-buttons ${errorMessage ? 'single-button' : ''}`}>
          <button className="button" onClick={onClose}>
            Cerrar
          </button>
          {!errorMessage && (
            <button className="button" onClick={onContinue}>
              Continuar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalResult;

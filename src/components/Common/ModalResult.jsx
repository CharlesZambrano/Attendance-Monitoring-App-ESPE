import React from 'react';
import './ModalResult.scss';

const ModalResult = ({ result, onClose }) => {
  const translateDayToSpanish = (message) => {
    const daysMap = {
      'Monday': 'Lunes',
      'Tuesday': 'Martes',
      'Wednesday': 'Miércoles',
      'Thursday': 'Jueves',
      'Friday': 'Viernes',
      'Saturday': 'Sábado',
      'Sunday': 'Domingo'
    };

    let translatedMessage = message;
    Object.keys(daysMap).forEach((day) => {
      if (message.includes(day)) {
        translatedMessage = translatedMessage.replace(day, daysMap[day]);
      }
    });
    return translatedMessage;
  };

  return (
    <div className="modal-result">
      <div className="modal-content">
        <h2>{result.error ? "Error en el Registro" : "Resultado de Asistencia"}</h2>
        <p>{translateDayToSpanish(result.message || result.error)}</p>
        <button onClick={onClose}>Aceptar</button>
      </div>
    </div>
  );
};

export default ModalResult;

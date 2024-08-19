import React from 'react';
import placeholderIcon from '../../assets/placeholder.png';
import './ClassCard.scss';

const ClassCard = ({ schedule, onCardClick }) => {
  const { SUBJECT, NRC, TYPE, START_TIME, END_TIME } = schedule;

  // Formatear horas en UTC para mostrarlas correctamente en el card
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC' // Usamos UTC para evitar la conversión a la zona horaria local
    });
  };

  return (
    <div className="class-card">
      <div className="card-header">
        <img src={placeholderIcon} alt="Icono" className="icon" onClick={(e) => {
          e.stopPropagation(); // Evita que el click en el icono abra el card
          onCardClick(); // Solo el icono abre el modal
        }} />
      </div>
      <div className="card-content">
        <h3>{SUBJECT}</h3>
        <p><strong>NRC:</strong> {NRC}</p>
        <p><strong>Tipo:</strong> {TYPE}</p>
        <p><strong>Hora de inicio:</strong> {formatTime(START_TIME)}</p>
        <p><strong>Hora de fin:</strong> {formatTime(END_TIME)}</p>
      </div>
    </div>
  );
};

export default ClassCard;

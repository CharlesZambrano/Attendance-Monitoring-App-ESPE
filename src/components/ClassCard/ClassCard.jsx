import React from 'react';
import placeholderIcon from '../../assets/placeholder.png';
import './ClassCard.scss';

const ClassCard = ({ schedule, onCardClick }) => {
  const { SUBJECT, NRC, TYPE, START_TIME, END_TIME } = schedule;

  // Formatear horas para mostrarlas en el card
  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="class-card" onClick={onCardClick}>
      <div className="card-header">
        <img src={placeholderIcon} alt="Icono" className="icon" onClick={(e) => {
          e.stopPropagation(); // Evita que el click en el icono abra el card
          onCardClick();
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

import React from 'react';
import './ClassScheduleModal.scss';

const ClassScheduleModal = ({ schedule, onClose }) => {
  const {
    BUILDING, CAPACITY, CLASSROOM, CODE, CREDITS,
    DAYS_OF_WEEK, END_TIME, START_TIME, KNOWLEDGE_AREA,
    SECTION, STATUS, SUBJECT, EDUCATION_LEVEL // Eliminamos TYPE
  } = schedule;

  const translateDay = (day) => {
    const days = {
      "Monday": "Lunes",
      "Tuesday": "Martes",
      "Wednesday": "Miércoles",
      "Thursday": "Jueves",
      "Friday": "Viernes",
      "Saturday": "Sábado",
      "Sunday": "Domingo"
    };
    return days[day] || day;
  };

  const formatTime = (time) => {
    return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{SUBJECT}</h2>
        <p><strong>Edificio:</strong> {BUILDING}</p>
        <p><strong>Aula:</strong> {CLASSROOM}</p>
        <p><strong>Código:</strong> {CODE}</p>
        <p><strong>Capacidad:</strong> {CAPACITY}</p>
        <p><strong>Créditos:</strong> {CREDITS}</p>
        <p><strong>Día de la semana:</strong> {translateDay(DAYS_OF_WEEK)}</p>
        <p><strong>Hora de inicio:</strong> {formatTime(START_TIME)}</p>
        <p><strong>Hora de fin:</strong> {formatTime(END_TIME)}</p>
        <p><strong>Área de conocimiento:</strong> {KNOWLEDGE_AREA}</p>
        <p><strong>Sección:</strong> {SECTION}</p>
        <p><strong>Estado:</strong> {STATUS}</p>
        <p><strong>Nivel educativo:</strong> {EDUCATION_LEVEL}</p>
        <button className="button" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ClassScheduleModal;

import React, { useEffect, useState } from 'react';
import placeholderIcon from '../../assets/placeholder.png';
import speechIcon from '../../assets/speech.png'; // Importamos el icono de tardanza
import API_ENDPOINTS from '../../routes/apiEndpoints';
import './ClassCard.scss';

const ClassCard = ({ schedule, onCardClick }) => {
  const { CLASS_SCHEDULE_ID, SUBJECT, NRC, TYPE, START_TIME, END_TIME } = schedule;
  const [attendanceInfo, setAttendanceInfo] = useState(null);

  useEffect(() => {
    const fetchAttendanceInfo = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.GET_CLASS_SCHEDULE_ATTENDANCE}/${CLASS_SCHEDULE_ID}`);
        const data = await response.json();

        if (response.ok) {
          setAttendanceInfo(data[0]); // Usamos el primer registro, asumir que solo se tiene uno por clase
        } else {
          console.error("Error al obtener la asistencia:", data.message || data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud de asistencia:", error);
      }
    };

    fetchAttendanceInfo();
  }, [CLASS_SCHEDULE_ID]);

  // Función para formatear tiempo de "Hora de inicio" y "Hora de fin" que viene con fecha completa
  const formatFullDateTime = (time) => {
    if (!time) return '';  // Manejo para tiempos nulos

    const date = new Date(time);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Función para formatear tiempo de "Hora de registro Inicio" y "Hora de registro Fin" que viene solo con la hora
  const formatTimeOnly = (time) => {
    if (!time) return '';  // Manejo para tiempos nulos

    const [hours, minutes, seconds] = time.split(':');
    const date = new Date();
    date.setHours(hours, minutes, seconds);
    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="class-card">
      <div className="card-header">
        <img src={placeholderIcon} alt="Icono" className="icon" onClick={(e) => {
          e.stopPropagation();
          onCardClick(); // Solo el icono abre el modal
        }} />
      </div>
      <div className="card-content">
        <h3>{SUBJECT}</h3>
        <p><strong>NRC:</strong> {NRC}</p>
        <p><strong>Tipo:</strong> {TYPE}</p>
        <p>
          <strong>Hora de inicio:</strong> {formatFullDateTime(START_TIME)}
          {attendanceInfo?.ENTRY_TIME && (
            <span className="aligned-right">
              <strong>Hora de registro Inicio:</strong> {formatTimeOnly(attendanceInfo.ENTRY_TIME)}{' '}
              {attendanceInfo.LATE_ENTRY === 'SI' && <span className="late-text">(Tarde <img src={speechIcon} alt="Tarde" className="late-icon" />)</span>}
            </span>
          )}
        </p>
        <p>
          <strong>Hora de fin:</strong> {formatFullDateTime(END_TIME)}
          {attendanceInfo?.EXIT_TIME && (
            <span className="aligned-right">
              <strong>Hora de registro Fin:</strong> {formatTimeOnly(attendanceInfo.EXIT_TIME)}{' '}
              {attendanceInfo.LATE_EXIT === 'SI' && <span className="late-text">(Tarde <img src={speechIcon} alt="Tarde" className="late-icon" />)</span>}
            </span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ClassCard;

import React, { useEffect, useState } from 'react';
import placeholderIcon from '../../assets/placeholder.png';
import speechIcon from '../../assets/speech.png'; // Import tardiness icon
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

        if (response.ok && data.length > 0) {
          setAttendanceInfo(data[0]); // Assume only one attendance record per class
        } else if (!response.ok) {
          console.error("Error fetching attendance:", data.message || data.error);
        } else {
          console.warn(`No attendance records found for CLASS_SCHEDULE_ID ${CLASS_SCHEDULE_ID}`);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
      }
    };

    fetchAttendanceInfo();
  }, [CLASS_SCHEDULE_ID]);

  // Function to manually adjust and format the time
  const formatFullDateTime = (time) => {
    if (!time) return '';  // Handle null times

    const date = new Date(time);
    date.setHours(date.getHours() - 7); // Manually subtract 5 hours to adjust for Ecuador timezone

    return date.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Function to format "Record Start Time" and "Record End Time" that comes only with time
  const formatTimeOnly = (time) => {
    if (!time) return '';  // Handle null times

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
    <div className="class-card" onClick={onCardClick}>
      <div className="card-header">
        <img src={placeholderIcon} alt="Icon" className="icon" />
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

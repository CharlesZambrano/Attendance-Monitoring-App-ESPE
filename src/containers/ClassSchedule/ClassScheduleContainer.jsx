import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fondo from '../../assets/fondo.jpeg';
import ClassCard from '../../components/ClassCard/ClassCard';
import ClassScheduleModal from '../../components/ClassScheduleModal/ClassScheduleModal';
import API_ENDPOINTS from '../../routes/apiEndpoints';
import './ClassScheduleContainer.scss';

const ClassScheduleContainer = () => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [attendanceResult, setAttendanceResult] = useState(null); // Guardar el resultado del registro de asistencia
  
  const location = useLocation();
  const professorId = location.state?.professorId;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.GET_CLASS_SCHEDULES}/${professorId}`);
        const data = await response.json();
        
        if (response.ok) {
          setSchedules(data);
        } else {
          console.error("Error al obtener los horarios de clase:", data.message || data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud de horarios de clase:", error);
      }
    };

    fetchSchedules();
  }, [professorId]);

  const handleCardClick = async (schedule) => {
    const currentDate = new Date();
    const requestBody = {
      CLASS_SCHEDULE_ID: schedule.CLASS_SCHEDULE_ID,
      PROFESSOR_ID: professorId,
      REGISTER_DATE: currentDate.toISOString().split('T')[0], // YYYY-MM-DD
      TIME: currentDate.toISOString() // Fecha y hora en formato ISO
    };

    try {
      const response = await fetch(API_ENDPOINTS.REGISTER_ATTENDANCE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      const result = await response.json();
      setAttendanceResult(result);

      if (!response.ok) {
        console.error("Error al registrar la asistencia:", result.message || result.error);
      }

    } catch (error) {
      console.error("Error en la solicitud de registro de asistencia:", error);
    }

    setSelectedSchedule(schedule);
  };

  const handleCloseModal = () => {
    setSelectedSchedule(null);
    setAttendanceResult(null); // Limpiar el resultado al cerrar el modal
  };

  return (
    <div className="class-schedule-container" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="class-schedule-list">
        {schedules.map(schedule => (
          <ClassCard 
            key={schedule.CLASS_SCHEDULE_ID}
            schedule={schedule}
            onCardClick={() => handleCardClick(schedule)} // Al hacer clic en el card, registrar asistencia
          />
        ))}
      </div>
      {attendanceResult && (
        <ClassScheduleModal
          schedule={selectedSchedule}
          onClose={handleCloseModal}
          result={attendanceResult} // Pasar el resultado al modal
        />
      )}
    </div>
  );
};

export default ClassScheduleContainer;

import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import fondo from '../../assets/fondo.jpeg';
import ClassCard from '../../components/ClassCard/ClassCard';
import ModalResult from '../../components/Common/ModalResult';
import API_ENDPOINTS from '../../routes/apiEndpoints';
import './ClassScheduleContainer.scss';

const ClassScheduleContainer = () => {
  const [schedules, setSchedules] = useState([]);
  const [attendanceResult, setAttendanceResult] = useState(null); // Guardar el resultado del registro de asistencia
  const [isModalOpen, setIsModalOpen] = useState(false); // Controlar la visibilidad del modal

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

    // Convertimos la fecha y hora actuales a la zona horaria de Ecuador
    const timeZone = 'America/Guayaquil';
    const zonedDate = toZonedTime(currentDate, timeZone);

    const requestBody = {
      CLASS_SCHEDULE_ID: schedule.CLASS_SCHEDULE_ID,
      PROFESSOR_ID: professorId,
      REGISTER_DATE: format(zonedDate, 'yyyy-MM-dd'), // Formato de la fecha con la zona horaria de Ecuador
      TIME: format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") // Fecha y hora en formato ISO UTC con el sufijo 'Z'
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

      setIsModalOpen(true); // Mostrar el modal tanto para éxito como para error

    } catch (error) {
      console.error("Error en la solicitud de registro de asistencia:", error);
      setAttendanceResult({ error: "Ocurrió un error inesperado. Por favor, intenta de nuevo más tarde." });
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setAttendanceResult(null); // Limpiar el resultado al cerrar el modal
    setIsModalOpen(false); // Cerrar el modal
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
      {isModalOpen && attendanceResult && (
        <ModalResult
          result={attendanceResult}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ClassScheduleContainer;

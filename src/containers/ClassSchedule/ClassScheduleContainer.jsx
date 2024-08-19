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
  
  const location = useLocation();
  const professorId = location.state?.professorId;

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await fetch(`${API_ENDPOINTS.GET_CLASS_SCHEDULES}/${professorId}`);
        const data = await response.json();
        
        if (response.ok) {
          // Ordenar horarios por hora de inicio (START_TIME) de más temprano a más tarde
          const sortedSchedules = data.sort((a, b) => new Date(a.START_TIME) - new Date(b.START_TIME));
          setSchedules(sortedSchedules);
        } else {
          console.error("Error al obtener los horarios de clase:", data.message || data.error);
        }
      } catch (error) {
        console.error("Error en la solicitud de horarios de clase:", error);
      }
    };

    fetchSchedules();
  }, [professorId]);

  const handleCardClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  const handleCloseModal = () => {
    setSelectedSchedule(null);
  };

  return (
    <div className="class-schedule-container" style={{ backgroundImage: `url(${fondo})` }}>
      <div className="class-schedule-list">
        {schedules.map(schedule => (
          <ClassCard 
            key={schedule.CLASS_SCHEDULE_ID}
            schedule={schedule}
            onCardClick={() => handleCardClick(schedule)}
          />
        ))}
      </div>
      {selectedSchedule && (
        <ClassScheduleModal
          schedule={selectedSchedule}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ClassScheduleContainer;

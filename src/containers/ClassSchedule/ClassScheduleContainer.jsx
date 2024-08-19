import React, { useEffect, useState } from 'react';
import fondo from '../../assets/fondo.jpeg';
import ClassCard from '../../components/ClassCard/ClassCard';
import ClassScheduleModal from '../../components/ClassScheduleModal/ClassScheduleModal'; // Importando ClassScheduleModal
import API_ENDPOINTS from '../../routes/apiEndpoints';
import './ClassScheduleContainer.scss';

const ClassScheduleContainer = ({ professorId }) => {
  const [schedules, setSchedules] = useState([]);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

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

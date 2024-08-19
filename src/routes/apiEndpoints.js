const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  DETECT: `${API_BASE_URL}/detect`,
  RECOGNIZE: `${API_BASE_URL}/recognize`,
  GET_PROFESSOR_BY_ID_CARD: `${API_BASE_URL}/professor/id_card`,
  GET_CLASS_SCHEDULES: `${API_BASE_URL}/class-schedules`, // Endpoint para obtener horarios de clase
  GET_CLASS_SCHEDULE_ATTENDANCE: `${API_BASE_URL}/class_schedule_attendance`, // Endpoint para obtener asistencia por ID de horario
  REGISTER_ATTENDANCE: `${API_BASE_URL}/class_schedule_attendance`, // Endpoint para registrar asistencia
};

export default API_ENDPOINTS;

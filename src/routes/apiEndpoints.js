const API_BASE_URL = 'http://localhost:5000';

export const API_ENDPOINTS = {
  DETECT: `${API_BASE_URL}/detect`,
  RECOGNIZE: `${API_BASE_URL}/recognize`,
  GET_PROFESSOR_BY_ID_CARD: `${API_BASE_URL}/professor/id_card`,
  GET_CLASS_SCHEDULES: `${API_BASE_URL}/class-schedules`,  // Añadimos el endpoint para obtener horarios
};

export default API_ENDPOINTS;

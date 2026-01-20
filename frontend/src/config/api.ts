export const API_BASE_URL = 'http://localhost:3001/api';
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    UPDATE_PASSWORD: '/auth/password',
    ME: '/auth/me',
    GET_ALL_USERS: '/auth/users',
    UPDATE_USER_STATUS: '/auth/status/',
  },
  VEHICLES: {
    GET_ALL: '/vehicules',
    GET_BY_ID: '/vehicules/',
    CREATE: '/vehicules/create',
    UPDATE_INFO: '/vehicules/update/',
    UPDATE_STATUS: '/vehicules/status/',
    DELETE: '/vehicules/delete/',
  },
  RESERVATIONS: {
    CREATE: '/reservations/create',
    GET_USER: '/reservations/user',
    CANCEL: '/reservations/cancel/',
    GET_ALL: '/reservations/all',
  },
};

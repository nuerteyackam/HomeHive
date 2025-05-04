import axiosInstance from '../utils/axios';

const setAuthToken = (token) => {
  if (token) {
    console.log('Setting auth token:', token.substring(0, 10) + '...');
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('Headers after setting token:', axiosInstance.defaults.headers.common);
  } else {
    console.log('Removing auth token');
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
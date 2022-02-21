import axios from 'axios';
import { getSessionCookie } from 'utils/cookies';

axios.defaults.baseURL = process.env.NODE_ENV === 'production'
  ? 'https://girassol-de-asfalto.herokuapp.com'
  : 'http://localhost:8445';

axios.interceptors.request.use(function (config) {
  const token = getSessionCookie(); 

  if (config.headers && token) {
    config.headers.Authorization = `bearer ${token}`;
  }

  return config;
});

export default axios;

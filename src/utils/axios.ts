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

async function searchBooks(search: string) {
  return await axios({
    method: 'get',
    baseURL: '',
    url: 'https://www.googleapis.com/books/v1/volumes',
    params: {
      q: search,
      token: process.env.GAPI_KEY,
    }
  });
}

export default axios;
export { searchBooks };

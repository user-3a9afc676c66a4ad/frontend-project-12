import axios from 'axios';
import { routes } from '../routes';

const apiClient = axios.create();

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const newConfig = {
      ...config,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      },
    };
    return newConfig;
  }
  return config;
});
// prettier-ignore
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && window.location.pathname !== routes.login()) {
      localStorage.removeItem('token');
      window.location.href = routes.login();
    }
    return Promise.reject(error);
  },
);

export default apiClient;

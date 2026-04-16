import axios from 'axios';
import { userManager } from '../auth/keycloak.config';

export const apiClient = axios.create({
  baseURL: '/bff',
});

apiClient.interceptors.request.use(async (config) => {
  const user = await userManager.getUser();
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

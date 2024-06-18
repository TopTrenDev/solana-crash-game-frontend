import axios, { AxiosRequestConfig } from 'axios';

// ----------------------------------------------------------------------
const accessKey = import.meta.env.VITE_APP_ACCESS_TOKENKEY!;

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_BACKEND_ENDPOINT}`
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['X-TIMEZONE'] = -new Date().getTimezoneOffset() / 60;
    return config;
  },
  (err) => {
    throw new Error(err);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || 'Something went wrong'
    )
);

export default axiosInstance;

// ----------------------------------------------------------------------
export const axiosGet = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

export const axiosPost = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.post(url, config?.data, config);

  return res.data;
};

export const axiosPut = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.put(url, config?.data, config);

  return res.data;
};

export const axiosDelete = async (
  args: string | [string, AxiosRequestConfig]
) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.delete(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const getAccessToken = (): string => {
  if (window) {
    const token = localStorage.getItem(accessKey);
    return token || '';
  }
  return '';
};

export const getUserData = (): string => {
  if (window) {
    const userData = localStorage.getItem('userData');
    return userData || '';
  }
  return '';
};

export const setAccessToken = (token: string): void => {
  if (window && token !== '') {
    localStorage.setItem(accessKey, token);
  }
};

export const setUserData = (userData: any): void => {
  if (window && userData !== '') {
    localStorage.setItem('userData', userData);
  }
};

export const removeAllTokens = (): void => {
  if (window) {
    localStorage.removeItem(accessKey);
    localStorage.removeItem('userData');
  }
};

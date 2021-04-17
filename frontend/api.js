import axios from "axios";
import { BASE_URL, HttpCode, TIMEOUT } from "./const";

export const API = (baseURL, timeout) => {
  const api = axios.create({
    baseURL,
    timeout,
  });

  const onSuccess = (response) => {
    return response;
  };

  const onFail = (err) => {
    if (err.response.status === HttpCode.BAD_REQUEST) {
      // onLoginFail();
      return;
    }

    throw err;
  };

  api.interceptors.response.use(onSuccess, onFail);

  return api;
};

export default new API(BASE_URL, TIMEOUT);

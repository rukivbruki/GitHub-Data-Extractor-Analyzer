import axios from "axios";
import { BASE_URL, TIMEOUT, HttpCode } from "@/const";

const Api = (baseURL, timeout) =>
  axios.create({
    baseURL,
    timeout,
  });

const onSuccess = (response) => {
  return response;
};

const onFail = (err) => {
  if (err.response.status === HttpCode.BAD_REQUEST) {
    return;
  }
  throw err;
};

axios.interceptors.response.use(onSuccess, onFail);

export default Api(BASE_URL, TIMEOUT);

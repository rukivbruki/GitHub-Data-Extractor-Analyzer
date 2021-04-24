import api from "./Api";
import { rs } from "@/utils/getRandomStr";

class ApiServe {
  getData(serviceName) {
    return api.get(`/api/${serviceName}/data`, {
      params: {
        id: rs,
      },
    });
  }

  startService(serviceName, data) {
    data.id = rs;
    return api
      .post(`/api/${serviceName}`, data)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}

export default new ApiServe();

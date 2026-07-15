import axios from 'axios';
import { readUserData } from "./utils/auth";


// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Add Token to all requests
    let user = readUserData();
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });


// Add a response interceptor
axios.interceptors.response.use(function (response) {

    return response;
  }, function (error) {
    // 401s are handled by the screens that need auth — no global redirect.
    return Promise.reject(error);
  });

export default axios;
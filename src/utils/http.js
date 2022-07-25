import axios from "axios";
// import { store } from "store";

// const apiURL = "https://fishermanscove-resort.com/test/public/api";
const apiURL = "https://www.pigeonarabia.com/APIs/public/api";
const API = axios.create({
  baseURL: apiURL,
  timeout: 60000,
});

// API.interceptors.request.use((request) => {
//   if (request) {
//     store.dispatch({ type: "SHOW_SPINNER" });
//     //perform the manipulation here and change the request object
//     // alert("request called")
//   }
//   return {
//     ...request,
//     onUploadProgress: function(progressEvent){
//       console.log(Math.round( (progressEvent.loaded * 100) / progressEvent.total ))
//     }
//   };
// }, (error) => {
//   console.log("interceptor request ERROR", error)
//   store.dispatch({ type: "HIDE_SPINNER" })
//
//   return Promise.reject(error.message);
// });
//
//
// API.interceptors.response.use((response) => {
//   store.dispatch({ type: "HIDE_SPINNER" })
//
//   if (response) {
//     //perform the manipulation here and change the response object
//   }
//   return response;
// }, (error) => {
//   console.log("interceptor response ERROR", error)
//   store.dispatch({ type: "HIDE_SPINNER" })
//
//   if (error.response?.status === 401) {
//     // history.replace("/authentication/logout");
//   }
//   return Promise.reject(error.message);
// });

export default API;

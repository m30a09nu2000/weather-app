import axios from "axios";

const apiEndPoint = process.env.REACT_APP_API_ENDPOINT;

console.log(apiEndPoint);

export const axiosPrivate = axios.create({
  baseURL: apiEndPoint,
  headers: { Accept: "application/json" },
  withCredentials: true,
});

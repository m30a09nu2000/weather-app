import { axiosPrivate } from "./Interceptor";

const geoData = (loc) => {
  console.log(loc);
  return axiosPrivate.get();
};

const weatherApi = {
  geoData,
};

export default weatherApi;

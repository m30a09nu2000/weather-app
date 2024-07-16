import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import axios from "axios";
import "./WeatherData.css";
import { images } from "./Images";
import humidity from "../assets/img/icons/humidity.png";
import main from "../assets/img/main.jpg";
import wind from "../assets/img/icons/wind.png";
import pressure from "../assets/img/icons/pressure.jpg";
import { Triangle } from "react-loader-spinner";
import Swal from "sweetalert2";

const schema = Yup.object().shape({
  location: Yup.string().required("location required"),
});
function WeatherData() {
  const [location, setLocation] = useState({
    lat: "",
    lon: "",
  });

  const [weatherData, setWeatherData] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const formData = (data) => {
    if (data) {
      fetchGeoData(data.location);
      reset();
    } else {
      Swal.fire({
        title: "",
        text: "Do you want to continue",
        icon: "error",
        confirmButtonText: "Cool",
      });
    }
  };

  const fetchGeoData = async (loc) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GEO_LOCATION_API}?q=${loc}&appid=${process.env.REACT_APP_API_KEY}`
      );
      console.log(response);
      if (response && response.data.length > 0) {
        const data = response.data[0];
        console.log(data);
        setLocation({
          lat: data.lat,
          lon: data.lon,
        });
        fetchWeatherData(data.lat, data.lon);
      } else {
        Swal.fire({
          text: "Location not found",
          icon: "error",
          showConfirmButton: false,
          timer: 2000,
        });
        setWeatherData("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWeatherData = async (lat, lon) => {
    setLoading(true);
    setWeatherData("");

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_WEATHER_API}?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_API_KEY}`
      );
      if (response.data) {
        setTimeout(() => {
          setLoading(false);
          setWeatherData(response?.data);
        }, 1000);

        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const kelvinToCelsius = (kelvin) => {
    return kelvin - 273.15;
  };

  return (
    <div className="create-post-container">
      {loading && (
        <div className="overlay">
          <Triangle
            height="80"
            width="80"
            color="black"
            ariaLabel="triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
          />
        </div>
      )}

      <div
        className="weather-container"
        style={{
          backgroundImage: weatherData
            ? `url(${images[weatherData.weather[0].main]})`
            : `url(${main})`,
        }}
      >
        <div className="weather">
          <form onSubmit={handleSubmit(formData)}>
            <input
              type="text"
              placeholder="Enter Location..."
              {...register("location")}
              data-testid="location"
            />
            <span>{errors.location?.message}</span>
            <button
              type="submit"
              data-testid="searchbutton"
              disabled={!isValid}
            >
              Search
            </button>
          </form>
        </div>
        <div className="weatherdata">
          {weatherData ? (
            <>
              <h3>{weatherData.name}</h3>
              <p>{}</p>
              <img
                src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                alt="icon"
              />
              <h1>{kelvinToCelsius(weatherData.main.temp).toFixed(0)} °C</h1>
              <h4>{weatherData.weather[0]?.description}</h4>
              <br />
              {weatherData.rain && weatherData.rain["1h"] ? (
                <p>Rain in the last hour: {weatherData.rain["1h"]} mm</p>
              ) : (
                <p>No rain data found within the last hour.</p>
              )}
              <div className="moreinfo">
                <div className="info1">
                  <img
                    style={{ height: "50px", width: "50px" }}
                    src={pressure}
                    alt="pressure"
                  />
                  <span>Pressure</span>
                  <span>{weatherData.main?.pressure} hPa</span>
                </div>

                <div className="info2">
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={humidity}
                    alt="humidity"
                  />
                  <span>Humidity</span>
                  <span>{weatherData.main?.humidity}%</span>
                </div>

                <div className="info3">
                  <img
                    style={{ width: "50px", height: "50px" }}
                    src={wind}
                    alt="wind"
                  />
                  <span>Wind</span>
                  <span>{weatherData.wind?.speed} m/s</span>
                </div>
              </div>
            </>
          ) : (
            <p>No data found</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default WeatherData;

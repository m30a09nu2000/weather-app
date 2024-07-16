import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import react from "react";
import WeatherData from "./WeatherData";
import axios from "axios";

jest.mock("axios");

describe("weather test", () => {
  it("checks input data", async () => {
    const mockFetchWeatherData = jest.fn();
    const mockResponseData = [{ lat: 40.7128, lon: -74.006 }];
    render(<WeatherData />);
    expect(screen.getByTestId("searchbutton")).toBeDisabled();
    fireEvent.change(screen.getByTestId("location"), {
      target: { value: "kochi" },
    });
    await waitFor(() => {
      expect(screen.getByTestId("searchbutton")).toBeEnabled();
    });
    fireEvent.submit(screen.getByTestId("searchbutton"));

    await waitFor(() => {
      expect(mockFetchWeatherData).toHaveBeenCalledTimes(1);
    });
  });
});

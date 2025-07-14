"use client";

import { useState, useEffect } from "react";

interface WeatherData {
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  feelsLike: number;
}

export const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true);
        setError(null);

        const lat = -8.1525;
        const lon = 112.5183;

        let weatherData = null;

        try {
          const wttrResponse = await fetch(`https://wttr.in/Malang,Indonesia?format=j1`);
          if (wttrResponse.ok) {
            const wttrData = await wttrResponse.json();
            const current = wttrData.current_condition[0];
            weatherData = {
              temperature: parseInt(current.temp_C),
              description: current.weatherDesc[0].value,
              humidity: parseInt(current.humidity),
              windSpeed: parseInt(current.windspeedKmph),
              icon: current.weatherCode,
              feelsLike: parseInt(current.FeelsLikeC),
            };
          }
        } catch (error) {
          console.log("wttr.in failed, trying alternative...");
        }

        if (!weatherData) {
          try {
            const meteoResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m`);
            if (meteoResponse.ok) {
              const meteoData = await meteoResponse.json();
              const current = meteoData.current_weather;

              const getWeatherDescription = (code: number): string => {
                if (code <= 3) return "Clear sky";
                if (code <= 48) return "Cloudy";
                if (code <= 67) return "Rainy";
                if (code <= 77) return "Snowy";
                if (code <= 82) return "Rain showers";
                if (code <= 86) return "Snow showers";
                if (code <= 99) return "Thunderstorm";
                return "Clear sky";
              };

              weatherData = {
                temperature: Math.round(current.temperature),
                description: getWeatherDescription(current.weathercode),
                humidity: meteoData.hourly.relative_humidity_2m[0] || 75,
                windSpeed: Math.round(current.windspeed),
                icon: current.weathercode.toString(),
                feelsLike: Math.round(current.temperature + (current.windspeed > 10 ? -2 : 0)),
              };
            }
          } catch (error) {
            console.log("open-meteo failed, using fallback...");
          }
        }

        if (weatherData) {
          setWeather(weatherData);
        } else {
          throw new Error("All weather services failed");
        }
      } catch (err) {
        console.error("Error fetching weather:", err);
        setError("Gagal mengambil data cuaca");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();

    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { weather, loading, error };
};

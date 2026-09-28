import { fetchWithResilience, type ApiResponse } from './core';

export interface WeatherDetails {
  temperature: number;
  rain: number;
  advisory: string;
}

const fallbackWeather: WeatherDetails = {
  temperature: 28,
  rain: 12.5,
  advisory: "Moderate rain expected: plan site work accordingly."
};

export const fetchWeather = async (lat: number, lon: number): Promise<ApiResponse<WeatherDetails>> => {
  return fetchWithResilience(
    `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`,
    async () => {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,rain&daily=rain_sum&timezone=auto`);
      if (!response.ok) throw new Error('Weather API error');
      const data = await response.json();
      
      const rainSum = data.daily?.rain_sum?.[0] || 0;
      let advisory = "Clear weather expected.";
      if (rainSum > 20) advisory = "Heavy rain expected: delay outdoor foundation work.";
      else if (rainSum > 5) advisory = "Moderate rain expected: plan site work accordingly.";

      return {
        temperature: data.current?.temperature_2m || 0,
        rain: rainSum,
        advisory
      };
    },
    fallbackWeather,
    { cacheTtlMs: 1000 * 60 * 30 } // 30 min cache
  );
};

export interface AirQualityDetails {
  aqi: number;
  advisory: string;
}

const fallbackAqi: AirQualityDetails = {
  aqi: 65,
  advisory: "Moderate air quality. Standard dust control measures required during construction."
};

export const fetchAirQuality = async (lat: number, lon: number): Promise<ApiResponse<AirQualityDetails>> => {
  return fetchWithResilience(
    `aqi_${lat.toFixed(2)}_${lon.toFixed(2)}`,
    async () => {
      const response = await fetch(`https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=european_aqi`);
      if (!response.ok) throw new Error('AQI API error');
      const data = await response.json();
      
      const aqi = data.current?.european_aqi || 50;
      let advisory = "Good air quality.";
      if (aqi > 100) advisory = "Poor air quality. Strict dust suppression required on site.";
      else if (aqi > 60) advisory = "Moderate air quality. Standard dust control measures required during construction.";

      return { aqi, advisory };
    },
    fallbackAqi,
    { cacheTtlMs: 1000 * 60 * 60 } // 1 hour cache
  );
};

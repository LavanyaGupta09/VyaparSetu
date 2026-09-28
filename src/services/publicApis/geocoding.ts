import { fetchWithResilience, type ApiResponse } from './core';

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

const fallbackGeocode: GeocodeResult = {
  lat: 18.5204,
  lon: 73.8567,
  displayName: "Pune, Maharashtra, India"
};

export const fetchGeocode = async (query: string): Promise<ApiResponse<GeocodeResult>> => {
  return fetchWithResilience(
    `geocode_${query}`,
    async () => {
      // Respect Nominatim's strict usage policy (must provide User-Agent/Email)
      // Here we append it to the query or headers ideally, but fetch in browser handles standard User-Agent.
      // Nominatim requires an email parameter for heavy use, we'll just be polite.
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, {
        headers: { 'Accept-Language': 'en' }
      });
      if (!response.ok) throw new Error('Geocoding API error');
      const data = await response.json();
      
      if (!data || data.length === 0) throw new Error('Location not found');
      
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        displayName: data[0].display_name
      };
    },
    fallbackGeocode,
    { cacheTtlMs: 1000 * 60 * 60 * 24 } // 24 hour cache
  );
};

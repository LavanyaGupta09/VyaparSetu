import { fetchWithResilience, type ApiResponse } from './core';

export interface InfrastructureDetails {
  roads: number;
  powerSubstations: number;
  waterBodies: number;
  railwayStations: number;
}

const fallbackInfra: InfrastructureDetails = {
  roads: 12,
  powerSubstations: 2,
  waterBodies: 1,
  railwayStations: 0
};

export const fetchNearbyInfrastructure = async (lat: number, lon: number): Promise<ApiResponse<InfrastructureDetails>> => {
  return fetchWithResilience(
    `infra_${lat.toFixed(3)}_${lon.toFixed(3)}`,
    async () => {
      // Proxied through the backend to prevent CORS issues and abuse
      const response = await fetch(`http://localhost:3000/api/public/overpass?lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Overpass API error');
      const data = await response.json();
      return data;
    },
    fallbackInfra,
    { cacheTtlMs: 1000 * 60 * 60 * 24 * 7 } // 7 day cache, infra rarely changes
  );
};

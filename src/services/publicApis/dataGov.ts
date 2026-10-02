import { fetchWithResilience, type ApiResponse } from './core';
import { z } from 'zod';
import { ALLOWED_DATAGOV_RESOURCES } from '../../config/datagov';

export const DataGovRecordSchema = z.object({
  state: z.string().optional(),
  district: z.string().optional(),
  total_msme: z.number().or(z.string()).optional(),
  year: z.string().optional()
}).catchall(z.any());

export const DataGovResponseSchema = z.object({
  records: z.array(DataGovRecordSchema),
  total: z.number().optional()
}).catchall(z.any());

export type DataGovRecord = z.infer<typeof DataGovRecordSchema>;

const fallbackData = {
  records: [
    { state: "Maharashtra", district: "Pune", total_msme: 145000, year: "2023-24" },
    { state: "Maharashtra", district: "Mumbai", total_msme: 210000, year: "2023-24" },
    { state: "Maharashtra", district: "Thane", total_msme: 180000, year: "2023-24" },
    { state: "Maharashtra", district: "Nashik", total_msme: 85000, year: "2023-24" },
    { state: "Maharashtra", district: "Nagpur", total_msme: 62000, year: "2023-24" }
  ],
  total: 5
};

export const fetchGovDataStats = async (resourceId: string = '386ce542-8e39-4c4c-98e0-ddc28c2b5c56'): Promise<ApiResponse<typeof fallbackData>> => {
  if (!ALLOWED_DATAGOV_RESOURCES.includes(resourceId)) {
    console.error(`Resource ID ${resourceId} is not allow-listed in config.`);
    return { data: fallbackData, source: 'demo-fallback', fetchedAt: new Date().toISOString() };
  }

  return fetchWithResilience(
    `datagov_${resourceId}`,
    async () => {
      const response = await fetch(`/api/public/datagov?resource=${resourceId}&limit=100`);
      if (!response.ok) throw new Error('DataGov API error or rate limit');
      
      const rawData = await response.json();
      
      // Zod validation
      const parsedData = DataGovResponseSchema.parse(rawData);
      
      // Audit trail logging
      const auditLog = JSON.parse(localStorage.getItem('audit_trail') || '[]');
      auditLog.push({ action: 'DataGov API Fetch', resource: resourceId, timestamp: new Date().toISOString(), source: rawData.source || 'live' });
      localStorage.setItem('audit_trail', JSON.stringify(auditLog));

      return parsedData as typeof fallbackData;
    },
    fallbackData,
    { cacheTtlMs: 1000 * 60 * 60 * 24 } // 24 hours
  );
};

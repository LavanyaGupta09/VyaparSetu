import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchGovDataStats, DataGovResponseSchema } from '../src/services/publicApis/dataGov';

// Mock the global fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();
(global as any).localStorage = localStorageMock;

describe('Data.gov.in Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
  });

  it('validates response with zod schema', () => {
    const validData = {
      records: [
        { state: 'Maharashtra', district: 'Pune', total_msme: 145000 }
      ],
      total: 1
    };
    
    expect(() => DataGovResponseSchema.parse(validData)).not.toThrow();
  });

  it('falls back to demo data on API failure', async () => {
    (fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    const response = await fetchGovDataStats();
    expect(response.source).toBe('demo-fallback');
    expect(response.data.records.length).toBeGreaterThan(0);
    expect(response.data.records[0].state).toBe('Maharashtra');
  });

  it('uses live data when API succeeds', async () => {
    const mockLiveResponse = {
      records: [{ state: 'Maharashtra', district: 'Thane', total_msme: 180000 }],
      source: 'live'
    };

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockLiveResponse
    });

    const response = await fetchGovDataStats();
    expect(response.source).toBe('live');
    expect(response.data.records[0].district).toBe('Thane');
  });

  it('rejects unallowed resource IDs', async () => {
    const response = await fetchGovDataStats('unallowed-id-123');
    expect(response.source).toBe('demo-fallback');
    // Ensure fetch was not called for unallowed IDs
    expect(fetch).not.toHaveBeenCalled();
  });
});

# Data.gov.in Integration

This module integrates public statistics from `api.data.gov.in` into MAHA-SETU.

## Setup
1. Get an API key from [data.gov.in](https://data.gov.in).
2. Add `DATA_GOV_API_KEY=your_api_key_here` to the server-side `.env` file.
3. Add any approved resource IDs to `src/config/datagov.ts`.

## Fallback Strategy
Data.gov.in responses are cached in memory for 24 hours. 
If the API key is missing, rate-limited (429), or unavailable, the proxy and frontend resilience engine will automatically serve hardcoded demo data. 
The UI will never break. Look for the "Demo data (fallback)" label in the UI to confirm.

## Rules Enforced
- Allowed Resource IDs only.
- Strict Zod validation on API responses.
- No PII is sent to this public API.
- All fetches are recorded in the audit trail (`localStorage: audit_trail`).

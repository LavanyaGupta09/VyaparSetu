# Supabase Integration

MAHA-SETU uses Supabase for authentication, database (PostgreSQL), and secure document storage.

## Setup Instructions

1. Obtain your Supabase Project URL, Publishable Key, and Secret Key.
2. In the root directory, configure the `.env` file with these values:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   SUPABASE_SECRET_KEY=your_secret_key
   ```
3. Run the SQL schema and seed migrations located in `/supabase/migrations` against your Supabase project.
4. Ensure the `documents` storage bucket is created (private).

## Architecture & Security

- **Row Level Security (RLS)**: Enforced aggressively across all tables. Entrepreneurs can only see their own applications, while department officers can only see applications belonging to their department.
- **Consultant Mode**: Consultants are given secure access to their linked entrepreneur clients through the `clients` join table.
- **Offline / Demo Fallback**: MAHA-SETU utilizes a unified repository pattern (`IApplicationRepository`). If the `.env` keys are missing or the user chooses the "Try Interactive Demo" button, the UI gracefully falls back to `MockRepository`, which leverages `localStorage` to simulate the full application experience.
- **Audit Logging**: Every mutation through `SupabaseRepository` inserts an append-only entry into the `audit_logs` table for tracking.

-- Seed Data for MAHA-SETU
-- Used primarily for local development/testing.

INSERT INTO profiles (id, email, full_name, role, department) VALUES
  ('00000000-0000-0000-0000-000000000001', 'demo@entrepreneur.com', 'Rahul Sharma', 'entrepreneur', NULL),
  ('00000000-0000-0000-0000-000000000002', 'officer@maha.gov.in', 'Priya Desai', 'officer', 'MPCB'),
  ('00000000-0000-0000-0000-000000000003', 'admin@maha.gov.in', 'System Admin', 'admin', NULL)
ON CONFLICT (id) DO NOTHING;

INSERT INTO business_profiles (id, user_id, business_name, industry, registration_number, address) VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Shree Foods Pvt Ltd', 'Food Processing', 'UDYAM-MH-12-0012345', 'MIDC Chakan, Pune')
ON CONFLICT (id) DO NOTHING;

INSERT INTO applications (id, applicant_id, business_id, department, title, status, health, stage, readiness_score) VALUES
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'MPCB', 'Pollution Consent (CTE)', 'Pending Review', 'On Track', 'Verification', 95)
ON CONFLICT (id) DO NOTHING;

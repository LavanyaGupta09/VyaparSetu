-- ========================================================
-- MAHA-SETU Initial Schema & RLS Policies
-- ========================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT NOT NULL CHECK (role IN ('entrepreneur', 'officer', 'inspector', 'admin', 'consultant')),
    department TEXT, -- For officers/inspectors
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can read all profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin')
);
CREATE POLICY "Officers can read entrepreneur profiles" ON profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role IN ('officer', 'inspector', 'admin'))
);
-- Role assignments are done via secure backend functions or direct db access, not from client.

-- 2. CLIENTS (Consultant Mode)
CREATE TABLE clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    consultant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    entrepreneur_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(consultant_id, entrepreneur_id)
);
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- Clients Policies
CREATE POLICY "Consultants see own clients" ON clients FOR SELECT USING (consultant_id = auth.uid());
CREATE POLICY "Entrepreneurs see own consultant links" ON clients FOR SELECT USING (entrepreneur_id = auth.uid());

-- 3. BUSINESS PROFILES
CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    industry TEXT,
    registration_number TEXT, -- Masked/encrypted in app layer
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- Business Profiles Policies
CREATE POLICY "Users see own business" ON business_profiles FOR SELECT USING (
    user_id = auth.uid() OR 
    user_id IN (SELECT entrepreneur_id FROM clients WHERE consultant_id = auth.uid())
);
CREATE POLICY "Officers see all businesses" ON business_profiles FOR SELECT USING (
  EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'inspector', 'admin'))
);
CREATE POLICY "Users insert own business" ON business_profiles FOR INSERT WITH CHECK (user_id = auth.uid());

-- 4. APPLICATIONS
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'Draft',
    health TEXT DEFAULT 'On Track',
    stage TEXT DEFAULT 'Submission',
    readiness_score INT DEFAULT 0,
    predictive_delay INT,
    cost_of_delay INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Applications Policies
CREATE POLICY "Applicants see own applications" ON applications FOR ALL USING (
    applicant_id = auth.uid() OR 
    applicant_id IN (SELECT entrepreneur_id FROM clients WHERE consultant_id = auth.uid())
);
CREATE POLICY "Officers see department applications" ON applications FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin')) OR
    (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'inspector')) AND department = (SELECT department FROM profiles WHERE id = auth.uid()))
);

-- 5. APPLICATION EVENTS
CREATE TABLE application_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    description TEXT,
    created_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE application_events ENABLE ROW LEVEL SECURITY;

-- Application Events Policies
CREATE POLICY "Users see events for visible apps" ON application_events FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM applications a WHERE a.id = application_id AND (
            a.applicant_id = auth.uid() OR 
            a.applicant_id IN (SELECT entrepreneur_id FROM clients WHERE consultant_id = auth.uid()) OR
            EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('admin')) OR
            (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('officer', 'inspector')) AND a.department = (SELECT department FROM profiles WHERE id = auth.uid()))
        )
    )
);

-- 6. DOCUMENTS
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    document_type TEXT,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- 7. CONSENTS
CREATE TABLE consents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    granted_by UUID NOT NULL REFERENCES profiles(id),
    granted_to UUID NOT NULL REFERENCES profiles(id), -- Specific officer
    purpose TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE consents ENABLE ROW LEVEL SECURITY;

-- Documents Policies
CREATE POLICY "Owners see own docs" ON documents FOR ALL USING (
    owner_id = auth.uid() OR 
    owner_id IN (SELECT entrepreneur_id FROM clients WHERE consultant_id = auth.uid())
);
CREATE POLICY "Officers see consented docs" ON documents FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM consents c 
        WHERE c.document_id = id AND c.granted_to = auth.uid() AND c.expires_at > NOW()
    ) OR EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);

-- Consents Policies
CREATE POLICY "Users see own granted consents" ON consents FOR ALL USING (granted_by = auth.uid());
CREATE POLICY "Officers see consents granted to them" ON consents FOR SELECT USING (granted_to = auth.uid());

-- 8. DOCUMENT VERSIONS
CREATE TABLE document_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    file_path TEXT NOT NULL,
    version_number INT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE document_versions ENABLE ROW LEVEL SECURITY;

-- 9. QUERIES
CREATE TABLE queries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    raised_by UUID NOT NULL REFERENCES profiles(id),
    text TEXT NOT NULL,
    status TEXT DEFAULT 'Open',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);
ALTER TABLE queries ENABLE ROW LEVEL SECURITY;
-- Inherits application visibility logic (omitted for brevity but would match application_events)

-- 10. INSPECTIONS
CREATE TABLE inspections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    inspector_id UUID NOT NULL REFERENCES profiles(id),
    scheduled_date TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'Scheduled',
    report_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE inspections ENABLE ROW LEVEL SECURITY;

-- 11. GRIEVANCES
CREATE TABLE grievances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE grievances ENABLE ROW LEVEL SECURITY;

-- 12. CERTIFICATES
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    issued_by UUID NOT NULL REFERENCES profiles(id),
    file_url TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;

-- 13. NOTIFICATIONS
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON notifications FOR ALL USING (user_id = auth.uid());

-- 14. AUDIT LOGS
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT NOT NULL,
    resource_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert audit logs" ON audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins read audit logs" ON audit_logs FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
);
-- No UPDATE or DELETE policies -> append-only

-- 15. RULES & RULE VERSIONS
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE TABLE rule_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rule_id UUID NOT NULL REFERENCES rules(id) ON DELETE CASCADE,
    version INT NOT NULL,
    logic JSONB NOT NULL,
    active BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read rules" ON rules FOR SELECT USING (true);
CREATE POLICY "Everyone can read rule_versions" ON rule_versions FOR SELECT USING (true);

-- 16. FEEDBACK REPORTS
CREATE TABLE feedback_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE feedback_reports ENABLE ROW LEVEL SECURITY;

-- ========================================================
-- STORAGE (Documents Bucket)
-- ========================================================
-- We simulate the creation of the bucket using SQL (in reality, done via UI or migration script)
INSERT INTO storage.buckets (id, name, public) VALUES ('documents', 'documents', false) ON CONFLICT DO NOTHING;

-- Storage Policies (requires postgres extensions mapping to auth schema if ran directly, assuming standard Supabase setup)
CREATE POLICY "Users can upload their own documents" ON storage.objects FOR INSERT WITH CHECK (
    bucket_id = 'documents' AND auth.uid()::text = (string_to_array(name, '/'))[1]
);
CREATE POLICY "Users can read own documents" ON storage.objects FOR SELECT USING (
    bucket_id = 'documents' AND auth.uid()::text = (string_to_array(name, '/'))[1]
);
-- Note: Further complex sharing relies on signed URLs generated backend-side using Service Role Key.

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardRouter from './pages/DashboardRouter';
import ApprovalRoadmap from './pages/ApprovalRoadmap';
import DocumentVault from './pages/DocumentVault';
import ComplianceCalendar from './pages/ComplianceCalendar';
import SchemeMatch from './pages/SchemeMatch';
import MitraAI from './pages/MitraAI';
import ComingSoon from './pages/ComingSoon';
import ApplicationForm from './pages/ApplicationForm';
import RulesRegistry from './pages/RulesRegistry';
import WhatIfSimulator from './pages/WhatIfSimulator';
import CertificateView from './pages/CertificateView';
import VerifyCertificate from './pages/VerifyCertificate';
import ConsentLedger from './pages/ConsentLedger';
import SiteAdvisor from './pages/SiteAdvisor';
import ProcessVisualizer from './pages/ProcessVisualizer';
import DataSources from './pages/DataSources';
import MyApplications from './pages/MyApplications';
import { CommandPalette } from './components/CommandPalette';
import { UserRoleProvider } from './context/UserRoleContext';
import { DemoControlProvider } from './context/DemoControlContext';
import './i18n';

function App() {
  return (
    <UserRoleProvider>
      <DemoControlProvider>
        <BrowserRouter>
          <CommandPalette />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/verify/:id" element={<VerifyCertificate />} />
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardRouter />} />
              <Route path="/roadmap" element={<ApprovalRoadmap />} />
              <Route path="/roadmap/what-if" element={<WhatIfSimulator />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/documents" element={<DocumentVault />} />
              <Route path="/calendar" element={<ComplianceCalendar />} />
              <Route path="/schemes" element={<SchemeMatch />} />
              <Route path="/ai" element={<MitraAI />} />
              <Route path="/application" element={<ApplicationForm />} />
              <Route path="/certificate/:id" element={<CertificateView />} />
              <Route path="/admin/rules" element={<RulesRegistry />} />
              <Route path="/settings/consent" element={<ConsentLedger />} />
              <Route path="/settings/data" element={<DataSources />} />
              <Route path="/advisor" element={<SiteAdvisor />} />
              <Route path="/bpr" element={<ProcessVisualizer />} />
              <Route path="*" element={<ComingSoon />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </DemoControlProvider>
    </UserRoleProvider>
  );
}

export default App;

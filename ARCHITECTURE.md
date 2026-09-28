# MAHA-SETU Phase 2 Architecture

## 1. Unified Shared State (The Data Model)
All features in Phase 2 plug into a unified state to avoid isolated pages. The state is extended to include:
- `rules` & `ruleVersions`: Powers the dynamic rules engine.
- `scenarios`: In-memory copies of user profiles for the What-If Simulator.
- `costProfile`: Financial metrics for the Cost-of-Delay Calculator.
- `consents`: Ledger of document access permissions.
- `certificates`: Issued QR-verifiable certificates.
- `integrations`: Status of external API adapters.
- `feedbackReports`, `locale`, `accessibilityPrefs`, `demoControlLog`.

## 2. Dynamic Rules Engine (`/src/engine`)
Replaces hardcoded component logic with a data-driven engine.
- **Data Source**: JSON registries (`approvals.json`, `conditions.json`).
- **Evaluator**: A safe TypeScript-based expression evaluator (`evaluateProfile`) that computes applicability and dependencies.
- **Explainability Trace**: Every evaluation returns a trace (matched rule, inputs used, version) that feeds into the `<ExplainPanel />`.

## 3. Localization (i18n) & Voice Layer
- **i18n Framework**: Implementation using `react-i18next` with `en`, `hi`, `mr` resource files.
- **Voice**: Web Speech API (`SpeechRecognition` and `SpeechSynthesis`) built natively into the Mitra AI component.

## 4. Integration Adapter Layer (`/src/integrations`)
- Mock adapters (DigiLocker, Udyam, GST) returning realistic fictional data with artificial latency.
- Plugs directly into the Consent Ledger to enforce data-minimization and access control.

## 5. Security & Verification
- **Certificates**: Client-side PDF generation with QR encoding.
- **Verification**: Public, auth-free `/verify/:certId` route reading from the `certificates` store.
- **Disclaimers**: Global components enforcing "Simulated", "Demo Data", and "Authority verification required" labels.

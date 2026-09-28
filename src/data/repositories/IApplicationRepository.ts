export interface ApplicationData {
  id: string;
  applicant_id?: string;
  name: string;
  department: string;
  status: string;
  health: string;
  stage: string;
  slaDays: number;
  submittedAt: string;
  lastUpdated: string;
  readinessScore: number;
  pendingItems: string[];
  predictiveDelay: number | null;
  costOfDelay: number;
  industry: string;
}

export interface IApplicationRepository {
  getApplications(): Promise<ApplicationData[]>;
  getApplicationById(id: string): Promise<ApplicationData | null>;
  createApplication(app: Partial<ApplicationData>): Promise<ApplicationData>;
  updateApplication(id: string, updates: Partial<ApplicationData>): Promise<ApplicationData>;
  deleteApplication(id: string): Promise<void>;
  subscribeToChanges(callback: (apps: ApplicationData[]) => void): () => void;
}

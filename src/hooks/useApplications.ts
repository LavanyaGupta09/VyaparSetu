import { useState, useEffect } from 'react';
import { getApplicationRepository } from '../data/repositories';
import type { ApplicationData as Application } from '../data/repositories/IApplicationRepository';

export type AppStatus = 'Draft' | 'Submitted' | 'Action Required' | 'Approved' | 'Delayed';
export type AppHealth = 'On Track' | 'At Risk' | 'Delayed' | 'Waiting for Applicant' | 'Waiting for Department';
export type AppStage = 'Submitted' | 'Verification' | 'Review' | 'Inspection' | 'Decision';

export type { Application };

export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: () => void = () => {};

    const loadData = async () => {
      try {
        const repo = await getApplicationRepository();
        const data = await repo.getApplications();
        setApplications(data);

        unsubscribe = repo.subscribeToChanges((newData) => {
          setApplications(newData);
        });
      } catch (err) {
        console.error('Failed to load applications:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();

    return () => unsubscribe();
  }, []);

  const addApplication = async (app: Partial<Application>) => {
    const repo = await getApplicationRepository();
    await repo.createApplication(app);
  };

  const updateApplication = async (id: string, updates: Partial<Application>) => {
    const repo = await getApplicationRepository();
    await repo.updateApplication(id, updates);
  };

  const deleteApplication = async (id: string) => {
    const repo = await getApplicationRepository();
    await repo.deleteApplication(id);
  };

  return { applications, loading, addApplication, updateApplication, deleteApplication };
};

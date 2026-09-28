import type { IApplicationRepository, ApplicationData } from './IApplicationRepository';

export class MockRepository implements IApplicationRepository {
  private getStorage(): ApplicationData[] {
    const data = localStorage.getItem('maha_applications_v2');
    if (!data) return [];
    return JSON.parse(data);
  }

  private setStorage(data: ApplicationData[]) {
    localStorage.setItem('maha_applications_v2', JSON.stringify(data));
    window.dispatchEvent(new Event('storage'));
  }

  async getApplications(): Promise<ApplicationData[]> {
    return this.getStorage();
  }

  async getApplicationById(id: string): Promise<ApplicationData | null> {
    const apps = this.getStorage();
    return apps.find(a => a.id === id) || null;
  }

  async createApplication(app: Partial<ApplicationData>): Promise<ApplicationData> {
    const apps = this.getStorage();
    const newApp = { ...app, id: app.id || Math.random().toString() } as ApplicationData;
    this.setStorage([newApp, ...apps]);
    return newApp;
  }

  async updateApplication(id: string, updates: Partial<ApplicationData>): Promise<ApplicationData> {
    const apps = this.getStorage();
    let updatedApp: ApplicationData | null = null;
    const newApps = apps.map(app => {
      if (app.id === id) {
        updatedApp = { ...app, ...updates };
        return updatedApp;
      }
      return app;
    });
    if (!updatedApp) throw new Error('Not found');
    this.setStorage(newApps);
    return updatedApp;
  }

  async deleteApplication(id: string): Promise<void> {
    const apps = this.getStorage();
    this.setStorage(apps.filter(app => app.id !== id));
  }

  subscribeToChanges(callback: (apps: ApplicationData[]) => void): () => void {
    const handleStorage = () => callback(this.getStorage());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }
}

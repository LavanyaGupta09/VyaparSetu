import type { IApplicationRepository, ApplicationData } from './IApplicationRepository';
import { supabase } from '../../lib/supabase';

export class SupabaseRepository implements IApplicationRepository {
  
  async getApplications(): Promise<ApplicationData[]> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('applications').select('*').order('created_at', { ascending: false });
    if (error) throw error;
    
    // Map db fields to frontend structure (e.g., submitted_at to submittedAt)
    return data.map(this.mapFromDb);
  }

  async getApplicationById(id: string): Promise<ApplicationData | null> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('applications').select('*').eq('id', id).single();
    if (error) return null;
    return this.mapFromDb(data);
  }

  async createApplication(app: Partial<ApplicationData>): Promise<ApplicationData> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('applications').insert([this.mapToDb(app)]).select().single();
    if (error) throw error;
    
    this.logAudit('create', data.id);
    return this.mapFromDb(data);
  }

  async updateApplication(id: string, updates: Partial<ApplicationData>): Promise<ApplicationData> {
    if (!supabase) throw new Error('Supabase not configured');
    const { data, error } = await supabase.from('applications').update(this.mapToDb(updates)).eq('id', id).select().single();
    if (error) throw error;
    
    this.logAudit('update', id);
    return this.mapFromDb(data);
  }

  async deleteApplication(id: string): Promise<void> {
    if (!supabase) throw new Error('Supabase not configured');
    const { error } = await supabase.from('applications').delete().eq('id', id);
    if (error) throw error;
    
    this.logAudit('delete', id);
  }

  subscribeToChanges(callback: (apps: ApplicationData[]) => void): () => void {
    if (!supabase) return () => {};
    
    const subscription = supabase!
      .channel('public:applications')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'applications' }, () => {
        // Fetch new data and notify
        this.getApplications().then(callback).catch(console.error);
      })
      .subscribe();
      
    return () => {
      supabase!.removeChannel(subscription);
    };
  }

  private mapFromDb(row: any): ApplicationData {
    return {
      id: row.id,
      name: row.title,
      department: row.department,
      status: row.status,
      health: row.health,
      stage: row.stage,
      slaDays: 30, // Mocked for now, normally computed
      submittedAt: row.created_at,
      lastUpdated: row.updated_at,
      readinessScore: row.readiness_score,
      pendingItems: [],
      predictiveDelay: row.predictive_delay,
      costOfDelay: row.cost_of_delay,
      industry: 'Other',
    };
  }

  private mapToDb(app: Partial<ApplicationData>): any {
    const dbApp: any = {};
    if (app.name) dbApp.title = app.name;
    if (app.department) dbApp.department = app.department;
    if (app.status) dbApp.status = app.status;
    if (app.health) dbApp.health = app.health;
    if (app.stage) dbApp.stage = app.stage;
    if (app.readinessScore !== undefined) dbApp.readiness_score = app.readinessScore;
    if (app.predictiveDelay !== undefined) dbApp.predictive_delay = app.predictiveDelay;
    if (app.costOfDelay !== undefined) dbApp.cost_of_delay = app.costOfDelay;
    return dbApp;
  }

  private async logAudit(action: string, id: string) {
    if (!supabase) return;
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return;
    
    await supabase.from('audit_logs').insert([{
      user_id: userData.user.id,
      action: `application_${action}`,
      resource_type: 'applications',
      resource_id: id,
    }]);
  }
}

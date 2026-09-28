import React, { useState } from 'react';
import { Database, CheckCircle2, XCircle, RefreshCw, Server, AlertTriangle } from 'lucide-react';
import { fetchPincode, fetchIfsc, fetchGeocode, fetchWeather, fetchAirQuality, fetchNearbyInfrastructure, fetchGovDataStats } from '../services/publicApis';

const apiSources = [
  { id: 'pincode', name: 'India Post Pincode', endpoint: 'api.postalpincode.in', data: 'Pincode lookup', policy: 'No key required' },
  { id: 'ifsc', name: 'Razorpay IFSC', endpoint: 'ifsc.razorpay.com', data: 'Bank details lookup', policy: 'Rate limited' },
  { id: 'nominatim', name: 'OSM Nominatim', endpoint: 'nominatim.openstreetmap.org', data: 'Geocoding', policy: 'Max 1 req/sec' },
  { id: 'openmeteo', name: 'Open-Meteo Weather', endpoint: 'api.open-meteo.com', data: '7-day Forecast', policy: 'No key required' },
  { id: 'openmeteo_aqi', name: 'Open-Meteo AQI', endpoint: 'air-quality-api.open-meteo.com', data: 'Air Quality Index', policy: 'No key required' },
  { id: 'overpass', name: 'OSM Overpass (Proxied)', endpoint: 'overpass-api.de', data: 'Infrastructure POIs', policy: 'Strict caching applied' },
  { id: 'datagov', name: 'Data.gov.in (Proxied)', endpoint: 'data.gov.in', data: 'MSME Statistics', policy: 'API Key stored securely' },
  { id: 'supabase', name: 'Supabase Postgres', endpoint: 'https://oggbzuxjwlpmwcnaasup.supabase.co', data: 'Auth, User Profiles & DB', policy: 'Strict RLS & JWT' }
];

const DataSources = () => {
  const [statuses, setStatuses] = useState<Record<string, string>>({
    'pincode': 'Live',
    'ifsc': 'Cached',
    'nominatim': 'Live',
    'openmeteo': 'Live',
    'openmeteo_aqi': 'Live',
    'overpass': 'Cached',
    'datagov': 'Live',
  });
  
  const [loading, setLoading] = useState<string | null>(null);

  const testConnection = async (id: string) => {
    setLoading(id);
    setStatuses(prev => ({ ...prev, [id]: 'Testing...' }));
    
    try {
      let res: any;
      if (id === 'pincode') res = await fetchPincode('411001');
      if (id === 'ifsc') res = await fetchIfsc('HDFC0000001');
      if (id === 'nominatim') res = await fetchGeocode('Pune, Maharashtra');
      if (id === 'openmeteo') res = await fetchWeather(18.52, 73.85);
      if (id === 'openmeteo_aqi') res = await fetchAirQuality(18.52, 73.85);
      if (id === 'overpass') res = await fetchNearbyInfrastructure(18.52, 73.85);
      if (id === 'datagov') res = await fetchGovDataStats();
      if (id === 'supabase') {
        const { supabase, isSupabaseConfigured } = await import('../lib/supabase');
        if (!isSupabaseConfigured()) {
          res = { source: 'demo-fallback' };
        } else {
          // just a lightweight ping
          const { error } = await supabase!.from('profiles').select('id').limit(1);
          if (error && error.code !== 'PGRST116') throw error;
          res = { source: 'live' };
        }
      }
      
      setStatuses(prev => ({ 
        ...prev, 
        [id]: res?.source === 'demo-fallback' ? 'Fallback' : (res?.source === 'cache' ? 'Cached' : 'Live')
      }));
    } catch (e) {
      setStatuses(prev => ({ ...prev, [id]: 'Error' }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-accent" />
          Public Data Sources
        </h1>
        <p className="text-slate-500 text-sm mt-1">Manage and monitor the free public APIs integrated into MAHA-SETU.</p>
      </div>

      <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Privacy & Fallback Guaranteed</p>
          <p>No PII (PAN, Aadhaar, Names) is ever sent to these public APIs. If any API is unreachable, MAHA-SETU seamlessly falls back to bundled demo data.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-semibold">Service Name</th>
                <th className="p-4 font-semibold">Endpoint</th>
                <th className="p-4 font-semibold">Data Provided</th>
                <th className="p-4 font-semibold">Policy</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {apiSources.map((api) => (
                <tr key={api.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 font-medium text-slate-800 flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-400" /> {api.name}
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{api.endpoint}</td>
                  <td className="p-4 text-slate-600">{api.data}</td>
                  <td className="p-4 text-xs text-slate-500">{api.policy}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                      statuses[api.id] === 'Live' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      statuses[api.id] === 'Cached' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      statuses[api.id] === 'Testing...' ? 'bg-slate-50 text-slate-700 border-slate-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {statuses[api.id] === 'Live' ? <CheckCircle2 className="w-3.5 h-3.5" /> : 
                       statuses[api.id] === 'Cached' ? <Database className="w-3.5 h-3.5" /> :
                       statuses[api.id] === 'Testing...' ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> :
                       <XCircle className="w-3.5 h-3.5" />}
                      {statuses[api.id]}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => testConnection(api.id)}
                      disabled={loading === api.id}
                      className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 disabled:opacity-50 flex items-center gap-1.5 ml-auto"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading === api.id ? 'animate-spin text-accent' : ''}`} />
                      Test
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DataSources;

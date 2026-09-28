import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Info, AlertTriangle, ShieldCheck, CheckCircle2, TrendingDown, Factory, Search, CloudRain, Wind, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchGeocode, fetchWeather, fetchAirQuality, fetchNearbyInfrastructure, fetchGovDataStats } from '../services/publicApis';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const zones = [
  { id: 'midc-pune', name: 'MIDC Chakan (Pune)', type: 'Industrial', category: 'Orange', desc: 'Ideal for food processing and auto-components. Moderate pollution category.', approvals: 5 },
  { id: 'midc-nagpur', name: 'MIHAN SEZ (Nagpur)', type: 'SEZ', category: 'Green', desc: 'Non-polluting industries only. High export incentives available.', approvals: 3 },
  { id: 'midc-mumbai', name: 'TTC Industrial Area (Navi Mumbai)', type: 'Industrial', category: 'Red', desc: 'Heavy industries permitted. Strict environmental compliance required.', approvals: 8 },
];

const SiteAdvisor = () => {
  const navigate = useNavigate();
  const [selectedZone, setSelectedZone] = useState(zones[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationName, setLocationName] = useState(zones[0].name);
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState<[number, number]>([18.7500, 73.8500]);
  const [weatherData, setWeatherData] = useState<any>(null);
  const [aqiData, setAqiData] = useState<any>(null);
  const [infraData, setInfraData] = useState<any>(null);
  const [govStats, setGovStats] = useState<any>(null);

  const analyzeLocation = async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setLocationName(name);
    setMapCenter([lat, lon]);
    try {
      const [w, a, i, g] = await Promise.all([
        fetchWeather(lat, lon),
        fetchAirQuality(lat, lon),
        fetchNearbyInfrastructure(lat, lon),
        fetchGovDataStats()
      ]);
      setWeatherData(w);
      setAqiData(a);
      setInfraData(i);
      setGovStats(g);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.length < 3) return;
    setLoading(true);
    try {
      const geocode = await fetchGeocode(searchQuery + ', Maharashtra');
      await analyzeLocation(geocode.data.lat, geocode.data.lon, geocode.data.displayName);
    } catch (e) {
      alert("Location not found.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial fetch for default zone
    analyzeLocation(18.7500, 73.8500, zones[0].name);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-accent" />
          Site & Location Advisor
        </h1>
        <p className="text-slate-500 text-sm mt-1">Simulate how choosing different industrial zones impacts your regulatory compliance burden.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mock Map View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[600px] flex flex-col relative">
          <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/4/4e/Maharashtra_locator_map.svg')] bg-contain bg-no-repeat bg-center opacity-10 pointer-events-none"></div>
          
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 backdrop-blur-sm relative z-10">
            <h3 className="font-bold text-slate-800">Maharashtra Industrial Map</h3>
            <div className="flex items-center gap-4">
              <div className="flex gap-4 text-xs font-medium hidden md:flex">
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-emerald-500"></div> Green Zone</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Orange Zone</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Red Zone</span>
              </div>
              <form onSubmit={handleSearch} className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search location..." 
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-accent" 
                />
              </form>
            </div>
          </div>

          <div className="flex-1 relative z-0">
            <MapContainer key={mapCenter.join(',')} center={mapCenter} zoom={11} scrollWheelZoom={false} className="absolute inset-0 z-0">
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={mapCenter}>
                <Popup>Selected Location: {locationName}</Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white to-transparent pt-12 max-h-[300px] overflow-y-auto z-10 custom-scrollbar">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
              {zones.map(zone => (
                <div 
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedZone.id === zone.id 
                      ? 'border-accent bg-blue-50 shadow-md ring-4 ring-accent/10' 
                      : 'border-slate-200 bg-white hover:border-accent/50'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                      <Factory className="w-4 h-4 text-slate-400" />
                      {zone.name}
                    </h4>
                    <div className={`w-3 h-3 rounded-full shadow-sm ${
                      zone.category === 'Green' ? 'bg-emerald-500' : 
                      zone.category === 'Orange' ? 'bg-amber-500' : 'bg-red-500'
                    }`}></div>
                  </div>
                  <p className="text-xs text-slate-500 mb-3">{zone.desc}</p>
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded">{zone.type}</span>
                    <span className="text-primary-900">{zone.approvals} Required Approvals</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Intelligence Panel */}
        <div className="lg:col-span-1 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div 
              key={selectedZone.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-3 rounded-xl ${
                  selectedZone.category === 'Green' ? 'bg-emerald-100 text-emerald-600' : 
                  selectedZone.category === 'Orange' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                }`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-900 text-lg line-clamp-1" title={locationName}>{locationName}</h2>
                  <p className="text-sm text-slate-500">{selectedZone.category} Category Zone</p>
                </div>
              </div>

              {loading ? (
                <div className="p-8 text-center text-slate-400">Loading public data...</div>
              ) : (
                <div className="space-y-4">
                  
                  {/* Weather & AQI from Public APIs */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1"><CloudRain className="w-3.5 h-3.5"/> Weather</p>
                      <p className="text-lg font-bold text-slate-800">{weatherData?.data.temperature || '--'}°C</p>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{weatherData?.data.advisory}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                      <p className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1 mb-1"><Wind className="w-3.5 h-3.5"/> Air Quality</p>
                      <p className="text-lg font-bold text-slate-800">AQI: {aqiData?.data.aqi || '--'}</p>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{aqiData?.data.advisory}</p>
                    </div>
                  </div>

                  {/* Overpass Infra */}
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="text-xs font-bold text-primary-900 uppercase flex items-center gap-1 mb-2"><Zap className="w-3.5 h-3.5"/> Nearby Infrastructure</p>
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>Roads: <b>{infraData?.data.roads}</b></span>
                      <span>Substations: <b>{infraData?.data.powerSubstations}</b></span>
                      <span>Water: <b>{infraData?.data.waterBodies}</b></span>
                    </div>
                  </div>

                  {/* Public Data Insights (Data.gov.in) */}
                  {govStats && govStats.data?.records && (
                    <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100">
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xs font-bold text-indigo-900 uppercase flex items-center gap-1">
                          <Factory className="w-3.5 h-3.5"/> MSME Cluster Density
                        </p>
                        <span className="text-[9px] text-indigo-500 bg-indigo-100 px-1.5 rounded" title={`Fetched: ${new Date(govStats.fetchedAt).toLocaleString()}`}>
                          {govStats.source === 'live' ? 'Data.gov.in' : 'Demo Data (Fallback)'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1 text-xs text-slate-600">
                        <span>Total MSMEs in Maharashtra: <b>{govStats.data.records.reduce((acc: number, curr: any) => acc + (curr.total_msme || 0), 0).toLocaleString()}</b></span>
                        <span className="text-[10px] text-slate-500">Based on district-level public statistics.</span>
                      </div>
                    </div>
                  )}

                  {/* Zone Rules */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase">Impact on Roadmap</span>
                    <span className="text-lg font-bold text-primary-900">{selectedZone.approvals}</span>
                  </div>
                  {selectedZone.category === 'Red' && (
                    <p className="text-xs text-red-600 flex items-start gap-1">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Choosing a Red Zone adds 3 additional environmental clearances to your roadmap.
                    </p>
                  )}
                  {selectedZone.category === 'Green' && (
                    <p className="text-xs text-emerald-600 flex items-start gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                      Choosing a Green Zone exempts you from standard pollution NOCs.
                    </p>
                  )}
                  {selectedZone.category === 'Orange' && (
                    <p className="text-xs text-amber-600 flex items-start gap-1">
                      <Info className="w-3.5 h-3.5 shrink-0" />
                      Standard compliance applies for food processing units here.
                    </p>
                  )}
                </div>

                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                  <span className="text-xs font-bold text-emerald-600 uppercase flex items-center gap-1 mb-2">
                    <TrendingDown className="w-4 h-4" /> Cost Savings
                  </span>
                  <p className="text-sm font-medium text-emerald-800 mb-1">Estimated Stamp Duty Exemption</p>
                  <p className="text-2xl font-bold text-emerald-700">100%</p>
                  <p className="text-xs text-emerald-600 mt-1">Available in D+ zones under PSI 2019.</p>
                </div>

                <button 
                  onClick={() => navigate('/roadmap')}
                  className="w-full py-3 bg-accent text-white rounded-xl font-medium shadow-sm hover:bg-accent-hover transition-colors"
                >
                  Analyze This Location
                </button>
              </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default SiteAdvisor;

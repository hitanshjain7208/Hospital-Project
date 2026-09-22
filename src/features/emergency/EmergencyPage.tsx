import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  HeartPulse,
  Brain,
  Activity,
  Bone,
  Flame,
  Ambulance,
  Stethoscope,
  Baby,
  PhoneCall,
  Navigation,
  MapPin,
  ShieldAlert,
  Clock,
  Bed,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { EMERGENCY_CATEGORIES } from '../../services/mockData';
import { calculateHaversineDistance, formatDistance, estimateDriveTime } from '../../utils/haversine';
import { useToast } from '../../components/ui/Toast';

export const EmergencyPage: React.FC = () => {
  const { hospitals } = useAuth();
  const { location, requestLocation } = useLocation();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      case 'Brain': return <Brain className="w-6 h-6" />;
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'Bone': return <Bone className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Ambulance': return <Ambulance className="w-6 h-6" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6" />;
      case 'Baby': return <Baby className="w-6 h-6" />;
      default: return <ShieldAlert className="w-6 h-6" />;
    }
  };

  // Calculate distance & sort hospitals by proximity
  const sortedHospitals = hospitals
    .map((hosp) => {
      const userLat = location.latitude || 28.5355;
      const userLng = location.longitude || 77.2882;
      const dist = calculateHaversineDistance(userLat, userLng, hosp.latitude, hosp.longitude);
      return {
        ...hosp,
        distanceKm: dist,
        driveTime: estimateDriveTime(dist),
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);

  // Filter hospitals matching selected emergency category
  const filteredHospitals = sortedHospitals.filter((hosp) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ambulance') return hosp.hasAmbulance;
    return hosp.departments.some((d) => d.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      hosp.description.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Emergency Alert Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 p-6 sm:p-10 shadow-2xl shadow-red-600/30">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                Zero-Login Instant Triage
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                I Need Emergency Help
              </h1>

              <p className="text-white/90 text-sm sm:text-base leading-relaxed">
                Select your urgent medical condition below. We automatically locate nearby ER-equipped hospitals, real-time bed availability, and 1-click direct dispatcher calling.
              </p>
            </div>

            {/* GPS Location Status Box */}
            <div className="bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-white/20 w-full md:w-auto min-w-[280px]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400">
                  <MapPin className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Your Detected GPS</h4>
                  <p className="text-[11px] text-slate-300 font-mono">
                    {location.loading
                      ? 'Detecting GPS coordinates...'
                      : location.address || 'Sarita Vihar, New Delhi'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  requestLocation();
                  showToast('Location Refreshed', 'Recalculating distances to nearest hospital ERs.', 'info');
                }}
                className="mt-3 w-full py-2 px-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-semibold text-white flex items-center justify-center gap-2 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5" /> Re-detect My Location
              </button>
            </div>
          </div>
        </div>

        {/* 8 Required Emergency Categories Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-500" /> Select Emergency Category
            </h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs text-sky-400 hover:underline"
              >
                Clear Filter (Show All Hospitals)
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {EMERGENCY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(isSelected ? 'all' : cat.id)}
                  className={`p-3.5 rounded-2xl flex flex-col items-center text-center transition-all transform active:scale-95 border ${
                    isSelected
                      ? 'bg-gradient-to-b ' + cat.color + ' text-white border-white/40 shadow-lg scale-105'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl mb-2 ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-200'}`}>
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-xs font-bold leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearby Hospitals Sorted by Distance */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Nearby ER Hospitals
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-red-950 text-red-400 border border-red-800">
                  {filteredHospitals.length} Available
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Sorted by real-time Haversine proximity to your detected position.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHospitals.map((hosp) => (
              <motion.div
                key={hosp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-900 rounded-3xl p-6 border border-slate-800 hover:border-red-500/50 transition-all shadow-xl flex flex-col justify-between space-y-5"
              >
                <div>
                  {/* Top Badge Info */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-red-500/10 text-red-400 border border-red-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistance(hosp.distanceKm)} ({hosp.driveTime} drive)
                    </span>

                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-emerald-400" />
                      <strong className="text-emerald-400">{hosp.availableICUBeds}</strong> ICU Beds Free
                    </span>
                  </div>

                  <h4 className="text-xl font-bold text-white">{hosp.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    {hosp.address}, {hosp.city}
                  </p>

                  {/* Available Emergency Specialities */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                      Available Emergency Facilities:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {hosp.departments.map((dept, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
                        >
                          {dept}
                        </span>
                      ))}
                      {hosp.hasAmbulance && (
                        <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Ambulance className="w-3 h-3" /> 24/7 Ambulance
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Prompt requirement: One-click Call & One-click Google Maps Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:${hosp.emergencyNumber}`}
                    className="py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
                  >
                    <PhoneCall className="w-4 h-4 animate-bounce" /> Call ER ({hosp.emergencyNumber})
                  </a>

                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-2xl border border-slate-700 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-sky-400" /> Google Maps Nav
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

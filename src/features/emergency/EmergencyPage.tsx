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
      case 'HeartPulse': return <HeartPulse className="w-5 h-5" />;
      case 'Brain': return <Brain className="w-5 h-5" />;
      case 'Activity': return <Activity className="w-5 h-5" />;
      case 'Bone': return <Bone className="w-5 h-5" />;
      case 'Flame': return <Flame className="w-5 h-5" />;
      case 'Ambulance': return <Ambulance className="w-5 h-5" />;
      case 'Stethoscope': return <Stethoscope className="w-5 h-5" />;
      case 'Baby': return <Baby className="w-5 h-5" />;
      default: return <ShieldAlert className="w-5 h-5" />;
    }
  };

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

  const filteredHospitals = sortedHospitals.filter((hosp) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'ambulance') return hosp.hasAmbulance;
    return hosp.departments.some((d) => d.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      hosp.description.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 transition-colors" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-6xl space-y-12">

        {/* Emergency Alert Banner */}
        <div
          className="relative overflow-hidden rounded-[var(--r-lg)] p-8 sm:p-12 shadow-[var(--shadow-md)] animate-fade-up"
          style={{ background: 'var(--red-light)', border: '1px solid rgba(212, 106, 96, 0.2)' }}
        >
          {/* Ambient red glow behind banner */}
          <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-[var(--red)] opacity-10 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest"
                   style={{ background: '#FFFFFF', color: 'var(--red)', boxShadow: 'var(--shadow-xs)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--red)' }} />
                Instant Zero-Login Triage
              </div>

              <h1 className="display-font" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--red)' }}>
                Immediate Assistance
              </h1>

              <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                Select an urgent medical condition below. We will instantly locate nearby ER-equipped hospitals, real-time ICU availability, and provide 1-click dispatcher routing.
              </p>
            </div>

            {/* GPS Location Status Box */}
            <div className="card p-5 w-full md:w-auto min-w-[280px]" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--r-sm)] flex items-center justify-center" style={{ background: 'var(--green-light)' }}>
                  <MapPin className="w-5 h-5 animate-bounce" style={{ color: 'var(--green)' }} />
                </div>
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Detected GPS</h4>
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                    {location.loading ? 'Locating...' : location.address || 'Sarita Vihar, ND'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  requestLocation();
                  showToast('Location Refreshed', 'Recalculating distances to nearest hospital ERs.', 'info');
                }}
                className="mt-4 w-full py-2.5 rounded-[var(--r-sm)] text-xs font-semibold flex items-center justify-center gap-2 transition-all"
                style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; (e.currentTarget as HTMLElement).style.background = 'var(--green-light)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)'; }}
              >
                <Navigation className="w-3.5 h-3.5" /> Re-detect My Location
              </button>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-5 animate-fade-up-delay-1">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <ShieldAlert className="w-5 h-5" style={{ color: 'var(--red)' }} /> What is the emergency?
            </h2>
            {selectedCategory !== 'all' && (
              <button
                onClick={() => setSelectedCategory('all')}
                className="text-xs font-semibold hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Clear Selection
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
                  className={`p-4 rounded-[var(--r-md)] flex flex-col items-center justify-center text-center transition-all ${
                    isSelected ? 'shadow-[var(--shadow-md)] scale-[1.02]' : 'hover:scale-[1.02]'
                  }`}
                  style={{
                    background: isSelected ? 'var(--red)' : 'var(--bg-surface)',
                    border: `1px solid ${isSelected ? 'var(--red)' : 'var(--border)'}`,
                    color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  }}
                >
                  <div
                    className="mb-2 w-10 h-10 rounded-full flex items-center justify-center transition-colors"
                    style={{ background: isSelected ? 'rgba(255,255,255,0.2)' : 'var(--red-light)', color: isSelected ? '#FFFFFF' : 'var(--red)' }}
                  >
                    {getCategoryIcon(cat.iconName)}
                  </div>
                  <span className="text-[11px] font-bold leading-tight">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearby ER Hospitals */}
        <div className="space-y-6 animate-fade-up-delay-2 pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <div>
            <h3 className="display-font text-3xl flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
              Nearest Emergency Centers
              <span className="px-2.5 py-1 rounded-lg text-xs font-sans tracking-wide"
                    style={{ background: 'var(--red-light)', color: 'var(--red)' }}>
                {filteredHospitals.length} Found
              </span>
            </h3>
            <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
              Ranked by real-time driving proximity to your detected location.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredHospitals.map((hosp) => (
              <motion.div
                key={hosp.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 sm:p-8 flex flex-col justify-between space-y-6 group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="tag tag-red flex items-center gap-1.5 px-3 py-1.5 shadow-sm text-[11px]">
                      <Clock className="w-3.5 h-3.5" />
                      {formatDistance(hosp.distanceKm)} ({hosp.driveTime} drive)
                    </span>
                    <span className="text-xs font-semibold flex items-center gap-1.5" style={{ color: 'var(--sage)' }}>
                      <Bed className="w-4 h-4" />
                      <strong>{hosp.availableICUBeds}</strong> ICU Free
                    </span>
                  </div>

                  <h4 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{hosp.name}</h4>
                  <p className="text-sm mt-1 flex items-start gap-1.5" style={{ color: 'var(--text-muted)' }}>
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    {hosp.address}, {hosp.city}
                  </p>

                  <div className="mt-5 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
                    <div className="flex flex-wrap gap-2">
                      {hosp.departments.slice(0, 3).map((dept, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md text-[10px] font-semibold" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                          {dept}
                        </span>
                      ))}
                      {hosp.hasAmbulance && (
                        <span className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1" style={{ background: 'var(--gold-light)', color: 'var(--gold)' }}>
                          <Ambulance className="w-3 h-3" /> 24/7 Ambulance
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`tel:${hosp.emergencyNumber}`}
                    className="btn btn-emergency flex items-center justify-center gap-2 py-3.5 shadow-[var(--shadow-sm)]"
                  >
                    <PhoneCall className="w-4 h-4" /> Call ER ({hosp.emergencyNumber})
                  </a>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hosp.latitude},${hosp.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost flex items-center justify-center gap-2 py-3.5"
                  >
                    <Navigation className="w-4 h-4" /> Navigate
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

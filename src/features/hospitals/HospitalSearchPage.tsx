import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Filter,
  Star,
  MapPin,
  Building2,
  Stethoscope,
  Clock,
  Bed,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { calculateHaversineDistance, formatDistance } from '../../utils/haversine';

interface HospitalSearchPageProps {
  onSelectHospital: (id: string) => void;
  onSelectDoctor: (id: string) => void;
}

export const HospitalSearchPage: React.FC<HospitalSearchPageProps> = ({
  onSelectHospital,
  onSelectDoctor,
}) => {
  const { hospitals, doctors } = useAuth();
  const { location } = useLocation();

  const [activeTab, setActiveTab] = useState<'hospitals' | 'doctors'>('hospitals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [maxFee, setMaxFee] = useState(2000);
  const [maxDistanceKm, setMaxDistanceKm] = useState(50);

  // Compute distance for hospitals
  const enrichedHospitals = hospitals.map((hosp) => {
    const dist = calculateHaversineDistance(
      location.latitude || 28.5355,
      location.longitude || 77.2882,
      hosp.latitude,
      hosp.longitude
    );
    return { ...hosp, distanceKm: dist };
  });

  // Filter Hospitals
  const filteredHospitals = enrichedHospitals.filter((hosp) => {
    const matchesQuery =
      !searchQuery ||
      hosp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hosp.departments.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hosp.treatments.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
      hosp.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDepartment === 'all' ||
      hosp.departments.some((d) => d.toLowerCase() === selectedDepartment.toLowerCase());

    const matchesRating = hosp.rating >= minRating;
    const matchesDistance = hosp.distanceKm <= maxDistanceKm;

    return matchesQuery && matchesDept && matchesRating && matchesDistance;
  });

  // Filter Doctors
  const filteredDoctors = doctors.filter((doc) => {
    const matchesQuery =
      !searchQuery ||
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.hospitalName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept =
      selectedDepartment === 'all' ||
      doc.specialization.toLowerCase() === selectedDepartment.toLowerCase();

    const matchesRating = doc.rating >= minRating;
    const matchesFee = doc.consultationFee <= maxFee;

    return matchesQuery && matchesDept && matchesRating && matchesFee;
  });

  const departmentsList = [
    'all',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'Gastroenterology',
    'Emergency & Trauma',
  ];

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-7xl space-y-12">
        
        {/* Search Hero */}
        <div
          className="relative overflow-hidden rounded-[var(--r-lg)] p-8 sm:p-12 shadow-[var(--shadow-md)] animate-fade-up"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full pointer-events-none opacity-10"
               style={{ background: 'var(--green-light)', transform: 'translate(-20%, -30%)' }} />
          
          <div className="relative z-10 max-w-3xl space-y-5">
            <h1 className="display-font" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: 'var(--text-primary)' }}>
              Find Medical Experts
            </h1>
            <p className="text-sm font-medium leading-relaxed max-w-xl" style={{ color: 'var(--text-secondary)' }}>
              Real-time directory powered by GPS distance sorting, bed availability tracking, and verified patient ratings.
            </p>

            {/* Global Search Bar */}
            <div className="relative mt-6 max-w-2xl">
              <Search className="w-5 h-5 absolute left-4 top-4" style={{ color: 'var(--text-muted)' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hospital name, doctor, specialization..."
                className="input-base pl-12 py-4"
                style={{ fontSize: '0.875rem', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-sm)' }}
              />
            </div>
          </div>
        </div>

        {/* Tab Toggle: Hospitals vs Doctors */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4 animate-fade-up-delay-1" style={{ borderColor: 'var(--border)' }}>
          <div className="flex p-1 rounded-2xl" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setActiveTab('hospitals')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              style={{
                background: activeTab === 'hospitals' ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === 'hospitals' ? 'var(--green)' : 'var(--text-secondary)',
                boxShadow: activeTab === 'hospitals' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Building2 className="w-4 h-4" /> Hospitals ({filteredHospitals.length})
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className="px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
              style={{
                background: activeTab === 'doctors' ? 'var(--bg-surface)' : 'transparent',
                color: activeTab === 'doctors' ? 'var(--sage)' : 'var(--text-secondary)',
                boxShadow: activeTab === 'doctors' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              <Stethoscope className="w-4 h-4" /> Doctors ({filteredDoctors.length})
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs font-semibold" style={{ color: 'var(--text-secondary)' }}>
            <SlidersHorizontal className="w-4 h-4" style={{ color: 'var(--green)' }} />
            <span>Multi-Param Filters Applied</span>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-fade-in">
          
          {/* Filters Sidebar */}
          <div className="card p-6 space-y-8 h-fit lg:sticky lg:top-24">
            <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-base font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Filter className="w-4 h-4" style={{ color: 'var(--green)' }} /> Refine Search
              </h3>
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setMinRating(0);
                  setMaxFee(2000);
                  setMaxDistanceKm(50);
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Reset
              </button>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Specialization
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="input-base text-xs"
              >
                {departmentsList.map((d) => (
                  <option key={d} value={d}>
                    {d === 'all' ? 'All Specializations' : d}
                  </option>
                ))}
              </select>
            </div>

            {/* Minimum Rating */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Minimum Rating
                </label>
                <span className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--gold)' }}>
                  <Star className="w-3 h-3 fill-current" /> {minRating > 0 ? `${minRating}+` : 'Any'}
                </span>
              </div>
              <input
                type="range" min={0} max={5} step={0.5}
                value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-[var(--green)]"
              />
            </div>

            {/* Max Distance Filter for Hospitals */}
            {activeTab === 'hospitals' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Max Distance Radius
                  </label>
                  <span className="text-xs font-bold" style={{ color: 'var(--green)' }}>{maxDistanceKm} km</span>
                </div>
                <input
                  type="range" min={2} max={50} step={2}
                  value={maxDistanceKm} onChange={(e) => setMaxDistanceKm(parseInt(e.target.value))}
                  className="w-full accent-[var(--green)]"
                />
              </div>
            )}

            {/* Max Consultation Fee for Doctors */}
            {activeTab === 'doctors' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                    Max Fee
                  </label>
                  <span className="text-xs font-bold" style={{ color: 'var(--sage)' }}>₹{maxFee}</span>
                </div>
                <input
                  type="range" min={500} max={2500} step={100}
                  value={maxFee} onChange={(e) => setMaxFee(parseInt(e.target.value))}
                  className="w-full accent-[var(--sage)]"
                />
              </div>
            )}
          </div>

          {/* Search Results Display */}
          <div className="lg:col-span-3 space-y-6">
            
            {activeTab === 'hospitals' ? (
              /* HOSPITAL CARDS LIST */
              filteredHospitals.length === 0 ? (
                <div className="card p-12 text-center border-dashed" style={{ borderColor: 'var(--border)' }}>
                  <Building2 className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: 'var(--text-primary)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>No hospitals match your search parameters.</p>
                </div>
              ) : (
                filteredHospitals.map((hosp) => (
                  <motion.div
                    key={hosp.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 flex flex-col md:flex-row gap-6 transition-all hover:scale-[1.01]"
                  >
                    <img src={hosp.images[0]} alt={hosp.name} className="w-full md:w-56 h-48 rounded-[var(--r-md)] object-cover" />

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="tag tag-green">{formatDistance(hosp.distanceKm)} away</span>

                          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--gold)' }}>
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{hosp.rating}</span>
                            <span className="font-normal" style={{ color: 'var(--text-muted)' }}>({hosp.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mt-3" style={{ color: 'var(--text-primary)' }}>{hosp.name}</h3>
                        <p className="text-xs mt-1.5 flex items-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
                          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: 'var(--text-muted)' }} />
                          {hosp.address}, {hosp.city}
                        </p>

                        <div className="flex items-center gap-4 mt-4 text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4" style={{ color: 'var(--green)' }} />
                            <strong style={{ color: 'var(--text-primary)' }}>{hosp.availableBeds}</strong> Beds Free
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" style={{ color: 'var(--sage)' }} />
                            24/7 ER
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div className="flex flex-wrap gap-1.5 max-w-[200px] sm:max-w-md">
                          {hosp.departments.slice(0, 4).map((d, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] font-medium" style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}>
                              {d}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => onSelectHospital(hosp.id)}
                          className="btn btn-primary py-2 px-4 shadow-[var(--shadow-sm)] text-[11px] shrink-0"
                        >
                          View <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              /* DOCTOR CARDS LIST */
              filteredDoctors.length === 0 ? (
                <div className="card p-12 text-center border-dashed" style={{ borderColor: 'var(--border)' }}>
                  <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-20" style={{ color: 'var(--text-primary)' }} />
                  <p className="text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>No doctors match your filters.</p>
                </div>
              ) : (
                filteredDoctors.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card p-6 flex flex-col md:flex-row gap-6 transition-all hover:scale-[1.01]"
                  >
                    <img src={doc.photo} alt={doc.name} className="w-28 h-28 rounded-[var(--r-md)] object-cover shrink-0" style={{ border: '2px solid var(--green-light)' }} />

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="tag tag-sage">{doc.specialization}</span>

                          <div className="flex items-center gap-1 text-xs font-bold" style={{ color: 'var(--gold)' }}>
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span>{doc.rating}</span>
                            <span className="font-normal" style={{ color: 'var(--text-muted)' }}>({doc.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{doc.name}</h3>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                          {doc.qualification} • {doc.experienceYears} Years Experience
                        </p>
                        <p className="text-xs font-semibold mt-1.5 flex items-center gap-1" style={{ color: 'var(--sage)' }}>
                          <Building2 className="w-3.5 h-3.5" /> {doc.hospitalName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                        <div>
                          <span className="text-[9px] uppercase tracking-wider block" style={{ color: 'var(--text-muted)' }}>Consultation Fee</span>
                          <span className="text-sm font-extrabold" style={{ color: 'var(--text-primary)' }}>₹{doc.consultationFee}</span>
                        </div>

                        <button
                          onClick={() => onSelectDoctor(doc.id)}
                          className="btn btn-primary py-2 px-4 shadow-[var(--shadow-sm)] text-[11px]"
                          style={{ background: 'var(--sage)', color: '#fff' }}
                        >
                          Book Visit <ChevronRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            )}

          </div>
        </div>

      </div>
    </div>
  );
};

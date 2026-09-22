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
  PhoneCall,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { calculateHaversineDistance, formatDistance } from '../../utils/haversine';
import { Hospital, Doctor } from '../../types';

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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Search Hero */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Find Hospitals & Medical Specialists
            </h1>
            <p className="text-sky-100 text-sm sm:text-base">
              Real-time directory powered by GPS distance sorting, bed availability tracking, and verified patient ratings.
            </p>

            {/* Global Search Bar */}
            <div className="relative mt-4">
              <Search className="w-5 h-5 absolute left-4 top-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by hospital name, doctor, specialization, treatment, or city..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium focus:outline-none shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Tab Toggle: Hospitals vs Doctors */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-2xl border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'hospitals'
                  ? 'bg-white dark:bg-slate-800 text-sky-600 dark:text-sky-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Building2 className="w-4 h-4" /> Hospitals ({filteredHospitals.length})
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'doctors'
                  ? 'bg-white dark:bg-slate-800 text-teal-600 dark:text-teal-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <Stethoscope className="w-4 h-4" /> Doctors ({filteredDoctors.length})
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-500">
            <SlidersHorizontal className="w-4 h-4 text-sky-500" />
            <span>Interactive Multi-Param Filters Applied</span>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 space-y-6 h-fit">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-sky-500" /> Refine Search
              </h3>
              <button
                onClick={() => {
                  setSelectedDepartment('all');
                  setMinRating(0);
                  setMaxFee(2000);
                  setMaxDistanceKm(50);
                  setSearchQuery('');
                }}
                className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 hover:underline"
              >
                Reset All
              </button>
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Department / Specialization
              </label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
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
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Minimum Rating
                </label>
                <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {minRating > 0 ? `${minRating}+ Stars` : 'Any'}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                step={0.5}
                value={minRating}
                onChange={(e) => setMinRating(parseFloat(e.target.value))}
                className="w-full accent-sky-600"
              />
            </div>

            {/* Max Distance Filter for Hospitals */}
            {activeTab === 'hospitals' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Max Distance Radius
                  </label>
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400">
                    {maxDistanceKm} km
                  </span>
                </div>
                <input
                  type="range"
                  min={2}
                  max={50}
                  step={2}
                  value={maxDistanceKm}
                  onChange={(e) => setMaxDistanceKm(parseInt(e.target.value))}
                  className="w-full accent-sky-600"
                />
              </div>
            )}

            {/* Max Consultation Fee for Doctors */}
            {activeTab === 'doctors' && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Max Consultation Fee
                  </label>
                  <span className="text-xs font-bold text-teal-600 dark:text-teal-400">
                    ₹{maxFee}
                  </span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={2500}
                  step={100}
                  value={maxFee}
                  onChange={(e) => setMaxFee(parseInt(e.target.value))}
                  className="w-full accent-teal-600"
                />
              </div>
            )}
          </div>

          {/* Search Results Display */}
          <div className="lg:col-span-3 space-y-6">
            
            {activeTab === 'hospitals' ? (
              /* HOSPITAL CARDS LIST */
              filteredHospitals.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
                  <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300 opacity-60" />
                  <p className="text-sm font-semibold">No hospitals match your exact search parameters.</p>
                </div>
              ) : (
                filteredHospitals.map((hosp) => (
                  <motion.div
                    key={hosp.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all flex flex-col md:flex-row gap-6"
                  >
                    <img
                      src={hosp.images[0]}
                      alt={hosp.name}
                      className="w-full md:w-56 h-48 rounded-2xl object-cover"
                    />

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                            {formatDistance(hosp.distanceKm)} away
                          </span>

                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{hosp.rating}</span>
                            <span className="text-slate-400 font-normal">({hosp.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
                          {hosp.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          {hosp.address}, {hosp.city}
                        </p>

                        <div className="flex items-center gap-4 mt-3 text-xs text-slate-600 dark:text-slate-300">
                          <span className="flex items-center gap-1">
                            <Bed className="w-4 h-4 text-emerald-500" />
                            <strong>{hosp.availableBeds}</strong> Beds Free
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-sky-500" />
                            24/7 ER
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap gap-1.5 max-w-md">
                          {hosp.departments.slice(0, 4).map((d, i) => (
                            <span key={i} className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300">
                              {d}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={() => onSelectHospital(hosp.id)}
                          className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1 shrink-0"
                        >
                          View Hospital <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              /* DOCTOR CARDS LIST */
              filteredDoctors.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center text-slate-400 border border-slate-200 dark:border-slate-800">
                  <Stethoscope className="w-12 h-12 mx-auto mb-3 text-slate-300 opacity-60" />
                  <p className="text-sm font-semibold">No doctor specialists match your filters.</p>
                </div>
              ) : (
                filteredDoctors.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all flex flex-col md:flex-row gap-6"
                  >
                    <img
                      src={doc.photo}
                      alt={doc.name}
                      className="w-24 h-24 rounded-2xl object-cover ring-2 ring-teal-500/30 shrink-0"
                    />

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                            {doc.specialization}
                          </span>

                          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                            <Star className="w-4 h-4 fill-amber-400" />
                            <span>{doc.rating}</span>
                            <span className="text-slate-400 font-normal">({doc.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                          {doc.name}
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {doc.qualification} • {doc.experienceYears} Years Experience
                        </p>
                        <p className="text-xs text-sky-600 dark:text-sky-400 font-medium mt-1 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" /> {doc.hospitalName}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Consultation Fee</span>
                          <span className="text-base font-extrabold text-slate-900 dark:text-white">
                            ₹{doc.consultationFee}
                          </span>
                        </div>

                        <button
                          onClick={() => onSelectDoctor(doc.id)}
                          className="py-2.5 px-5 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1"
                        >
                          Book Appointment <ChevronRight className="w-4 h-4" />
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

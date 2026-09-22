import React from 'react';
import { motion } from 'framer-motion';
import {
  Heart,
  Search,
  ShieldAlert,
  Bot,
  Building2,
  Stethoscope,
  Clock,
  Star,
  Users,
  Award,
  ChevronRight,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { calculateHaversineDistance, formatDistance } from '../../utils/haversine';
import { useLocation } from '../../context/LocationContext';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSelectHospital: (id: string) => void;
  onSelectDoctor: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectHospital,
  onSelectDoctor,
}) => {
  const { hospitals, doctors } = useAuth();
  const { location } = useLocation();

  const nearbyHospitals = hospitals.slice(0, 3).map((hosp) => {
    const dist = calculateHaversineDistance(
      location.latitude || 28.5355,
      location.longitude || 77.2882,
      hosp.latitude,
      hosp.longitude
    );
    return { ...hosp, distanceKm: dist };
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white space-y-16 pb-20 transition-colors">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-slate-50 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider border border-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI Healthcare Ecosystem
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Smart Hospital Triage & Appointment Booking with{' '}
              <span className="bg-gradient-to-r from-sky-600 via-teal-500 to-emerald-500 bg-clip-text text-transparent">
                MedConnect AI
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Connect Patients, Doctors, Hospitals, and Administrators in one unified network. Analyze medical images with Gemini AI vision, find nearby ER hospitals in seconds, and access instant digital prescriptions.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <button
                onClick={() => onNavigate('hospitals')}
                className="py-4 px-8 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-sky-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <Search className="w-4 h-4" /> Find Hospitals & Doctors <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('emergency')}
                className="py-4 px-8 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <ShieldAlert className="w-4 h-4 animate-bounce" /> 24/7 Emergency Help
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs">
              <div>
                <strong className="block text-xl font-black text-sky-600 dark:text-sky-400">100%</strong>
                <span className="text-slate-500 dark:text-slate-400">NABH Certified</span>
              </div>
              <div>
                <strong className="block text-xl font-black text-teal-600 dark:text-teal-400">&lt; 5 Mins</strong>
                <span className="text-slate-500 dark:text-slate-400">ER Dispatch Speed</span>
              </div>
              <div>
                <strong className="block text-xl font-black text-emerald-600 dark:text-emerald-400">4.9 / 5</strong>
                <span className="text-slate-500 dark:text-slate-400">Verified Rating</span>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-sky-500 to-teal-400 rounded-3xl blur-2xl opacity-20 dark:opacity-30" />
            <div className="relative bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6">
              
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-600 flex items-center justify-center font-bold">
                    <Bot className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold">Gemini AI Health Assistant</h3>
                    <p className="text-[10px] text-slate-400">Live Multi-Modal Triage</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-500">
                  Online
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-2 border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  💬 "I uploaded a photo of a scalding burn on my arm. What precautions should I follow?"
                </p>
                <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-800 dark:text-sky-200 text-[11px] leading-relaxed">
                  <strong>Gemini AI Triage:</strong> Cool under running water for 15 minutes. Apply pure Aloe Vera gel. Do NOT apply ice directly on open skin. Recommended Specialist: <strong>Burns & Plastic Surgery</strong>.
                </div>
              </div>

              <button
                onClick={() => onNavigate('ai-chatbot')}
                className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5"
              >
                Try AI Image & Health Assistant <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Hospitals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Top Nearby Hospitals</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sorted by GPS proximity to your current location.
            </p>
          </div>
          <button
            onClick={() => onNavigate('hospitals')}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
          >
            View All Hospitals ({hospitals.length}) →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {nearbyHospitals.map((hosp) => (
            <div
              key={hosp.id}
              onClick={() => onSelectHospital(hosp.id)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 shadow-sm hover:shadow-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <img
                src={hosp.images[0]}
                alt={hosp.name}
                className="w-full h-44 rounded-2xl object-cover group-hover:scale-102 transition-transform"
              />
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2.5 py-0.5 rounded-full">
                    {formatDistance(hosp.distanceKm)}
                  </span>
                  <span className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {hosp.rating}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1">{hosp.name}</h3>
                <p className="text-xs text-slate-500 line-clamp-1">{hosp.address}, {hosp.city}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{hosp.availableICUBeds} ICU Free</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold group-hover:translate-x-1 transition-transform">Details →</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold">Verified Medical Specialists</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Top rated cardiologists, neurologists, orthopedics, and pediatricians.
            </p>
          </div>
          <button
            onClick={() => onNavigate('doctors')}
            className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline"
          >
            Browse All Doctors →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {doctors.slice(0, 4).map((doc) => (
            <div
              key={doc.id}
              onClick={() => onSelectDoctor(doc.id)}
              className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all cursor-pointer space-y-3"
            >
              <img src={doc.photo} alt={doc.name} className="w-full h-44 rounded-2xl object-cover" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 block">{doc.specialization}</span>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{doc.name}</h4>
                <p className="text-[11px] text-slate-500">{doc.qualification}</p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900 dark:text-white">₹{doc.consultationFee}</span>
                <button className="py-1.5 px-3 bg-teal-600 text-white text-[11px] font-bold rounded-lg">Book</button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

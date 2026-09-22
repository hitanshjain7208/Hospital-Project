import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Building2,
  Star,
  Clock,
  Calendar,
  Languages,
  Award,
  CheckCircle2,
  DollarSign,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BookingWizardModal } from '../appointments/BookingWizardModal';

interface DoctorDetailPageProps {
  doctorId: string;
  onBack: () => void;
}

export const DoctorDetailPage: React.FC<DoctorDetailPageProps> = ({ doctorId, onBack }) => {
  const { doctors, reviews } = useAuth();
  const doctor = doctors.find((d) => d.id === doctorId) || doctors[0];
  const doctorReviews = reviews.filter((r) => r.targetId === doctor.id && r.targetType === 'doctor');

  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(doctor.availableSlots[0]);
  const [selectedDate, setSelectedDate] = useState('2026-09-25');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
        >
          ← Back to Search / Directory
        </button>

        {/* Doctor Header Profile Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row gap-8">
          <img
            src={doctor.photo}
            alt={doctor.name}
            className="w-36 h-36 rounded-3xl object-cover ring-4 ring-teal-500/30 shrink-0 mx-auto md:mx-0 shadow-md"
          />

          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-500/20">
                  {doctor.specialization}
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {doctor.name}
                </h1>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{doctor.qualification}</p>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/50 rounded-xl text-amber-500 border border-amber-200 dark:border-amber-800">
                <Star className="w-5 h-5 fill-amber-400" />
                <span className="text-base font-black">{doctor.rating}</span>
                <span className="text-xs text-slate-400">({doctor.reviewCount} Reviews)</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-slate-400 block">Experience</span>
                <strong className="text-slate-900 dark:text-white">{doctor.experienceYears} Years</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Registration</span>
                <strong className="text-slate-900 dark:text-white">{doctor.medicalRegistrationNumber}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Consultation Fee</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">₹{doctor.consultationFee}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Languages</span>
                <strong className="text-slate-900 dark:text-white">{doctor.languages.join(', ')}</strong>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {doctor.bio}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsBookingModalOpen(true)}
                className="py-3 px-8 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 transition-transform active:scale-95"
              >
                Book Appointment Now
              </button>
            </div>
          </div>
        </div>

        {/* Available Slots & Schedule */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-500" /> Choose Consultation Date & Slot
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Select Date</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Available Time Slots</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {doctor.availableSlots.map((slot) => (
                  <button
                    key={slot}
                    onClick={() => setSelectedSlot(slot)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                      selectedSlot === slot
                        ? 'bg-teal-600 text-white border-teal-600 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-teal-500'
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-amber-500" /> Patient Feedback & Ratings
          </h3>

          <div className="space-y-3">
            {doctorReviews.length === 0 ? (
              <p className="text-xs text-slate-400 py-2">No reviews recorded yet for this specialist.</p>
            ) : (
              doctorReviews.map((r) => (
                <div key={r.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-900 dark:text-white">
                    <span>{r.patientName}</span>
                    <span className="text-amber-400">{'★'.repeat(Math.round(r.rating))}</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Guided Booking Modal */}
        {isBookingModalOpen && (
          <BookingWizardModal
            preselectedDoctor={doctor}
            preselectedSlot={selectedSlot}
            preselectedDate={selectedDate}
            onClose={() => setIsBookingModalOpen(false)}
          />
        )}

      </div>
    </div>
  );
};

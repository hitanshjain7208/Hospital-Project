import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Building2,
  Star,
  Clock,
  Languages,
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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-6xl space-y-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity animate-fade-in"
          style={{ color: 'var(--green)' }}
        >
          &larr; Back to Medical Directory
        </button>

        {/* Doctor Header Profile Card */}
        <div className="card p-8 sm:p-12 animate-fade-up">
          <div className="flex flex-col md:flex-row gap-10">
            <img
              src={doctor.photo}
              alt={doctor.name}
              className="w-40 h-40 rounded-[var(--r-lg)] object-cover shrink-0 mx-auto md:mx-0 shadow-[var(--shadow-sm)]"
              style={{ border: '4px solid var(--green-light)' }}
            />

            <div className="flex-1 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="tag tag-sage">{doctor.specialization}</span>
                  <h1 className="display-font mt-3" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--text-primary)' }}>
                    {doctor.name}
                  </h1>
                  <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-secondary)' }}>{doctor.qualification}</p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border" style={{ background: 'var(--gold-light)', color: 'var(--gold)', borderColor: 'rgba(241,216,163,0.3)' }}>
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-base font-black">{doctor.rating}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>({doctor.reviewCount} Reviews)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                <div>
                  <span className="block uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Experience</span>
                  <strong className="text-sm" style={{ color: 'var(--text-primary)' }}>{doctor.experienceYears} Years</strong>
                </div>
                <div>
                  <span className="block uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Registration</span>
                  <strong className="text-sm" style={{ color: 'var(--text-primary)' }}>{doctor.medicalRegistrationNumber}</strong>
                </div>
                <div>
                  <span className="block uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Consultation Fee</span>
                  <strong className="text-sm font-extrabold" style={{ color: 'var(--green)' }}>₹{doctor.consultationFee}</strong>
                </div>
                <div>
                  <span className="block uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>Languages</span>
                  <strong className="text-sm" style={{ color: 'var(--text-primary)' }}>{doctor.languages.join(', ')}</strong>
                </div>
              </div>

              <p className="text-sm leading-relaxed pt-2" style={{ color: 'var(--text-secondary)' }}>
                {doctor.bio}
              </p>

              <div className="pt-4 flex justify-start md:justify-end">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="btn btn-primary py-3.5 px-8 w-full md:w-auto"
                >
                  Book Appointment Now
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-up-delay-1">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Available Slots */}
            <div className="card p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Clock className="w-5 h-5" style={{ color: 'var(--green)' }} /> Choose Consultation Slot
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Select Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="input-base w-full sm:w-auto"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Available Times</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {doctor.availableSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setSelectedSlot(slot)}
                        className="py-3 px-4 rounded-[var(--r-md)] text-sm font-bold border transition-all"
                        style={{
                          background: selectedSlot === slot ? 'var(--green)' : 'transparent',
                          color: selectedSlot === slot ? '#fff' : 'var(--text-secondary)',
                          borderColor: selectedSlot === slot ? 'var(--green)' : 'var(--border)',
                          boxShadow: selectedSlot === slot ? 'var(--shadow-md)' : 'none',
                        }}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="card p-8 space-y-6">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <MessageSquare className="w-5 h-5" style={{ color: 'var(--gold)' }} /> Patient Reviews
              </h3>

              <div className="space-y-4">
                {doctorReviews.length === 0 ? (
                  <p className="text-sm py-2" style={{ color: 'var(--text-muted)' }}>No reviews recorded yet for this specialist.</p>
                ) : (
                  doctorReviews.map((r) => (
                    <div key={r.id} className="p-5 rounded-[var(--r-md)] space-y-2 border-l-4" style={{ background: 'var(--bg-muted)', borderLeftColor: 'var(--sage)' }}>
                      <div className="flex justify-between items-center text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                        <span>{r.patientName}</span>
                        <span style={{ color: 'var(--gold)' }}>{'★'.repeat(Math.round(r.rating))}</span>
                      </div>
                      <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>"{r.comment}"</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="card p-8 space-y-5">
              <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Hospital Affiliation</h3>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{doctor.hospitalName}</h4>
                  <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Primary consulting location</p>
                </div>
              </div>
            </div>
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

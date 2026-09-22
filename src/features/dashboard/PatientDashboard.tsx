import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  FileText,
  Download,
  Stethoscope,
  Plus,
  ShieldCheck,
  AlertCircle,
  HeartPulse,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { useToast } from '../../components/ui/Toast';

interface PatientDashboardProps {
  onNavigate: (tab: string) => void;
  onSelectDoctor: (docId: string) => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ onNavigate, onSelectDoctor }) => {
  const { currentUser, appointments, prescriptions, doctors, hospitals } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'prescriptions' | 'mediclaim'>('overview');

  const patientAppointments = appointments.filter(
    (a) => a.patientId === currentUser?.id || a.patientName.includes(currentUser?.name || '')
  );

  const upcomingApts = patientAppointments.filter((a) => a.status === 'confirmed' || a.status === 'pending');
  const pastApts = patientAppointments.filter((a) => a.status === 'completed' || a.status === 'cancelled');

  const patientPrescriptions = prescriptions.filter(
    (p) => p.patientId === currentUser?.id || p.patientName.includes(currentUser?.name || '')
  );

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-7xl space-y-12">
        
        {/* Welcome Hero Banner */}
        <div
          className="relative overflow-hidden rounded-[var(--r-lg)] p-8 sm:p-12 shadow-[var(--shadow-md)] animate-fade-up"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          {/* Subtle green ambient wash */}
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full pointer-events-none opacity-10"
               style={{ background: 'var(--green-light)', transform: 'translate(20%, -30%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="space-y-3">
              <div className="eyebrow flex items-center gap-2">
                <HeartPulse className="w-4 h-4" /> Patient Portal
              </div>
              <h1 className="display-font" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
                Welcome, {currentUser?.name?.split(' ')[0] || 'Patient'}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5"><strong style={{ color: 'var(--text-primary)' }}>Blood Group:</strong> {currentUser?.bloodGroup || 'O+'}</span>
                <span className="flex items-center gap-1.5"><strong style={{ color: 'var(--text-primary)' }}>Emergency:</strong> {currentUser?.emergencyContact || '+91-99999'}</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate('hospitals')}
              className="btn btn-primary shadow-[var(--shadow-sm)]"
            >
              <Plus className="w-4 h-4" /> Book Appointment
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex gap-8 overflow-x-auto border-b animate-fade-up-delay-1" style={{ borderColor: 'var(--border)' }}>
          {[
            { id: 'overview', label: 'Care Overview' },
            { id: 'appointments', label: `Appointments (${patientAppointments.length})` },
            { id: 'prescriptions', label: `Prescriptions (${patientPrescriptions.length})` },
            { id: 'mediclaim', label: 'Insurance' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="pb-4 text-sm font-semibold whitespace-nowrap transition-colors relative"
              style={{ color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)' }}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'var(--green)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
            <div className="lg:col-span-2 space-y-8">
              
              {/* Upcoming Appointment */}
              <div className="card p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                    <Calendar className="w-5 h-5" style={{ color: 'var(--green)' }} /> Upcoming Appointment
                  </h3>
                  <span className="tag tag-sage">Confirmed</span>
                </div>

                {upcomingApts.length === 0 ? (
                  <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>No upcoming appointments scheduled.</p>
                ) : (
                  <div
                    className="p-6 rounded-[var(--r-md)] space-y-4"
                    style={{ background: 'var(--green-light)', border: '1px solid var(--border)' }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{upcomingApts[0].doctorName}</h4>
                        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{upcomingApts[0].doctorSpecialization} • {upcomingApts[0].hospitalName}</p>
                      </div>
                      <span className="tag" style={{ background: 'var(--bg-surface)', color: 'var(--green)' }}>
                        {upcomingApts[0].date} at {upcomingApts[0].timeSlot}
                      </span>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                      Reason: <em style={{ color: 'var(--text-secondary)' }}>"{upcomingApts[0].symptoms}"</em>
                    </p>
                  </div>
                )}
              </div>

              {/* Recommended Doctors */}
              <div className="card p-8 space-y-6">
                <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <Stethoscope className="w-5 h-5" style={{ color: 'var(--sage)' }} /> Top Rated Specialists
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {doctors.slice(0, 2).map((doc) => (
                    <div
                      key={doc.id}
                      className="p-4 rounded-[var(--r-md)] flex items-center gap-4 transition-all hover:scale-[1.02] cursor-pointer"
                      style={{ background: 'var(--bg-muted)' }}
                      onClick={() => onSelectDoctor(doc.id)}
                    >
                      <img src={doc.photo} alt={doc.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</h4>
                        <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{doc.specialization}</p>
                        <span className="text-[11px] font-bold mt-1.5 block" style={{ color: 'var(--green)' }}>
                          Book Visit &rarr;
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              <div className="card p-8 space-y-5">
                <h3 className="eyebrow flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> Insurance Mediclaim
                </h3>
                <div
                  className="p-5 rounded-[var(--r-md)] space-y-3"
                  style={{ background: 'var(--sage-light)', color: 'var(--text-primary)' }}
                >
                  <div className="flex justify-between font-bold text-sm">
                    <span>{currentUser?.mediclaimProvider || 'Star Health'}</span>
                    <span style={{ color: 'var(--sage)' }}>{currentUser?.mediclaimStatus || 'Active'}</span>
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Policy: <span className="font-mono font-bold">{currentUser?.mediclaimNumber || 'SH-POL-992'}</span>
                  </div>
                  <div className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    Expiry: <strong>{currentUser?.mediclaimExpiry || '2027-12-31'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Appointments */}
        {activeTab === 'appointments' && (
          <div className="card p-8 space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Appointment History</h3>
            <div className="space-y-4">
              {patientAppointments.length === 0 ? (
                <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>No appointment history found.</p>
              ) : (
                patientAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 rounded-[var(--r-md)] flex flex-col sm:flex-row justify-between gap-4"
                    style={{ border: '1px solid var(--border)' }}
                  >
                    <div>
                      <h4 className="font-bold text-base" style={{ color: 'var(--text-primary)' }}>{apt.doctorName} <span className="font-normal text-sm" style={{ color: 'var(--text-secondary)' }}>({apt.doctorSpecialization})</span></h4>
                      <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{apt.hospitalName} • {apt.department}</p>
                      <p className="text-xs mt-2 font-medium" style={{ color: 'var(--text-secondary)' }}>Symptoms: {apt.symptoms}</p>
                    </div>
                    <div className="text-right sm:self-center flex flex-col items-end">
                      <span className="text-sm font-bold" style={{ color: 'var(--green)' }}>{apt.date} at {apt.timeSlot}</span>
                      <span className={`tag mt-2 ${apt.status === 'confirmed' ? 'tag-sage' : 'tag-white'}`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="card p-8 space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Digital Prescriptions</h3>
            <div className="space-y-5">
              {patientPrescriptions.length === 0 ? (
                <p className="text-sm py-4" style={{ color: 'var(--text-muted)' }}>No digital prescriptions generated yet.</p>
              ) : (
                patientPrescriptions.map((pres) => (
                  <div
                    key={pres.id}
                    className="p-6 rounded-[var(--r-md)] space-y-5"
                    style={{ background: 'var(--bg-muted)' }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4" style={{ borderBottom: '1px solid var(--border)' }}>
                      <div>
                        <h4 className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>Dr. {pres.doctorName}</h4>
                        <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-secondary)' }}>{pres.hospitalName} • {pres.date}</p>
                      </div>
                      <button
                        onClick={() => {
                          generatePrescriptionPDF(pres);
                          showToast('PDF Download Initiated', `Generating Prescription_${pres.patientName}.pdf`, 'info');
                        }}
                        className="btn btn-ghost"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>

                    <div className="text-sm space-y-3">
                      <div><strong style={{ color: 'var(--text-primary)' }}>Diagnosis:</strong> <span style={{ color: 'var(--text-secondary)' }}>{pres.diagnosis}</span></div>
                      <div>
                        <strong style={{ color: 'var(--text-primary)' }}>Prescribed Medicines:</strong>
                        <ul className="list-disc pl-5 mt-2 space-y-1" style={{ color: 'var(--text-secondary)' }}>
                          {pres.medicines.map((m, i) => (
                            <li key={i}>{m.name} ({m.dosage}) - {m.frequency} for {m.durationDays} Days</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

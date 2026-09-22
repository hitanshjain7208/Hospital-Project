import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Calendar,
  FileText,
  ShieldCheck,
  Download,
  Clock,
  Building2,
  Stethoscope,
  Heart,
  Plus,
  CheckCircle2,
  AlertCircle,
  Award,
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Hero Banner */}
        <div className="bg-gradient-to-r from-sky-600 via-teal-600 to-emerald-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Patient Portal
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Welcome Back, {currentUser?.name || 'Rahul Verma'} 👋
            </h1>
            <p className="text-sky-100 text-xs sm:text-sm">
              Blood Group: <strong className="text-white">{currentUser?.bloodGroup || 'O+'}</strong> • Emergency Contact: <strong className="text-white">{currentUser?.emergencyContact || '+91-98765-99999'}</strong>
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => onNavigate('hospitals')}
              className="py-3 px-5 bg-white text-sky-700 hover:bg-sky-50 font-bold text-xs rounded-2xl shadow-lg transition-transform active:scale-95 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Book New Appointment
            </button>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview & Care Summary
          </button>
          <button
            onClick={() => setActiveTab('appointments')}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'appointments'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Appointments ({patientAppointments.length})
          </button>
          <button
            onClick={() => setActiveTab('prescriptions')}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'prescriptions'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Digital Prescriptions & Reports ({patientPrescriptions.length})
          </button>
          <button
            onClick={() => setActiveTab('mediclaim')}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'mediclaim'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Mediclaim Insurance Status
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Upcoming Appointment Card */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sky-500" /> Upcoming Appointment
                  </h3>
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full">
                    Confirmed
                  </span>
                </div>

                {upcomingApts.length === 0 ? (
                  <p className="text-xs text-slate-400 py-4">No upcoming appointments scheduled.</p>
                ) : (
                  <div className="p-5 rounded-2xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-800/60 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{upcomingApts[0].doctorName}</h4>
                        <p className="text-xs text-slate-500">{upcomingApts[0].doctorSpecialization} • {upcomingApts[0].hospitalName}</p>
                      </div>
                      <span className="text-xs font-bold text-sky-600 dark:text-sky-400 bg-white dark:bg-slate-800 px-3 py-1 rounded-xl shadow-sm">
                        {upcomingApts[0].date} at {upcomingApts[0].timeSlot}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">
                      Reason for visit: <em>"{upcomingApts[0].symptoms}"</em>
                    </p>
                  </div>
                )}
              </div>

              {/* Recommended Doctors Slider */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-teal-500" /> Top Rated Specialists
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {doctors.slice(0, 2).map((doc) => (
                    <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
                      <img src={doc.photo} alt={doc.name} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{doc.name}</h4>
                        <p className="text-[10px] text-slate-500 truncate">{doc.specialization}</p>
                        <button
                          onClick={() => onSelectDoctor(doc.id)}
                          className="mt-1 text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          Book Visit →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Mediclaim & Quick Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Insurance Mediclaim</h3>
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2">
                  <div className="flex justify-between font-bold text-slate-900 dark:text-white">
                    <span>{currentUser?.mediclaimProvider || 'Star Health Insurance'}</span>
                    <span className="text-emerald-600 dark:text-emerald-400">{currentUser?.mediclaimStatus || 'Active'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Policy No: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentUser?.mediclaimNumber || 'SH-POL-99201948'}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Expiry: <strong>{currentUser?.mediclaimExpiry || '2027-12-31'}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Appointments */}
        {activeTab === 'appointments' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">All Appointment History</h3>
            <div className="space-y-3">
              {patientAppointments.map((apt) => (
                <div key={apt.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">{apt.doctorName} ({apt.doctorSpecialization})</h4>
                    <p className="text-xs text-slate-500">{apt.hospitalName} • {apt.department}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">Symptoms: {apt.symptoms}</p>
                  </div>
                  <div className="text-right sm:self-center">
                    <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block">{apt.date} at {apt.timeSlot}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block mt-1 uppercase ${
                      apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Prescriptions */}
        {activeTab === 'prescriptions' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Digital Medical Prescriptions</h3>
            <div className="space-y-4">
              {patientPrescriptions.length === 0 ? (
                <p className="text-xs text-slate-400 py-4">No digital prescriptions generated yet.</p>
              ) : (
                patientPrescriptions.map((pres) => (
                  <div key={pres.id} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-slate-200 dark:border-slate-700 pb-3">
                      <div>
                        <h4 className="text-base font-bold text-slate-900 dark:text-white">Prescription by {pres.doctorName}</h4>
                        <p className="text-xs text-slate-500">{pres.hospitalName} • Date: {pres.date}</p>
                      </div>
                      <button
                        onClick={() => {
                          generatePrescriptionPDF(pres);
                          showToast('PDF Download Initiated', `Generating Prescription_${pres.patientName}.pdf`, 'info');
                        }}
                        className="py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow transition-colors flex items-center gap-2 self-start sm:self-auto"
                      >
                        <Download className="w-4 h-4" /> Download PDF Prescription
                      </button>
                    </div>

                    <div className="text-xs space-y-2">
                      <div><strong className="text-slate-700 dark:text-slate-300">Diagnosis:</strong> {pres.diagnosis}</div>
                      <div>
                        <strong className="text-slate-700 dark:text-slate-300">Prescribed Medicines:</strong>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
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

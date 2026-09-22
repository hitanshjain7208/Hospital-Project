import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  FileText,
  Plus,
  Trash2,
  Download,
  AlertCircle,
  Award,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Appointment, MedicinePrescribed, Prescription } from '../../types';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { useToast } from '../../components/ui/Toast';

export const DoctorDashboard: React.FC = () => {
  const { currentUser, appointments, updateAppointmentStatus, createPrescription } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'queue' | 'prescription' | 'calendar'>('queue');
  const [selectedAptForRx, setSelectedAptForRx] = useState<Appointment | null>(null);

  // Prescription Form State
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [followUpDate, setFollowUpDate] = useState('2026-10-01');
  const [medicines, setMedicines] = useState<MedicinePrescribed[]>([
    { name: 'Paracetamol 500mg', dosage: '1 Tablet', frequency: '1-0-1 (After Food)', durationDays: 5, instructions: 'Take with warm water' },
  ]);

  const doctorApts = appointments.filter(
    (a) => a.doctorId === currentUser?.id || a.doctorName.includes(currentUser?.name || '')
  );

  const todayApts = doctorApts.filter((a) => a.status === 'confirmed');
  const completedApts = doctorApts.filter((a) => a.status === 'completed');

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '1 Tablet', frequency: '1-0-1', durationDays: 3 }]);
  };

  const handleMedicineChange = (index: number, field: keyof MedicinePrescribed, value: any) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleCreatePrescriptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAptForRx) {
      showToast('Selection Required', 'Please select an appointment from the queue to issue Rx.', 'warning');
      return;
    }

    const newPres = createPrescription({
      appointmentId: selectedAptForRx.id,
      patientId: selectedAptForRx.patientId,
      patientName: selectedAptForRx.patientName,
      patientAge: selectedAptForRx.patientAge || 30,
      patientGender: selectedAptForRx.patientGender || 'Male',
      doctorId: currentUser?.id || 'doc-1',
      doctorName: currentUser?.name || 'Dr. Rajesh Sharma',
      doctorRegistration: currentUser?.medicalRegNo || 'DMC-CARD-88192',
      doctorSpecialization: currentUser?.specialization || 'Cardiology',
      hospitalId: selectedAptForRx.hospitalId,
      hospitalName: selectedAptForRx.hospitalName,
      date: new Date().toISOString().split('T')[0],
      vitals: {
        bloodPressure: '120/80 mmHg',
        pulseRate: '72 bpm',
        temperature: '98.6 °F',
        weightKg: '70 kg',
      },
      diagnosis,
      medicines,
      advice,
      followUpDate,
      digitalSignatureUrl: `Dr. ${currentUser?.name} [Digitally Verified]`,
    });

    generatePrescriptionPDF(newPres);
    showToast('Prescription Published & PDF Generated 🎉', `Prescription sent to ${selectedAptForRx.patientName}.`, 'success');
    setSelectedAptForRx(null);
    setDiagnosis('');
    setAdvice('');
    setActiveTab('queue');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Doctor Header Banner */}
        <div className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Doctor Workstation
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {currentUser?.name || 'Dr. Rajesh Sharma'}
            </h1>
            <p className="text-teal-100 text-xs sm:text-sm">
              {currentUser?.qualification || 'MBBS, MD'} • Reg No: <strong className="text-white">{currentUser?.medicalRegNo || 'DMC-CARD-88192'}</strong>
            </p>
          </div>

          <div className="flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-center">
            <div>
              <span className="block text-teal-200 text-[10px] uppercase">Today's Queue</span>
              <strong className="text-xl font-bold">{todayApts.length} Patients</strong>
            </div>
            <div className="border-l border-white/20 pl-4">
              <span className="block text-teal-200 text-[10px] uppercase">Completed</span>
              <strong className="text-xl font-bold">{completedApts.length} Visits</strong>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6">
          <button
            onClick={() => setActiveTab('queue')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'queue'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Today's Patient Queue ({todayApts.length})
          </button>
          <button
            onClick={() => setActiveTab('prescription')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'prescription'
                ? 'border-teal-600 text-teal-600 dark:text-teal-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Prescription Writer & PDF Generator
          </button>
        </div>

        {/* Tab 1: Queue */}
        {activeTab === 'queue' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Active Patient Queue</h3>
            
            <div className="space-y-4">
              {todayApts.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">No active pending appointments in queue.</p>
              ) : (
                todayApts.map((apt) => (
                  <div key={apt.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">{apt.patientName}</h4>
                        <span className="text-[10px] font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">
                          Slot: {apt.timeSlot}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500">Phone: {apt.patientPhone} • Email: {apt.patientEmail}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">Symptoms: <em>"{apt.symptoms}"</em></p>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-center">
                      <button
                        onClick={() => {
                          setSelectedAptForRx(apt);
                          setActiveTab('prescription');
                        }}
                        className="py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" /> Write Rx
                      </button>

                      <button
                        onClick={() => {
                          updateAppointmentStatus(apt.id, 'completed');
                          showToast('Appointment Completed', `${apt.patientName} visit marked completed.`, 'success');
                        }}
                        className="py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Complete
                      </button>

                      <button
                        onClick={() => {
                          updateAppointmentStatus(apt.id, 'cancelled');
                          showToast('Appointment Cancelled', `Appointment for ${apt.patientName} cancelled.`, 'info');
                        }}
                        className="py-2 px-2.5 bg-rose-500/10 text-rose-600 hover:bg-rose-500/20 text-xs font-bold rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Prescription Writer Panel */}
        {activeTab === 'prescription' && (
          <form onSubmit={handleCreatePrescriptionSubmit} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-teal-500" /> Digital Prescription Writer
              </h3>
              {selectedAptForRx && (
                <span className="text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-3 py-1 rounded-full">
                  Selected Patient: {selectedAptForRx.patientName}
                </span>
              )}
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Clinical Diagnosis
              </label>
              <input
                required
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Viral Bronchitis / Essential Hypertension"
                className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            {/* Prescribed Medicines Builder Table */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Prescribed Medicines (Rx)
                </label>
                <button
                  type="button"
                  onClick={handleAddMedicine}
                  className="py-1.5 px-3 bg-teal-50 dark:bg-teal-950 text-teal-600 dark:text-teal-400 hover:bg-teal-100 text-xs font-bold rounded-xl flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Drug Row
                </button>
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <input
                    required
                    type="text"
                    value={med.name}
                    onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)}
                    placeholder="Medicine / Drug Name"
                    className="p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={med.dosage}
                    onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)}
                    placeholder="Dosage (e.g. 500mg)"
                    className="p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <input
                    type="text"
                    value={med.frequency}
                    onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)}
                    placeholder="Frequency (1-0-1)"
                    className="p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={med.durationDays}
                      onChange={(e) => handleMedicineChange(idx, 'durationDays', Number(e.target.value))}
                      placeholder="Days"
                      className="p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white w-full"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveMedicine(idx)}
                      className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Advice & Follow-Up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Special Advice & Precautions
                </label>
                <textarea
                  rows={3}
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  placeholder="Drink warm water, rest for 3 days, avoid heavy exertion..."
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Follow-up Visit Date
                </label>
                <input
                  type="date"
                  value={followUpDate}
                  onChange={(e) => setFollowUpDate(e.target.value)}
                  className="p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white w-full font-bold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" /> Publish Digital Prescription & Generate PDF
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

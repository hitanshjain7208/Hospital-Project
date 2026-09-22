import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope,
  Calendar,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  Download,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Appointment, MedicinePrescribed } from '../../types';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';
import { useToast } from '../../components/ui/Toast';

export const DoctorDashboard: React.FC = () => {
  const { currentUser, appointments, updateAppointmentStatus, createPrescription } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'queue' | 'prescription'>('queue');
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
      vitals: { bloodPressure: '120/80 mmHg', pulseRate: '72 bpm', temperature: '98.6 °F', weightKg: '70 kg' },
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
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-7xl space-y-12">
        
        {/* Doctor Header Banner */}
        <div
          className="relative overflow-hidden rounded-[var(--r-lg)] p-8 sm:p-12 shadow-[var(--shadow-md)] animate-fade-up"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full pointer-events-none opacity-10"
               style={{ background: 'var(--sage-light)', transform: 'translate(20%, -30%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3">
              <div className="eyebrow flex items-center gap-2">
                <Stethoscope className="w-4 h-4" /> Doctor Workstation
              </div>
              <h1 className="display-font" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
                {currentUser?.name || 'Dr. Rajesh Sharma'}
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                {currentUser?.qualification || 'MBBS, MD'} • Reg No: <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.medicalRegNo || 'DMC-CARD-88192'}</strong>
              </p>
            </div>

            <div className="flex gap-4 p-5 rounded-[var(--r-md)] text-center shadow-[var(--shadow-sm)]" style={{ background: 'var(--bg-base)' }}>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Today's Queue</span>
                <strong className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{todayApts.length}</strong>
              </div>
              <div className="pl-4" style={{ borderLeft: '1px solid var(--border)' }}>
                <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Completed</span>
                <strong className="text-2xl font-bold" style={{ color: 'var(--sage)' }}>{completedApts.length}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b gap-8 animate-fade-up-delay-1" style={{ borderColor: 'var(--border)' }}>
          {[
            { id: 'queue', label: `Today's Queue (${todayApts.length})` },
            { id: 'prescription', label: 'Prescription Writer' },
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
                  layoutId="activeDocTab"
                  className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'var(--green)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Queue */}
        {activeTab === 'queue' && (
          <div className="card p-8 space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Active Patient Queue</h3>
            
            <div className="space-y-4">
              {todayApts.length === 0 ? (
                <p className="text-sm py-6" style={{ color: 'var(--text-muted)' }}>No active pending appointments in queue.</p>
              ) : (
                todayApts.map((apt) => (
                  <div key={apt.id} className="p-5 rounded-[var(--r-md)] flex flex-col md:flex-row justify-between gap-5 transition-all hover:shadow-[var(--shadow-xs)]" style={{ border: '1px solid var(--border)', background: 'var(--bg-base)' }}>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>{apt.patientName}</h4>
                        <span className="tag tag-sage">Slot: {apt.timeSlot}</span>
                      </div>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Phone: {apt.patientPhone} • Email: {apt.patientEmail}</p>
                      <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-primary)' }}>Symptoms: <em style={{ color: 'var(--text-secondary)' }}>"{apt.symptoms}"</em></p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                      <button
                        onClick={() => { setSelectedAptForRx(apt); setActiveTab('prescription'); }}
                        className="btn btn-sm" style={{ background: 'var(--green-light)', color: 'var(--green)' }}
                      >
                        <FileText className="w-3.5 h-3.5" /> Write Rx
                      </button>
                      <button
                        onClick={() => { updateAppointmentStatus(apt.id, 'completed'); showToast('Completed', 'Visit marked completed.', 'success'); }}
                        className="btn btn-sm" style={{ background: 'var(--sage-light)', color: 'var(--sage)' }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                      </button>
                      <button
                        onClick={() => { updateAppointmentStatus(apt.id, 'cancelled'); showToast('Cancelled', 'Appointment cancelled.', 'info'); }}
                        className="btn btn-sm" style={{ background: 'var(--red-light)', color: 'var(--red)' }}
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

        {/* Tab 2: Prescription Writer */}
        {activeTab === 'prescription' && (
          <form onSubmit={handleCreatePrescriptionSubmit} className="card p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-5" style={{ borderColor: 'var(--border)' }}>
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <FileText className="w-5 h-5" style={{ color: 'var(--green)' }} /> Digital Prescription
              </h3>
              {selectedAptForRx && (
                <span className="tag tag-green mt-3 sm:mt-0">
                  Patient: {selectedAptForRx.patientName}
                </span>
              )}
            </div>

            {/* Diagnosis */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                Clinical Diagnosis
              </label>
              <input
                required type="text" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Acute Viral Bronchitis"
                className="input-base"
              />
            </div>

            {/* Medicines */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                  Prescribed Medicines
                </label>
                <button type="button" onClick={handleAddMedicine} className="btn btn-sm btn-ghost flex items-center gap-1">
                  <Plus className="w-3.5 h-3.5" /> Add Drug
                </button>
              </div>

              {medicines.map((med, idx) => (
                <div key={idx} className="p-5 rounded-[var(--r-md)] grid grid-cols-1 sm:grid-cols-4 gap-4 items-center" style={{ background: 'var(--bg-base)', border: '1px solid var(--border)' }}>
                  <input required type="text" value={med.name} onChange={(e) => handleMedicineChange(idx, 'name', e.target.value)} placeholder="Drug Name" className="input-base" />
                  <input type="text" value={med.dosage} onChange={(e) => handleMedicineChange(idx, 'dosage', e.target.value)} placeholder="Dosage" className="input-base" />
                  <input type="text" value={med.frequency} onChange={(e) => handleMedicineChange(idx, 'frequency', e.target.value)} placeholder="Frequency" className="input-base" />
                  <div className="flex items-center gap-2">
                    <input type="number" value={med.durationDays} onChange={(e) => handleMedicineChange(idx, 'durationDays', Number(e.target.value))} placeholder="Days" className="input-base w-full" />
                    <button type="button" onClick={() => handleRemoveMedicine(idx)} className="btn-icon" style={{ color: 'var(--red)' }}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Advice & Follow-Up */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Advice & Precautions</label>
                <textarea rows={3} value={advice} onChange={(e) => setAdvice(e.target.value)} placeholder="Rest, warm water..." className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Follow-up Date</label>
                <input type="date" value={followUpDate} onChange={(e) => setFollowUpDate(e.target.value)} className="input-base" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full py-4 text-sm mt-4">
              <Download className="w-4 h-4" /> Publish Prescription & Generate PDF
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

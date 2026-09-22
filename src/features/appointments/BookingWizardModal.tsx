import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  CheckCircle2,
  Building2,
  Stethoscope,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { Hospital, Doctor } from '../../types';
import { useToast } from '../../components/ui/Toast';

interface BookingWizardModalProps {
  preselectedDoctor?: Doctor;
  preselectedSlot?: string;
  preselectedDate?: string;
  onClose: () => void;
}

export const BookingWizardModal: React.FC<BookingWizardModalProps> = ({
  preselectedDoctor,
  preselectedSlot,
  preselectedDate,
  onClose,
}) => {
  const { hospitals, doctors, currentUser, bookAppointment } = useAuth();
  const { showToast } = useToast();

  // 5 Steps: 1: Hospital -> 2: Department -> 3: Doctor -> 4: Date & Slot -> 5: Confirm & Pay
  const [step, setStep] = useState(preselectedDoctor ? 4 : 1);

  const [selectedHospital, setSelectedHospital] = useState<Hospital>(
    preselectedDoctor
      ? hospitals.find((h) => h.id === preselectedDoctor.hospitalId) || hospitals[0]
      : hospitals[0]
  );
  const [selectedDepartment, setSelectedDepartment] = useState<string>(
    preselectedDoctor ? preselectedDoctor.specialization : selectedHospital.departments[0] || 'Cardiology'
  );
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor>(preselectedDoctor || doctors[0]);
  const [date, setDate] = useState(preselectedDate || '2026-09-25');
  const [timeSlot, setTimeSlot] = useState(preselectedSlot || selectedDoctor.availableSlots[0] || '10:00 AM');

  const [patientName, setPatientName] = useState(currentUser?.name || 'Rahul Verma');
  const [patientPhone, setPatientPhone] = useState(currentUser?.phone || '+91-98765-11223');
  const [patientEmail, setPatientEmail] = useState(currentUser?.email || 'patient@medconnect.ai');
  const [symptoms, setSymptoms] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'Pay at Hospital' | 'Insurance Covered' | 'Paid'>('Pay at Hospital');
  const [isSuccess, setIsSuccess] = useState(false);

  const availableDoctors = doctors.filter(
    (d) => d.hospitalId === selectedHospital.id && d.specialization.toLowerCase() === selectedDepartment.toLowerCase()
  );

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();

    bookAppointment({
      patientId: currentUser?.id || 'guest-patient',
      patientName,
      patientPhone,
      patientEmail,
      patientAge: 30,
      patientGender: currentUser?.gender || 'Male',
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      hospitalId: selectedHospital.id,
      hospitalName: selectedHospital.name,
      department: selectedDepartment,
      date,
      timeSlot,
      symptoms: symptoms || 'General Checkup',
      fee: selectedDoctor.consultationFee,
      paymentStatus: paymentMethod,
    });

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // ignore
    }

    setIsSuccess(true);
    showToast('Appointment Confirmed! 🎉', `Email notification sent to ${patientEmail}.`, 'success');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-slate-950/90">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
        >
          {/* Top Bar */}
          <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/40">
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-500" /> MedConnect Guided Appointment Booking
            </h3>
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Header */}
          {!isSuccess && (
            <div className="px-6 py-3 bg-sky-50/50 dark:bg-sky-950/30 border-b border-sky-100 dark:border-sky-900/40 flex justify-between text-[11px] font-bold text-sky-700 dark:text-sky-300">
              <span className={step >= 1 ? 'font-black text-sky-600 dark:text-sky-400' : 'opacity-40'}>1. Hospital</span>
              <span className={step >= 2 ? 'font-black text-sky-600 dark:text-sky-400' : 'opacity-40'}>2. Department</span>
              <span className={step >= 3 ? 'font-black text-sky-600 dark:text-sky-400' : 'opacity-40'}>3. Doctor</span>
              <span className={step >= 4 ? 'font-black text-sky-600 dark:text-sky-400' : 'opacity-40'}>4. Slot</span>
              <span className={step >= 5 ? 'font-black text-sky-600 dark:text-sky-400' : 'opacity-40'}>5. Confirm</span>
            </div>
          )}

          <div className="p-6 sm:p-8 space-y-6">
            {isSuccess ? (
              /* Success Screen */
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Appointment Successfully Booked!
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                  A confirmation email with calendar invite has been dispatched to <strong className="text-slate-800 dark:text-slate-200">{patientEmail}</strong>.
                </p>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-left text-xs space-y-2 border border-slate-200 dark:border-slate-700 max-w-md mx-auto">
                  <div><span className="text-slate-400">Doctor:</span> <strong className="text-slate-900 dark:text-white">{selectedDoctor.name}</strong></div>
                  <div><span className="text-slate-400">Hospital:</span> <strong className="text-slate-900 dark:text-white">{selectedHospital.name}</strong></div>
                  <div><span className="text-slate-400">Date & Slot:</span> <strong className="text-sky-600 dark:text-sky-400">{date} at {timeSlot}</strong></div>
                  <div><span className="text-slate-400">Fee Payment:</span> <strong className="text-emerald-600">{paymentMethod} (₹{selectedDoctor.consultationFee})</strong></div>
                </div>

                <button
                  onClick={onClose}
                  className="py-3 px-8 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  View in Patient Dashboard
                </button>
              </div>
            ) : (
              /* Wizard Steps */
              <div>
                {step === 1 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Step 1: Select Hospital</h4>
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {hospitals.map((h) => (
                        <div
                          key={h.id}
                          onClick={() => {
                            setSelectedHospital(h);
                            setSelectedDepartment(h.departments[0] || 'Cardiology');
                            setStep(2);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                            selectedHospital.id === h.id
                              ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/40'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <div>
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{h.name}</h5>
                            <p className="text-[11px] text-slate-500">{h.address}, {h.city}</p>
                          </div>
                          <Building2 className="w-5 h-5 text-sky-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Step 2: Select Clinical Department at {selectedHospital.name}
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedHospital.departments.map((dept) => (
                        <button
                          key={dept}
                          onClick={() => {
                            setSelectedDepartment(dept);
                            const matchDoc = doctors.find((d) => d.hospitalId === selectedHospital.id && d.specialization.toLowerCase() === dept.toLowerCase());
                            if (matchDoc) setSelectedDoctor(matchDoc);
                            setStep(3);
                          }}
                          className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                            selectedDepartment === dept
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                          }`}
                        >
                          {dept} <Stethoscope className="w-4 h-4 opacity-70" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      Step 3: Select Doctor Specialist in {selectedDepartment}
                    </h4>
                    <div className="space-y-3">
                      {(availableDoctors.length > 0 ? availableDoctors : doctors.slice(0, 2)).map((doc) => (
                        <div
                          key={doc.id}
                          onClick={() => {
                            setSelectedDoctor(doc);
                            setStep(4);
                          }}
                          className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center gap-4 ${
                            selectedDoctor.id === doc.id
                              ? 'border-teal-500 bg-teal-50/40 dark:bg-teal-950/30'
                              : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                          }`}
                        >
                          <img src={doc.photo} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                          <div className="flex-1">
                            <h5 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h5>
                            <p className="text-[11px] text-slate-500">{doc.qualification} • Fee: ₹{doc.consultationFee}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Step 4: Date & Time Slot</h4>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Appointment Date</label>
                      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Time Slot</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                        {selectedDoctor.availableSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setTimeSlot(slot)}
                            className={`py-2 px-3 text-xs font-bold rounded-xl border transition-all ${
                              timeSlot === slot ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setStep(5)} className="w-full py-3 bg-sky-600 text-white text-xs font-bold rounded-xl mt-4">
                      Proceed to Details & Confirmation →
                    </button>
                  </div>
                )}

                {step === 5 && (
                  <form onSubmit={handleConfirmBooking} className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">Step 5: Patient Details & Payment Confirmation</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Patient Name</label>
                        <input required type="text" value={patientName} onChange={(e) => setPatientName(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Email (for Confirmation)</label>
                        <input required type="email" value={patientEmail} onChange={(e) => setPatientEmail(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Symptoms / Reason for Visit</label>
                      <input type="text" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} placeholder="Chest pain, headache, routine checkup..." className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Payment Mode</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Pay at Hospital', 'Insurance Covered', 'Paid'].map((pm) => (
                          <button
                            key={pm}
                            type="button"
                            onClick={() => setPaymentMethod(pm as any)}
                            className={`py-2 text-[11px] font-bold rounded-xl border ${paymentMethod === pm ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
                          >
                            {pm}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 mt-2">
                      Confirm & Generate Booking Ticket
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

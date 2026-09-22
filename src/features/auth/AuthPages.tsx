import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Stethoscope,
  Building2,
  Lock,
  Mail,
  Heart,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { useToast } from '../../components/ui/Toast';

interface AuthPagesProps {
  initialMode?: 'login' | 'register';
  onSuccessNavigate: (tab: string) => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({ initialMode = 'login', onSuccessNavigate }) => {
  const { currentRole, selectRole, login, registerPatient, registerDoctor, registerAdmin } = useAuth();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [selectedRoleTab, setSelectedRoleTab] = useState<UserRole>(currentRole || 'patient');

  // Common fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  // Patient
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [mediclaimProvider, setMediclaimProvider] = useState('');
  const [mediclaimNumber, setMediclaimNumber] = useState('');

  // Doctor
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [experienceYears, setExperienceYears] = useState(5);
  const [medicalRegNo, setMedicalRegNo] = useState('');
  const [consultationFee, setConsultationFee] = useState(1000);

  // Admin
  const [hospitalName, setHospitalName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [state, setState] = useState('Delhi');
  const [pincode, setPincode] = useState('110001');

  const handleRoleChange = (role: UserRole) => {
    setSelectedRoleTab(role);
    selectRole(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Validation Error', 'Please enter both email and password.', 'warning');
      return;
    }
    const res = login(email, password, selectedRoleTab);
    if (res.success) {
      showToast('OTP Dispatched', res.message, 'info');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast('Password Mismatch', 'Password and Confirm Password do not match.', 'error');
      return;
    }

    if (selectedRoleTab === 'patient') {
      registerPatient({ name, email, phone, dob, gender, address, bloodGroup, emergencyContact, mediclaimProvider, mediclaimNumber });
      showToast('Registration Successful 🎉', 'Welcome to MedConnect AI Patient Portal.', 'success');
      onSuccessNavigate('patient-dashboard');
    } else if (selectedRoleTab === 'doctor') {
      registerDoctor({ name, email, phone, qualification, specialization, experienceYears: Number(experienceYears), medicalRegistrationNumber: medicalRegNo, consultationFee: Number(consultationFee) });
      showToast('Doctor Registration Submitted 🎉', 'Welcome to MedConnect AI Doctor Workstation.', 'success');
      onSuccessNavigate('doctor-dashboard');
    } else if (selectedRoleTab === 'admin') {
      registerAdmin({ name: hospitalName, ownerName, registrationNumber, address, city, state, pincode, email, phone });
      showToast('Hospital Admin Registered 🎉', 'Welcome to MedConnect Multi-Hospital Dashboard.', 'success');
      onSuccessNavigate('admin-dashboard');
    } else {
      selectRole('guest');
      onSuccessNavigate('hospitals');
    }
  };

  return (
    <div
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden"
      style={{ background: 'var(--bg-base)' }}
    >
      {/* Ambient backgrounds */}
      <div className="absolute top-0 left-0 w-[40vw] h-[40vw] rounded-full bg-[var(--green-dim)] pointer-events-none opacity-30" />
      <div className="absolute bottom-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[var(--sage-light)] pointer-events-none opacity-30" />

      <div className="w-full max-w-xl space-y-8 relative z-10 animate-fade-up">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div
            className="inline-flex p-3.5 rounded-[var(--r-md)] mb-2"
            style={{ background: 'var(--green-light)' }}
          >
            <Heart className="w-8 h-8" style={{ color: 'var(--green)', fill: 'var(--green-dim)' }} />
          </div>
          <h2 className="display-font" style={{ fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            {mode === 'login' ? 'Sign In to MedConnect' : 'Create an Account'}
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {mode === 'login'
              ? 'Select your role and authenticate via secure OTP.'
              : 'Join the premium healthcare platform for patients and providers.'}
          </p>
        </div>

        {/* Role Selector */}
        <div
          className="p-2 rounded-[var(--r-md)] grid grid-cols-4 gap-1"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          {[
            { id: 'patient', icon: UserIcon, label: 'Patient' },
            { id: 'doctor', icon: Stethoscope, label: 'Doctor' },
            { id: 'admin', icon: Building2, label: 'Admin' },
            { id: 'guest', icon: UserCheck, label: 'Guest' },
          ].map((role) => (
            <button
              key={role.id}
              onClick={() => handleRoleChange(role.id as UserRole)}
              className="py-2.5 px-3 rounded-xl text-xs font-semibold transition-all flex flex-col items-center gap-1.5"
              style={{
                background: selectedRoleTab === role.id ? 'var(--green)' : 'transparent',
                color: selectedRoleTab === role.id ? '#fff' : 'var(--text-secondary)',
                boxShadow: selectedRoleTab === role.id ? 'var(--shadow-sm)' : 'none',
              }}
            >
              <role.icon className="w-4 h-4" /> {role.label}
            </button>
          ))}
        </div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 sm:p-8"
        >
          {mode === 'login' ? (
            /* ── LOGIN ── */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3.5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRoleTab === 'doctor' ? 'doctor@medconnect.ai' :
                      selectedRoleTab === 'admin' ? 'admin@medconnect.ai' : 'patient@medconnect.ai'
                    }
                    className="input-base pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-3.5" style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-base pl-11"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--text-secondary)' }}>
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 text-[var(--green)] focus:ring-[var(--green)]" />
                  Remember Me
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password Reset', 'Reset instructions sent.', 'info')}
                  className="font-semibold hover:underline"
                  style={{ color: 'var(--green)' }}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="btn btn-primary w-full py-3.5 text-[0.875rem]">
                Sign In Securely
              </button>
            </form>
          ) : (
            /* ── REGISTER ── */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* PATIENT */}
              {selectedRoleTab === 'patient' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Full Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Verma" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Date of Birth</label>
                      <input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="input-base" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="input-base">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Blood Group</label>
                      <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="input-base">
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Phone Number</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-98765" className="input-base" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@example.com" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Emergency Contact</label>
                      <input required type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="+91-99999" className="input-base" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Address</label>
                    <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="City, State" className="input-base" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Mediclaim Provider</label>
                      <input type="text" value={mediclaimProvider} onChange={(e) => setMediclaimProvider(e.target.value)} placeholder="Provider Name" className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Policy No (Optional)</label>
                      <input type="text" value={mediclaimNumber} onChange={(e) => setMediclaimNumber(e.target.value)} placeholder="POL-XXX" className="input-base" />
                    </div>
                  </div>
                </>
              )}

              {/* DOCTOR */}
              {selectedRoleTab === 'doctor' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Doctor Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Medical Reg No.</label>
                      <input required type="text" value={medicalRegNo} onChange={(e) => setMedicalRegNo(e.target.value)} className="input-base" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Specialization</label>
                      <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="input-base">
                        {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Qualifications</label>
                      <input required type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} className="input-base" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Experience (Yrs)</label>
                      <input required type="number" value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Fee (₹)</label>
                      <input required type="number" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Phone</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-base" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Email</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" />
                  </div>
                </>
              )}

              {/* ADMIN */}
              {selectedRoleTab === 'admin' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Hospital Name</label>
                      <input required type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Manager Name</label>
                      <input required type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} className="input-base" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Registration No</label>
                      <input required type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>City</label>
                      <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} className="input-base" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Address</label>
                    <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="input-base" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Admin Email</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-base" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Contact Phone</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="input-base" />
                    </div>
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 mt-1" style={{ borderTop: '1px solid var(--border)' }}>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Password</label>
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="input-base" />
                </div>
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Confirm Password</label>
                  <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="input-base" />
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full py-3.5 mt-2 text-[0.875rem]">
                Create Account
              </button>
            </form>
          )}

          {/* Toggle Mode Footer */}
          <div className="mt-6 pt-5 text-center text-xs" style={{ borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button type="button" onClick={() => setMode('register')} className="font-bold hover:underline" style={{ color: 'var(--green)' }}>
                  Create New Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button type="button" onClick={() => setMode('login')} className="font-bold hover:underline" style={{ color: 'var(--green)' }}>
                  Sign In Here
                </button>
              </p>
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
};

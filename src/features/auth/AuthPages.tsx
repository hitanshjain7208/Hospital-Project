import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Stethoscope,
  Building2,
  Lock,
  Mail,
  Phone,
  MapPin,
  Heart,
  ShieldCheck,
  Calendar,
  AlertCircle,
  FileText,
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

  // Patient Registration specific fields
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [mediclaimProvider, setMediclaimProvider] = useState('');
  const [mediclaimNumber, setMediclaimNumber] = useState('');

  // Doctor Registration specific fields
  const [qualification, setQualification] = useState('');
  const [specialization, setSpecialization] = useState('Cardiology');
  const [experienceYears, setExperienceYears] = useState(5);
  const [medicalRegNo, setMedicalRegNo] = useState('');
  const [consultationFee, setConsultationFee] = useState(1000);

  // Hospital Admin Registration specific fields
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
      registerPatient({
        name,
        email,
        phone,
        dob,
        gender,
        address,
        bloodGroup,
        emergencyContact,
        mediclaimProvider,
        mediclaimNumber,
      });
      showToast('Registration Successful 🎉', 'Welcome to MedConnect AI Patient Portal.', 'success');
      onSuccessNavigate('patient-dashboard');
    } else if (selectedRoleTab === 'doctor') {
      registerDoctor({
        name,
        email,
        phone,
        qualification,
        specialization,
        experienceYears: Number(experienceYears),
        medicalRegistrationNumber: medicalRegNo,
        consultationFee: Number(consultationFee),
      });
      showToast('Doctor Registration Submitted 🎉', 'Welcome to MedConnect AI Doctor Workstation.', 'success');
      onSuccessNavigate('doctor-dashboard');
    } else if (selectedRoleTab === 'admin') {
      registerAdmin({
        name: hospitalName,
        ownerName,
        registrationNumber,
        address,
        city,
        state,
        pincode,
        email,
        phone,
      });
      showToast('Hospital Admin Registered 🎉', 'Welcome to MedConnect Multi-Hospital Dashboard.', 'success');
      onSuccessNavigate('admin-dashboard');
    } else {
      selectRole('guest');
      onSuccessNavigate('hospitals');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center transition-colors">
      <div className="w-full max-w-xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-2">
            <Heart className="w-8 h-8 fill-sky-500/20" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {mode === 'login' ? 'Sign In to MedConnect AI' : 'Create Enterprise Account'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {mode === 'login'
              ? 'Select your role below and authenticate via email OTP'
              : 'Register your account to access digital healthcare services'}
          </p>
        </div>

        {/* First Landing Screen Dropdown / Role Selector Tabs */}
        <div className="bg-white dark:bg-slate-900 p-2 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-4 gap-1">
          <button
            onClick={() => handleRoleChange('patient')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRoleTab === 'patient'
                ? 'bg-sky-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserIcon className="w-4 h-4" /> Patient
          </button>

          <button
            onClick={() => handleRoleChange('doctor')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRoleTab === 'doctor'
                ? 'bg-teal-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Stethoscope className="w-4 h-4" /> Doctor
          </button>

          <button
            onClick={() => handleRoleChange('admin')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRoleTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> Admin
          </button>

          <button
            onClick={() => handleRoleChange('guest')}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              selectedRoleTab === 'guest'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Guest
          </button>
        </div>

        {/* Card Form Wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 dark:border-slate-800"
        >
          {mode === 'login' ? (
            /* Login Form */
            <form onSubmit={handleLoginSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      selectedRoleTab === 'doctor'
                        ? 'doctor@medconnect.ai'
                        : selectedRoleTab === 'admin'
                        ? 'admin@medconnect.ai'
                        : 'patient@medconnect.ai'
                    }
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <input type="checkbox" defaultChecked className="rounded text-sky-600" /> Remember Me
                </label>
                <button
                  type="button"
                  onClick={() => showToast('Password Reset', 'Password reset instructions sent to your email.', 'info')}
                  className="text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                >
                  Forgot Password?
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-transform active:scale-98"
              >
                Sign In with Email OTP
              </button>
            </form>
          ) : (
            /* Registration Forms */
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* PATIENT REGISTRATION FORM */}
              {selectedRoleTab === 'patient' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Verma" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Date of Birth</label>
                      <input required type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Gender</label>
                      <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Blood Group</label>
                      <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map((bg) => (
                          <option key={bg} value={bg}>{bg}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-98765-43210" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@example.com" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Emergency Contact</label>
                      <input required type="text" value={emergencyContact} onChange={(e) => setEmergencyContact(e.target.value)} placeholder="+91-98765-99999 (Spouse)" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Residential Address</label>
                    <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House No, Street Name, City, State" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mediclaim Provider</label>
                      <input type="text" value={mediclaimProvider} onChange={(e) => setMediclaimProvider(e.target.value)} placeholder="Star Health / ICICI Lombard" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Mediclaim Policy No (Optional)</label>
                      <input type="text" value={mediclaimNumber} onChange={(e) => setMediclaimNumber(e.target.value)} placeholder="POL-8819201" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                </>
              )}

              {/* DOCTOR REGISTRATION FORM */}
              {selectedRoleTab === 'doctor' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Doctor Name</label>
                      <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Rajesh Sharma" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Medical Registration No.</label>
                      <input required type="text" value={medicalRegNo} onChange={(e) => setMedicalRegNo(e.target.value)} placeholder="DMC-CARD-88192" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                      <select value={specialization} onChange={(e) => setSpecialization(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                        {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology', 'Oncology', 'Gastroenterology'].map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Qualifications</label>
                      <input required type="text" value={qualification} onChange={(e) => setQualification(e.target.value)} placeholder="MBBS, MD, DM" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Experience (Years)</label>
                      <input required type="number" value={experienceYears} onChange={(e) => setExperienceYears(Number(e.target.value))} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Consultation Fee (₹)</label>
                      <input required type="number" value={consultationFee} onChange={(e) => setConsultationFee(Number(e.target.value))} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="doctor@hospital.com" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                  </div>
                </>
              )}

              {/* HOSPITAL ADMIN REGISTRATION FORM */}
              {selectedRoleTab === 'admin' && (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital Name</label>
                      <input required type="text" value={hospitalName} onChange={(e) => setHospitalName(e.target.value)} placeholder="Apollo Super Speciality" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Owner / Manager Name</label>
                      <input required type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} placeholder="Dr. Pratap C. Reddy" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital Reg Number</label>
                      <input required type="text" value={registrationNumber} onChange={(e) => setRegistrationNumber(e.target.value)} placeholder="MED-APO-99482" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
                      <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="New Delhi" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Hospital Address</label>
                    <input required type="text" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Mathura Road, Sarita Vihar" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
                      <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@apollo.com" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Contact Phone</label>
                      <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91-11-2692-5858" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                </>
              )}

              {/* Password Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Password</label>
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                  <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3.5 px-4 bg-gradient-to-r from-sky-600 to-emerald-600 hover:from-sky-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-sky-500/25 transition-transform active:scale-98"
              >
                Register & Verify OTP
              </button>
            </form>
          )}

          {/* Toggle Mode Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500">
            {mode === 'login' ? (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
                  Create New Account
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
                >
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

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  UserRole,
  Hospital,
  Doctor,
  Appointment,
  Prescription,
  Review,
  NotificationItem,
} from '../types';
import {
  INITIAL_HOSPITALS,
  INITIAL_DOCTORS,
  INITIAL_APPOINTMENTS,
  INITIAL_PRESCRIPTIONS,
  INITIAL_REVIEWS,
} from '../services/mockData';

interface AuthContextType {
  currentUser: User | null;
  currentRole: UserRole;
  token: string | null;
  isOtpModalOpen: boolean;
  pendingOtpEmail: string | null;
  hospitals: Hospital[];
  doctors: Doctor[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  reviews: Review[];
  notifications: NotificationItem[];
  // Auth methods
  selectRole: (role: UserRole) => void;
  login: (email: string, pass: string, role: UserRole) => { success: boolean; requiresOtp?: boolean; message?: string };
  verifyOtp: (otpCode: string) => boolean;
  registerPatient: (patientData: Partial<User>) => void;
  registerDoctor: (doctorData: Partial<User> & Partial<Doctor>) => void;
  registerAdmin: (adminData: Partial<User> & Partial<Hospital>) => void;
  logout: () => void;
  closeOtpModal: () => void;
  // Entity actions
  bookAppointment: (apt: Omit<Appointment, 'id' | 'bookingDate' | 'status'>) => Appointment;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  createPrescription: (presData: Omit<Prescription, 'id'>) => Prescription;
  updateHospitalStats: (hospitalId: string, updates: Partial<Hospital>) => void;
  addDoctor: (doctorData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => void;
  addReview: (reviewData: Omit<Review, 'id' | 'date'>) => void;
  markNotificationRead: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo Pre-configured Users
const DEMO_PATIENT: User = {
  id: 'patient-demo',
  role: 'patient',
  name: 'Rahul Verma',
  email: 'patient@medconnect.ai',
  phone: '+91-98765-11223',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  isOtpVerified: true,
  dob: '1992-05-14',
  gender: 'Male',
  address: 'B-42, South Extension Part II, New Delhi',
  bloodGroup: 'O+',
  emergencyContact: '+91-98765-99999 (Wife: Neha)',
  mediclaimProvider: 'Star Health & Allied Insurance',
  mediclaimNumber: 'SH-POL-99201948',
  mediclaimExpiry: '2027-12-31',
  mediclaimStatus: 'Active',
};

const DEMO_DOCTOR: User = {
  id: 'user-doc-1',
  role: 'doctor',
  name: 'Dr. Rajesh Sharma',
  email: 'doctor@medconnect.ai',
  phone: '+91-98112-34567',
  avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80',
  isOtpVerified: true,
  qualification: 'MBBS, MD (Gen Med), DM (Cardiology)',
  specialization: 'Cardiology',
  experienceYears: 18,
  hospitalId: 'hosp-1',
  medicalRegNo: 'DMC-CARD-88192',
  consultationFee: 1200,
};

const DEMO_ADMIN: User = {
  id: 'admin-demo',
  role: 'admin',
  name: 'Dr. Pratap C. Reddy (Admin)',
  email: 'admin@medconnect.ai',
  phone: '+91-11-2692-5858',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
  isOtpVerified: true,
  ownerName: 'Dr. Pratap C. Reddy',
  hospitalRegNo: 'MED-APO-99482',
  hospitalId: 'hosp-1',
};

const GUEST_USER: User = {
  id: 'guest-user',
  role: 'guest',
  name: 'Regular Guest User',
  email: 'guest@medconnect.ai',
  phone: '',
  isOtpVerified: false,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('medconnect_user');
    return saved ? JSON.parse(saved) : DEMO_PATIENT; // Default active session for instant testing
  });

  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    return currentUser ? currentUser.role : 'patient';
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('medconnect_token') || 'demo_jwt_token_header_xxx';
  });

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [pendingOtpEmail, setPendingOtpEmail] = useState<string | null>(null);

  // Entities state with LocalStorage persistence
  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const saved = localStorage.getItem('medconnect_hospitals');
    return saved ? JSON.parse(saved) : INITIAL_HOSPITALS;
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const saved = localStorage.getItem('medconnect_doctors');
    return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('medconnect_appointments');
    return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
  });

  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem('medconnect_prescriptions');
    return saved ? JSON.parse(saved) : INITIAL_PRESCRIPTIONS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('medconnect_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      userId: 'patient-demo',
      title: 'Appointment Confirmed',
      message: 'Your Cardiology appointment with Dr. Rajesh Sharma is confirmed for Sept 24, 10:30 AM.',
      type: 'appointment',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: 'notif-2',
      userId: 'patient-demo',
      title: 'New Digital Prescription Available',
      message: 'Dr. Meera Kapoor has uploaded your digital prescription with PDF download.',
      type: 'prescription',
      timestamp: 'Yesterday',
      read: true,
    }
  ]);

  // Sync to LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('medconnect_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('medconnect_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('medconnect_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('medconnect_appointments', JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem('medconnect_prescriptions', JSON.stringify(prescriptions));
  }, [prescriptions]);

  const selectRole = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'patient') setCurrentUser(DEMO_PATIENT);
    else if (role === 'doctor') setCurrentUser(DEMO_DOCTOR);
    else if (role === 'admin') setCurrentUser(DEMO_ADMIN);
    else setCurrentUser(GUEST_USER);
  };

  const login = (email: string, pass: string, role: UserRole) => {
    setPendingOtpEmail(email);
    setIsOtpModalOpen(true);
    return {
      success: true,
      requiresOtp: true,
      message: `OTP sent to ${email}. Please enter 123456 to verify.`,
    };
  };

  const verifyOtp = (otpCode: string) => {
    if (otpCode === '123456' || otpCode.length === 6) {
      setIsOtpModalOpen(false);
      const fakeToken = `jwt_session_${Date.now()}`;
      setToken(fakeToken);
      localStorage.setItem('medconnect_token', fakeToken);

      if (pendingOtpEmail) {
        if (currentRole === 'doctor') setCurrentUser({ ...DEMO_DOCTOR, email: pendingOtpEmail });
        else if (currentRole === 'admin') setCurrentUser({ ...DEMO_ADMIN, email: pendingOtpEmail });
        else if (currentRole === 'guest') setCurrentUser({ ...GUEST_USER, email: pendingOtpEmail });
        else setCurrentUser({ ...DEMO_PATIENT, email: pendingOtpEmail });
      }
      return true;
    }
    return false;
  };

  const closeOtpModal = () => setIsOtpModalOpen(false);

  const registerPatient = (patientData: Partial<User>) => {
    const newUser: User = {
      id: `pat-${Date.now()}`,
      role: 'patient',
      name: patientData.name || 'New Patient',
      email: patientData.email || 'patient@example.com',
      phone: patientData.phone || '',
      isOtpVerified: true,
      dob: patientData.dob,
      gender: patientData.gender,
      address: patientData.address,
      bloodGroup: patientData.bloodGroup,
      emergencyContact: patientData.emergencyContact,
      mediclaimProvider: patientData.mediclaimProvider,
      mediclaimNumber: patientData.mediclaimNumber,
      mediclaimStatus: 'Pending Verification',
    };
    setCurrentUser(newUser);
    setCurrentRole('patient');
    setToken(`jwt_${Date.now()}`);
  };

  const registerDoctor = (doctorData: Partial<User> & Partial<Doctor>) => {
    const docUserId = `user-doc-${Date.now()}`;
    const newDocObj: Doctor = {
      id: `doc-${Date.now()}`,
      userId: docUserId,
      hospitalId: doctorData.hospitalId || 'hosp-1',
      hospitalName: 'Apollo Multi-Speciality Super Hospital',
      name: doctorData.name || 'Dr. New Specialist',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
      qualification: doctorData.qualification || 'MBBS, MD',
      specialization: doctorData.specialization || 'General Medicine',
      experienceYears: doctorData.experienceYears || 5,
      medicalRegistrationNumber: doctorData.medicalRegistrationNumber || 'REG-99120',
      email: doctorData.email || 'doctor@example.com',
      phone: doctorData.phone || '',
      consultationFee: doctorData.consultationFee || 1000,
      languages: ['English', 'Hindi'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      rating: 5.0,
      reviewCount: 1,
      bio: 'Newly registered medical specialist.',
    };

    setDoctors((prev) => [newDocObj, ...prev]);

    const newUser: User = {
      id: docUserId,
      role: 'doctor',
      name: newDocObj.name,
      email: newDocObj.email,
      phone: newDocObj.phone,
      isOtpVerified: true,
      qualification: newDocObj.qualification,
      specialization: newDocObj.specialization,
      experienceYears: newDocObj.experienceYears,
      hospitalId: newDocObj.hospitalId,
      medicalRegNo: newDocObj.medicalRegistrationNumber,
      consultationFee: newDocObj.consultationFee,
    };

    setCurrentUser(newUser);
    setCurrentRole('doctor');
    setToken(`jwt_${Date.now()}`);
  };

  const registerAdmin = (adminData: Partial<User> & Partial<Hospital>) => {
    const newHospId = `hosp-${Date.now()}`;
    const newHospital: Hospital = {
      id: newHospId,
      name: adminData.name || 'New Healthcare Hospital',
      tagline: 'Modern Quality Healthcare Services',
      registrationNumber: adminData.registrationNumber || `REG-HOSP-${Date.now()}`,
      ownerName: adminData.ownerName || 'Admin Owner',
      address: adminData.address || 'Central City Road',
      city: adminData.city || 'New Delhi',
      state: adminData.state || 'Delhi',
      pincode: adminData.pincode || '110001',
      email: adminData.email || 'admin@hospital.com',
      phone: adminData.phone || '+91-11-2000-3000',
      emergencyNumber: '102 / 108',
      latitude: 28.5355,
      longitude: 77.2882,
      images: ['https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=1000&q=80'],
      description: 'Fully registered multi-speciality hospital facility.',
      departments: ['Emergency', 'General Medicine', 'Cardiology', 'Pediatrics'],
      treatments: ['Outpatient Consultation', 'Emergency Triage', 'ICU Care'],
      totalBeds: 200,
      availableBeds: 45,
      totalICUBeds: 30,
      availableICUBeds: 8,
      hasAmbulance: true,
      workingHours: '24/7 Emergency',
      rating: 5.0,
      reviewCount: 1,
    };

    setHospitals((prev) => [newHospital, ...prev]);

    const newUser: User = {
      id: `admin-${Date.now()}`,
      role: 'admin',
      name: `${adminData.ownerName} (Admin)`,
      email: adminData.email || 'admin@hospital.com',
      phone: adminData.phone || '',
      isOtpVerified: true,
      ownerName: adminData.ownerName,
      hospitalRegNo: newHospital.registrationNumber,
      hospitalId: newHospId,
    };

    setCurrentUser(newUser);
    setCurrentRole('admin');
    setToken(`jwt_${Date.now()}`);
  };

  const logout = () => {
    setCurrentUser(GUEST_USER);
    setCurrentRole('guest');
    setToken(null);
    localStorage.removeItem('medconnect_token');
    localStorage.removeItem('medconnect_user');
  };

  // Entity Actions
  const bookAppointment = (apt: Omit<Appointment, 'id' | 'bookingDate' | 'status'>): Appointment => {
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      bookingDate: new Date().toISOString().split('T')[0],
      status: 'confirmed',
    };

    setAppointments((prev) => [newApt, ...prev]);

    // Send in-app notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: apt.patientId,
        title: 'Appointment Booked Successfully 🎉',
        message: `Your appointment with ${apt.doctorName} at ${apt.hospitalName} is confirmed for ${apt.date} at ${apt.timeSlot}.`,
        type: 'appointment',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const createPrescription = (presData: Omit<Prescription, 'id'>): Prescription => {
    const newPres: Prescription = {
      ...presData,
      id: `pres-${Date.now()}`,
    };
    setPrescriptions((prev) => [newPres, ...prev]);

    // Link to appointment
    setAppointments((prev) =>
      prev.map((a) => (a.id === presData.appointmentId ? { ...a, status: 'completed', prescriptionId: newPres.id } : a))
    );

    // Send in-app notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: presData.patientId,
        title: 'Prescription Uploaded 📋',
        message: `${presData.doctorName} has issued a digital prescription for your consultation on ${presData.date}.`,
        type: 'prescription',
        timestamp: 'Just now',
        read: false,
      },
      ...prev,
    ]);

    return newPres;
  };

  const updateHospitalStats = (hospitalId: string, updates: Partial<Hospital>) => {
    setHospitals((prev) =>
      prev.map((h) => (h.id === hospitalId ? { ...h, ...updates } : h))
    );
  };

  const addDoctor = (doctorData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => {
    const newDoc: Doctor = {
      ...doctorData,
      id: `doc-${Date.now()}`,
      rating: 5.0,
      reviewCount: 0,
    };
    setDoctors((prev) => [newDoc, ...prev]);
  };

  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
    };

    setReviews((prev) => [newRev, ...prev]);

    // Recalculate average rating for target hospital/doctor
    if (reviewData.targetType === 'hospital') {
      const targetRevs = [...reviews, newRev].filter((r) => r.targetId === reviewData.targetId);
      const avg = targetRevs.reduce((acc, curr) => acc + curr.rating, 0) / targetRevs.length;
      updateHospitalStats(reviewData.targetId, {
        rating: Math.round(avg * 10) / 10,
        reviewCount: targetRevs.length,
      });
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole,
        token,
        isOtpModalOpen,
        pendingOtpEmail,
        hospitals,
        doctors,
        appointments,
        prescriptions,
        reviews,
        notifications,
        selectRole,
        login,
        verifyOtp,
        registerPatient,
        registerDoctor,
        registerAdmin,
        logout,
        closeOtpModal,
        bookAppointment,
        updateAppointmentStatus,
        createPrescription,
        updateHospitalStats,
        addDoctor,
        addReview,
        markNotificationRead,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

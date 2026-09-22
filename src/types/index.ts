export type UserRole = 'patient' | 'doctor' | 'admin' | 'guest';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  isOtpVerified: boolean;
  // Patient fields
  dob?: string;
  gender?: 'Male' | 'Female' | 'Other';
  address?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  mediclaimProvider?: string;
  mediclaimNumber?: string;
  mediclaimExpiry?: string;
  mediclaimStatus?: 'Active' | 'Pending Verification' | 'Expired';
  // Doctor fields
  qualification?: string;
  specialization?: string;
  experienceYears?: number;
  hospitalId?: string;
  medicalRegNo?: string;
  consultationFee?: number;
  // Admin fields
  ownerName?: string;
  hospitalRegNo?: string;
}

export interface EmergencyCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  color: string;
}

export interface Hospital {
  id: string;
  name: string;
  tagline: string;
  registrationNumber: string;
  ownerName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  email: string;
  phone: string;
  emergencyNumber: string;
  latitude: number;
  longitude: number;
  images: string[];
  description: string;
  departments: string[];
  treatments: string[];
  totalBeds: number;
  availableBeds: number;
  totalICUBeds: number;
  availableICUBeds: number;
  hasAmbulance: boolean;
  workingHours: string;
  rating: number;
  reviewCount: number;
}

export interface Doctor {
  id: string;
  userId: string;
  hospitalId: string;
  hospitalName: string;
  name: string;
  photo: string;
  qualification: string;
  specialization: string;
  experienceYears: number;
  medicalRegistrationNumber: string;
  email: string;
  phone: string;
  consultationFee: number;
  languages: string[];
  availableDays: string[];
  availableSlots: string[]; // e.g. ["09:00 AM", "10:00 AM", "02:00 PM"]
  rating: number;
  reviewCount: number;
  bio: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge?: number;
  patientGender?: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalId: string;
  hospitalName: string;
  department: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // e.g., "10:30 AM"
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  symptoms: string;
  bookingDate: string;
  fee: number;
  paymentStatus: 'Paid' | 'Pay at Hospital' | 'Insurance Covered';
  prescriptionId?: string;
}

export interface MedicinePrescribed {
  name: string;
  dosage: string; // e.g., "500mg"
  frequency: string; // e.g., "1-0-1 (After Meals)"
  durationDays: number;
  instructions?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorRegistration: string;
  doctorSpecialization: string;
  hospitalId: string;
  hospitalName: string;
  hospitalLogo?: string;
  date: string;
  vitals?: {
    bloodPressure?: string;
    pulseRate?: string;
    temperature?: string;
    weightKg?: string;
  };
  diagnosis: string;
  medicines: MedicinePrescribed[];
  advice: string;
  followUpDate?: string;
  digitalSignatureUrl?: string;
  medicalNotes?: string;
}

export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  targetId: string; // hospitalId or doctorId
  targetType: 'hospital' | 'doctor';
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'appointment' | 'prescription' | 'emergency' | 'system';
  timestamp: string;
  read: boolean;
}

export interface AIMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  imageUrl?: string;
  disclaimer?: string;
  suggestedDepartment?: string;
  actionableLinks?: { label: string; url: string }[];
}

export interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  city: string | null;
  address: string | null;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}

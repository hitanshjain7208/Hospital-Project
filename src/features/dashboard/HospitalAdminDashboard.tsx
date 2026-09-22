import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Bed,
  Stethoscope,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  Clock,
  ShieldCheck,
  PhoneCall,
  Activity,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { Hospital, Doctor } from '../../types';
import { useToast } from '../../components/ui/Toast';

export const HospitalAdminDashboard: React.FC = () => {
  const { hospitals, doctors, appointments, updateHospitalStats, addDoctor } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'hospital-profile' | 'doctors' | 'appointments'>('analytics');

  const myHospital = hospitals.find((h) => h.id === 'hosp-1') || hospitals[0];
  const myDoctors = doctors.filter((d) => d.hospitalId === myHospital.id);

  // Form states for hospital stats update
  const [totalBeds, setTotalBeds] = useState(myHospital.totalBeds);
  const [availableBeds, setAvailableBeds] = useState(myHospital.availableBeds);
  const [totalICU, setTotalICU] = useState(myHospital.totalICUBeds);
  const [availableICU, setAvailableICU] = useState(myHospital.availableICUBeds);

  // Form states for Adding Doctor
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [newDocName, setNewDocName] = useState('');
  const [newDocSpec, setNewDocSpec] = useState('Cardiology');
  const [newDocQual, setNewDocQual] = useState('MBBS, MD');
  const [newDocExp, setNewDocExp] = useState(8);
  const [newDocFee, setNewDocFee] = useState(1200);

  // Chart Analytics Data
  const appointmentTrends = [
    { day: 'Mon', visits: 45, revenue: 54000, emergency: 8 },
    { day: 'Tue', visits: 58, revenue: 69600, emergency: 12 },
    { day: 'Wed', visits: 62, revenue: 74400, emergency: 9 },
    { day: 'Thu', visits: 70, revenue: 84000, emergency: 15 },
    { day: 'Fri', visits: 85, revenue: 102000, emergency: 18 },
    { day: 'Sat', visits: 92, revenue: 110400, emergency: 22 },
    { day: 'Sun', visits: 60, revenue: 72000, emergency: 14 },
  ];

  const departmentUtilization = [
    { name: 'Cardiology', value: 35, color: '#0284C7' },
    { name: 'Neurology', value: 25, color: '#14B8A6' },
    { name: 'Orthopedics', value: 20, color: '#10B981' },
    { name: 'Pediatrics', value: 15, color: '#F59E0B' },
    { name: 'Emergency', value: 5, color: '#EF4444' },
  ];

  const handleUpdateHospitalStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalStats(myHospital.id, {
      totalBeds: Number(totalBeds),
      availableBeds: Number(availableBeds),
      totalICUBeds: Number(totalICU),
      availableICUBeds: Number(availableICU),
    });
    showToast('Hospital Bed Inventory Saved 🎉', 'Real-time counters updated across network.', 'success');
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName) return;

    addDoctor({
      userId: `user-doc-${Date.now()}`,
      hospitalId: myHospital.id,
      hospitalName: myHospital.name,
      name: newDocName,
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=500&q=80',
      qualification: newDocQual,
      specialization: newDocSpec,
      experienceYears: Number(newDocExp),
      medicalRegistrationNumber: `REG-DMC-${Date.now()}`,
      email: `${newDocName.toLowerCase().replace(/\s+/g, '.')}@${myHospital.name.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: '+91-98000-11111',
      consultationFee: Number(newDocFee),
      languages: ['English', 'Hindi'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      availableSlots: ['10:00 AM', '12:00 PM', '03:00 PM'],
      bio: 'Verified clinical specialist staff member.',
    });

    showToast('Doctor Added to Hospital Staff 🎉', `${newDocName} registered successfully.`, 'success');
    setIsAddDoctorModalOpen(false);
    setNewDocName('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Hospital Admin Header Banner */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
              Hospital Admin Suite
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              {myHospital.name}
            </h1>
            <p className="text-emerald-100 text-xs sm:text-sm">
              Reg No: <strong className="text-white">{myHospital.registrationNumber}</strong> • Manager: <strong className="text-white">{myHospital.ownerName}</strong>
            </p>
          </div>

          <div className="flex gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-xs text-center">
            <div>
              <span className="block text-emerald-100 text-[10px] uppercase">Free General Beds</span>
              <strong className="text-xl font-bold">{myHospital.availableBeds} / {myHospital.totalBeds}</strong>
            </div>
            <div className="border-l border-white/20 pl-4">
              <span className="block text-emerald-100 text-[10px] uppercase">Free ICU Beds</span>
              <strong className="text-xl font-bold text-sky-200">{myHospital.availableICUBeds} / {myHospital.totalICUBeds}</strong>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'analytics'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Analytics & Revenue Dashboard
          </button>
          <button
            onClick={() => setActiveTab('hospital-profile')}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'hospital-profile'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Hospital Bed & Emergency Inventory
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`pb-3 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
              activeTab === 'doctors'
                ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Manage Doctors & Staff ({myDoctors.length})
          </button>
        </div>

        {/* Tab 1: Revenue & Utilization Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            
            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Weekly Revenue</span>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">₹5,69,400</h4>
                <p className="text-[11px] text-emerald-500 font-bold">+14.2% from last week</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Total Patients Visited</span>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">475 Patients</h4>
                <p className="text-[11px] text-sky-500 font-bold">98.4% Satisfaction Rate</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Emergency Cases Handled</span>
                <h4 className="text-2xl font-black text-rose-500">98 Cases</h4>
                <p className="text-[11px] text-slate-400">Avg response: 4.2 mins</p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase">Doctor Utilization</span>
                <h4 className="text-2xl font-black text-teal-500">92% Capacity</h4>
                <p className="text-[11px] text-slate-400">Across 5 departments</p>
              </div>
            </div>

            {/* Recharts Analytics Graphs */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Daily Visits & Revenue Chart */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Daily Patient Visits & Revenue Trend
                </h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appointmentTrends}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0284C7" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#0284C7" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="day" stroke="#94A3B8" />
                      <YAxis stroke="#94A3B8" />
                      <Tooltip />
                      <Area type="monotone" dataKey="visits" stroke="#0284C7" fillOpacity={1} fill="url(#colorVisits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Department Utilization Donut Chart */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Department Utilization Breakdown
                </h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentUtilization}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {departmentUtilization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 text-xs">
                  {departmentUtilization.map((dept) => (
                    <div key={dept.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="text-slate-600 dark:text-slate-300 font-medium">{dept.name}</span>
                      </span>
                      <strong className="text-slate-900 dark:text-white">{dept.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

        {/* Tab 2: Hospital Bed & ICU Inventory */}
        {activeTab === 'hospital-profile' && (
          <form onSubmit={handleUpdateHospitalStats} className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Manage Live Bed & ICU Availability Counters
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total General Beds</label>
                <input
                  type="number"
                  value={totalBeds}
                  onChange={(e) => setTotalBeds(Number(e.target.value))}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Available Free General Beds</label>
                <input
                  type="number"
                  value={availableBeds}
                  onChange={(e) => setAvailableBeds(Number(e.target.value))}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total ICU Beds</label>
                <input
                  type="number"
                  value={totalICU}
                  onChange={(e) => setTotalICU(Number(e.target.value))}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Available Free ICU Beds</label>
                <input
                  type="number"
                  value={availableICU}
                  onChange={(e) => setAvailableICU(Number(e.target.value))}
                  className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/25"
            >
              Update Live Bed Inventory
            </button>
          </form>
        )}

        {/* Tab 3: Doctors Management */}
        {activeTab === 'doctors' && (
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Hospital Specialist Doctors</h3>
              <button
                onClick={() => setIsAddDoctorModalOpen(true)}
                className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" /> Add Doctor Specialist
              </button>
            </div>

            {/* Add Doctor Form Modal */}
            {isAddDoctorModalOpen && (
              <form onSubmit={handleAddDoctorSubmit} className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-4">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Add Doctor Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Doctor Name</label>
                    <input required type="text" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} placeholder="Dr. Sameer Khan" className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Specialization</label>
                    <select value={newDocSpec} onChange={(e) => setNewDocSpec(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                      {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Dermatology'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Qualifications</label>
                    <input required type="text" value={newDocQual} onChange={(e) => setNewDocQual(e.target.value)} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Experience Years</label>
                    <input required type="number" value={newDocExp} onChange={(e) => setNewDocExp(Number(e.target.value))} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">Consultation Fee (₹)</label>
                    <input required type="number" value={newDocFee} onChange={(e) => setNewDocFee(Number(e.target.value))} className="w-full p-2.5 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button type="submit" className="py-2.5 px-5 bg-emerald-600 text-white text-xs font-bold rounded-xl">Save Doctor</button>
                  <button type="button" onClick={() => setIsAddDoctorModalOpen(false)} className="py-2.5 px-5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-xl">Cancel</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myDoctors.map((doc) => (
                <div key={doc.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex gap-4">
                  <img src={doc.photo} alt={doc.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                    <p className="text-[11px] text-slate-500">{doc.specialization} • Fee: ₹{doc.consultationFee}</p>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block mt-1">Available Staff</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

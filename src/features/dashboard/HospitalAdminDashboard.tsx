import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Stethoscope,
  Plus,
  Activity,
  Bed,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

export const HospitalAdminDashboard: React.FC = () => {
  const { hospitals, doctors, updateHospitalStats, addDoctor } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'analytics' | 'hospital-profile' | 'doctors'>('analytics');

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
    { day: 'Mon', visits: 45, revenue: 54000 },
    { day: 'Tue', visits: 58, revenue: 69600 },
    { day: 'Wed', visits: 62, revenue: 74400 },
    { day: 'Thu', visits: 70, revenue: 84000 },
    { day: 'Fri', visits: 85, revenue: 102000 },
    { day: 'Sat', visits: 92, revenue: 110400 },
    { day: 'Sun', visits: 60, revenue: 72000 },
  ];

  const departmentUtilization = [
    { name: 'Cardiology', value: 35, color: '#7DBE7D' }, // green
    { name: 'Neurology', value: 25, color: '#9DC4A0' }, // sage
    { name: 'Orthopedics', value: 20, color: '#F1D8A3' }, // gold (assumed warm tone)
    { name: 'Pediatrics', value: 15, color: '#141E14' }, // dark
    { name: 'Emergency', value: 5, color: '#D46A60' }, // red
  ];

  const handleUpdateHospitalStats = (e: React.FormEvent) => {
    e.preventDefault();
    updateHospitalStats(myHospital.id, {
      totalBeds: Number(totalBeds),
      availableBeds: Number(availableBeds),
      totalICUBeds: Number(totalICU),
      availableICUBeds: Number(availableICU),
    });
    showToast('Hospital Bed Inventory Saved 🎉', 'Real-time counters updated.', 'success');
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
      email: `${newDocName.toLowerCase().replace(/\s+/g, '.')}@hospital.com`,
      phone: '+91-98000-11111',
      consultationFee: Number(newDocFee),
      languages: ['English', 'Hindi'],
      availableDays: ['Monday', 'Tuesday', 'Wednesday'],
      availableSlots: ['10:00 AM', '12:00 PM', '03:00 PM'],
      bio: 'Verified clinical specialist.',
    });

    showToast('Doctor Added 🎉', `${newDocName} registered successfully.`, 'success');
    setIsAddDoctorModalOpen(false);
    setNewDocName('');
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-7xl space-y-12">
        
        {/* Header Banner */}
        <div
          className="relative overflow-hidden rounded-[var(--r-lg)] p-8 sm:p-12 shadow-[var(--shadow-md)] animate-fade-up"
          style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}
        >
          <div className="absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full pointer-events-none opacity-10"
               style={{ background: 'var(--sage-light)', transform: 'translate(20%, -30%)' }} />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
            <div className="space-y-3">
              <div className="eyebrow flex items-center gap-2">
                <Building2 className="w-4 h-4" /> Hospital Admin Suite
              </div>
              <h1 className="display-font" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
                {myHospital.name}
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                Reg No: <strong style={{ color: 'var(--text-primary)' }}>{myHospital.registrationNumber}</strong> • Manager: <strong style={{ color: 'var(--text-primary)' }}>{myHospital.ownerName}</strong>
              </p>
            </div>

            <div className="flex gap-4 p-5 rounded-[var(--r-md)] text-center shadow-[var(--shadow-sm)]" style={{ background: 'var(--bg-base)' }}>
              <div>
                <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Free Beds</span>
                <strong className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{myHospital.availableBeds}</strong>
              </div>
              <div className="pl-4" style={{ borderLeft: '1px solid var(--border)' }}>
                <span className="block text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--text-muted)' }}>Free ICU</span>
                <strong className="text-2xl font-bold" style={{ color: 'var(--red)' }}>{myHospital.availableICUBeds}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b gap-8 animate-fade-up-delay-1" style={{ borderColor: 'var(--border)' }}>
          {[
            { id: 'analytics', label: 'Revenue Analytics' },
            { id: 'hospital-profile', label: 'Bed Inventory' },
            { id: 'doctors', label: `Staff Doctors (${myDoctors.length})` },
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
                  layoutId="activeAdminTab"
                  className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'var(--green)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab 1: Analytics */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Weekly Revenue', val: '₹5,69,400', sub: '+14.2% from last week', subColor: 'var(--green)' },
                { title: 'Total Patients', val: '475', sub: '98.4% Satisfaction', subColor: 'var(--sage)' },
                { title: 'Emergency Cases', val: '98', sub: 'Avg response: 4.2 mins', subColor: 'var(--text-muted)', valColor: 'var(--red)' },
                { title: 'Doctor Utilization', val: '92%', sub: 'Across 5 departments', subColor: 'var(--text-muted)', valColor: 'var(--green)' },
              ].map((kpi, i) => (
                <div key={i} className="card p-6 space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>{kpi.title}</span>
                  <h4 className="text-3xl font-black" style={{ color: kpi.valColor || 'var(--text-primary)' }}>{kpi.val}</h4>
                  <p className="text-[11px] font-bold" style={{ color: kpi.subColor }}>{kpi.sub}</p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 card p-8 space-y-5">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Daily Patient Visits</h3>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={appointmentTrends}>
                      <defs>
                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--green)" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="var(--green)" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} stroke="var(--text-muted)" />
                      <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                      <YAxis stroke="var(--text-muted)" fontSize={12} />
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                      <Area type="monotone" dataKey="visits" stroke="var(--green)" strokeWidth={3} fillOpacity={1} fill="url(#colorVisits)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card p-8 space-y-5">
                <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Utilization</h3>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={departmentUtilization} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {departmentUtilization.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-md)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 text-sm">
                  {departmentUtilization.map((dept) => (
                    <div key={dept.name} className="flex justify-between items-center">
                      <span className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }} />
                        <span className="font-medium" style={{ color: 'var(--text-secondary)' }}>{dept.name}</span>
                      </span>
                      <strong style={{ color: 'var(--text-primary)' }}>{dept.value}%</strong>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Inventory */}
        {activeTab === 'hospital-profile' && (
          <form onSubmit={handleUpdateHospitalStats} className="card p-8 space-y-8 animate-fade-in">
            <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <Bed className="w-5 h-5" style={{ color: 'var(--sage)' }} /> Live Bed Inventory
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Total General Beds</label>
                <input type="number" value={totalBeds} onChange={(e) => setTotalBeds(Number(e.target.value))} className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Available Free General Beds</label>
                <input type="number" value={availableBeds} onChange={(e) => setAvailableBeds(Number(e.target.value))} className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Total ICU Beds</label>
                <input type="number" value={totalICU} onChange={(e) => setTotalICU(Number(e.target.value))} className="input-base" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Available Free ICU Beds</label>
                <input type="number" value={availableICU} onChange={(e) => setAvailableICU(Number(e.target.value))} className="input-base" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary py-3.5 px-6">
              Update Live Inventory
            </button>
          </form>
        )}

        {/* Tab 3: Doctors */}
        {activeTab === 'doctors' && (
          <div className="card p-8 space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <Stethoscope className="w-5 h-5" style={{ color: 'var(--green)' }} /> Hospital Doctors
              </h3>
              <button onClick={() => setIsAddDoctorModalOpen(true)} className="btn btn-primary py-2.5">
                <Plus className="w-4 h-4" /> Add Doctor
              </button>
            </div>

            {isAddDoctorModalOpen && (
              <form onSubmit={handleAddDoctorSubmit} className="p-6 rounded-[var(--r-md)] space-y-5" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Add Doctor Details</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Doctor Name</label>
                    <input required type="text" value={newDocName} onChange={(e) => setNewDocName(e.target.value)} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Specialization</label>
                    <select value={newDocSpec} onChange={(e) => setNewDocSpec(e.target.value)} className="input-base">
                      {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Qualifications</label>
                    <input required type="text" value={newDocQual} onChange={(e) => setNewDocQual(e.target.value)} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Experience (Yrs)</label>
                    <input required type="number" value={newDocExp} onChange={(e) => setNewDocExp(Number(e.target.value))} className="input-base" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-1" style={{ color: 'var(--text-secondary)' }}>Fee (₹)</label>
                    <input required type="number" value={newDocFee} onChange={(e) => setNewDocFee(Number(e.target.value))} className="input-base" />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn btn-primary py-2.5">Save Doctor</button>
                  <button type="button" onClick={() => setIsAddDoctorModalOpen(false)} className="btn btn-ghost py-2.5">Cancel</button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {myDoctors.map((doc) => (
                <div key={doc.id} className="p-5 rounded-[var(--r-md)] flex items-center gap-4 transition-transform hover:scale-[1.02]" style={{ border: '1px solid var(--border)', background: 'var(--bg-surface)' }}>
                  <img src={doc.photo} alt={doc.name} className="w-16 h-16 rounded-xl object-cover" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</h4>
                    <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>{doc.specialization} • ₹{doc.consultationFee}</p>
                    <span className="tag tag-sage mt-2">Active Staff</span>
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

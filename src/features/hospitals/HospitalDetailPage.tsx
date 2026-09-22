import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  PhoneCall,
  Mail,
  Star,
  Bed,
  CheckCircle2,
  Stethoscope,
  ShieldAlert,
  MessageSquare,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/Toast';

interface HospitalDetailPageProps {
  hospitalId: string;
  onBack: () => void;
  onSelectDoctor: (doctorId: string) => void;
}

export const HospitalDetailPage: React.FC<HospitalDetailPageProps> = ({
  hospitalId,
  onBack,
  onSelectDoctor,
}) => {
  const { hospitals, doctors, reviews, addReview, currentUser } = useAuth();
  const { showToast } = useToast();

  const hospital = hospitals.find((h) => h.id === hospitalId) || hospitals[0];
  const hospitalDoctors = doctors.filter((d) => d.hospitalId === hospital.id);
  const hospitalReviews = reviews.filter((r) => r.targetId === hospital.id && r.targetType === 'hospital');

  const [activeTab, setActiveTab] = useState<'overview' | 'doctors' | 'reviews'>('overview');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isAddingReview, setIsAddingReview] = useState(false);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      showToast('Validation Error', 'Please write a review comment.', 'warning');
      return;
    }

    addReview({
      patientId: currentUser?.id || 'guest',
      patientName: currentUser?.name || 'Anonymous Patient',
      patientAvatar: currentUser?.avatar,
      targetId: hospital.id,
      targetType: 'hospital',
      rating: newRating,
      comment: newComment,
    });

    showToast('Review Published 🎉', 'Thank you for rating your hospital experience.', 'success');
    setNewComment('');
    setIsAddingReview(false);
  };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8" style={{ background: 'var(--bg-base)' }}>
      <div className="site-container max-w-7xl space-y-10">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-sm font-bold flex items-center gap-2 hover:opacity-80 transition-opacity animate-fade-in"
          style={{ color: 'var(--green)' }}
        >
          &larr; Back to Results
        </button>

        {/* Hospital Header Banner */}
        <div className="card p-8 sm:p-12 animate-fade-up">
          <div className="flex flex-col lg:flex-row justify-between gap-8">
            
            <div className="space-y-4 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="tag tag-sage border">Reg No: {hospital.registrationNumber}</span>
                <span className="tag tag-green border"><ShieldAlert className="w-3.5 h-3.5" /> Verified NABH Facility</span>
              </div>

              <h1 className="display-font" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: 'var(--text-primary)' }}>
                {hospital.name}
              </h1>
              <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{hospital.tagline}</p>

              <div className="flex flex-wrap items-center gap-5 text-sm pt-2" style={{ color: 'var(--text-secondary)' }}>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" style={{ color: 'var(--green)' }} /> {hospital.address}, {hospital.city}, {hospital.state}
                </span>
                <span className="flex items-center gap-1 font-bold" style={{ color: 'var(--gold)' }}>
                  <Star className="w-4 h-4 fill-current" /> {hospital.rating} <span className="font-normal text-xs" style={{ color: 'var(--text-muted)' }}>({hospital.reviewCount} Ratings)</span>
                </span>
              </div>
            </div>

            {/* Quick Stats Box */}
            <div className="p-6 rounded-[var(--r-md)] flex flex-col justify-between space-y-5 min-w-[280px]" style={{ background: 'var(--bg-muted)' }}>
              <div className="space-y-3 text-xs font-medium">
                <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Available General Beds:</span>
                  <strong style={{ color: 'var(--green)' }}>{hospital.availableBeds} / {hospital.totalBeds}</strong>
                </div>
                <div className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>ICU Beds Free:</span>
                  <strong style={{ color: 'var(--red)' }}>{hospital.availableICUBeds} / {hospital.totalICUBeds}</strong>
                </div>
                <div className="flex justify-between pb-1">
                  <span style={{ color: 'var(--text-secondary)' }}>Ambulance Service:</span>
                  <strong style={{ color: 'var(--gold)' }}>{hospital.hasAmbulance ? '24/7 Available' : 'On Demand'}</strong>
                </div>
              </div>

              <a
                href={`tel:${hospital.emergencyNumber}`}
                className="btn btn-emergency w-full flex items-center justify-center gap-2 py-3"
              >
                <PhoneCall className="w-4 h-4" /> ER Helpline ({hospital.emergencyNumber})
              </a>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-8 mt-6" style={{ borderTop: '1px solid var(--border)' }}>
            {hospital.images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`${hospital.name} gallery ${idx + 1}`}
                className="w-full h-56 rounded-[var(--r-md)] object-cover hover:scale-[1.02] transition-transform"
              />
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b gap-8 animate-fade-up-delay-1" style={{ borderColor: 'var(--border)' }}>
          {[
            { id: 'overview', label: 'Overview & Services' },
            { id: 'doctors', label: `Doctors (${hospitalDoctors.length})` },
            { id: 'reviews', label: `Reviews (${hospitalReviews.length})` },
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
                  layoutId="activeHospDetailTab"
                  className="absolute bottom-[-1px] left-0 right-0 h-0.5 rounded-full"
                  style={{ background: 'var(--green)' }}
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="animate-fade-in">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="card p-8 space-y-4">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>About Hospital</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {hospital.description}
                  </p>
                </div>

                <div className="card p-8 space-y-5">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Clinical Departments</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {hospital.departments.map((dept, i) => (
                      <div key={i} className="p-3.5 rounded-[var(--r-md)] text-xs font-semibold flex items-center gap-2" style={{ background: 'var(--bg-muted)', border: '1px solid var(--border)' }}>
                        <CheckCircle2 className="w-4 h-4" style={{ color: 'var(--sage)' }} /> {dept}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card p-8 space-y-5">
                  <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Advanced Procedures</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {hospital.treatments.map((treat, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-md text-xs font-medium" style={{ background: 'var(--green-light)', color: 'var(--green)' }}>
                        {treat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar Contact & Google Maps */}
              <div className="space-y-8">
                <div className="card p-8 space-y-6">
                  <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>Contact Information</h3>
                  
                  <div className="space-y-4 text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 shrink-0 mt-0.5" style={{ color: 'var(--green)' }} />
                      <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <PhoneCall className="w-4 h-4 shrink-0" style={{ color: 'var(--sage)' }} />
                      <span>{hospital.phone}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 shrink-0" style={{ color: 'var(--gold)' }} />
                      <span>{hospital.email}</span>
                    </div>
                  </div>

                  <div className="pt-5" style={{ borderTop: '1px solid var(--border)' }}>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost w-full py-3 flex items-center justify-center gap-2"
                    >
                      <Navigation className="w-4 h-4" /> Directions via Maps
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hospitalDoctors.map((doc) => (
                <div key={doc.id} className="card p-6 flex items-center gap-5 hover:scale-[1.01] transition-transform">
                  <img src={doc.photo} alt={doc.name} className="w-20 h-20 rounded-[var(--r-md)] object-cover shrink-0" style={{ border: '2px solid var(--green-light)' }} />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold truncate" style={{ color: 'var(--text-primary)' }}>{doc.name}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{doc.qualification} • {doc.experienceYears} Yrs Exp</p>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-3 mt-2" style={{ borderTop: '1px solid var(--border)' }}>
                      <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>Fee: ₹{doc.consultationFee}</span>
                      <button
                        onClick={() => onSelectDoctor(doc.id)}
                        className="btn btn-primary py-1.5 px-3 text-[11px]"
                      >
                        Book Slot
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Patient Feedback</h3>
                <button
                  onClick={() => setIsAddingReview(!isAddingReview)}
                  className="btn btn-primary flex items-center gap-2 py-2.5 px-4"
                >
                  <MessageSquare className="w-4 h-4" /> Write Review
                </button>
              </div>

              {isAddingReview && (
                <form onSubmit={handleReviewSubmit} className="card p-8 space-y-5 bg-[var(--green-light)]">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star} type="button" onClick={() => setNewRating(star)}
                          className="p-1 text-2xl transition-transform hover:scale-110"
                          style={{ color: star <= newRating ? 'var(--gold)' : 'var(--border)' }}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-secondary)' }}>Your Review</label>
                    <textarea
                      rows={3} value={newComment} onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Describe your care experience..."
                      className="input-base"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary py-2.5 px-6">
                    Post Patient Review
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {hospitalReviews.map((rev) => (
                  <div key={rev.id} className="card p-6 space-y-2 border-l-4" style={{ borderLeftColor: 'var(--sage)' }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{rev.patientName}</span>
                      <div className="flex text-xs" style={{ color: 'var(--gold)' }}>
                        {'★'.repeat(Math.round(rev.rating))}
                      </div>
                    </div>
                    <p className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>"{rev.comment}"</p>
                    <span className="text-[10px] block mt-2" style={{ color: 'var(--text-muted)' }}>{rev.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

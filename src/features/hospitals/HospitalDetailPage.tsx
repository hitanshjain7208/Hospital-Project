import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  MapPin,
  PhoneCall,
  Mail,
  Star,
  Clock,
  Bed,
  Ambulance,
  CheckCircle2,
  Stethoscope,
  ChevronRight,
  ShieldAlert,
  MessageSquare,
  Navigation,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Doctor, Review } from '../../types';
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
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1"
        >
          ← Back to Hospital Search
        </button>

        {/* Hospital Header Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                  Reg No: {hospital.registrationNumber}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Verified NABH Facility
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                {hospital.name}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{hospital.tagline}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-300 pt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-sky-500" /> {hospital.address}, {hospital.city}, {hospital.state}
                </span>
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> {hospital.rating} ({hospital.reviewCount} Ratings)
                </span>
              </div>
            </div>

            {/* Quick Stats Box */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-6 rounded-2xl border border-slate-200 dark:border-slate-700/60 flex flex-col justify-between space-y-4 min-w-[280px]">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Available General Beds:</span>
                  <strong className="text-emerald-600 dark:text-emerald-400 font-bold">{hospital.availableBeds} / {hospital.totalBeds}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">ICU Beds Free:</span>
                  <strong className="text-sky-600 dark:text-sky-400 font-bold">{hospital.availableICUBeds} / {hospital.totalICUBeds}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Ambulance Service:</span>
                  <strong className="text-amber-500 font-bold">{hospital.hasAmbulance ? '24/7 Available' : 'On Demand'}</strong>
                </div>
              </div>

              <a
                href={`tel:${hospital.emergencyNumber}`}
                className="py-3 px-4 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <PhoneCall className="w-4 h-4" /> Emergency ER ({hospital.emergencyNumber})
              </a>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            {hospital.images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt={`${hospital.name} gallery ${idx + 1}`}
                className="w-full h-48 rounded-2xl object-cover hover:scale-102 transition-transform shadow-sm"
              />
            ))}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 gap-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Overview & Services
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'doctors'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Doctors ({hospitalDoctors.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'reviews'
                ? 'border-sky-600 text-sky-600 dark:text-sky-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Ratings & Reviews ({hospitalReviews.length})
          </button>
        </div>

        {/* Tab Contents */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">About Hospital</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {hospital.description}
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Clinical Departments</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hospital.departments.map((dept, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-teal-500" /> {dept}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Advanced Procedures & Treatments</h3>
                <div className="flex flex-wrap gap-2">
                  {hospital.treatments.map((treat, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 text-xs font-medium text-sky-700 dark:text-sky-300">
                      {treat}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar Contact & Google Maps */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Contact & Address</h3>
                
                <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                    <span>{hospital.address}, {hospital.city}, {hospital.state} - {hospital.pincode}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneCall className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{hospital.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{hospital.email}</span>
                  </div>
                </div>

                {/* Google Maps Embed Placeholder */}
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white flex items-center justify-center gap-2 transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-sky-500" /> Open Directions on Google Maps
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
              <div key={doc.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex gap-4">
                <img src={doc.photo} alt={doc.name} className="w-20 h-20 rounded-2xl object-cover ring-2 ring-teal-500/30 shrink-0" />
                <div className="flex-1 space-y-2">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">{doc.name}</h4>
                  <p className="text-xs text-slate-500">{doc.qualification} • {doc.experienceYears} Yrs Exp</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Fee: ₹{doc.consultationFee}</span>
                    <button
                      onClick={() => onSelectDoctor(doc.id)}
                      className="py-1.5 px-3 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-lg transition-colors"
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Patient Reviews</h3>
              <button
                onClick={() => setIsAddingReview(!isAddingReview)}
                className="py-2 px-4 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
              >
                <MessageSquare className="w-4 h-4" /> Write Review
              </button>
            </div>

            {isAddingReview && (
              <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewRating(star)}
                        className={`p-2 rounded-lg text-lg ${star <= newRating ? 'text-amber-400' : 'text-slate-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Your Review</label>
                  <textarea
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Describe your care experience, cleanliness, staff politeness..."
                    className="w-full p-3 text-xs rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
                <button type="submit" className="py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl">
                  Post Patient Review
                </button>
              </form>
            )}

            <div className="space-y-4">
              {hospitalReviews.map((rev) => (
                <div key={rev.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{rev.patientName}</span>
                    <div className="flex text-amber-400 text-xs">
                      {'★'.repeat(Math.round(rev.rating))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">{rev.comment}</p>
                  <span className="text-[10px] text-slate-400">{rev.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

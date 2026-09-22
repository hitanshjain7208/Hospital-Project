import React from 'react';
import { Heart, ShieldCheck, Mail, PhoneCall, MapPin, CheckCircle2, HelpCircle } from 'lucide-react';

interface StaticPageProps {
  type: 'about' | 'contact' | 'faq' | 'privacy' | 'terms';
}

export const StaticPages: React.FC<StaticPageProps> = ({ type }) => {
  if (type === 'about') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-sky-500/10 text-sky-600 rounded-2xl">
              <Heart className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">About MedConnect AI</h1>
              <p className="text-xs text-slate-500">Enterprise Multi-Hospital Management & AI Health Platform</p>
            </div>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            MedConnect AI is an enterprise-grade healthcare ecosystem connecting Patients, Doctors, Hospital Administrators, and Regular Users in one platform. Powered by Gemini AI for vision medical image triage and real-time GPS emergency routing.
          </p>
        </div>
      </div>
    );
  }

  if (type === 'contact') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Contact & Support</h1>
          <div className="space-y-4 text-xs text-slate-600 dark:text-slate-300">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-sky-500" /> Support Email: support@medconnect.ai</p>
            <p className="flex items-center gap-2"><PhoneCall className="w-4 h-4 text-emerald-500" /> Toll Free Helpline: 1800-108-9999</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-teal-500" /> Head Office:sarita Vihar, Mathura Road, New Delhi, India</p>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'faq') {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 space-y-6">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-8 h-8 text-sky-500" /> Frequently Asked Questions
          </h1>
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">How does the Emergency Module work?</h4>
              <p className="text-slate-500">The Emergency Module requires zero login. It automatically detects your GPS coordinates, sorts nearby ER hospitals by distance, and provides 1-click direct calling and 1-click Google Maps navigation.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">How does Gemini Medical Image Analysis work?</h4>
              <p className="text-slate-500">Users upload a photo of a skin rash, burn, cut, or swelling. Gemini AI evaluates visual indicators, suggests possible conditions, home remedies, basic precautions, and emergency warning signs.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-200 dark:border-slate-800 space-y-4 text-xs">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{type} Policy</h1>
        <p className="text-slate-500">MedConnect AI enforces strict HIPAA & Digital Personal Data Protection guidelines. All user data, medical history, and prescriptions are encrypted with JWT & RBAC access controls.</p>
      </div>
    </div>
  );
};

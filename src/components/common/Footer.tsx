import React from 'react';
import { Heart, PhoneCall, ShieldCheck, Mail, MapPin, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('home')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-teal-400 flex items-center justify-center shadow-lg shadow-sky-500/20">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                MedConnect <span className="text-sky-400">AI</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Production-ready multi-hospital management platform connecting Patients, Doctors, Hospitals, and Administrators with Gemini AI medical vision triage and 24/7 instant emergency routing.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <div className="px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4" /> NABH & JCI Accredited Network
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('hospitals')} className="hover:text-sky-400 transition-colors">
                  Search Hospitals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-sky-400 transition-colors">
                  Find Specialists
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('ai-chatbot')} className="hover:text-sky-400 transition-colors flex items-center gap-1">
                  AI Image Analysis <span className="px-1.5 py-0.2 text-[9px] bg-sky-500/20 text-sky-300 rounded">Gemini</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('emergency')} className="hover:text-rose-400 transition-colors text-rose-300 font-semibold">
                  24/7 Emergency Care
                </button>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Dashboards</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('patient-dashboard')} className="hover:text-sky-400 transition-colors">
                  Patient Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctor-dashboard')} className="hover:text-sky-400 transition-colors">
                  Doctor Workstation
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-sky-400 transition-colors">
                  Hospital Admin Suite
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('mediclaim')} className="hover:text-sky-400 transition-colors">
                  Mediclaim Insurance
                </button>
              </li>
            </ul>
          </div>

          {/* Emergency Helplines */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">24/7 National Helplines</h4>
            <div className="space-y-3">
              <a href="tel:1066" className="flex items-center gap-2 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 p-2.5 rounded-xl border border-red-900/40">
                <PhoneCall className="w-4 h-4 shrink-0" /> National Cardiac Ambulance: 1066
              </a>
              <a href="tel:108" className="flex items-center gap-2 text-xs font-bold text-amber-400 hover:text-amber-300 bg-amber-950/40 p-2.5 rounded-xl border border-amber-900/40">
                <PhoneCall className="w-4 h-4 shrink-0" /> Disaster Trauma Rescue: 108
              </a>
            </div>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} MedConnect AI Healthcare Ecosystem. All rights reserved.</p>
          <div className="flex gap-6">
            <button onClick={() => onNavigate('privacy')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('terms')} className="hover:text-slate-300 transition-colors">
              Terms & Conditions
            </button>
            <button onClick={() => onNavigate('faq')} className="hover:text-slate-300 transition-colors">
              FAQs
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React from 'react';
import { Heart, PhoneCall, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: 'var(--bg-invert)', color: 'var(--text-muted)' }}>

      {/* Top divider line */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />

      <div className="site-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-5">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2.5"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--green)' }}
              >
                <Heart className="w-4 h-4 text-white" strokeWidth={2.5} />
              </div>
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: 'var(--text-invert)' }}
              >
                MedConnect
                <span className="ml-1 text-[0.625rem] font-bold tracking-widest uppercase align-middle" style={{ color: 'var(--green)' }}>AI</span>
              </span>
            </button>

            <p className="text-[13px] leading-relaxed max-w-xs">
              Connecting patients, doctors, and hospitals across India with
              AI-powered triage and 24/7 emergency support.
            </p>

            <div
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--green)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <ShieldCheck className="w-4 h-4" />
              NABH & JCI Accredited Network
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4
              className="text-[10px] font-bold tracking-widest uppercase mb-5"
              style={{ color: 'var(--text-invert)' }}
            >
              Platform
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Find Hospitals', tab: 'hospitals' },
                { label: 'Find Specialists', tab: 'doctors' },
                { label: 'AI Image Analysis', tab: 'ai-chatbot' },
                { label: '24/7 Emergency', tab: 'emergency', danger: true },
              ].map(({ label, tab, danger }) => (
                <li key={tab}>
                  <button
                    onClick={() => onNavigate(tab)}
                    className="text-[13px] transition-colors"
                    style={{ color: danger ? 'var(--red)' : 'var(--text-muted)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = danger ? '#FF6B5B' : 'var(--text-invert)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = danger ? 'var(--red)' : 'var(--text-muted)')}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4
              className="text-[10px] font-bold tracking-widest uppercase mb-5"
              style={{ color: 'var(--text-invert)' }}
            >
              Dashboards
            </h4>
            <ul className="space-y-3">
              {[
                { label: 'Patient Portal', tab: 'patient-dashboard' },
                { label: 'Doctor Workstation', tab: 'doctor-dashboard' },
                { label: 'Hospital Admin', tab: 'admin-dashboard' },
                { label: 'Mediclaim', tab: 'mediclaim' },
              ].map(({ label, tab }) => (
                <li key={tab}>
                  <button
                    onClick={() => onNavigate(tab)}
                    className="text-[13px] transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-invert)')}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Emergency */}
          <div>
            <h4
              className="text-[10px] font-bold tracking-widest uppercase mb-5"
              style={{ color: 'var(--text-invert)' }}
            >
              Helplines
            </h4>
            <div className="space-y-3">
              {[
                { href: 'tel:1066', label: 'Cardiac Ambulance', num: '1066', color: 'var(--red)' },
                { href: 'tel:108', label: 'Trauma Rescue', num: '108', color: 'var(--gold)' },
                { href: 'tel:1800111565', label: 'Senior Helpline', num: '1800-111-565', color: 'var(--green)' },
              ].map(({ href, label, num, color }) => (
                <a
                  key={num}
                  href={href}
                  className="flex items-center gap-2.5 text-[13px] font-medium px-3.5 py-2.5 rounded-xl transition-all"
                  style={{
                    color,
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)')}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)')}
                >
                  <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}: <strong>{num}</strong></span>
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div
          className="mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p>© {year} MedConnect AI. All rights reserved.</p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy', tab: 'privacy' },
              { label: 'Terms', tab: 'terms' },
              { label: 'FAQ', tab: 'faq' },
            ].map(({ label, tab }) => (
              <button
                key={tab}
                onClick={() => onNavigate(tab)}
                className="transition-colors"
                style={{ color: 'var(--text-muted)' }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-invert)')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--text-muted)')}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

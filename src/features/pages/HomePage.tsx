import React from 'react';
import {
  Search,
  ShieldAlert,
  Bot,
  Star,
  ArrowRight,
  HeartPulse,
  Users,
  Clock,
  Sparkles,
  MapPin,
  ChevronRight,
  Activity,
  CheckCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { calculateHaversineDistance, formatDistance } from '../../utils/haversine';
import { useLocation } from '../../context/LocationContext';

interface HomePageProps {
  onNavigate: (tab: string) => void;
  onSelectHospital: (id: string) => void;
  onSelectDoctor: (id: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectHospital,
  onSelectDoctor,
}) => {
  const { hospitals, doctors } = useAuth();
  const { location } = useLocation();

  const nearbyHospitals = hospitals.slice(0, 3).map((hosp) => ({
    ...hosp,
    distanceKm: calculateHaversineDistance(
      location.latitude || 28.5355,
      location.longitude || 77.2882,
      hosp.latitude,
      hosp.longitude
    ),
  }));

  return (
    <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section
        className="relative min-h-screen flex items-center pt-[72px] overflow-hidden"
        style={{ background: 'var(--bg-base)' }}
      >
        {/* Dot grid background */}
        <div
          className="absolute inset-0 dot-grid opacity-60"
          style={{ zIndex: 0 }}
        />

        {/* Ambient blobs */}
        <div
          className="absolute top-0 right-0 w-[56vw] h-[56vw] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--green-light) 0%, transparent 70%)',
            opacity: 0.9,
            transform: 'translate(20%, -20%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[40vw] h-[40vw] rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, var(--sage-light) 0%, transparent 70%)',
            opacity: 0.7,
            transform: 'translate(-20%, 20%)',
          }}
        />

        <div className="site-container relative z-10 w-full py-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-16 xl:gap-24 items-center">

            {/* Left — Copy */}
            <div className="space-y-8">
              {/* Eyebrow */}
              <div className="animate-fade-up">
                <span className="tag tag-green">
                  <Sparkles className="w-3 h-3" />
                  Gemini AI — Medical Vision
                </span>
              </div>

              {/* Headline */}
              <div className="animate-fade-up-delay-1 space-y-1">
                <h1
                  className="display-font text-balance"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)' }}
                >
                  Healthcare,
                </h1>
                <h1
                  className="display-font italic text-balance"
                  style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', color: 'var(--green)' }}
                >
                  reimagined.
                </h1>
                <div className="rule" />
              </div>

              {/* Body */}
              <p
                className="animate-fade-up-delay-2 text-base leading-relaxed max-w-[420px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                Find verified hospitals, book top specialists, and receive instant AI-powered triage —
                all in a single, unified platform built for India's modern healthcare needs.
              </p>

              {/* CTAs */}
              <div className="animate-fade-up-delay-2 flex flex-wrap gap-3">
                <button onClick={() => onNavigate('hospitals')} className="btn btn-primary flex items-center gap-2">
                  <Search className="w-4 h-4" />
                  Find Care Near You
                </button>
                <button onClick={() => onNavigate('ai-chatbot')} className="btn btn-ghost flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Try AI Assistant
                </button>
              </div>

              {/* Stats */}
              <div
                className="animate-fade-up-delay-3 grid grid-cols-3 gap-5 pt-4"
                style={{ borderTop: '1px solid var(--border)' }}
              >
                {[
                  { num: '100%', label: 'NABH Certified', icon: <CheckCircle className="w-3.5 h-3.5" /> },
                  { num: '< 5 min', label: 'ER Dispatch', icon: <Clock className="w-3.5 h-3.5" /> },
                  { num: '4.9★', label: 'Avg Rating', icon: <Star className="w-3.5 h-3.5" /> },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>{s.num}</div>
                    <div className="flex items-center gap-1 mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                      <span style={{ color: 'var(--green)' }}>{s.icon}</span>
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Visual Stack */}
            <div className="relative hidden lg:block animate-fade-in">

              {/* Emergency card (floating top-left) */}
              <div
                className="absolute -top-8 -left-8 z-20 p-4 rounded-2xl w-52 animate-fade-up"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-lg)',
                }}
              >
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--red-light)' }}>
                    <Activity className="w-4 h-4" style={{ color: 'var(--red)' }} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold" style={{ color: 'var(--text-primary)' }}>Live ER Status</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-muted)' }}>3 hospitals nearby</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {['AIIMS Delhi', 'Fortis', 'Apollo'].map((h, i) => (
                    <div key={h} className="flex items-center justify-between text-[10px]">
                      <span style={{ color: 'var(--text-secondary)' }}>{h}</span>
                      <span
                        className="px-1.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: i === 0 ? 'var(--green-light)' : 'var(--gold-light)',
                          color: i === 0 ? 'var(--green)' : 'var(--gold)',
                        }}
                      >
                        {i === 0 ? 'Open' : i === 1 ? 'Busy' : 'Open'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Main AI chat card */}
              <div
                className="card relative z-10 p-6 space-y-4"
                style={{ background: 'var(--bg-surface)' }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--green-light)' }}>
                      <Bot className="w-5 h-5" style={{ color: 'var(--green)' }} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Gemini AI Triage</p>
                      <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>Medical Vision Analysis</p>
                    </div>
                  </div>
                  <span className="tag tag-green text-[10px] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--green)' }} />
                    Active
                  </span>
                </div>

                {/* Chat thread */}
                <div className="space-y-3">
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{ background: 'var(--bg-muted)', color: 'var(--text-secondary)' }}
                  >
                    I uploaded a photo of a burn. What should I do?
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl text-sm leading-relaxed"
                    style={{
                      background: 'var(--green-light)',
                      color: 'var(--text-primary)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <strong style={{ color: 'var(--green)' }}>Gemini AI: </strong>
                    Cool under running water 15 min. Apply Aloe Vera. Recommended specialist:{' '}
                    <strong>Burns & Plastic Surgery.</strong>
                  </div>
                </div>

                <button
                  onClick={() => onNavigate('ai-chatbot')}
                  className="w-full flex items-center justify-between p-3.5 rounded-xl text-sm font-medium transition-all group"
                  style={{
                    background: 'var(--bg-muted)',
                    color: 'var(--text-secondary)',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--green-light)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--green)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = 'var(--bg-muted)';
                    (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                  }}
                >
                  <span>Open AI Health Assistant</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>

              {/* Rating badge (floating bottom-right) */}
              <div
                className="absolute -bottom-6 -right-6 z-20 px-4 py-3 rounded-2xl flex items-center gap-3 animate-fade-up-delay-1"
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gold-light)' }}>
                  <Star className="w-4 h-4 fill-current" style={{ color: 'var(--gold)' }} />
                </div>
                <div>
                  <p className="text-sm font-bold leading-none" style={{ color: 'var(--text-primary)' }}>4.9 / 5.0</p>
                  <p className="text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>From 12,000+ patients</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-fade-up-delay-3">
          <p className="text-[10px] tracking-widest uppercase" style={{ color: 'var(--text-muted)' }}>Scroll</p>
          <div
            className="w-[1px] h-8"
            style={{ background: 'linear-gradient(to bottom, var(--green), transparent)' }}
          />
        </div>
      </section>

      {/* ══════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════ */}
      <section
        className="section-sm"
        style={{
          background: 'var(--bg-invert)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="site-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { num: '120+', label: 'Partner Hospitals' },
              { num: '2,400+', label: 'Verified Specialists' },
              { num: '50K+', label: 'Appointments Served' },
              { num: '24 / 7', label: 'Emergency Support' },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold mb-1" style={{ color: 'var(--text-invert)' }}>{s.num}</div>
                <div className="text-xs tracking-wide" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          NEARBY HOSPITALS
      ══════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-base)' }}>
        <div className="site-container space-y-12">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Nearby</p>
              <h2 className="display-font" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                Top Hospitals Near You
              </h2>
              <div className="rule" />
            </div>
            <button
              onClick={() => onNavigate('hospitals')}
              className="flex items-center gap-1.5 text-sm font-medium transition-colors"
              style={{ color: 'var(--green)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--green-hover)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--green)')}
            >
              View all {hospitals.length} hospitals <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Cards grid — asymmetric: first card is tall/featured */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {nearbyHospitals.map((hosp, i) => (
              <div
                key={hosp.id}
                onClick={() => onSelectHospital(hosp.id)}
                className={`card cursor-pointer ${i === 0 ? 'md:row-span-1' : ''}`}
              >
                <div className="relative overflow-hidden" style={{ height: i === 0 ? '260px' : '200px' }}>
                  <img
                    src={hosp.images[0]}
                    alt={hosp.name}
                    className="card-image w-full h-full"
                    style={{ objectPosition: 'center' }}
                  />
                  {/* Overlay gradient */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgba(20,28,24,0.55) 0%, transparent 60%)',
                    }}
                  />
                  {/* Floating badges */}
                  <div className="absolute top-3 left-3">
                    <span className="tag tag-white text-[10px] flex items-center gap-1">
                      <MapPin className="w-3 h-3" style={{ color: 'var(--green)' }} />
                      {formatDistance(hosp.distanceKm)}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="tag tag-white text-[10px] flex items-center gap-1">
                      <Star className="w-3 h-3" style={{ color: 'var(--gold)', fill: 'var(--gold)' }} />
                      {hosp.rating}
                    </span>
                  </div>
                  {/* Hospital name on image */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-sm font-semibold text-white leading-snug truncate">{hosp.name}</p>
                    <p className="text-[11px] text-white/70 truncate">{hosp.city}</p>
                  </div>
                </div>

                <div
                  className="p-4 flex items-center justify-between"
                  style={{ borderTop: '1px solid var(--border)' }}
                >
                  <span className="text-xs font-semibold flex items-center gap-1" style={{ color: 'var(--sage)' }}>
                    <HeartPulse className="w-3.5 h-3.5" />
                    {hosp.availableICUBeds} ICU beds free
                  </span>
                  <span
                    className="text-xs font-semibold flex items-center gap-1 transition-all group"
                    style={{ color: 'var(--green)' }}
                  >
                    View details <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          DOCTORS
      ══════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-muted)' }}>
        <div className="site-container space-y-12">

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2">Our Specialists</p>
              <h2 className="display-font" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
                Verified Medical Experts
              </h2>
              <div className="rule" />
            </div>
            <button
              onClick={() => onNavigate('doctors')}
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: 'var(--green)' }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--green-hover)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'var(--green)')}
            >
              Browse all doctors <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {doctors.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                onClick={() => onSelectDoctor(doc.id)}
                className="card cursor-pointer group"
              >
                {/* Photo */}
                <div className="relative overflow-hidden" style={{ height: '220px' }}>
                  <img
                    src={doc.photo}
                    alt={doc.name}
                    className="card-image w-full h-full"
                    style={{ objectPosition: 'top' }}
                  />
                </div>

                {/* Info */}
                <div className="p-5 space-y-3">
                  <div>
                    <span className="eyebrow text-[10px]">{doc.specialization}</span>
                    <h3
                      className="text-sm font-semibold mt-1 leading-snug"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {doc.name}
                    </h3>
                    <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                      {doc.qualification}
                    </p>
                  </div>

                  <div
                    className="flex items-center justify-between pt-3"
                    style={{ borderTop: '1px solid var(--border)' }}
                  >
                    <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      ₹{doc.consultationFee}
                    </span>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: 'var(--green-light)',
                        color: 'var(--green)',
                        borderRadius: 'var(--r-sm)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--green)';
                        (e.currentTarget as HTMLElement).style.color = '#fff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'var(--green-light)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--green)';
                      }}
                      onClick={(e) => { e.stopPropagation(); onSelectDoctor(doc.id); }}
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section className="section" style={{ background: 'var(--bg-base)' }}>
        <div className="site-container space-y-16">

          <div className="text-center max-w-xl mx-auto space-y-4">
            <p className="eyebrow">Why MedConnect</p>
            <h2 className="display-font text-balance" style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}>
              Built for every person in healthcare
            </h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Whether you're a patient, doctor, or administrator — one platform handles everything.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Bot className="w-5 h-5" />,
                color: 'var(--green)',
                bg: 'var(--green-light)',
                title: 'AI Medical Vision',
                desc: 'Upload images for instant Gemini AI analysis. Get preliminary diagnosis suggestions and specialist referrals in seconds.',
                action: () => onNavigate('ai-chatbot'),
                cta: 'Try now',
              },
              {
                icon: <Users className="w-5 h-5" />,
                color: 'var(--sage)',
                bg: 'var(--sage-light)',
                title: 'Multi-Role Platform',
                desc: 'Switch seamlessly between Patient, Doctor, and Admin views. One login, full access.',
                action: () => onNavigate('hospitals'),
                cta: 'Explore',
              },
              {
                icon: <ShieldAlert className="w-5 h-5" />,
                color: 'var(--red)',
                bg: 'var(--red-light)',
                title: 'Zero-Login Emergency',
                desc: 'No account needed for emergency access. Find nearest ER and get dispatch in under 5 minutes.',
                action: () => onNavigate('emergency'),
                cta: 'Emergency',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="card p-7 space-y-4 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: f.bg, color: f.color }}
                >
                  {f.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-base" style={{ color: 'var(--text-primary)' }}>{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{f.desc}</p>
                </div>
                <button
                  onClick={f.action}
                  className="flex items-center gap-1.5 text-xs font-semibold transition-all"
                  style={{ color: f.color }}
                >
                  {f.cta} <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA BAND
      ══════════════════════════════════════ */}
      <section
        className="section-sm"
        style={{ background: 'var(--bg-invert)' }}
      >
        <div className="site-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h2
                className="display-font text-3xl md:text-4xl"
                style={{ color: 'var(--text-invert)' }}
              >
                Ready to experience modern healthcare?
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                Join 50,000+ patients who trust MedConnect AI.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('register')}
                className="btn btn-primary"
                style={{ background: 'var(--green)' }}
              >
                Get Started — Free
              </button>
              <button
                onClick={() => onNavigate('emergency')}
                className="btn btn-emergency flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Emergency
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

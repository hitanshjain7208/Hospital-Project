import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Mail, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';

export const OTPModal: React.FC = () => {
  const { isOtpModalOpen, pendingOtpEmail, verifyOtp, closeOtpModal } = useAuth();
  const { showToast } = useToast();
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOtpModalOpen) return null;

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newDigits = [...digits];
    newDigits[index] = value.substring(value.length - 1);
    setDigits(newDigits);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = digits.join('');
    if (code.length < 6) {
      setErrorMsg('Please enter all 6 digits of the OTP code.');
      return;
    }

    const success = verifyOtp(code);
    if (success) {
      showToast('Authentication Verified! 🎉', 'Session initialized successfully.', 'success');
      setDigits(['', '', '', '', '', '']);
      setErrorMsg('');
    } else {
      setErrorMsg('Invalid OTP code. Enter 123456 for demo authorization.');
      showToast('OTP Verification Failed', 'Invalid code entered.', 'error');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-[var(--bg-invert)]/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md p-8 card"
        >
          <button
            onClick={closeOtpModal}
            className="absolute top-4 right-4 p-2 transition-colors hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div
              className="w-14 h-14 mb-4 rounded-[var(--r-md)] flex items-center justify-center"
              style={{ background: 'var(--green-light)', color: 'var(--green)' }}
            >
              <ShieldCheck className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Two-Factor OTP Verification
            </h3>
            <p className="mt-2 text-sm flex items-center justify-center gap-1.5" style={{ color: 'var(--text-secondary)' }}>
              <Mail className="w-4 h-4" style={{ color: 'var(--sage)' }} />
              Code sent to: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{pendingOtpEmail || 'your email'}</span>
            </p>

            <div
              className="mt-4 px-3 py-1.5 rounded-lg text-xs font-mono font-medium"
              style={{ background: 'var(--sage-light)', color: 'var(--sage)', border: '1px solid var(--sage-light)' }}
            >
              Demo Code: <span className="font-bold">123456</span>
            </div>

            <form onSubmit={handleSubmit} className="w-full mt-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {digits.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-input-${idx}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl outline-none transition-all"
                    style={{
                      background: 'var(--bg-muted)',
                      color: 'var(--text-primary)',
                      border: '1.5px solid var(--border)',
                    }}
                    onFocus={(e) => ((e.target as HTMLInputElement).style.borderColor = 'var(--green)')}
                    onBlur={(e) => ((e.target as HTMLInputElement).style.borderColor = 'var(--border)')}
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="mt-4 text-xs font-medium" style={{ color: 'var(--red)' }}>{errorMsg}</p>
              )}

              <button
                type="submit"
                className="btn btn-primary w-full mt-6 py-3.5"
              >
                Verify & Continue
              </button>
            </form>

            <p className="mt-5 text-xs" style={{ color: 'var(--text-muted)' }}>
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={() => showToast('OTP Resent', 'A fresh code has been sent to your email.', 'info')}
                className="font-semibold hover:underline"
                style={{ color: 'var(--green)' }}
              >
                Resend OTP
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

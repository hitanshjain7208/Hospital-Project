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
      <div className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-md p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800"
        >
          <button
            onClick={closeOtpModal}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col items-center text-center">
            <div className="w-14 h-14 mb-4 rounded-2xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400 flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              Two-Factor OTP Verification
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 flex items-center justify-center gap-1.5">
              <Mail className="w-4 h-4 text-sky-500" />
              OTP code dispatched to: <span className="font-semibold text-slate-800 dark:text-slate-200">{pendingOtpEmail || 'your email'}</span>
            </p>

            <div className="mt-2 px-3 py-1.5 bg-sky-50 dark:bg-sky-950/50 rounded-lg text-xs font-mono text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
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
                    className="w-11 h-13 text-center text-xl font-bold rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-sm"
                  />
                ))}
              </div>

              {errorMsg && (
                <p className="mt-3 text-xs text-rose-500 font-medium">{errorMsg}</p>
              )}

              <button
                type="submit"
                className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-500/25 transition-all transform active:scale-98"
              >
                Verify & Continue
              </button>
            </form>

            <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
              Didn't receive code?{' '}
              <button
                type="button"
                onClick={() => showToast('OTP Resent', 'A fresh code has been sent to your email.', 'info')}
                className="text-sky-600 dark:text-sky-400 font-medium hover:underline"
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

import { useState, useEffect } from 'react';
import {
  Fingerprint,
  ShieldCheck,
  X,
  Lock
} from 'lucide-react';

import {
  authenticateBiometric,
  isWebAuthnSupported,
} from '../services/webauthnService';

import { speak } from '../services/ttsService';

export default function BiometricModal({
  open,
  onClose,
  onSuccess,
  isBiometricRegistered,
}) {
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(!isBiometricRegistered);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleBiometric = async () => {
    try {
      setLoading(true);
      setError('');

      speak(
        'Konfirmasi transfer. Gunakan biometrik atau tekan tombol PIN.'
      );

      if (!isWebAuthnSupported()) {
        throw new Error('WebAuthn not supported');
      }

      const verified = await authenticateBiometric();

      if (verified) {
        speak(
          'Biometrik terverifikasi. Memproses transfer.'
        );

        onSuccess();
      } else {
        throw new Error('Biometric verification failed');
      }
    } catch {
      setShowPin(true);

      setError(
        'Verifikasi biometrik gagal. Silakan gunakan PIN.'
      );

      speak(
        'Biometrik gagal. Silakan gunakan PIN.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Automatically trigger WebAuthn when opened if registered
  useEffect(() => {
    if (open && isBiometricRegistered && !showPin) {
      handleBiometric();
    }
  }, [open, isBiometricRegistered, showPin]);

  const handlePin = () => {
    const savedPin = localStorage.getItem('transaction_pin');
    if (pin === savedPin) {
      speak(
        'PIN benar. Memproses transfer.'
      );

      onSuccess();
    } else {
      setError('PIN salah');
      speak(
        'PIN salah. Silakan coba lagi.'
      );
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black/70 backdrop-blur-sm flex items-center justify-center p-5 animate-fade-in">

      <div className="w-full max-w-md bg-white dark:bg-[#18181b] border border-zinc-200 dark:border-white/8 rounded-[24px] overflow-hidden shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 dark:border-white/8">

          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] text-zinc-400 dark:text-white/30">
              Verifikasi
            </p>

            <h2 className="font-syne text-xl font-extrabold text-zinc-800 dark:text-white">
              Transfer<span className="text-pink-500 dark:text-[#fbcfe8]">.</span>
            </h2>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-zinc-50 border border-zinc-200 dark:bg-white/4 dark:border-white/8 flex items-center justify-center text-zinc-500 dark:text-white/50 hover:bg-zinc-100 dark:hover:bg-white/8 transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* BODY */}

        <div className="p-7">

          <div className="flex flex-col items-center">

            <div className="w-[90px] h-[90px] rounded-[26px]
              bg-pink-500/10
              border border-pink-500/20
              dark:bg-[#fbcfe8]/10
              dark:border-[#fbcfe8]/20
              flex items-center justify-center
              mb-5">

              {showPin
                ? (
                  <Lock
                    size={42}
                    className="text-pink-600 dark:text-[#f9a8d4]"
                  />
                )
                : (
                  <Fingerprint
                    size={42}
                    className="text-pink-600 dark:text-[#f9a8d4]"
                  />
                )}
            </div>

            <h3 className="font-semibold text-zinc-800 dark:text-white text-center mb-2">
              {showPin
                ? 'Masukkan PIN Transaksi'
                : 'Konfirmasi dengan Biometrik'}
            </h3>

            <p className="text-xs text-zinc-500 dark:text-white/40 text-center leading-relaxed max-w-[280px] mb-6">
              {showPin
                ? 'Masukkan PIN 6 digit untuk melanjutkan transaksi.'
                : 'Gunakan fingerprint atau Face ID perangkat Anda untuk mengonfirmasi transfer.'}
            </p>

            {error && (
              <div className="w-full mb-5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <p className="text-xs text-amber-600 dark:text-amber-400 text-center">
                  {error}
                </p>
              </div>
            )}

            {!showPin && (
              <>
                <button
                  onClick={handleBiometric}
                  disabled={loading}
                  className="
                    w-full
                    p-[15px]
                    rounded-xl
                    border-none
                    cursor-pointer
                    font-medium
                    text-[#09090b]
                    bg-gradient-to-br
                    from-[#fbcfe8]
                    to-[#f472b6]
                    flex
                    items-center
                    justify-center
                    gap-2
                    transition-all
                    hover:opacity-90
                    active:scale-98
                  "
                >
                  <ShieldCheck size={16} />

                  {loading
                    ? 'Memverifikasi...'
                    : 'Konfirmasi Biometrik'}
                </button>

                <button
                  onClick={() => setShowPin(true)}
                  className="
                    mt-3
                    text-sm
                    text-pink-600
                    dark:text-[#fbcfe8]
                    hover:underline
                  "
                >
                  Gunakan PIN
                </button>
              </>
            )}

            {showPin && (
              <>
                <input
                  type="password"
                  maxLength={6}
                  value={pin}
                  onChange={(e) =>
                    setPin(
                      e.target.value.replace(/[^0-9]/g, '')
                    )
                  }
                  placeholder="••••••"
                  className="
                    w-full
                    bg-zinc-50
                    border
                    border-zinc-200
                    dark:bg-white/4
                    dark:border-white/8
                    rounded-xl
                    px-4
                    py-3.5
                    text-center
                    tracking-[0.35em]
                    font-mono
                    text-lg
                    text-zinc-800
                    dark:text-white
                    outline-none
                    mb-4
                  "
                />

                <button
                  onClick={handlePin}
                  className="
                    w-full
                    p-[15px]
                    rounded-xl
                    border-none
                    cursor-pointer
                    font-medium
                    text-[#09090b]
                    bg-gradient-to-br
                    from-[#fbcfe8]
                    to-[#f472b6]
                    transition-all
                    hover:opacity-90
                  "
                >
                  Verifikasi PIN
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
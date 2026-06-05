/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, User, Sparkles, Scissors, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginProps {
  onLoginSuccess: () => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [error, setError] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isLocked) {
      // Keep locked but show the dynamic unlock button active!
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, isLocked]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;

    if (username === 'joelromero888' && password === '12903456') {
      setError('');
      setFailedAttempts(0);
      onLoginSuccess();
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setError('Credenciales incorrectas. Intenta de nuevo.');

      if (newAttempts >= 3) {
        setIsLocked(true);
        setTimeLeft(10);
        setError('Sistema bloqueado por exceso de intentos.');
      }
    }
  };

  const handleManualUnlock = () => {
    setIsLocked(false);
    setFailedAttempts(0);
    setTimeLeft(0);
    setError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0f12] text-gray-100 p-4 relative overflow-hidden font-sans">
      {/* Decorative Gold & Dark Gradients */}
      <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/10 blur-[120px]" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[#14181f]/80 backdrop-blur-xl rounded-2xl border border-amber-500/20 p-8 shadow-2xl relative z-10"
      >
        {/* Barber Pole Stripes Line */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-white to-blue-600 rounded-t-2xl animate-pulse" />
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-4 animate-bounce">
            <Scissors className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-sans bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 bg-clip-text text-transparent">
            JRD PREMIUM BARBER
          </h1>
          <p className="text-gray-400 text-sm mt-1 font-mono">ESTILO · CLASE · EXCELENCIA</p>
        </div>

        <AnimatePresence mode="wait">
          {isLocked ? (
            <motion.div 
              key="locked"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 mb-4 animate-pulse">
                {timeLeft > 0 ? <Lock className="w-10 h-10" /> : <Unlock className="w-10 h-10 text-emerald-500" />}
              </div>
              
              <h2 className="text-xl font-bold text-red-400 mb-2">
                {timeLeft > 0 ? 'Acceso Temporalmente Bloqueado' : 'Sistema Listo'}
              </h2>
              
              <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
                {timeLeft > 0 
                  ? `Se alcanzaron 3 intentos fallidos. Por seguridad, espera que termine el tiempo de bloqueo.`
                  : 'El tiempo de espera ha finalizado. Puedes desbloquear el sistema de inmediato.'}
              </p>

              {timeLeft > 0 ? (
                <div className="text-4xl font-mono font-bold text-amber-500 mb-6 tracking-widest bg-amber-500/5 py-3 rounded-lg border border-amber-500/10">
                  00:{timeLeft.toString().padStart(2, '0')}
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleManualUnlock}
                  type="button"
                  id="btn-dynamic-unlock"
                  className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-950/20 transition-all cursor-pointer border border-emerald-400/20"
                >
                  <Unlock className="w-5 h-5" />
                  Desbloquear Sistema
                </motion.button>
              )}
            </motion.div>
          ) : (
            <motion.form 
              key="login"
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs"
                >
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Error:</span> {error}
                    {failedAttempts > 0 && failedAttempts < 3 && (
                      <p className="mt-1 font-semibold text-red-300">Intento {failedAttempts} de 3.</p>
                    )}
                  </div>
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold" htmlFor="login-username">
                  Usuario
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <User className="w-5 h-5" />
                  </span>
                  <input
                    type="text"
                    id="login-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Ingrese su usuario"
                    className="w-full pl-10 pr-4 py-3 bg-[#0d0f12] border border-gray-800 rounded-xl text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-gray-600 text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-semibold" htmlFor="login-password">
                  Contraseña
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <Lock className="w-5 h-5" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-3 bg-[#0d0f12] border border-gray-800 rounded-xl text-white outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-gray-600 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  id="btn-login-submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl shadow-lg shadow-amber-950/20 transition-all cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                >
                  <Sparkles className="w-4 h-4" />
                  Iniciar Sesión
                </motion.button>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-500 tracking-wide font-mono">
                  DEMO ACCESS: joelromero888 / 12903456
                </p>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

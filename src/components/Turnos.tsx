/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, CheckCircle, Trash2, Printer, Award, ShieldAlert, Sparkles, Scissors, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Turno, TipoServicio, ServicioInfo } from '../types';

interface TurnosProps {
  onAddNotification: (msg: string, type: 'success' | 'info') => void;
}

const SERVICIOS: ServicioInfo[] = [
  {
    tipo: 'corte_pelo',
    nombre: 'Corte de Pelo',
    precio: 1800,
    duracion: '30 min',
    descripcion: 'Diseño de corte personalizado, lavado premium y peinado con cera o pomada.'
  },
  {
    tipo: 'corte_barba',
    nombre: 'Arreglo de Barba',
    precio: 1200,
    duracion: '25 min',
    descripcion: 'Perfilado con navaja, toalla caliente, aceites esenciales y tratamiento hidratante.'
  },
  {
    tipo: 'servicio_premium',
    nombre: 'Servicio JRD Premium',
    precio: 3500,
    duracion: '60 min',
    descripcion: 'Corte de pelo + diseño de barba + cuidado facial de ozono + masaje relajante capilar.'
  }
];

const BARBEROS = [
  { id: '1', nombre: 'Joel Romero' },
  { id: '2', nombre: 'Ruben' },
  { id: '3', nombre: 'Dylan' }
];

const TIME_SLOTS = [
  '09:00', '09:40', '10:20', '11:00', '11:40', '12:20',
  '14:00', '14:40', '15:20', '16:00', '16:40', '17:20', '18:00', '18:40'
];

export default function Turnos({ onAddNotification }: TurnosProps) {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [cliente, setCliente] = useState('');
  const [telefono, setTelefono] = useState('');
  const [barberoId, setBarberoId] = useState('1');
  const [servicio, setServicio] = useState<TipoServicio>('corte_pelo');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [notas, setNotas] = useState('');
  const [currentTicket, setCurrentTicket] = useState<Turno | null>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('jrd_turnos');
    if (saved) {
      try {
        setTurnos(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      // Seed data
      const defaultTurnos: Turno[] = [
        {
          id: 't-1',
          codigoUnico: 'JRD-7521-T',
          cliente: 'Carlos Mendoza',
          telefono: '+54 11 5562 1290',
          barberoId: '1',
          barberoNombre: 'Joel Romero',
          servicio: 'servicio_premium',
          fecha: new Date().toISOString().split('T')[0],
          hora: '15:20',
          notas: 'Primera vez, quiere degradado alto.',
          creadoEn: new Date().toISOString()
        },
        {
          id: 't-2',
          codigoUnico: 'JRD-4412-T',
          cliente: 'Andres Peralta',
          telefono: '+54 11 9081 2234',
          barberoId: '2',
          barberoNombre: 'Ruben',
          servicio: 'corte_pelo',
          fecha: new Date().toISOString().split('T')[0],
          hora: '11:00',
          notas: '',
          creadoEn: new Date().toISOString()
        }
      ];
      setTurnos(defaultTurnos);
      localStorage.setItem('jrd_turnos', JSON.stringify(defaultTurnos));
    }

    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setFecha(today);
  }, []);

  const saveTurnos = (updated: Turno[]) => {
    setTurnos(updated);
    localStorage.setItem('jrd_turnos', JSON.stringify(updated));
  };

  const handleCreateTurno = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliente || !telefono || !fecha || !hora) {
      alert('Por favor complete todos los datos requeridos');
      return;
    }

    // Check if slot is already taken for the same barber on that day and hour
    const isTaken = turnos.some(t => t.barberoId === barberoId && t.fecha === fecha && t.hora === hora);
    if (isTaken) {
      alert('Esta hora ya se encuentra reservada para este barbero. Por favor elija otro horario o barbero.');
      return;
    }

    const recBarber = BARBEROS.find(b => b.id === barberoId);
    if (!recBarber) return;

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codigoUnico = `JRD-${randomSuffix}-T`;

    const nuevoTurno: Turno = {
      id: `t-${Date.now()}`,
      codigoUnico,
      cliente,
      telefono,
      barberoId,
      barberoNombre: recBarber.nombre,
      servicio,
      fecha,
      hora,
      notas,
      creadoEn: new Date().toISOString()
    };

    const updated = [nuevoTurno, ...turnos];
    saveTurnos(updated);
    onAddNotification(`Turno reservado exitosamente para ${cliente}`, 'success');

    // Automatically trigger visual ticket modal
    setCurrentTicket(nuevoTurno);

    // Reset fields except date
    setCliente('');
    setTelefono('');
    setNotas('');
    setHora('');
  };

  const handleDeleteTurno = (id: string, clientName: string) => {
    if (window.confirm(`¿Está seguro de cancelar el turno de ${clientName}?`)) {
      const filtered = turnos.filter(t => t.id !== id);
      saveTurnos(filtered);
      onAddNotification(`Turno de ${clientName} cancelado`, 'info');
    }
  };

  // Pseudo-random QR Code SVG Generator for stylish receipt
  const renderMockQR = (text: string) => {
    // We generate a deterministic grid of coordinates based on the code characters
    const size = 15;
    const squares: React.ReactNode[] = [];
    const hashStr = text + "JRD_PREMIUM_BARBER_SECRET_HASH_2026";
    let hashIndex = 0;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Render finder patterns at corners
        const isFinder = 
          (r < 4 && c < 4) || 
          (r < 4 && c >= size - 4) || 
          (r >= size - 4 && c < 4);
        
        let filled = false;
        if (isFinder) {
          // Classic QR corner pattern: outer border full, middle empty, inner full
          const inBorder = (r === 0 || r === 3 || c === 0 || c === 3) ||
                           (r === 0 || r === 3 || c === size - 4 || c === size - 1) ||
                           (r === size - 4 || r === size - 1 || c === 0 || c === 3);
          const inInner = (r === 1.5 || r === 2 || c === 1.5 || c === 2) || // center square approximate
                           (r === 1 || r === 2) && (c === 1 || c === 2) ||
                           (r === 1 || r === 2) && (c === size - 3 || c === size - 2) ||
                           (r === size - 3 || r === size - 2) && (c === 1 || c === 2);
          
          filled = inBorder || inInner;
        } else {
          // Deterministic pattern from string
          const charCode = hashStr.charCodeAt(hashIndex % hashStr.length);
          filled = ((charCode + r * 7 + c * 13) % 3) === 0;
          hashIndex++;
        }

        if (filled) {
          squares.push(
            <rect 
              key={`sq-${r}-${c}`} 
              x={c * 8 + 10} 
              y={r * 8 + 10} 
              width={7} 
              height={7} 
              fill="#111827" 
            />
          );
        }
      }
    }

    return (
      <svg viewBox="0 0 140 140" className="w-32 h-32 mx-auto bg-white p-2 rounded-lg border border-gray-200">
        <rect width="140" height="140" fill="#fff" />
        {squares}
        {/* Decorative central mini-logo */}
        <circle cx="70" cy="70" r="10" fill="#f59e0b" />
        <text x="70" y="73" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#000" fontFamily="sans-serif">
          JRD
        </text>
      </svg>
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-amber-500"><Scissors className="w-8 h-8" /></span>
            Gestión de Turnos
          </h2>
          <p className="text-gray-400 mt-1">Crea, consulta e imprime turnos con código QR de seguridad.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Formulario de Reserva */}
        <div className="lg:col-span-5 bg-[#14181f]/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-md relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20" />
          <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Nueva Reserva Premium
          </h3>

          <form onSubmit={handleCreateTurno} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <User className="w-4 h-4 text-amber-500" /> Nombre del Cliente *
              </label>
              <input
                type="text"
                value={cliente}
                onChange={(e) => setCliente(e.target.value)}
                required
                placeholder="Ej. Juan Pérez"
                className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500/50 transition-all text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-amber-500" /> Número de Teléfono *
              </label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                placeholder="Ej. +34 612 345 678"
                className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-3 text-white outline-none focus:border-amber-500/50 transition-all text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" /> Fecha *
                </label>
                <input
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-3 py-3 text-white outline-none focus:border-amber-500/50 transition-all text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-500" /> Hora *
                </label>
                <select
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  required
                  className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-3 py-3 text-white outline-none focus:border-amber-500/50 transition-all text-sm cursor-pointer"
                >
                  <option value="">Seleccionar...</option>
                  {TIME_SLOTS.map(slot => (
                    <option key={slot} value={slot}>{slot} hs</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-bold flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Barbero Especialista
              </label>
              <div className="grid grid-cols-3 gap-2">
                {BARBEROS.map(b => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBarberoId(b.id)}
                    className={`py-2 px-1 text-xs font-semibold rounded-xl border transition-all ${
                      barberoId === b.id 
                        ? 'bg-amber-500/15 border-amber-500 text-amber-500' 
                        : 'bg-[#0d0f12] border-gray-800 text-gray-400 hover:border-gray-700'
                    }`}
                  >
                    {b.nombre}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                Servicio Requerido
              </label>
              <div className="space-y-2.5">
                {SERVICIOS.map(s => (
                  <div
                    key={s.tipo}
                    onClick={() => setServicio(s.tipo)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      servicio === s.tipo
                        ? 'bg-amber-500/[0.08] border-amber-500/50 shadow-md shadow-amber-950/10'
                        : 'bg-[#0d0f12] border-gray-800/80 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${servicio === s.tipo ? 'bg-amber-400' : 'bg-gray-600'}`} />
                        <span className="font-bold text-sm text-white">{s.nombre}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{s.descripcion}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-bold text-amber-400 text-sm">${(s.precio / 100).toFixed(2)}</span>
                      <p className="text-[10px] text-gray-500 font-mono">{s.duracion}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-gray-400 font-bold">
                Instrucciones / Notas adicionales (Opcional)
              </label>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                placeholder="Ej. Toalla fría suave, barba cuadrada, etc."
                rows={2}
                className="w-full bg-[#0d0f12] border border-gray-800 rounded-xl px-4 py-2 text-white outline-none focus:border-amber-500/50 transition-all text-sm resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold rounded-xl transition-all uppercase tracking-wider text-xs shadow-lg shadow-amber-950/20 cursor-pointer"
            >
              Confirmar y Ver Ticket QR
            </motion.button>
          </form>
        </div>

        {/* Turnos del Día */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#14181f]/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-md">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-xl font-bold text-white">Turnos Programados</h3>
                <p className="text-xs text-gray-400 font-mono mt-0.5">ESTADO EN TIEMPO REAL</p>
              </div>
              <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-[11px] font-bold text-amber-400 font-mono">
                {turnos.length} Activos
              </span>
            </div>

            {turnos.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800 rounded-xl">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 font-bold">No hay turnos registrados</p>
                <p className="text-xs text-gray-500 mt-1">Completa el formulario de la izquierda para reservar.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2 custom-scrollbar">
                {turnos.map((t) => {
                  const sInfo = SERVICIOS.find(s => s.tipo === t.servicio);
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 bg-[#0d0f12] border border-gray-800/80 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-gray-700 transition-all group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold px-2 py-0.5 bg-gray-900 border border-gray-800 rounded text-amber-500">
                            {t.codigoUnico}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-full">
                            {sInfo?.nombre || t.servicio}
                          </span>
                        </div>
                        
                        <div>
                          <h4 className="font-extrabold text-white text-base">{t.cliente}</h4>
                          <p className="text-xs text-gray-400 flex items-center gap-1.5 mt-0.5">
                            <Phone className="w-3.5 h-3.5 text-amber-500" /> {t.telefono}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-400 pt-1">
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5 text-amber-500" /> Barbero: <strong className="text-gray-300">{t.barberoNombre}</strong>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" /> {t.fecha}
                          </span>
                          <span className="flex items-center gap-1 font-mono font-bold text-amber-400">
                            <Clock className="w-3.5 h-3.5" /> {t.hora} hs
                          </span>
                        </div>

                        {t.notas && (
                          <div className="text-xs text-gray-500 mt-2 bg-gray-900/50 p-2 rounded border border-gray-900 flex items-start gap-1">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5 text-amber-500/60" />
                            <span><strong className="text-gray-400">Nota:</strong> {t.notas}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 border-t border-gray-900 pt-3 md:border-none md:pt-0 shrink-0 justify-end">
                        <button
                          onClick={() => setCurrentTicket(t)}
                          className="px-3 py-2 bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black rounded-lg transition-all text-xs font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          Imprimir QR
                        </button>
                        <button
                          onClick={() => handleDeleteTurno(t.id, t.cliente)}
                          className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all cursor-pointer border border-red-500/10"
                          title="Cancelar Turno"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL / POPUP DE TICKET IMPRIMIBLE */}
      <AnimatePresence>
        {currentTicket && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm print:absolute print:inset-0 print:bg-white print:p-0">
            <motion.div
              type="ticket"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white text-gray-900 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative border-4 border-amber-500 print:border-none print:shadow-none print:rounded-none"
            >
              {/* Header inside ticket */}
              <div className="text-center pb-4 border-b border-dashed border-gray-300">
                <h3 className="text-xl font-black tracking-widest text-black">JRD PREMIUM BARBER</h3>
                <p className="text-[10px] font-mono uppercase tracking-widest text-amber-600 font-bold mt-0.5">Estilo · Clase · Excelencia</p>
                <p className="text-[10px] text-gray-400 mt-1 font-mono">TEL: +54 11 5529 1900</p>
                <p className="text-[10px] text-gray-400 font-mono">Av. Santa Fe 2390, CABA</p>
              </div>

              {/* Ticket details */}
              <div className="py-4 space-y-3 font-mono text-xs">
                <div className="flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                  <span className="font-bold text-gray-800">TICKET DE TURNO</span>
                  <span className="font-bold text-amber-600 bg-amber-500/10 px-2 py-0.5 rounded text-sm">{currentTicket.codigoUnico}</span>
                </div>

                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">CLIENTE:</span>
                    <span className="font-extrabold text-black uppercase">{currentTicket.cliente}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">TELÉFONO:</span>
                    <span className="font-semibold">{currentTicket.telefono}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">BARBERO:</span>
                    <span className="font-bold text-black">{currentTicket.barberoNombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">SERVICIO:</span>
                    <span className="font-bold">
                      {SERVICIOS.find(s => s.tipo === currentTicket.servicio)?.nombre || currentTicket.servicio}
                    </span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100">
                    <span className="text-gray-500 font-bold">FECHA:</span>
                    <span className="font-extrabold text-black">{currentTicket.fecha}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-bold">HORARIO:</span>
                    <span className="font-extrabold text-amber-600 text-sm bg-amber-500/5 px-1.5 rounded">{currentTicket.hora} hs</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-1 font-sans">
                    <span className="text-gray-500 font-bold font-mono">TOTAL:</span>
                    <span className="font-black text-black text-base font-mono">
                      ${((SERVICIOS.find(s => s.tipo === currentTicket.servicio)?.precio || 0) / 100).toFixed(2)}
                    </span>
                  </div>
                </div>

                {currentTicket.notas && (
                  <div className="bg-gray-50 p-2 rounded border border-gray-100 text-[11px] text-gray-600 pt-1.5">
                    <span className="font-bold block text-gray-700">INDICACIONES:</span>
                    <p className="italic mt-0.5">{currentTicket.notas}</p>
                  </div>
                )}
              </div>

              {/* Dynamic QR Code Section */}
              <div className="text-center py-2 space-y-2 border-t border-dashed border-gray-300">
                <p className="text-[10px] text-gray-500 font-mono tracking-wider">ESCANEÉ EL CÓDIGO QR PARA VERIFICAR SU TURNO</p>
                
                {renderMockQR(currentTicket.codigoUnico)}

                <p className="text-[9px] text-gray-400 font-mono">Emitido el: {new Date(currentTicket.creadoEn).toLocaleDateString()} {new Date(currentTicket.creadoEn).toLocaleTimeString()}</p>
              </div>

              {/* Buttons panel (Hidden when printing!) */}
              <div className="mt-5 flex gap-2.5 print:hidden">
                <button
                  onClick={handlePrint}
                  id="btn-print-action"
                  className="flex-1 py-3 bg-neutral-900 text-white hover:bg-neutral-800 rounded-xl font-bold flex items-center justify-center gap-2 text-xs transition-all cursor-pointer shadow-lg shadow-neutral-950/10"
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Ticket
                </button>
                <button
                  onClick={() => setCurrentTicket(null)}
                  className="px-4 py-3 bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-xl font-semibold text-xs transition-all cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

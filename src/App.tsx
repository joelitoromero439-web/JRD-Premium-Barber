/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Scissors, CalendarCheck, FileSpreadsheet, Award, LogOut, 
  Menu, X, Sparkles, Clock, MapPin, Phone, Star, TrendingUp, Compass, 
  Info, Users, Bell, Layers, Zap, Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Login from './components/Login';
import Turnos from './components/Turnos';
import Biblioteca from './components/Biblioteca';
import Inventario from './components/Inventario';

type Section = 'dashboard' | 'turnos' | 'biblioteca' | 'inventario';

interface NotificationToast {
  id: string;
  msg: string;
  type: 'success' | 'info';
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifications, setNotifications] = useState<NotificationToast[]>([]);

  // Clock ticks
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync login state with session/local storage for convenience
  useEffect(() => {
    const logged = sessionStorage.getItem('jrd_logged_in');
    if (logged === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    sessionStorage.setItem('jrd_logged_in', 'true');
    addNotification('¡Sesión iniciada correctamente! Bienvenido, Joel Romero.', 'success');
  };

  const handleLogout = () => {
    if (window.confirm('¿Deseas cerrar sesión en el sistema premium?')) {
      setIsLoggedIn(false);
      sessionStorage.removeItem('jrd_logged_in');
      setActiveSection('dashboard');
    }
  };

  const addNotification = (msg: string, type: 'success' | 'info') => {
    const newNotif: NotificationToast = {
      id: `notif-${Date.now()}`,
      msg,
      type
    };
    setNotifications(prev => [...prev, newNotif]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotif.id));
    }, 4000);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  // Mini-Home Dashboard Section
  const renderDashboardHome = () => {
    return (
      <div className="space-y-8 text-gray-200">
        {/* Welcome Premium Banner */}
        <div className="relative rounded-3xl bg-gradient-to-r from-amber-500/10 via-[#1a1e27] to-[#14181f] border border-amber-500/15 p-6 md:p-8 overflow-hidden">
          <div className="absolute right-[-10%] top-[-20%] w-[40%] h-[150%] rounded-full bg-amber-500/5 blur-[80px]" />
          
          <div className="max-w-xl space-y-4 relative z-10">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs font-bold text-amber-500">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Socio Fundador Autorizado
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
              Diseño Capilar Retro & Vanguardista, <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200 bg-clip-text text-transparent">Joel Romero</span>
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed font-sans">
              Bienvenido al panel central de JRD Premium. Gestiona de manera ágil los turnos con código QR impreso, audita el inventario de ceras y geles, y coordina a tu staff técnico selecto.
            </p>
          </div>
          
          {/* Animated Barber Pole Stripes inside the Hero Block */}
          <div className="absolute top-0 bottom-0 right-0 w-2 h-full bg-gradient-to-r from-red-600 via-white to-blue-600 opacity-60 flex flex-col justify-between" />
        </div>

        {/* Rapid Actions & Summary metrics */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-500" /> Accesos Directos & Resumen de Hoy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Action 1: Bookings */}
            <div 
              onClick={() => setActiveSection('turnos')}
              className="bg-[#14181f]/60 hover:bg-[#1a1f29]/80 border border-gray-800 hover:border-amber-500/20 p-5 rounded-2xl cursor-pointer transition-all group relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Agenda de Turnos</h4>
                  <p className="text-xs text-gray-400 mt-1">Registra citas, selecciona peluqueros e imprime credenciales QR térmicas.</p>
                </div>
              </div>
              <span className="text-xs text-amber-500 font-bold font-mono mt-4 flex items-center gap-1 group-hover:underline">
                Gestionar turnos &rarr;
              </span>
            </div>

            {/* Action 2: Staff */}
            <div 
              onClick={() => setActiveSection('biblioteca')}
              className="bg-[#14181f]/60 hover:bg-[#1a1f29]/80 border border-gray-800 hover:border-amber-500/20 p-5 rounded-2xl cursor-pointer transition-all group relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Biblioteca de Estilistas</h4>
                  <p className="text-xs text-gray-400 mt-1">Nuestra galeria de tendencias, información de Rubén, Dylan y Joel, y mapa de ubicación.</p>
                </div>
              </div>
              <span className="text-xs text-amber-500 font-bold font-mono mt-4 flex items-center gap-1 group-hover:underline">
                Ver portafolio &rarr;
              </span>
            </div>

            {/* Action 3: Spreadsheet Excel */}
            <div 
              onClick={() => setActiveSection('inventario')}
              className="bg-[#14181f]/60 hover:bg-[#1a1f29]/80 border border-gray-800 hover:border-amber-500/20 p-5 rounded-2xl cursor-pointer transition-all group relative flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Control de Inventario</h4>
                  <p className="text-xs text-gray-400 mt-1">Agrega ceras, geles y tintas. Genera y carga planificaciones en formato MS Excel.</p>
                </div>
              </div>
              <span className="text-xs text-emerald-400 font-bold font-mono mt-4 flex items-center gap-1 group-hover:underline">
                Ir a Inventario Excel &rarr;
              </span>
            </div>

          </div>
        </div>

        {/* Business information highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          <div className="bg-[#14181f]/50 border border-gray-800 rounded-2xl p-6 space-y-4">
            <h4 className="font-bold text-white flex items-center gap-2 text-base">
              <Users className="w-5 h-5 text-amber-500" /> Staff Disponible Hoy
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-[#0d0f12] rounded-xl border border-gray-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="font-bold text-white block">Joel Romero (Senior Pro)</span>
                    <span className="text-gray-500 text-[10px]">Cortes Modernos, Fades quirúrgicos</span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-500 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">9:00 - 20:00</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0d0f12] rounded-xl border border-gray-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <span className="font-bold text-white block">Ruben (El Arte Clásico)</span>
                    <span className="text-gray-500 text-[10px]">Afeitados con navaja, barberoterapia</span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-500 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">9:00 - 18:00</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-[#0d0f12] rounded-xl border border-gray-900">
                <div className="flex items-center gap-2.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <div>
                    <span className="font-bold text-white block">Dylan (Concept Street)</span>
                    <span className="text-gray-500 text-[10px]">Crops texturizados, Mullets modernos</span>
                  </div>
                </div>
                <span className="text-[10px] text-amber-500 font-mono font-bold bg-amber-500/10 px-2 py-0.5 rounded">12:00 - 20:00</span>
              </div>
            </div>
          </div>

          <div className="bg-[#14181f]/50 border border-gray-800 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2 text-base">
                <TrendingUp className="w-5 h-5 text-amber-500" /> Filosofía JRD Premium
              </h4>
              <p className="text-xs text-gray-400 mt-2.5 leading-relaxed">
                "Una verdadera experiencia de barbería no se trata solo del producto final, sino del cuidado con el que se esculpe. Cada toalla caliente, cada navaja libre y cada diseño de degradación son tratados como una firma de nuestro compromiso con el caballero contemporáneo."
              </p>
            </div>
            
            <div className="pt-4 border-t border-gray-900 flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-amber-500" /> Palermo, CABA</span>
              <span className="flex items-center gap-1 font-mono font-bold text-amber-500"><Zap className="w-4 h-4" /> 100% Offline-First Mode</span>
            </div>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d0f12] text-gray-100 flex flex-col md:flex-row font-sans relative overflow-x-hidden selection:bg-amber-500 selection:text-black">
      
      {/* Dynamic Notifications System */}
      <div className="fixed top-4 right-4 z-50 space-y-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {notifications.map(n => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-xl border shadow-2xl flex items-start gap-2.5 pointer-events-auto ${
                n.type === 'success' 
                  ? 'bg-emerald-950/95 border-emerald-500/30 text-emerald-300' 
                  : 'bg-amber-950/95 border-amber-500/30 text-amber-300'
              }`}
            >
              <Bell className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs font-semibold leading-relaxed">
                {n.msg}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* MOBILE BAR HEADER (Hidden on Desktop) */}
      <header className="md:hidden bg-[#14181f] border-b border-gray-800/80 px-4 py-3.5 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-amber-500 rotate-45" />
          <span className="font-extrabold text-sm tracking-widest text-white">JRD PREMIUM</span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 bg-[#0d0f12] border border-gray-800 rounded-lg text-gray-300 cursor-pointer"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* SIDEBAR NAVIGATION */}
      <AnimatePresence>
        {(sidebarOpen || true) && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className={`w-[260px] bg-[#14181f]/95 md:bg-[#14181f]/70 border-r border-gray-800 p-6 flex flex-col justify-between fixed md:sticky top-0 bottom-0 z-40 h-screen transition-transform duration-300 ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
            }`}
          >
            {/* Sidebar content */}
            <div className="space-y-8">
              {/* Brand Logo */}
              <div className="flex items-center gap-2.5 border-b border-gray-800 pb-5">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="font-black text-sm tracking-widest text-white">JRD BARBER</h1>
                  <span className="text-[9px] font-mono text-gray-500 block leading-none font-bold">PREMIUM PANEL v1.2</span>
                </div>
              </div>

              {/* Navigation list */}
              <nav className="space-y-1.5">
                <button
                  onClick={() => { setActiveSection('dashboard'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSection === 'dashboard'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/20 font-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/45'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  Inicio Premium
                </button>

                <button
                  onClick={() => { setActiveSection('turnos'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSection === 'turnos'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/20 font-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/45'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  Gestión de Turnos
                </button>

                <button
                  onClick={() => { setActiveSection('biblioteca'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSection === 'biblioteca'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/20 font-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/45'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  Biblioteca & Staff
                </button>

                <button
                  onClick={() => { setActiveSection('inventario'); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeSection === 'inventario'
                      ? 'bg-amber-500 text-black shadow-lg shadow-amber-950/20 font-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/45'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  Inventario Excel
                </button>
              </nav>
            </div>

            {/* User Profile & Logout section */}
            <div className="space-y-4 pt-6 border-t border-gray-800">
              {/* Dynamic clock */}
              <div className="text-[11px] font-mono text-gray-500 bg-gray-950/50 p-2.5 rounded-xl border border-gray-900 text-center tracking-wider">
                <Clock className="w-3.5 h-3.5 text-amber-500 inline mr-1.5 -mt-0.5 animate-pulse" />
                {currentTime.toLocaleDateString('es-ES')} - {currentTime.toLocaleTimeString('es-ES')}
              </div>

              <div className="flex items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-xs border border-amber-400/40">
                    JR
                  </div>
                  <div>
                    <span className="font-extrabold text-[11px] text-white block">joelromero888</span>
                    <span className="text-[8px] font-mono text-amber-400 uppercase font-black">PRO BARBER</span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all border border-red-500/10 cursor-pointer"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER PAGE */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full overflow-y-auto">
        
        {/* Render active section content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="pb-16"
          >
            {activeSection === 'dashboard' && renderDashboardHome()}
            {activeSection === 'turnos' && <Turnos onAddNotification={addNotification} />}
            {activeSection === 'biblioteca' && <Biblioteca />}
            {activeSection === 'inventario' && <Inventario onAddNotification={addNotification} />}
          </motion.div>
        </AnimatePresence>

      </main>
    </div>
  );
}

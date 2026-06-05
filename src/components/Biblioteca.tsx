/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Award, Star, Mail, MapPin, Instagram, Phone, Share2, Eye, Compass, Heart, MessageSquare, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Barbero } from '../types';

const BARBEROS: Barbero[] = [
  {
    id: '1',
    nombre: 'Joel Romero',
    especialidad: '"Fades" Quirúrgicos, Estilismo Avanzado & Diseño Capilar Tridimensional',
    experiencia: '12 años calibrando perfiles masculinos de primer nivel. Fundador y director artístico de JRD Premium Barber.',
    calificacion: 5.0,
    foto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80', // replacement safe photo
    trabajos: [
      'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '2',
    nombre: 'Ruben',
    especialidad: 'Cortes Clásicos, Perfilados Quirúrgicos & Peinados Estilo Retro',
    experiencia: '8 años rescatando el ritual del corte de cabello tradicional con técnicas puristas combinadas con navajas inglesas.',
    calificacion: 4.9,
    foto: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    trabajos: [
      'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1634480256802-7cb5b651ee6d?w=500&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: '3',
    nombre: 'Dylan',
    especialidad: 'Cortes Texturizados Modernos (French Crops, Mullets) & Tintura Creativa',
    experiencia: '5 años a la vanguardia de las tendencias del street-style global. Especialista en texturizados y colores fantasía.',
    calificacion: 4.8,
    foto: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    trabajos: [
      'https://images.unsplash.com/photo-1605497746444-17f735af048a?w=500&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1593702295094-aec22dfad70d?w=500&auto=format&fit=crop&q=80'
    ]
  }
];

const GALERIA_GENERAL = [
  {
    id: 'g1',
    titulo: 'Degradado Low Fade + Texturizado superior',
    barber: 'Joel Romero',
    src: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format&fit=crop&q=80',
    likes: 423
  },
  {
    id: 'g2',
    titulo: 'Corte High Fade + Pompadour Texturizado',
    barber: 'Ruben',
    src: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format&fit=crop&q=80',
    likes: 295
  },
  {
    id: 'g3',
    titulo: 'Modern French Crop con navaja pulida',
    barber: 'Dylan',
    src: 'https://images.unsplash.com/photo-1605497746444-17f735af048a?w=600&auto=format&fit=crop&q=80',
    likes: 312
  },
  {
    id: 'g4',
    titulo: 'Estilo Buzz Cut + Degradado Sharp a Navaja',
    barber: 'Joel Romero',
    src: 'https://images.unsplash.com/photo-1634480256802-7cb5b651ee6d?w=600&auto=format&fit=crop&q=80',
    likes: 512
  },
  {
    id: 'g5',
    titulo: 'Corte Undercut Desconectado con Brillo JRD',
    barber: 'Ruben',
    src: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80',
    likes: 188
  },
  {
    id: 'g6',
    titulo: 'Texturizado Crop y Contornos Ultra-Finados',
    barber: 'Dylan',
    src: 'https://images.unsplash.com/photo-1593702295094-aec22dfad70d?w=600&auto=format&fit=crop&q=80',
    likes: 340
  }
];

export default function Biblioteca() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likesCount, setLikesCount] = useState<Record<string, number>>({
    g1: 423, g2: 295, g3: 312, g4: 512, g5: 188, g6: 340
  });
  const [likedItems, setLikedItems] = useState<Record<string, boolean>>({});
  
  // Interactive Custom Map Variables
  const [zoom, setZoom] = useState(1);
  const [activePin, setActivePin] = useState<'principal' | 'estacionamiento' | 'plaza' | null>('principal');

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedItems[id]) {
      setLikesCount(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setLikedItems(prev => ({ ...prev, [id]: false }));
    } else {
      setLikesCount(prev => ({ ...prev, [id]: prev[id] + 1 }));
      setLikedItems(prev => ({ ...prev, [id]: true }));
    }
  };

  return (
    <div className="space-y-12 font-sans text-gray-200">
      
      {/* Header */}
      <div className="border-b border-gray-800 pb-5">
        <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span className="text-amber-500"><Award className="w-8 h-8" /></span>
          Biblioteca de Expertos & Portal JRD
        </h2>
        <p className="text-gray-400 mt-1">Conoce a nuestro staff de élite, explora la galería interactiva y encuentra cada sucursal.</p>
      </div>

      {/* Seccion Barberos */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-3">
          Estilistas de Élite JRD
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BARBEROS.map(b => (
            <div 
              key={b.id} 
              className="bg-[#14181f]/60 rounded-2xl border border-gray-800 p-5 relative flex flex-col justify-between hover:border-amber-500/30 transition-all group overflow-hidden"
            >
              {/* Background amber glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-amber-500/5 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img 
                      src={b.foto} 
                      alt={b.nombre} 
                      className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/40"
                    />
                    <div className="absolute -bottom-1.5 -right-1 bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-0.5 shadow">
                      <Star className="w-2.5 h-2.5 fill-black" />
                      {b.calificacion.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white">{b.nombre}</h4>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-amber-500 font-bold bg-amber-500/10 px-2 py-0.5 rounded mt-1 inline-block">
                      {b.id === '1' ? 'PROPIETARIO / SENIOR' : 'ESPECIALISTA'}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-xs text-gray-400 leading-relaxed italic">
                    {b.especialidad}
                  </p>
                  
                  <div className="text-xs bg-[#0d0f12]/80 p-3 rounded-xl border border-gray-900 leading-relaxed text-gray-300">
                    <span className="text-[10px] font-mono font-bold block text-amber-500/80 mb-1">CUALIFICACIONES & LOGROS</span>
                    {b.experiencia}
                  </div>
                </div>
              </div>

              {/* Mini Showcase de trabajos del Barbero */}
              <div className="mt-4 pt-4 border-t border-gray-900/40">
                <span className="text-[10px] font-mono font-bold block text-gray-500 mb-2">GALERÍA DE AUTOR RECIENTE</span>
                <div className="grid grid-cols-2 gap-2">
                  {b.trabajos.map((trabajoUrl, i) => (
                    <div 
                      key={i} 
                      onClick={() => setSelectedImage(trabajoUrl)}
                      className="relative rounded-lg overflow-hidden h-24 cursor-zoom-in group/img border border-gray-950"
                    >
                      <img 
                        src={trabajoUrl} 
                        alt="Trabajo de Barbero" 
                        className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                        <Eye className="w-5 h-5 text-amber-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Work Interactive Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white tracking-wide border-l-4 border-amber-500 pl-3">
            Galería del Salón
          </h3>
          <span className="text-xs text-gray-400 font-mono">ÚLTIMOS ESTILOS REALIZADOS</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GALERIA_GENERAL.map((item) => (
            <div 
              key={item.id}
              className="bg-[#14181f]/40 border border-gray-800 rounded-2xl overflow-hidden group hover:border-amber-500/20 transition-all flex flex-col h-full"
            >
              <div className="relative h-64 overflow-hidden bg-black cursor-zoom-in" onClick={() => setSelectedImage(item.src)}>
                <img 
                  src={item.src} 
                  alt={item.titulo} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/20 to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md border border-amber-500/20 px-2.5 py-1 rounded-lg text-[10px] font-bold text-amber-500">
                  {item.barber}
                </div>

                <div className="absolute bottom-3 left-3 right-3">
                  <h4 className="text-sm font-extrabold text-white line-clamp-1">{item.titulo}</h4>
                </div>
              </div>

              <div className="p-3.5 bg-[#0e1217] flex items-center justify-between border-t border-gray-900 text-xs">
                <span className="text-gray-500 font-mono">FOTOGRAFÍA REAL DE CLIENTES JRD</span>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={(e) => handleLike(item.id, e)}
                    className="flex items-center gap-1.5 hover:text-red-400 transition-all font-mono py-1 px-2.5 rounded-full bg-gray-950/70 border border-gray-800 text-gray-400"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedItems[item.id] ? 'fill-red-500 text-red-500' : ''}`} />
                    {likesCount[item.id]}
                  </button>
                  <button className="text-gray-400 hover:text-white transition-all p-1">
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Contact Map and Social Networks */}
      <div className="bg-[#14181f]/60 rounded-2xl border border-gray-800 p-6 md:p-8 backdrop-blur-md">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-black">ENCUÉNTRANOS</span>
              <h3 className="text-2xl font-black text-white mt-1">Sedes & Redes Sociales</h3>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Nuestra peluquería principal se encuentra en el vibrante corazón de Buenos Aires. Ven a disfrutar de un trago de cortesía o un café espresso premium durante tu sesión.
              </p>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="flex items-start gap-3 bg-[#0d0f12] p-3.5 rounded-xl border border-gray-900">
                <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">SUCURSAL CENTRAL</span>
                  <span className="text-gray-400 block mt-0.5">Av. Santa Fe 2390, Palermo, CABA, Argentina</span>
                  <span className="text-gray-500 block text-[10px] mt-1">Frente al Centro de Convenciones</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0d0f12] p-3.5 rounded-xl border border-gray-900">
                <Phone className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">RESERVAS & CONSULTAS WHATSAPP</span>
                  <span className="text-gray-400 block mt-0.5">+54 11 5529 1900</span>
                  <span className="text-gray-500 block text-[10px] mt-1">Lunes a Sábados de 09:00 a 20:00 hs.</span>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-[#0d0f12]/60 p-3.5 rounded-xl border border-gray-900">
                <Mail className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">CORREO CORPORATIVO</span>
                  <span className="text-gray-400 block mt-0.5">contacto@jrdpremiumbarber.com</span>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[10px] font-mono tracking-widest text-gray-500 uppercase font-bold block mb-3">CONÉCTATE EN REDES SOCIALES</span>
              <div className="flex flex-wrap gap-2.5">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 py-2 px-4 bg-gradient-to-r from-purple-600/25 to-pink-600/25 border border-pink-500/30 rounded-xl text-pink-400 text-xs font-bold hover:brightness-110 transition-all font-mono"
                >
                  <Instagram className="w-4 h-4" />
                  @jrdpremium_barber
                </a>
                <a 
                  href="https://whatsapp.com" 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center gap-2 py-2 px-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-bold hover:brightness-110 transition-all font-mono"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp Directo
                </a>
              </div>
            </div>
          </div>

          {/* Map Interactive Representation */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-white font-bold flex items-center gap-1.5 font-mono">
                <Compass className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} /> MAPA VIRTUAL JRD CENTRAL
              </span>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setZoom(prev => Math.max(0.7, prev - 0.15))}
                  className="w-7 h-7 bg-[#0d0f12] text-amber-400 border border-gray-800 rounded flex items-center justify-center font-bold font-mono text-sm hover:border-gray-700 cursor-pointer"
                  title="Zoom Out"
                >
                  -
                </button>
                <button 
                  onClick={() => setZoom(prev => Math.min(1.5, prev + 0.15))}
                  className="w-7 h-7 bg-[#0d0f12] text-amber-400 border border-gray-800 rounded flex items-center justify-center font-bold font-mono text-sm hover:border-gray-700 cursor-pointer"
                  title="Zoom In"
                >
                  +
                </button>
                <button 
                  onClick={() => setZoom(1)}
                  className="px-2 h-7 bg-[#0d0f12] text-amber-400 border border-gray-800 rounded text-xs font-mono hover:border-gray-700 cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Custom high fidelity interactive vector map */}
            <div className="relative h-[280px] md:h-[340px] bg-[#0c0e12] rounded-2xl border border-gray-800 overflow-hidden select-none shadow-inner">
              
              <div 
                className="absolute inset-0 transition-transform duration-300 origin-center p-6 flex items-center justify-center"
                style={{ transform: `scale(${zoom})` }}
              >
                {/* Street Grid SVG */}
                <svg viewBox="0 0 600 400" className="w-full h-full opacity-60">
                  {/* Streets */}
                  <rect x="0" y="0" width="600" height="400" fill="#0d0f12" />
                  
                  {/* Grid of streets blocks */}
                  {/* Avenue Santa Fe */}
                  <line x1="100" y1="0" x2="200" y2="400" stroke="#1f2937" strokeWidth="24" />
                  <line x1="100" y1="0" x2="200" y2="400" stroke="#f59e0b" strokeWidth="1" strokeDasharray="6,6" opacity="0.3" />
                  <text x="110" y="50" transform="rotate(76, 110, 50)" fill="#4b5563" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    AV. SANTA FE
                  </text>

                  {/* Pueyrredon cross street */}
                  <line x1="0" y1="180" x2="600" y2="250" stroke="#1f2937" strokeWidth="18" />
                  <text x="20" y="175" fill="#4b5563" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    AV. PUEYRREDÓN
                  </text>

                  {/* Minor streets */}
                  <line x1="300" y1="0" x2="300" y2="400" stroke="#111827" strokeWidth="10" />
                  <line x1="450" y1="0" x2="450" y2="400" stroke="#111827" strokeWidth="10" />
                  <line x1="0" y1="80" x2="600" y2="80" stroke="#111827" strokeWidth="10" />
                  <line x1="0" y1="320" x2="600" y2="320" stroke="#111827" strokeWidth="10" />

                  {/* Buildings blocks / Green Areas */}
                  {/* Plaza Arenales representation */}
                  <rect x="340" y="30" width="180" height="110" rx="10" fill="#064e3b" opacity="0.4" />
                  <text x="430" y="90" fill="#10b981" fontSize="11" fontWeight="bold" textAnchor="middle">Plaza Güemes</text>

                  {/* Subway stations or points of interest */}
                  <circle cx="150" cy="200" r="14" fill="#1e3a8a" opacity="0.5" />
                  <text x="150" y="203" fill="#60a5fa" fontSize="9" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">H</text>

                  {/* Location blocks */}
                  <rect x="30" y="200" width="80" height="100" rx="5" fill="#1f2937" opacity="0.3" />
                  <rect x="230" y="110" width="60" height="50" rx="5" fill="#1f2937" opacity="0.3" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3,3" />
                  
                  {/* Secondary Pins representations */}
                  {/* Parking */}
                  <circle cx="260" cy="290" r="18" fill="#1f2937" stroke="#374151" strokeWidth="1.5" />
                  <text x="260" y="294" fill="#9ca3af" fontSize="10" fontWeight="bold" textAnchor="middle">🅿</text>

                  {/* Connection Arrows or labels */}
                  <text x="285" y="295" fill="#9ca3af" fontSize="9">Estac. 80m</text>
                </svg>

                {/* REAL INTERACTIVE MAP PINS (HTML Overlaid on coordinates) */}
                {/* JRD Barber Principal Center Pin */}
                <div 
                  className="absolute cursor-pointer group/pin"
                  style={{ left: '26%', top: '35%' }}
                  onClick={() => setActivePin('principal')}
                >
                  <div className="relative flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-amber-500 opacity-40"></span>
                    <div className="relative bg-amber-500 hover:bg-amber-400 text-black p-2.5 rounded-full shadow-xl shadow-amber-950/40 border-2 border-white transition-all z-20">
                      <MapPin className="w-5 h-5 fill-black" />
                    </div>
                  </div>
                </div>

                {/* Parking Pin */}
                <div 
                  className="absolute cursor-pointer flex items-center justify-center"
                  style={{ left: '44%', top: '72%' }}
                  onClick={() => setActivePin('estacionamiento')}
                >
                  <div className="bg-neutral-850 hover:bg-neutral-800 text-cyan-400 p-1.5 rounded-full border border-cyan-800 transition-all z-10">
                    <MapPin className="w-3.5 h-3.5 fill-none" />
                  </div>
                </div>

                {/* Park Pin */}
                <div 
                  className="absolute cursor-pointer flex items-center justify-center"
                  style={{ left: '71%', top: '22%' }}
                  onClick={() => setActivePin('plaza')}
                >
                  <div className="bg-emerald-950/90 text-emerald-400 p-1.5 rounded-full border border-emerald-800 transition-all z-10">
                    <MapPin className="w-3.5 h-3.5 fill-none" />
                  </div>
                </div>
              </div>

              {/* Informative Overlay for Active Pin */}
              <div className="absolute bottom-3 left-3 right-3 bg-gray-950/95 backdrop-blur-md border border-gray-850 p-3 rounded-xl flex items-center justify-between gap-3 text-xs z-30">
                {activePin === 'principal' ? (
                  <>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
                        🔑
                      </div>
                      <div>
                        <p className="font-extrabold text-white text-xs">JRD PREMIUM BARBER CENTRAL</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">Av. Santa Fe 2390. Abierto Ahora.</p>
                      </div>
                    </div>
                    <a 
                      href="https://maps.google.com/?q=Av.+Santa+Fe+2390,+Buenos+Aires" 
                      target="_blank" 
                      rel="noreferrer"
                      className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-lg inline-flex items-center gap-1 leading-none text-[10px]"
                    >
                      GPS <ExternalLink className="w-3 h-3" />
                    </a>
                  </>
                ) : activePin === 'estacionamiento' ? (
                  <div className="w-full flex justify-between items-center text-gray-300">
                    <div>
                      <p className="font-bold text-white text-[11px]">Estacionamiento "Sarmiento"</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">Convenio JRD: Primera hora gratis con tu sello de corte.</p>
                    </div>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-400 px-2 py-0.5 rounded border border-cyan-800 font-bold">80 METROS</span>
                  </div>
                ) : (
                  <div className="w-full text-gray-300 text-[11px]">
                    <span className="font-bold text-white">Plaza Güemes</span> — Un punto de referencia hermoso para relajarse antes o después de tu servicio.
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-[10px] text-gray-500 text-center font-mono italic">
              * Mapa completamente interactivo. Haz click en los Pines de ubicación o ajusta los niveles de zoom (+ / -).
            </p>
          </div>
        </div>
      </div>

      {/* FULL SCREEN IMAGE MODAL DETAIL */}
      <AnimatePresence>
        {selectedImage && (
          <div 
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl relative"
            >
              <img 
                src={selectedImage} 
                alt="Detalle de Trabajo de Corte" 
                className="max-w-full max-h-[85vh] object-contain rounded-xl border border-amber-500/20"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-2 hover:bg-black/80 font-bold text-sm leading-none"
              >
                ✕
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

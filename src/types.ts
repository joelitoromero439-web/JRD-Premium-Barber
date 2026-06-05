/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Barbero {
  id: string;
  nombre: string;
  especialidad: string;
  experiencia: string;
  foto: string;
  calificacion: number;
  trabajos: string[];
}

export type TipoServicio = 'corte_pelo' | 'corte_barba' | 'servicio_premium';

export interface ServicioInfo {
  tipo: TipoServicio;
  nombre: string;
  precio: number;
  duracion: string;
  descripcion: string;
}

export interface Turno {
  id: string;
  codigoUnico: string;
  cliente: string;
  telefono: string;
  barberoId: string;
  barberoNombre: string;
  servicio: TipoServicio;
  fecha: string;
  hora: string;
  notas?: string;
  creadoEn: string;
}

export interface ProductoInventario {
  id: string;
  nombre: string;
  categoria: 'Ceras' | 'Geles' | 'Shampoo' | 'Cuidado Facial' | 'Otros';
  cantidad: number;
  precioVenta: number;
  precioCosto: number;
  proveedor: string;
  estado: 'Disponible' | 'Bajo Stock' | 'Agotado';
}

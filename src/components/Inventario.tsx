/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { FileSpreadsheet, Upload, Download, Plus, Trash2, Edit2, Check, X, AlertCircle, ShoppingCart, RefreshCw, BarChart2, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import * as XLSX from 'xlsx';
import { ProductoInventario } from '../types';

interface InventarioProps {
  onAddNotification: (msg: string, type: 'success' | 'info') => void;
}

const PRODUCTOS_PREDETERMINADOS: ProductoInventario[] = [
  {
    id: 'prod-1',
    nombre: 'Cera JRD Premium Matte Clay',
    categoria: 'Ceras',
    cantidad: 24,
    precioVenta: 1800,
    precioCosto: 750,
    proveedor: 'Cosméticos Barber SRL',
    estado: 'Disponible'
  },
  {
    id: 'prod-2',
    nombre: 'Gel Extrafuerte 24 Horas JRD Glow',
    categoria: 'Geles',
    cantidad: 30,
    precioVenta: 1200,
    precioCosto: 450,
    proveedor: 'Geles Argentinos S.A.',
    estado: 'Disponible'
  },
  {
    id: 'prod-3',
    nombre: 'Pomada de Brillo Clásica Barber',
    categoria: 'Ceras',
    cantidad: 5,
    precioVenta: 1600,
    precioCosto: 800,
    proveedor: 'Importadora Estilos',
    estado: 'Bajo Stock'
  },
  {
    id: 'prod-4',
    nombre: 'Exfoliante de Carbón Activo JRD',
    categoria: 'Cuidado Facial',
    cantidad: 15,
    precioVenta: 2200,
    precioCosto: 1000,
    proveedor: 'Laboratorios Organix',
    estado: 'Disponible'
  },
  {
    id: 'prod-5',
    nombre: 'Shampoo Anticaspa Profesional',
    categoria: 'Shampoo',
    cantidad: 0,
    precioVenta: 2500,
    precioCosto: 1200,
    proveedor: 'Distribuidora Capilar',
    estado: 'Agotado'
  }
];

export default function Inventario({ onAddNotification }: InventarioProps) {
  const [productos, setProductos] = useState<ProductoInventario[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Inline edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNombre, setEditNombre] = useState('');
  const [editCategoria, setEditCategoria] = useState<ProductoInventario['categoria']>('Ceras');
  const [editCantidad, setEditCantidad] = useState(0);
  const [editPrecioVenta, setEditPrecioVenta] = useState(0);
  const [editPrecioCosto, setEditPrecioCosto] = useState(0);
  const [editProveedor, setEditProveedor] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load inventory on mount
  useEffect(() => {
    const saved = localStorage.getItem('jrd_inventario');
    if (saved) {
      try {
        setProductos(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    } else {
      setProductos(PRODUCTOS_PREDETERMINADOS);
      localStorage.setItem('jrd_inventario', JSON.stringify(PRODUCTOS_PREDETERMINADOS));
    }
  }, []);

  const saveInventory = (updated: ProductoInventario[]) => {
    setProductos(updated);
    localStorage.setItem('jrd_inventario', JSON.stringify(updated));
  };

  // Status computation helper
  const getStatus = (qty: number): ProductoInventario['estado'] => {
    if (qty <= 0) return 'Agotado';
    if (qty <= 5) return 'Bajo Stock';
    return 'Disponible';
  };

  const handleDownloadTemplate = () => {
    let templateData = [];

    if (productos.length > 0) {
      templateData = productos.map(p => ({
        'Producto': p.nombre,
        'Categoría': p.categoria,
        'Stock': p.cantidad,
        'Unitario ($)': p.precioVenta,
        'Inversión ($)': p.precioCosto,
        'Proveedor': p.proveedor
      }));
    } else {
      templateData = [
        {
          'Producto': 'Cera JRD Premium Matte Clay (Ejemplo)',
          'Categoría': 'Ceras',
          'Stock': 15,
          'Unitario ($)': 1800,
          'Inversión ($)': 750,
          'Proveedor': 'Cosméticos Barber SRL'
        },
        {
          'Producto': 'Gel Extrafuerte 24 Horas JRD Glow (Ejemplo)',
          'Categoría': 'Geles',
          'Stock': 20,
          'Unitario ($)': 1200,
          'Inversión ($)': 450,
          'Proveedor': 'Geles Argentinos S.A.'
        }
      ];
    }

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Plantilla JRD');

    // Auto-fit widths
    worksheet['!cols'] = [
      { w: 35 }, // Producto
      { w: 15 }, // Categoría
      { w: 12 }, // Stock
      { w: 18 }, // Unitario ($)
      { w: 18 }, // Inversión ($)
      { w: 25 }, // Proveedor
    ];

    XLSX.writeFile(workbook, 'Plantilla_Inventario_JRD.xlsx');
    onAddNotification(
      productos.length > 0 
        ? 'Plantilla exportada con tus datos actuales. Agrega más filas o edita y vuelve a cargar.' 
        : 'Plantilla de Excel descargada. Rellene con sus productos y cárguela.', 
      'info'
    );
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (window.confirm(`¿Seguro que desea eliminar "${name}" del inventario?`)) {
      const updated = productos.filter(p => p.id !== id);
      saveInventory(updated);
      onAddNotification(`Producto "${name}" eliminado`, 'info');
    }
  };

  // Start Inline Editing
  const startEdit = (p: ProductoInventario) => {
    setEditingId(p.id);
    setEditNombre(p.nombre);
    setEditCategoria(p.categoria);
    setEditCantidad(p.cantidad);
    setEditPrecioVenta(p.precioVenta);
    setEditPrecioCosto(p.precioCosto);
    setEditProveedor(p.proveedor);
  };

  const saveEdit = (id: string) => {
    const updated = productos.map(p => {
      if (p.id === id) {
        const qty = Number(editCantidad);
        return {
          ...p,
          nombre: editNombre.trim(),
          categoria: editCategoria,
          cantidad: qty,
          precioVenta: Math.round(Number(editPrecioVenta) * 100) / 100,
          precioCosto: Math.round(Number(editPrecioCosto) * 100) / 100,
          proveedor: editProveedor.trim(),
          estado: getStatus(qty)
        };
      }
      return p;
    });

    saveInventory(updated);
    setEditingId(null);
    onAddNotification('Producto actualizado correctamente', 'success');
  };

  // --- EXCEL GENERATION & EXPORT ---
  const handleExportExcel = () => {
    // Transform JSON data into a clean structure for spreadsheet
    const formattedData = productos.map((p, idx) => ({
      'N°': idx + 1,
      'Código ID': p.id,
      'Producto': p.nombre,
      'Categoría': p.categoria,
      'Stock': p.cantidad,
      'Unitario ($)': p.precioVenta,
      'Inversión ($)': p.precioCosto,
      'Valor del Stock ($)': p.cantidad * p.precioVenta,
      'Proveedor': p.proveedor,
      'Estado Alerta': p.estado
    }));

    // Generate sheet and workbook
    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inventario JRD');

    // Auto-fit column widths
    const max_len = formattedData.reduce((prev: any, next: any) => {
      Object.keys(next).forEach((key, colIndex) => {
        const valLen = String(next[key]).length;
        prev[colIndex] = Math.max(prev[colIndex] || 0, valLen, key.length);
      });
      return prev;
    }, []);
    worksheet['!cols'] = max_len.map((w: number) => ({ w: w + 3 }));

    // Write file and download immediately
    XLSX.writeFile(workbook, 'Inventario_JRD_Premium_Barber.xlsx');
    onAddNotification('Archivo Excel exportado exitosamente', 'success');
  };

  // --- EXCEL FILE LOADING ---
  const handleImportExcel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Parse rows as raw JSON array
        const rawJsonData = XLSX.utils.sheet_to_json<any>(worksheet);

        if (rawJsonData.length === 0) {
          alert('El archivo cargado está vacío o no tiene un formato parseable.');
          return;
        }

        // Map read rows to our ProductoInventario schema dynamically with fallback guards
        const mappedProducts: ProductoInventario[] = rawJsonData.map((row: any, i: number) => {
          // Robust column extraction supporting exact headers and fallback spelling
          const prodName = row['Producto'] || row['Nombre Producto'] || row['Nombre'] || row['nombre'] || `Excel Prod #${i + 1}`;
          let cat: ProductoInventario['categoria'] = 'Otros';
          const rCat = String(row['Categoría'] || row['Categoria'] || row['categoria'] || '').trim();
          if (['Ceras', 'Geles', 'Shampoo', 'Cuidado Facial', 'Otros'].includes(rCat)) {
            cat = rCat as ProductoInventario['categoria'];
          } else if (rCat.toLowerCase().includes('cera')) {
            cat = 'Ceras';
          } else if (rCat.toLowerCase().includes('gel')) {
            cat = 'Geles';
          } else if (rCat.toLowerCase().includes('shampoo') || rCat.toLowerCase().includes('champu')) {
            cat = 'Shampoo';
          } else if (rCat.toLowerCase().includes('facial') || rCat.toLowerCase().includes('rostro')) {
            cat = 'Cuidado Facial';
          }

          const qty = Number(row['Stock'] || row['Stock Físico (Unid)'] || row['Cantidad'] || row['cantidad'] || row['stock'] || 0);
          const pVenta = Number(row['Unitario ($)'] || row['Precio de Venta ($)'] || row['Precio Venta'] || row['precio_venta'] || row['Precio'] || 0);
          const pCosto = Number(row['Inversión ($)'] || row['Costo Unitario ($)'] || row['Precio Costo'] || row['precio_costo'] || row['Costo'] || 0);
          const prov = String(row['Proveedor'] || row['Proveedor de Reposición'] || row['proveedor'] || 'Importador General');

          return {
            id: `prod-${Date.now()}-${i}`,
            nombre: prodName,
            categoria: cat,
            cantidad: isNaN(qty) ? 0 : qty,
            precioVenta: isNaN(pVenta) ? 0 : pVenta,
            precioCosto: isNaN(pCosto) ? 0 : pCosto,
            proveedor: prov,
            estado: getStatus(qty)
          };
        });

        // Smart merging by product name to avoid duplications
        let agregados = 0;
        let actualizados = 0;
        const copiaProductos = [...productos];

        mappedProducts.forEach(newProd => {
          const index = copiaProductos.findIndex(p => p.nombre.trim().toLowerCase() === newProd.nombre.trim().toLowerCase());
          if (index !== -1) {
            // Update existing product values with the values from Excel
            copiaProductos[index] = {
              ...copiaProductos[index],
              categoria: newProd.categoria,
              cantidad: newProd.cantidad,
              precioVenta: newProd.precioVenta,
              precioCosto: newProd.precioCosto,
              proveedor: newProd.proveedor,
              estado: newProd.estado
            };
            actualizados++;
          } else {
            // Add as a new product
            copiaProductos.push(newProd);
            agregados++;
          }
        });

        if (window.confirm(`Se ha procesado el archivo Excel:\n\n• ${actualizados} productos existentes se actualizarán.\n• ${agregados} productos nuevos se añadirán.\n\n¿Desea aplicar estos cambios de forma segura a su inventario?`)) {
          saveInventory(copiaProductos);
          onAddNotification(`Sincronización armada: ${agregados} agregados, ${actualizados} actualizados.`, 'success');
        }
      } catch (err) {
        console.error(err);
        alert('Hubo un error al procesar el archivo Excel. Asegúrese de que tenga columnas válidas.');
      }
    };

    reader.readAsBinaryString(file);
    // Clear input so same file can be loaded again if desired
    e.target.value = '';
  };

  // Statistics computation
  const filteredProducts = productos.filter(p =>
    p.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.categoria.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.proveedor.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalValue = productos.reduce((sum, p) => sum + (p.cantidad * p.precioVenta), 0);
  const totalCost = productos.reduce((sum, p) => sum + (p.cantidad * p.precioCosto), 0);
  const lowStockCount = productos.filter(p => p.estado === 'Bajo Stock').length;
  const outOfStockCount = productos.filter(p => p.estado === 'Agotado').length;

  return (
    <div className="space-y-8 font-sans">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-amber-500"><FileSpreadsheet className="w-8 h-8" /></span>
            Inventario & Excel JRD
          </h2>
          <p className="text-gray-400 mt-1">Sincroniza geles, ceras y lociones. Genera plantillas o carga listados de stock.</p>
        </div>

        {/* Excel Sync Buttons */}
        <div className="flex items-center gap-2.5">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImportExcel}
            accept=".xlsx, .xls, .csv" 
            className="hidden" 
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-neutral-900 hover:bg-neutral-850 text-white border border-gray-850 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-neutral-950/20"
          >
            <Upload className="w-4 h-4 text-emerald-400" />
            Cargar Excel (.xlsx / .csv)
          </button>
          
          <button
            onClick={handleExportExcel}
            id="btn-export-excel"
            className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-450 hover:to-emerald-550 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-emerald-950/20"
          >
            <Download className="w-4 h-4" />
            Descargar Excel
          </button>
        </div>
      </div>

      {/* Stats Summary Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#14181f]/60 p-4 rounded-2xl border border-gray-800/80">
          <span className="text-[10px] font-mono tracking-wider font-bold text-gray-500 uppercase block">VALOR EN VENTA TOTAL</span>
          <span className="text-2xl font-black text-white font-mono mt-1 block">${totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="bg-[#14181f]/60 p-4 rounded-2xl border border-gray-800/80">
          <span className="text-[10px] font-mono tracking-wider font-bold text-gray-500 uppercase block">INVERSIÓN COSTO DE STOCK</span>
          <span className="text-2xl font-black text-amber-500 font-mono mt-1 block">${totalCost.toLocaleString('es-ES', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="bg-[#14181f]/60 p-4 rounded-2xl border border-gray-800/80">
          <span className="text-[10px] font-mono tracking-wider font-bold text-gray-500 uppercase block">PRODUCTOS EN RIESGO (BAJO)</span>
          <span className="text-2xl font-black text-amber-400 mt-1 block font-mono">{lowStockCount} items</span>
        </div>
        <div className="bg-[#14181f]/60 p-4 rounded-2xl border border-gray-800/80">
          <span className="text-[10px] font-mono tracking-wider font-bold text-gray-500 uppercase block">AGOTADOS SIN UNIDADES</span>
          <span className="text-2xl font-black text-red-400 mt-1 block font-mono">{outOfStockCount} items</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* ADD PRODUCT EXCLUSIVELY VIA EXCEL PANEL */}
        <div className="xl:col-span-4 bg-[#14181f]/60 border border-gray-800 rounded-2xl p-6 backdrop-blur-md relative h-fit flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-amber-500" />
              Carga Exclusiva por Excel
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Para garantizar la consistencia en el catálogo de la barbería, las altas de nuevos productos se realizan <strong className="text-amber-500 font-bold">únicamente mediante hojas Excel (.xlsx / .csv)</strong>. Sigue estos simples pasos para importar:
            </p>

            <div className="border border-gray-850 bg-[#0d0f12] rounded-xl p-3.5 space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-amber-500/80 uppercase tracking-wider">PASO 1: Descargar Plantilla con Datos</h4>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Descarga la plantilla oficial precargada con tus productos actuales para editarlos o agregar nuevos registros directamente en el archivo:
              </p>
              <button
                onClick={handleDownloadTemplate}
                className="w-full py-2.5 bg-neutral-900 hover:bg-[#1a1c22] border border-gray-800 hover:border-amber-500/30 text-amber-500 hover:text-amber-400 font-bold rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-amber-500" />
                Descargar Plantilla Oficial
              </button>
            </div>

            <div className="border border-gray-850 bg-[#0d0f12] rounded-xl p-3.5 space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-amber-500/80 uppercase tracking-wider">PASO 2: Rellenar Datos</h4>
              <ul className="text-[10px] space-y-2 text-gray-400 font-mono">
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Producto</strong>: Nombre del artículo (Ej. Cera Premium)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Categoría</strong>: Ceras, Geles, Shampoo, Cuidado Facial u Otros</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Stock</strong>: Cantidad de unidades físicas (Ej. 15)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Unitario ($)</strong>: Precio de venta al público (Ej. 1800)</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Inversión ($)</strong>: Costo o precio de costo unitario por unidad (Ej. 750)</span>
                </li>
              </ul>
            </div>

            <div className="border border-gray-850 bg-[#0d0f12] rounded-xl p-3.5 space-y-3">
              <h4 className="text-[10px] font-mono font-bold text-amber-500/80 uppercase tracking-wider">PASO 3: Cargar & Importar</h4>
              <p className="text-[11px] text-gray-300 leading-relaxed">
                Selecciona tu archivo guardado para sincronizar los ítems instantáneamente:
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-450 hover:to-emerald-550 text-white font-extrabold rounded-lg text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-emerald-950/20 animate-pulse hover:animate-none"
              >
                <Upload className="w-3.5 h-3.5" />
                Cargar & Importar Excel
              </button>
            </div>
          </div>

          <div className="p-3.5 bg-amber-500/5 border border-amber-500/10 rounded-xl flex items-start gap-2.5">
            <AlertCircle className="w-4.5 h-4.5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[10px] text-gray-400 leading-relaxed">
              <span className="font-bold text-gray-300 block mb-0.5">Tip inteligente de stock:</span>
              El importador inteligente asocia y suma los registros de forma segura para conservar tu historial contable.
            </div>
          </div>
        </div>

        {/* INTERACTIVE TABLE & VISUAL SPREADSHEET EDITOR */}
        <div className="xl:col-span-8 bg-[#14181f]/60 border border-gray-800 rounded-2xl p-5 backdrop-blur-md">
          
          {/* Table Search Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-white">Catálogo de Productos</h3>
              <p className="text-xs text-gray-500 mt-0.5">EDITABLE DIRECTAMENTE DESDE LA GRILLA</p>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Buscar por nombre, rubro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-[#0d0f12] border border-gray-850 rounded-xl text-white outline-none focus:border-amber-500/30 text-xs font-mono"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto border border-gray-850 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#0c0e12] text-gray-400 border-b border-gray-850 font-mono text-[10px] uppercase font-black">
                  <th className="py-3 px-4">Producto</th>
                  <th className="py-3 px-3">Categoría</th>
                  <th className="py-3 px-3 text-center">Stock</th>
                  <th className="py-3 px-3 text-right">Unitario ($)</th>
                  <th className="py-3 px-3 text-right">Inversión ($)</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-850/60">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((p) => {
                    const isEditing = editingId === p.id;
                    return (
                      <motion.tr 
                        key={p.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={`hover:bg-gray-900/30 transition-all ${
                          p.estado === 'Agotado' ? 'bg-red-500/[0.01]' : p.estado === 'Bajo Stock' ? 'bg-amber-500/[0.01]' : ''
                        }`}
                      >
                        {/* Name Column */}
                        <td className="py-3 px-4 max-w-xs">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editNombre}
                              onChange={(e) => setEditNombre(e.target.value)}
                              className="w-full bg-[#0d0f12] border border-amber-500/50 rounded px-2 py-1 text-white text-xs"
                            />
                          ) : (
                            <div>
                              <span className="font-bold text-white block text-sm">{p.nombre}</span>
                              <span className="text-[10px] text-gray-500 block font-mono mt-0.5">ID: {p.id} | Prov: {p.proveedor}</span>
                            </div>
                          )}
                        </td>

                        {/* Category Column */}
                        <td className="py-3 px-3">
                          {isEditing ? (
                            <select
                              value={editCategoria}
                              onChange={(e) => setEditCategoria(e.target.value as ProductoInventario['categoria'])}
                              className="bg-[#0d0f12] border border-amber-500/50 rounded px-1.5 py-1 text-white text-xs"
                            >
                              <option value="Ceras">Ceras</option>
                              <option value="Geles">Geles</option>
                              <option value="Shampoo">Shampoo</option>
                              <option value="Cuidado Facial">Cuidado Facial</option>
                              <option value="Otros">Otros</option>
                            </select>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-900 border border-gray-850 text-gray-400 rounded-md font-mono text-[10px]">
                              {p.categoria}
                            </span>
                          )}
                        </td>

                        {/* Stock Column */}
                        <td className="py-3 px-3 text-center font-mono">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editCantidad}
                              onChange={(e) => setEditCantidad(parseInt(e.target.value) || 0)}
                              className="w-16 bg-[#0d0f12] border border-amber-500/50 rounded px-1 text-center py-1 text-white text-xs"
                            />
                          ) : (
                            <div className="inline-flex flex-col items-center">
                              <span className="font-bold text-white text-sm">{p.cantidad} u.</span>
                              <span className={`text-[9px] uppercase font-bold mt-1 px-1.5 py-0.2 rounded-full ${
                                p.estado === 'Disponible' 
                                  ? 'bg-emerald-500/10 text-emerald-400' 
                                  : p.estado === 'Bajo Stock' 
                                  ? 'bg-amber-500/15 text-amber-400' 
                                  : 'bg-red-500/10 text-red-400'
                              }`}>
                                {p.estado}
                              </span>
                            </div>
                          )}
                        </td>

                        {/* Price Column */}
                        <td className="py-3 px-3 text-right font-mono">
                          {isEditing ? (
                            <div className="flex flex-col gap-1 items-end">
                              <span className="text-[9px] text-gray-500 uppercase">VENTA</span>
                              <input
                                type="number"
                                step="0.01"
                                value={editPrecioVenta}
                                onChange={(e) => setEditPrecioVenta(parseFloat(e.target.value) || 0)}
                                className="w-20 bg-[#0d0f12] border border-amber-500/50 rounded px-1 text-right py-0.5 text-white text-xs"
                              />
                              <span className="text-[9px] text-gray-500 uppercase">COSTO</span>
                              <input
                                type="number"
                                step="0.01"
                                value={editPrecioCosto}
                                onChange={(e) => setEditPrecioCosto(parseFloat(e.target.value) || 0)}
                                className="w-20 bg-[#0d0f12] border border-amber-500/50 rounded px-1 text-right py-0.5 text-white text-xs"
                              />
                            </div>
                          ) : (
                            <div>
                              <span className="font-bold text-white block">${p.precioVenta.toFixed(2)}</span>
                              <span className="text-[10px] text-gray-500 block">Costo: ${p.precioCosto.toFixed(2)}</span>
                            </div>
                          )}
                        </td>

                        {/* Value Column */}
                        <td className="py-3 px-3 text-right font-mono font-bold text-amber-500 text-sm">
                          ${(p.cantidad * p.precioVenta).toFixed(2)}
                        </td>

                        {/* Actions Column */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {isEditing ? (
                              <>
                                <button
                                  onClick={() => saveEdit(p.id)}
                                  className="p-1 text-emerald-400 hover:bg-emerald-500/10 rounded border border-emerald-500/20 cursor-pointer"
                                  title="Guardar"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="p-1 text-red-400 hover:bg-red-500/10 rounded border border-red-500/20 cursor-pointer"
                                  title="Cancelar"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => startEdit(p)}
                                  className="p-1 text-amber-400 hover:bg-amber-500/10 rounded border border-amber-500/10 cursor-pointer"
                                  title="Editar"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.nombre)}
                                  className="p-1 text-red-400 hover:bg-red-500/10 rounded border border-red-500/15 cursor-pointer"
                                  title="Eliminar"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 italic">
                      No se encontraron productos coincidentes o cargados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

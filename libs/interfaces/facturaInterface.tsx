import { HistorialCambio, Refineria, UserReference } from "./configRefineriaInterface";


export interface Factura {
  id: string;
  idRefinerias: Refineria[];
  idLineasFactura: LineaFactura[]; // Puedes crear una interface específica si tienes la estructura
  concepto: string;
  total: number;
  aprobada: string;
  fechaFactura: string;
  eliminado: boolean;
  estado: string;
  createdAt: string;
    updatedAt: string;
    createdBy: UserReference;
    modificadoPor: UserReference;
    historial: HistorialCambio[];
}

export interface LineaFactura {
  id?: string;
  _id?: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
  idSubPartida: SubPartida;
  idFactura: Factura;
  eliminado: boolean;
  estado: string;
  fecha: string;
  createdAt: string;
    updatedAt: string;
    createdBy: UserReference;
    modificadoPor: UserReference;
    historial: HistorialCambio[];
}

export interface SubPartida {
  idRefineria: string;
  idPartida: string;
  descripcion: string;
  codigo: number;
  eliminado: boolean;
  createdAt: string;
   updatedAt: string;
    createdBy: UserReference;
    modificadoPor: UserReference;
    historial: HistorialCambio[];
  id: string;
}

export interface Partida {
  idRefineria: Refineria;
  descripcion: string;
  codigo: number;
  eliminado: boolean;
  createdAt: string;
   updatedAt: string;
   createdBy: UserReference;
   modificadoPor: UserReference;
   historial: HistorialCambio[];
  id: string;
}
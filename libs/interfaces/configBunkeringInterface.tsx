import { HistorialCambio, UserReference } from "./configRefineriaInterface";

export interface Bunkering {
  id: string | undefined;
  nombre: string;
  correo: string;
  img: string;
  ubicacion: string;
  nit: string;
  rol: string;
  acceso: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserReference;
  modificadoPor: UserReference;
  historial: HistorialCambio[];
}

export interface Muelle {
  _id: string;
  ubicacion: string;
  correo: string;
  telefono: string;
  nombre: string;
  nit: string;
  legal: string;
  img: string;
  estado: string;
  idBunkering: Bunkering;
  eliminado: boolean;
  createdBy: UserReference;
  historial: HistorialCambio[];
  createdAt: string;
  updatedAt: string;
  id: string;
}

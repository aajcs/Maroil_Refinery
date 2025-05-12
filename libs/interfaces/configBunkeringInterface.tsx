import { HistorialCambio, UserReference } from "./configRefineriaInterface";

export interface Bunkering {
  id: string | undefined;
  nombre: string;
  correo: string;
  rol: string;
  acceso: string;
  estado: string;
  createdAt: string;
  updatedAt: string;
  createdBy: UserReference;
  modificadoPor: UserReference;
  historial: HistorialCambio[];
}

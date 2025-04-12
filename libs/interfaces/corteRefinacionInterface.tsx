import {
  Producto,
  Refineria,
  Tanque,
  TorreDestilacion,
} from "./configRefineriaInterface";

export interface CorteRefinacion {
  idRefineria: Refineria;
  numeroCorteRefinacion: number;
  corteTorre: Array<{
    idTorre: TorreDestilacion;
    detalles: Array<{
      idTanque: Tanque;
      idProducto: Producto;
      cantidad: number;
      _id: string;
    }>;
    _id: string;
  }>;
  fechaCorte: string;
  observacion: string;
  idOperador: {
    nombre: string;
    id: string;
  };
  eliminado: boolean;
  estado: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

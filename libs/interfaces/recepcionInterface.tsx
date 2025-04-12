import {
  LineaRecepcion,
  Producto,
  Refineria,
  Tanque,
} from "./configRefineriaInterface";
import { Contrato, ContratoItem } from "./contratoInterface";

export interface Recepcion {
  id: string;
  estadoCarga: string;
  estadoRecepcion: string;
  estado: string;
  eliminado: boolean;
  idContrato: Contrato;
  idContratoItems: ContratoItem;
  idLinea: LineaRecepcion;
  idRefineria: Refineria;
  idTanque: Tanque | null;

  cantidadRecibida: number;
  cantidadEnviada: number;
  fechaInicio: string;
  fechaFin: string;
  fechaDespacho: string;
  fechaInicioRecepcion: string;
  fechaFinRecepcion: string;
  fechaSalida: string;
  fechaLlegada: string;
  idGuia: number;
  placa: string;
  nombreChofer: string;
  apellidoChofer: string;
  createdAt: string;
  updatedAt: string;
}

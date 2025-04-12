import { LineaDespacho, Refineria, Tanque } from "./configRefineriaInterface";
import { Contrato, ContratoItem } from "./contratoInterface";

export interface Despacho {
  id: string;
  estadoCarga: string;
  estadoDespacho: string;
  estado: string;
  eliminado: boolean;
  idContrato: Contrato;
  idContratoItems: ContratoItem;
  idLineaDespacho: LineaDespacho;
  idRefineria: Refineria;
  idTanque: Tanque | null;

  cantidadRecibida: number;
  cantidadEnviada: number;
  fechaInicio: string;
  fechaFin: string;
  fechaDespacho: string;
  fechaInicioDespacho: string;
  fechaFinDespacho: string;
  fechaSalida: string;
  fechaLlegada: string;
  idGuia: number;
  placa: string;
  nombreChofer: string;
  apellidoChofer: string;
  createdAt: string;
  updatedAt: string;
}

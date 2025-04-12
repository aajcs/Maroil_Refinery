import { Producto, Refineria } from "./configRefineriaInterface";

export interface ContratoItem {
  // ID interno del item (por ejemplo, si lo almacenas en MongoDB)
  id: string | number;

  // Referencia al contrato padre
  idContrato: string;

  // Referencia al producto asociado
  producto: Producto; // o un objeto { id: string; nombre: string; ... } si lo prefieres

  cantidad?: number;
  precioUnitario?: number;

  brent?: number;
  convenio?: number;
  montoTransporte?: number;

  // Datos de calidad del producto
  nombre: string; // El nombre del crudo es obligatorio
  idContratoItem?: string; // ID del contrato asociado
  clasificacion?: string; // La clasificación es opcional
  gravedadAPI?: number; // Gravedad API del producto (opcional, debe ser no negativa)
  azufre?: number; // Porcentaje de azufre (opcional, debe ser no negativo)
  contenidoAgua?: number; // Contenido de agua en porcentaje (opcional, debe ser no negativo)
  flashPoint?: number; // Flashpoint del producto (opcional)

  // Estado y lógica de eliminado
  estado?: string; // "true" | "false" o como se maneje en tu app
  eliminado?: boolean;
}

/**
 * Interfaz principal del Contrato.
 * Aquí sustituimos "idItems: any" por un arreglo tipado de `ContratoItem`.
 */
export interface Contrato {
  id: string;
  numeroContrato: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  fechaInicio: string;
  fechaFin: string;
  estadoContrato: string;
  estadoEntrega: string;
  descripcion: string;
  tipoContrato: string;
  /**
   * Items (productos) asociados a este contrato.
   */
  idItems: ContratoItem[];

  /**
   * Referencia al contacto/proveedor asociado.
   */
  idContacto: Contacto; // Ajusta con la interfaz real si lo deseas

  /**
   * Referencia a la refinería asociada.
   */
  idRefineria: Refineria;
  montoTotal?: number;
  montoTransporte?: number;
}
export interface Contacto {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  idRefineria: Refineria;
}

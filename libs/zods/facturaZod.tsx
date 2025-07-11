import { z } from "zod";

// Reutiliza tus zods base si ya existen para UserReference, Refineria e HistorialCambio
const userReferenceSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string(),
  correo: z.string().optional(),
  id: z.string().optional(),
});

const historialCambioSchema = z.object({
  // Define los campos según tu modelo real
  // ejemplo:
  // fecha: z.string(),
  // descripcion: z.string(),
}).passthrough();

const refineriaSchema = z.object({
  _id: z.string().optional(),
  nombre: z.string(),
  id: z.string(),
});

export const subPartidaSchema = z.object({
  // idRefineria: z.string(),
  // idPartida: z.string(),
  // descripcion: z.string(),
  // codigo: z.number(),
  // eliminado: z.boolean(),
  // createdAt: z.string(),
  // updatedAt: z.string(),
  // createdBy: userReferenceSchema,
  // modificadoPor: userReferenceSchema,
  // historial: z.array(historialCambioSchema),
  id: z.string(),
});

export const partidaSchema = z.object({
  idRefineria: refineriaSchema,
  descripcion: z.string(),
  codigo: z.number(),
  eliminado: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  createdBy: userReferenceSchema,
  modificadoPor: userReferenceSchema,
  historial: z.array(historialCambioSchema),
  id: z.string(),
});

export const lineaFacturaSchema = z.object({
  id: z.string().optional(),
  _id: z.string().optional(),
  descripcion: z.string(),
  cantidad: z.number(),
  precioUnitario: z.number(),
  // subtotal: z.number(),
  idSubPartida: subPartidaSchema,
  // idFactura: z.lazy(() => facturaSchema), // Referencia circular
  // eliminado: z.boolean(),
  // estado: z.string(),
  // fecha: z.string(),
  // createdAt: z.string(),
  // updatedAt: z.string(),
  // createdBy: userReferenceSchema,
  // modificadoPor: userReferenceSchema,
  // historial: z.array(historialCambioSchema),
});

// Definición principal de FacturaSchema (debe ir después de LineaFacturaSchema por la referencia circular)
export const facturaSchema: z.ZodType<any> = z.object({
  id: z.string().optional(),
  idRefinerias: z.array(refineriaSchema).optional(),
  
  idLineasFactura: z.array(lineaFacturaSchema),
  concepto: z.string(),
  total: z.number(),
  // aprobada: z.string(),
  fechaFactura: z.string(),
  // eliminado: z.boolean(),
  estado: z.string(),
  // createdAt: z.string(),
  // updatedAt: z.string(),
  // createdBy: userReferenceSchema,
  // modificadoPor: userReferenceSchema,
  // historial: z.array(historialCambioSchema),
});
import { array, boolean, object, string } from "zod";

export const bunkeringSchema = object({
  nombre: string().min(1, "El nombre es obligatorio"),
  estado: string().min(1, "Debes seleccionar un estado").optional(),
  ubicacion: string().min(1, "La ubicación es obligatoria"),
  nit: string().min(1, "El NIT es obligatorio"),
  img: string().url("La URL de la imagen es inválida"),
  createdAt: string().optional(),
  updatedAt: string().optional(),
  id: string().optional(),
  idRefineria: object({
    id: string(),
    nombre: string(),
  }).optional(),
  material: array(
    object({
      estadoMaterial: string(),
      posicion: string(),
      nombre: string(),
    })
  ).optional(),
});

export const muelleSchema = object({
  _id: string().optional(),
  ubicacion: string().min(1, "La ubicación es obligatoria"),
  correo: string().email("Correo inválido"),
  telefono: string().min(7, "El teléfono es obligatorio"),
  nombre: string().min(1, "El nombre es obligatorio"),
  nit: string().min(1, "El NIT es obligatorio"),
  legal: string().min(1, "El representante legal es obligatorio"),
  img: string().url("La URL de la imagen es inválida"),
  estado: string().min(1, "El estado es obligatorio"),
  idBunkering: object({
    _id: string(),
    nombre: string(),
    id: string(),
  }),
  eliminado: boolean().optional(),

  createdAt: string().optional(),
  updatedAt: string().optional(),
  id: string().optional(),
});

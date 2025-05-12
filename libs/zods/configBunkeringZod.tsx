import { array, object, string } from "zod";

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

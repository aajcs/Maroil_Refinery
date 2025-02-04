import { array, boolean, object, string } from "zod";

export const loginSchema = object({
  correo: string().email("Correo inválido"),
  password: string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const registerSchema = object({
  fullname: string().nonempty("El nombre de usuario es obligatorio"),
  email: string()
    .email("El correo electrónico no es válido")
    .nonempty("El correo electrónico es obligatorio"),
  password: string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .nonempty("La contraseña es obligatoria"),
});

export const profileSchema = object({
  nombre: string().min(1, "El nombre es obligatorio"),
  correo: string().email("Correo electrónico inválido"),
  password: string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  rol: string().min(1, "Debes seleccionar un rol"),
  estado: string().min(1, "Debes seleccionar un estado"),
  acceso: string().min(1, "Debes seleccionar un acceso"),
});

export const refineriaSchema = object({
  nombre: string().min(1, "El nombre es obligatorio"),
  estado: string().min(1, "Debes seleccionar un estado"),
  eliminado: boolean().default(false),
  ubicacion: string().min(1, "La ubicación es obligatoria"),
  nit: string().min(1, "El NIT es obligatorio"),
  img: string().url("La URL de la imagen es inválida"),
  createdAt: string().optional(),
  updatedAt: string().optional(),
  id: string().optional(),
});

export const torreDestilacionSchema = object({
  id: string().optional(),
  nombre: string().min(1, "El nombre es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  ubicacion: string().min(1, "La ubicación es obligatoria"),
  material: array(string()).min(1, "El material es obligatorio"),
  id_empresa: string().optional(),
  createdAt: string().optional(),
  updatedAt: string().optional(),
});

import { number, object, string } from "zod";

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
  telefono: number()
    .min(1000000, { message: "El teléfono debe tener al menos 7 dígitos" })
    .max(9999999999, {
      message: "El teléfono no puede tener más de 10 dígitos",
    }),
  password: string()
    .optional()
    .refine((val) => val === undefined || val.length >= 6, {
      message:
        "La contraseña debe tener al menos 6 caracteres si se proporciona",
    }),
  rol: string().min(1, "Debes seleccionar un rol"),
  estado: string().min(1, "Debes seleccionar un estado"),
  acceso: string().min(1, "Debes seleccionar un acceso"),
  idRefineria: string().array().optional(),
  departamento: string()
    .array()
    .min(1, "Debes seleccionar al menos un departamento"),
});

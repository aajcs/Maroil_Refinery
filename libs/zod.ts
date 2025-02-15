import { array, boolean, date, number, object, string, union } from "zod";

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

export const torreDestilacionSchema = object({
  id: string().optional(),
  nombre: string().min(1, "El nombre es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  ubicacion: string().min(1, "La ubicación es obligatoria"),
  material: array(
    object({
      estadoMaterial: string(),
      posicion: string(),
      nombre: string(),
    })
  ).optional(),
  idRefineria: object({
    id: string().optional(),
  }).optional(),
  createdAt: string().optional(),
  updatedAt: string().optional(),
});

export const tanqueSchema = object({
  id: string().optional(),
  nombre: string().min(1, "El nombre es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  ubicacion: string().min(1, "La ubicación es obligatoria"),
  material: array(string()).min(1, "El material es obligatorio"),
  capacidad: number().min(1, "La capacidad es obligatoria"),
  almacenamiento: number().min(1, "El almacenamiento es obligatorio"),
  idRefineria: object({
    id: string().optional(),
  }).optional(),
  createdAt: string().optional(),
  updatedAt: string().optional(),
});

export const lineaRecepcionSchema = object({
  id: string().optional(),
  nombre: string().min(1, "El nombre es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  ubicacion: string().min(1, "La ubicación es obligatoria"),
  createdAt: string().optional(),
  updatedAt: string().optional(),
  idRefineria: object({
    id: string().optional(),
  }).optional(),
});

export const contactoSchema = object({
  id: string().optional(),
  nombre: string().min(1, "El nombre es obligatorio"),
  identificacionFiscal: string().min(
    1,
    "La identificación fiscal es obligatoria"
  ),
  correo: string().email("El correo debe ser válido"),
  direccion: string().min(1, "La dirección es obligatoria"),
  telefono: string().min(1, "El teléfono es obligatorio"),
  tipo: string().min(1, "El tipo es obligatorio"),
  idRefineria: object({
    id: string().optional(),
  }).optional(),
  representanteLegal: string().min(1, "El representante legal es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  createdAt: string().optional(),
  updatedAt: string().optional(),
});

export const contratoSchema = object({
  condicionesPago: object({
    tipo: string().min(1, "El tipo es obligatorio"),
    plazo: number().min(0, "El plazo debe ser un número no negativo"),
    abono: array(
      object({
        id: string().optional(),
        monto: number().min(0, "El monto debe ser un número no negativo"),
        fecha: string().optional(),
      })
    ).optional(),
  }),
  estadoEntrega: string().min(1, "El estado de entrega es obligatorio"),
  clausulas: array(string()).optional(),
  estado: string().min(1, "El estado es obligatorio"),
  estado_contrato: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  numeroContrato: string().min(1, "El número de contrato es obligatorio"),
  descripcion: string().min(1, "El número de contrato es obligatorio"),
  idRefineria: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
  }).optional(),
  idContacto: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre del contacto es obligatorio"),
  }),
  abono: array(
    object({
      id: string().optional(),
      monto: number().min(0, "El monto debe ser un número no negativo"),
      fecha: string().optional(),
    })
  ).optional(),
  idItems: array(
    object({
      // estado: string().min(1, "El estado es obligatorio"),
      eliminado: boolean().default(false),
      id: string().optional(),
      producto: string().min(1, "El producto es obligatorio"),
      cantidad: number().min(0, "La cantidad debe ser un número no negativo"),
      precioUnitario: number().min(
        0,
        "El precio unitario debe ser un número no negativo"
      ),
      gravedadAPI: number().min(
        0,
        "La gravedad API debe ser un número no negativo"
      ),
      azufre: number().min(0, "El azufre debe ser un número no negativo"),
      viscosidad: number().min(
        0,
        "La viscosidad debe ser un número no negativo"
      ),
      densidad: number().min(0, "La densidad debe ser un número no negativo"),
      contenidoAgua: number().min(
        0,
        "El contenido de agua debe ser un número no negativo"
      ),
      origen: string().min(1, "El origen es obligatorio"),
      temperatura: number().min(
        0,
        "La temperatura debe ser un número no negativo"
      ),
      presion: number().min(0, "La presión debe ser un número no negativo"),
    })
  ).optional(),
  items: array(
    object({
      // estado: string().min(1, "El estado es obligatorio"),
      eliminado: boolean().default(false),
      id: string().optional(),
      producto: string().min(1, "El producto es obligatorio"),
      cantidad: number().min(0, "La cantidad debe ser un número no negativo"),
      precioUnitario: number().min(
        0,
        "El precio unitario debe ser un número no negativo"
      ),
      gravedadAPI: number().min(
        0,
        "La gravedad API debe ser un número no negativo"
      ),
      azufre: number().min(0, "El azufre debe ser un número no negativo"),
      viscosidad: number().min(
        0,
        "La viscosidad debe ser un número no negativo"
      ),
      densidad: number().min(0, "La densidad debe ser un número no negativo"),
      contenidoAgua: number().min(
        0,
        "El contenido de agua debe ser un número no negativo"
      ),
      origen: string().min(1, "El origen es obligatorio"),
      temperatura: number().min(
        0,
        "La temperatura debe ser un número no negativo"
      ),
      presion: number().min(0, "La presión debe ser un número no negativo"),
    })
  ).optional(),
  historialModificaciones: array(
    object({
      id: string().optional(),
      fecha: string().optional(),
      descripcion: string().optional(),
    })
  ).optional(),
  fechaInicio: date().optional(),
  fechaFin: date().optional(),
  createdAt: string().optional(),
  updatedAt: string().optional(),
  id: string().optional(),
});

export const recepcionSchema = object({
  estadoCarga: string().min(1, "El estado de carga es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  cantidadRecibida: number().min(
    0,
    "La cantidad recibida debe ser un número no negativo"
  ),
  fechaInicio: union([string(), date()]).optional(),
  fechaFin: union([string(), date()]).optional(),
  idContrato: object({
    numeroContrato: string().min(1, "El estado es obligatorio").optional(),
    id: string().optional(),
    idRefineria: object({
      id: string().optional(),
      nombre: string().min(1, "El nombre de la refinería es obligatorio"),
    }).optional(),
    idContacto: object({
      id: string().optional(),
      nombre: string().min(1, "El nombre del contacto es obligatorio"),
    }).optional(),
    idItems: array(
      object({
        estado: string().min(1, "El estado es obligatorio"),
        eliminado: boolean().default(false),
        id: string().optional(),
        producto: string().min(1, "El producto es obligatorio"),
        cantidad: number().min(0, "La cantidad debe ser un número no negativo"),
        precioUnitario: number().min(
          0,
          "El precio unitario debe ser un número no negativo"
        ),
        gravedadAPI: number().min(
          0,
          "La gravedad API debe ser un número no negativo"
        ),
        azufre: number().min(0, "El azufre debe ser un número no negativo"),
        viscosidad: number().min(
          0,
          "La viscosidad debe ser un número no negativo"
        ),
        densidad: number().min(0, "La densidad debe ser un número no negativo"),
        contenidoAgua: number().min(
          0,
          "El contenido de agua debe ser un número no negativo"
        ),
        origen: string().min(1, "El origen es obligatorio"),
        temperatura: number().min(
          0,
          "La temperatura debe ser un número no negativo"
        ),
        presion: number().min(0, "La presión debe ser un número no negativo"),
      })
    ).optional(),
  }).optional(),
  idLinea: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre de la línea es obligatorio"),
  }).optional(),
  idTanque: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre del tanque es obligatorio"),
  }).optional(),
  idGuia: number().min(0, "El ID de la guía debe ser un número no negativo"),
  idRefineria: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
  }).optional(),
  placa: string().min(1, "La placa es obligatoria"),
  nombreChofer: string().min(1, "El nombre del chofer es obligatorio"),
  apellidoChofer: string().min(1, "El apellido del chofer es obligatorio"),
  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  id: string().optional(),
});

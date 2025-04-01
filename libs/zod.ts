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
  // eliminado: boolean().default(false),
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
      idProducto: object({
        _id: string().min(1, "El ID del producto es obligatorio"),
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        posicion: number().min(1, "La posición es obligatoria"),
        color: string().min(1, "El color es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }),
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
  idProducto: object({
    _id: string().min(1, "El ID del producto es obligatorio").optional(),
    nombre: string().min(1, "El nombre del producto es obligatorio"),
    posicion: number().min(1, "La posición es obligatoria").optional(),
    color: string().min(1, "El color es obligatorio").optional(),
    id: string().min(1, "El ID del producto es obligatorio"),
  }),
  almacenamientoMateriaPrimaria: boolean().default(false).optional(),
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
export const lineaDespachoSchema = object({
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
  // Ejemplo de campo adicional
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
  }).optional(),
  estadoEntrega: string().min(1, "El estado de entrega es obligatorio"),
  clausulas: array(string()).optional(),
  estado: string().min(1, "El estado es obligatorio"),
  estadoContrato: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  numeroContrato: string().min(1, "El número de contrato es obligatorio"),
  descripcion: string().min(1, "La descripción es obligatoria"),
  tipoContrato: string().min(1, "El tipo de contrato es obligatorio"),
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

  /**
   * idItems: aquí agregamos los campos
   * que reflejan la estructura de tu snippet de Mongoose
   * (producto, brent, convenio, montoTransporte, etc.).
   */
  idItems: array(
    object({
      id: string().optional(),
      eliminado: boolean().default(false),

      // Referencia al producto
      producto: object({
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }),
      ipTipoProducto: object({
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }).optional(),

      cantidad: number().min(0, "La cantidad debe ser un número no negativo"),
      precioUnitario: number().optional(),

      brent: number().optional(),
      convenio: number().optional(),
      montoTransporte: number()
        .min(0, "El monto de transporte debe ser un número no negativo")
        .optional(),

      // Características del producto
      clasificacion: string()
        .min(1, "La clasificación es obligatoria")
        .optional(),
      gravedadAPI: number()
        .min(0, "La gravedad API debe ser un número no negativo")
        .optional(),
      azufre: number()
        .min(0, "El porcentaje de azufre debe ser un número no negativo")
        .optional(),
      contenidoAgua: number()
        .min(0, "El contenido de agua debe ser un número no negativo")
        .optional(),
      flashPoint: number().min(0, "El Flashpoint es obligatorio").optional(),

      // Estado local de cada item
      estado: string().optional(),
    })
  ).optional(),

  /**
   * Campos alternativos para items (si tuvieras otra colección con la misma estructura).
   * Ajusta o elimina si no lo estás usando.
   */
  items: array(
    object({
      id: string().optional(),
      eliminado: boolean().default(false),

      // Referencia al producto
      producto: object({
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }),
      ipTipoProducto: object({
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }),
      cantidad: number().min(0, "La cantidad debe ser un número no negativo"),
      precioUnitario: number().min(
        0,
        "El precio unitario debe ser un número no negativo"
      ),

      brent: number()
        .min(0, "El valor de brent debe ser un número no negativo")
        .optional(),
      convenio: number()
        .min(0, "El porcentaje de convenio debe ser un número no negativo")
        .optional(),
      montoTransporte: number()
        .min(0, "El monto de transporte debe ser un número no negativo")
        .optional(),

      // Características del producto
      clasificacion: string()
        .min(1, "La clasificación es obligatoria")
        .optional(),
      gravedadAPI: number()
        .min(0, "La gravedad API debe ser un número no negativo")
        .optional(),
      azufre: number()
        .min(0, "El porcentaje de azufre debe ser un número no negativo")
        .optional(),
      contenidoAgua: number()
        .min(0, "El contenido de agua debe ser un número no negativo")
        .optional(),
      flashPoint: number().min(0, "El Flashpoint es obligatorio").optional(),

      // Estado local de cada item
      estado: string().optional(),
    })
  ).optional(),

  historialModificaciones: array(
    object({
      id: string().optional(),
      fecha: string().optional(),
      descripcion: string().optional(),
    })
  ).optional(),

  fechaInicio: union([string(), date()]).optional(),
  fechaFin: union([string(), date()]).optional(),
  createdAt: string().optional(),
  updatedAt: string().optional(),
  id: string().optional(),
});

export const recepcionSchema = object({
  estadoCarga: string().min(1, "El estado de carga es obligatorio").optional(),
  estadoRecepcion: string()
    .min(1, "El estado de recepción es obligatorio")
    .optional(),
  eliminado: boolean().default(false),
  cantidadEnviada: number()
    .min(0, "La cantidad enviada debe ser un número no negativo")
    .optional(),
  cantidadRecibida: number()
    .min(0, "La cantidad recibida debe ser un número no negativo")
    .optional(),
  fechaInicio: union([string(), date()]).optional(),
  fechaFin: union([string(), date()]).optional(),
  fechaInicioRecepcion: union([string(), date()]).optional(),
  fechaFinRecepcion: union([string(), date()]).optional(),
  fechaSalida: union([string(), date()]).optional(),
  fechaLlegada: union([string(), date()]).optional(),
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
        producto: object({
          nombre: string().min(1, "El nombre del producto es obligatorio"),
          id: string().min(1, "El ID del producto es obligatorio"),
          color: string().min(1, "El color es obligatorio").optional(),
        }),
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

        contenidoAgua: number().min(
          0,
          "El contenido de agua debe ser un número no negativo"
        ),

        clasificacion: string().min(1, "El origen es obligatorio"),

        flashPoint: number().min(
          0,
          "La presión debe ser un número no negativo"
        ),
      })
    ).optional(),
  }).optional(),
  idContratoItems: object({
    estado: string().min(1, "El estado es obligatorio"),
    eliminado: boolean().default(false),
    id: string().optional(),
    producto: object({
      nombre: string().min(1, "El nombre del producto es obligatorio"),
      id: string().min(1, "El ID del producto es obligatorio"),
    }),
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

    contenidoAgua: number().min(
      0,
      "El contenido de agua debe ser un número no negativo"
    ),
    clasificacion: string().min(1, "El origen es obligatorio"),
    flashPoint: number().min(
      0,
      "La temperatura debe ser un número no negativo"
    ),
  }).optional(),
  idLinea: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre de la línea es obligatorio"),
  })
    .optional()
    .nullable(),
  idTanque: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre del tanque es obligatorio"),
  })
    .optional()
    .nullable(),
  idGuia: number()
    .min(0, "El ID de la guía debe ser un número no negativo")
    .optional(),
  idRefineria: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
  }).optional(),
  placa: string()
    // .min(1, "La placa es obligatoria")
    .optional(),
  nombreChofer: string()
    // .min(1, "El nombre del chofer es obligatorio")
    .optional(),

  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  id: string().optional(),
}).superRefine((data, ctx) => {
  // Validaciones basadas en el estado de recepción
  if (data.estadoRecepcion === "PROGRAMADO") {
    if (!data.idContrato) {
      ctx.addIssue({
        path: ["idContrato"],
        code: "custom",
        message: "Debe seleccionar un contrato si el estado es PROGRAMADO",
      });
    }
    if (!data.idContratoItems) {
      ctx.addIssue({
        path: ["idContratoItems"],
        code: "custom",
        message: "Debe seleccionar un contrato si el estado es PROGRAMADO",
      });
    }
    if (!data.cantidadEnviada) {
      ctx.addIssue({
        path: ["cantidadEnviada"],
        code: "custom",
        message:
          "La cantidad enviada es obligatoria si el estado es PROGRAMADO",
      });
    }
    // if (!data.idLinea) {
    //   ctx.addIssue({
    //     path: ["idLinea"],
    //     code: "custom",
    //     message: "Debe seleccionar una línea si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.idTanque) {
    //   ctx.addIssue({
    //     path: ["idTanque"],
    //     code: "custom",
    //     message: "Debe seleccionar un tanque si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.idGuia) {
    //   ctx.addIssue({
    //     path: ["idGuia"],
    //     code: "custom",
    //     message: "Debe seleccionar una guía si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.idRefineria) {
    //   ctx.addIssue({
    //     path: ["idRefineria"],
    //     code: "custom",
    //     message: "Debe seleccionar una refinería si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.placa) {
    //   ctx.addIssue({
    //     path: ["placa"],
    //     code: "custom",
    //     message: "Debe ingresar una placa si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.nombreChofer) {
    //   ctx.addIssue({
    //     path: ["nombreChofer"],
    //     code: "custom",
    //     message: "Debe ingresar un nombre de chofer si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.apellidoChofer) {
    //   ctx.addIssue({
    //     path: ["apellidoChofer"],
    //     code: "custom",
    //     message:
    //       "Debe ingresar un apellido de chofer si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.fechaInicio) {
    //   ctx.addIssue({
    //     path: ["fechaInicio"],
    //     code: "custom",
    //     message: "Debe ingresar una fecha de inicio si el estado es PROGRAMADO",
    //   });
    // }
    // if (!data.fechaFin) {
    //   ctx.addIssue({
    //     path: ["fechaFin"],
    //     code: "custom",
    //     message: "Debe ingresar una fecha de fin si el estado es PROGRAMADO",
    //   });
    // }
  }
  if (data.estadoRecepcion === "EN_TRANSITO") {
    if (!data.idContrato) {
      ctx.addIssue({
        path: ["idContrato"],
        code: "custom",
        message: "Debe seleccionar un contrato si el estado es en transito",
      });
    }
    if (!data.idContratoItems) {
      ctx.addIssue({
        path: ["idContratoItems"],
        code: "custom",
        message: "Debe seleccionar un contrato si el estado es en transito",
      });
    }
    if (!data.cantidadEnviada) {
      ctx.addIssue({
        path: ["cantidadEnviada"],
        code: "custom",
        message:
          "La cantidad enviada es obligatoria si el estado es en transito",
      });
    }
    if (!data.idGuia) {
      ctx.addIssue({
        path: ["idGuia"],
        code: "custom",
        message: "Debe seleccionar una guía si el estado es en transito",
      });
    }
    if (!data.placa) {
      ctx.addIssue({
        path: ["placa"],
        code: "custom",
        message: "Debe ingresar una placa si el estado es en transito",
      });
    }
    if (!data.nombreChofer) {
      ctx.addIssue({
        path: ["nombreChofer"],
        code: "custom",
        message:
          "Debe ingresar un nombre de chofer si el estado es en transito",
      });
    }
    if (!data.fechaSalida) {
      ctx.addIssue({
        path: ["fechaSalida"],
        code: "custom",
        message:
          "Debe ingresar una fecha de salida si el estado es en transito",
      });
    }
    if (!data.fechaLlegada) {
      ctx.addIssue({
        path: ["fechaLlegada"],
        code: "custom",
        message:
          "Debe ingresar una fecha de llegada si el estado es en transito",
      });
    }
  }

  if (data.estadoRecepcion === "EN_REFINERIA" && !data.fechaLlegada) {
    ctx.addIssue({
      path: ["fechaLlegada"],
      code: "custom",
      message: "La fecha de llegada es obligatoria cuando está en refinería",
    });
  }

  // Validaciones basadas en el estado de carga
  if (data.estadoCarga === "EN_PROCESO" && !data.idTanque) {
    ctx.addIssue({
      path: ["idTanque"],
      code: "custom",
      message: "Debe seleccionar un tanque si el estado de carga es EN_PROCESO",
    });
  }
});

export const despachoSchema = object({
  estadoCarga: string().min(1, "El estado de carga es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  cantidadEnviada: number().min(
    0,
    "La cantidad enviada debe ser un número no negativo"
  ),
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
        producto: object({
          nombre: string().min(1, "El nombre del producto es obligatorio"),
          id: string().min(1, "El ID del producto es obligatorio"),
          color: string().min(1, "El color es obligatorio").optional(),
        }),
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

        contenidoAgua: number().min(
          0,
          "El contenido de agua debe ser un número no negativo"
        ),

        clasificacion: string().min(1, "El origen es obligatorio"),

        flashPoint: number().min(
          0,
          "La presión debe ser un número no negativo"
        ),
      })
    ).optional(),
  }).optional(),
  idContratoItems: object({
    estado: string().min(1, "El estado es obligatorio"),
    eliminado: boolean().default(false),
    id: string().optional(),
    producto: object({
      nombre: string().min(1, "El nombre del producto es obligatorio"),
      id: string().min(1, "El ID del producto es obligatorio"),
    }),
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

    contenidoAgua: number().min(
      0,
      "El contenido de agua debe ser un número no negativo"
    ),
    clasificacion: string().min(1, "El origen es obligatorio"),
    flashPoint: number().min(
      0,
      "La temperatura debe ser un número no negativo"
    ),
  }).optional(),
  idLineaDespacho: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre de la línea es obligatorio"),
  }).optional(),
  idTanque: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre del tanque es obligatorio"),
    null: boolean().optional(),
  })
    .optional()
    .nullable(),
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

export const productoSchema = object({
  idRefineria: object({
    id: string().optional(),
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
  }).optional(),
  nombre: string().min(1, "El nombre es obligatorio"),
  color: string().min(1, "El color es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  posicion: number().min(1, "La capacidad es obligatoria"),
  tipoMaterial: string().min(1, "El tipo de material es obligatorio"),
  eliminado: boolean().default(false),
  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  id: string().optional(),
});

export const chequeoCalidadSchema = object({
  idRefineria: object({
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
    id: string().min(1, "El ID de la refinería es obligatorio"),
  }).optional(),
  idProducto: object({
    nombre: string().min(1, "El nombre del producto es obligatorio"),
    id: string().min(1, "El ID del producto es obligatorio"),
  }),
  idTanque: object({
    nombre: string().min(1, "El nombre del tanque es obligatorio"),
    id: string().min(1, "El ID del tanque es obligatorio"),
  }),
  idTorre: object({
    nombre: string().min(1, "El nombre de la torre es obligatorio"),
    id: string().min(1, "El ID de la torre es obligatorio"),
  }),
  idRefinacion: object({
    id: string().min(1, "El ID de la refinación es obligatorio"),
    descripcion: string().min(
      1,
      "La descripción de la refinación es obligatoria"
    ),
  }),
  operador: string().min(1, "El nombre del operador es obligatorio"),
  fechaChequeo: union([string(), date()]).refine(
    (val) => val !== "",
    "La fecha de chequeo es obligatoria"
  ),
  gravedadAPI: number().min(
    0,
    "La gravedad API debe ser un número no negativo"
  ),
  azufre: number().min(0, "El azufre debe ser un número no negativo"),
  viscosidad: number().min(0, "La viscosidad debe ser un número no negativo"),
  densidad: number().min(0, "La densidad debe ser un número no negativo"),
  contenidoAgua: number().min(
    0,
    "El contenido de agua debe ser un número no negativo"
  ),
  contenidoPlomo: string().min(1, "El contenido de plomo es obligatorio"),
  octanaje: string().min(1, "El octanaje es obligatorio"),
  temperatura: number().min(0, "La temperatura debe ser un número no negativo"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  id: string().optional(),
});

export const chequeoCantidadSchema = object({
  idRefineria: object({
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
    id: string().min(1, "El ID de la refinería es obligatorio"),
  }).optional(),
  idProducto: object({
    nombre: string().min(1, "El nombre del producto es obligatorio"),
    id: string().min(1, "El ID del producto es obligatorio"),
  }).nullable(),
  idTanque: object({
    nombre: string().min(1, "El nombre del tanque es obligatorio"),
    id: string().min(1, "El ID del tanque es obligatorio"),
  }),
  idTorre: object({
    nombre: string().min(1, "La ubicación de la torre es obligatoria"),
    id: string().min(1, "El ID de la torre es obligatorio"),
  }),
  idRefinacion: object({
    id: string().min(1, "El ID de la refinación es obligatorio"),
    descripcion: string().min(
      1,
      "La descripción de la refinación es obligatoria"
    ),
  }),
  operador: string().min(1, "El nombre del operador es obligatorio"),
  fechaChequeo: union([string(), date()]).refine(
    (val) => val !== "",
    "La fecha de chequeo es obligatoria"
  ),
  cantidad: number().min(0, "La cantidad debe ser un número no negativo"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  id: string().optional(),
});

export const refinacionSchema = object({
  idRefineria: object({
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
    id: string().min(1, "El ID de la refinería es obligatorio"),
  }).optional(),
  idTanque: object({
    nombre: string().min(1, "El nombre del tanque es obligatorio"),
    id: string().min(1, "El ID del tanque es obligatorio"),
  }),
  idTorre: object({
    nombre: string().min(1, "El nombre de la torre es obligatorio"),
    id: string().min(1, "El ID de la torre es obligatorio"),
  }),
  idProducto: object({
    nombre: string().min(1, "El nombre del producto es obligatorio"),
    id: string().min(1, "El ID del producto es obligatorio"),
  }),
  cantidadTotal: number().min(
    0,
    "La cantidad total debe ser un número no negativo"
  ),
  idChequeoCalidad: array(
    object({
      operador: string().min(1, "El nombre del operador es obligatorio"),
      id: string().min(1, "El ID del chequeo de calidad es obligatorio"),
    })
  ).optional(),
  idChequeoCantidad: array(
    object({
      operador: string().min(1, "El nombre del operador es obligatorio"),
      id: string().min(1, "El ID del chequeo de cantidad es obligatorio"),
    })
  ).optional(),
  derivado: array(
    object({
      idProducto: object({
        _id: string().min(1, "El ID del producto es obligatorio"),
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }),
      porcentaje: number().min(
        0,
        "El porcentaje debe ser un número no negativo"
      ),
      _id: string().min(1, "El ID es obligatorio"),
    })
  ).optional(),
  fechaInicio: union([string(), date()]).refine(
    (val) => val !== "",
    "La fecha de inicio es obligatoria"
  ),
  fechaFin: union([string(), date()]).refine(
    (val) => val !== "",
    "La fecha de fin es obligatoria"
  ),
  operador: string().min(1, "El nombre del operador es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"),
  eliminado: boolean().default(false),
  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  descripcion: string().min(1, "La descripción es obligatoria"),
  estadoRefinacion: string().min(
    1,
    "El estado de la refinación es obligatorio"
  ),
  id: string().optional(),
});

export const refinacionSalidaSchema = object({
  idRefinacion: object({
    idTorre: object({
      _id: string().min(1, "El _id de la torre es obligatorio"),
      nombre: string().min(1, "El nombre de la torre es obligatorio"),
      id: string().min(1, "El ID de la torre es obligatorio"),
    }),
    idProducto: object({
      _id: string().min(1, "El _id del producto es obligatorio"),
      nombre: string().min(1, "El nombre del producto es obligatorio"),
      id: string().min(1, "El ID del producto es obligatorio"),
    }),
    cantidadTotal: number().min(0, "La cantidad total debe ser no negativa"),
    derivado: array(
      object({
        idProducto: object({
          _id: string().min(1, "El _id del producto derivado es obligatorio"),
          nombre: string().min(
            1,
            "El nombre del producto derivado es obligatorio"
          ),
          id: string().min(1, "El ID del producto derivado es obligatorio"),
        }),
        porcentaje: number().min(0, "El porcentaje debe ser no negativo"),
        _id: string().min(1, "El _id del derivado es obligatorio"),
      })
    ).optional(),
    numeroRefinacion: number().min(
      0,
      "El número de refinación debe ser no negativo"
    ),
    id: string().min(1, "El ID de la refinación es obligatorio"),
  }),
  idTanque: object({
    _id: string().min(1, "El _id del tanque es obligatorio"),
    nombre: string().min(1, "El nombre del tanque es obligatorio"),
    id: string().min(1, "El ID del tanque es obligatorio"),
  }),
  cantidadTotal: number().min(0, "La cantidad debe ser un número no negativo"),
  descripcion: string().min(1, "La descripción es obligatoria"),
  idChequeoCalidad: array(
    object({
      _id: string().min(1, "El _id del chequeo de calidad es obligatorio"),
      idProducto: object({
        _id: string().min(1, "El _id del producto es obligatorio"),
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }),
      idTanque: object({
        _id: string().min(1, "El _id del tanque es obligatorio"),
        nombre: string().min(1, "El nombre del tanque es obligatorio"),
        id: string().min(1, "El ID del tanque es obligatorio"),
      }),
      gravedadAPI: number().min(
        0,
        "La gravedad API debe ser un número no negativo"
      ),
      azufre: number().min(
        0,
        "El porcentaje de azufre debe ser un número no negativo"
      ),
      contenidoAgua: number().min(
        0,
        "El contenido de agua debe ser un número no negativo"
      ),
      id: string().min(1, "El ID del chequeo de calidad es obligatorio"),
    })
  ).optional(),
  idChequeoCantidad: array(
    object({
      idProducto: object({
        _id: string().min(1, "El _id del producto es obligatorio"),
        nombre: string().min(1, "El nombre del producto es obligatorio"),
        id: string().min(1, "El ID del producto es obligatorio"),
      }),
      idTanque: object({
        _id: string().min(1, "El _id del tanque es obligatorio"),
        nombre: string().min(1, "El nombre del tanque es obligatorio"),
        id: string().min(1, "El ID del tanque es obligatorio"),
      }),
      id: string().min(1, "El ID del chequeo de cantidad es obligatorio"),
    })
  ).optional(),
  idProducto: object({
    _id: string().min(1, "El _id del producto es obligatorio"),
    nombre: string().min(1, "El nombre del producto es obligatorio"),
    id: string().min(1, "El ID del producto es obligatorio"),
  }),
  fechaFin: union([string(), date()]).refine(
    (val) => val !== "",
    "La fecha de fin es obligatoria"
  ),
  operador: string().min(1, "El nombre del operador es obligatorio"),
  estadoRefinacionSalida: string().min(
    1,
    "El estado de la refinación es obligatorio"
  ),
  eliminado: boolean().default(false),
  estado: string().min(1, "El estado es obligatorio"),
  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  id: string().optional(),
});

export const tipoProductoSchema = object({
  _id: string().optional(),
  idRefineria: object({
    nombre: string().min(1, "El nombre de la refinería es obligatorio"),
    id: string().min(1, "El ID de la refinería es obligatorio"),
  }).optional(),
  idProducto: object({
    _id: string().min(1, "El ID del producto es obligatorio"),
    nombre: string().min(1, "El nombre del producto es obligatorio"),
    color: string().min(1, "El color es obligatorio"),
    id: string().min(1, "El ID es obligatorio"),
  }),
  nombre: string().min(1, "El nombre es obligatorio"),
  clasificacion: string().min(1, "La clasificación es obligatoria"),
  gravedadAPI: number().min(
    0,
    "La gravedad API debe ser un número no negativo"
  ),
  azufre: number().min(0, "El azufre debe ser un número no negativo"),
  contenidoAgua: number().min(
    0,
    "El contenido de agua debe ser un número no negativo"
  ),
  flashPoint: number().min(0, "El Flashpoint es obligatorio"),
  estado: string().min(1, "El estado es obligatorio"), // Considera usar boolean si es posible
  eliminado: boolean().default(false),
  createdAt: union([string(), date()]).optional(),
  updatedAt: union([string(), date()]).optional(),
  id: string().min(1, "El ID es obligatorio").optional(),
});

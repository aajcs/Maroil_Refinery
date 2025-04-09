export interface Refineria {
  id: string;
  nombre: string;
  correo: string;
  rol: string;
  acceso: string;
  estado: string;
}

export interface LineaRecepcion {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  idRefineria: {
    id: string | undefined;
  };
}
export interface LineaDespacho {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  idRefineria: {
    id: string | undefined;
  };
}

export interface Tanque {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  createdAt: string;
  updatedAt: string;
  idRefineria: {
    id: string | undefined;
  };
  almacenamientoMateriaPrimaria: boolean;
  idProducto: Producto;
  almacenamiento: number;
  capacidad: number;
}
// export interface Tanque {
//   id: string;
//   // idRefineria: { id: string };

//   nombre: string;
//   material: string[];
// }

export interface ContratoItem {
  // ID interno del item (por ejemplo, si lo almacenas en MongoDB)
  id?: string;

  // Referencia al contrato padre
  idContrato?: string;

  // Referencia al producto asociado
  producto?: string; // o un objeto { id: string; nombre: string; ... } si lo prefieres

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
  idContacto: any; // Ajusta con la interfaz real si lo deseas

  /**
   * Referencia a la refinería asociada.
   */
  idRefineria: {
    id: string | undefined;
  };
  montoTotal?: number;
  montoTransporte?: number;
}

export interface Recepcion {
  id: string;
  estadoCarga: string;
  estadoRecepcion: string;
  estado: string;
  eliminado: boolean;
  idContrato: {
    idItems: {
      estado: boolean;
      eliminado: boolean;
      producto: {
        nombre: string;
        id: string;
        color: string;
      };
      cantidad: number;
      precioUnitario: number;
      gravedadAPI: number;
      azufre: number;
      viscosidad: number;
      densidad: number;
      contenidoAgua: number;
      origen: string;
      temperatura: number;
      presion: number;
      idContrato: string;
      id: string;
    }[];
    numeroContrato: string;
    idRefineria: {
      nombre: string;
      id: string;
    };
    idContacto: {
      nombre: string;
      id: string;
    };
    id: string;
  };
  idContratoItems: {
    producto: {
      nombre: string;
      id: string;
      color: string;
    };

    cantidad: number;
    id: string;
  };
  idLinea: {
    nombre: string;
    id: string;
  };
  idRefineria: {
    nombre: string;
    id: string;
  };
  idTanque: {
    nombre: string;
    id: string;
  } | null;

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
export interface Despacho {
  id: string;
  estadoCarga: string;
  estadoDespacho: string;
  estado: string;
  eliminado: boolean;
  idContrato: {
    idItems: {
      estado: boolean;
      eliminado: boolean;
      producto: {
        nombre: string;
        id: string;
        color: string;
      };
      cantidad: number;
      precioUnitario: number;
      gravedadAPI: number;
      azufre: number;
      viscosidad: number;
      densidad: number;
      contenidoAgua: number;
      origen: string;
      temperatura: number;
      presion: number;
      idContrato: string;
      id: string;
    }[];
    numeroContrato: string;
    idRefineria: {
      nombre: string;
      id: string;
    };
    idContacto: {
      nombre: string;
      id: string;
    };
    id: string;
  };
  idContratoItems: {
    producto: {
      nombre: string;
      id: string;
      color: string;
    };

    cantidad: number;
    id: string;
  };
  idLineaDespacho: {
    nombre: string;
    id: string;
  };
  idRefineria: {
    nombre: string;
    id: string;
  };
  idTanque: {
    nombre: string;
    id: string;
  } | null;

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

export interface Contacto {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  idRefineria: {
    id: string | undefined;
  };
}

export interface TorreDestilacion {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: Material[];
  createdAt: string;
  updatedAt: string;
  idRefineria: {
    id: string | undefined;
    nombre: string;
  };
}
export interface Material {
  idProducto?: {
    _id: string;
    nombre: string;
    posicion: number;
    color: string;
    id: string;
  };

  estadoMaterial: string;
  _id?: string;
}

export interface Producto {
  idRefineria: {
    nombre: string;
    id: string;
  };
  idTipoProducto: [
    {
      nombre: string;
      id: string;
    }
  ];
  nombre: string;
  posicion: number;
  color: string;
  estado: boolean;
  eliminado: boolean;
  tipoMaterial: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface ChequeoCalidad {
  aplicar: {
    tipo: string;
    idReferencia: {
      idGuia?: number;
      _id?: string;
      nombre?: string;
      id: string;
      [key: string]: any;
    };
  };
  _id: string;
  idRefineria: {
    _id: string;
    nombre: string;
    id: string;
  };
  idProducto: {
    _id: string;
    nombre: string;
    id: string;
  };
  fechaChequeo: string;
  gravedadAPI: number;
  azufre: number;
  contenidoAgua: number;
  puntoDeInflamacion: number;
  cetano: number;
  idOperador: {
    nombre: string;
    id: string;
  };
  estado: string;
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  numeroChequeoCalidad: number;
  id: string;
}

export interface ChequeoCantidad {
  aplicar: {
    tipo: string;
    idReferencia: {
      idGuia?: number;
      _id?: string;
      nombre?: string;
      id: string;
      [key: string]: any;
    };
  };
  _id: string;
  idRefineria: {
    _id: string;
    nombre: string;
    id: string;
  };
  idProducto: {
    _id: string;
    nombre: string;
    id: string;
  };
  fechaChequeo: string;
  cantidad: number;
  idOperador: {
    nombre: string;
    id: string;
  };
  estado: string;
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  numeroChequeoCantidad: number;
  id: string;
}

export interface Refinacion {
  idRefineria: {
    nombre: string;
    id: string;
  };
  idTanque: {
    _id: string;
    nombre: string;
    id: string;
  };
  idTorre: {
    nombre: string;
    id: string;
  };
  cantidadTotal: number;
  idChequeoCalidad: {
    operador: string;
    id: string;
  }[];
  idChequeoCantidad: {
    operador: string;
    id: string;
    fechaChequeo: string;
    cantidad: number;
  }[];
  derivado: Derivado[];
  fechaInicio: string;
  fechaFin: string;
  operador: string;
  estado: string;
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  descripcion: string;
  estadoRefinacion: string;
  idProducto: {
    nombre: string;
    id: string;
  };
  numeroRefinacion: number;
  idRefinacionSalida: RefinacionSalida[];
}
export interface RefinacionSalida {
  idRefineria: {
    nombre: string;
    id: string;
  };
  idRefinacion: {
    idTorre: {
      _id: string;
      nombre: string;
      id: string;
    };
    idProducto: {
      _id: string;
      nombre: string;
      id: string;
    };
    cantidadTotal: number;
    derivado: Array<{
      idProducto: {
        _id: string;
        nombre: string;
        id: string;
      };
      porcentaje: number;
      _id: string;
    }>;
    numeroRefinacion: number;
    id: string;
  };
  idTanque: {
    _id: string;
    nombre: string;
    id: string;
  };
  cantidadTotal: number;
  descripcion: string;
  idChequeoCalidad: Array<{
    _id: string;
    idProducto: {
      _id: string;
      nombre: string;
      id: string;
    };
    idTanque: {
      _id: string;
      nombre: string;
      id: string;
    };
    gravedadAPI: number;
    azufre: number;
    contenidoAgua: number;
    id: string;
  }>;
  idChequeoCantidad: Array<{
    idProducto: {
      _id: string;
      nombre: string;
      id: string;
    };
    idTanque: {
      _id: string;
      nombre: string;
      id: string;
    };
    fechaChequeo: string;
    cantidad: number;
    estado: string;
    eliminado: boolean;
    createdAt: string;
    updatedAt: string;
    id: string;
  }>;
  idProducto: {
    _id: string;
    nombre: string;
    id: string;
  };
  fechaFin: string;
  operador: string;
  estadoRefinacionSalida: string;
  eliminado: boolean;
  estado: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  numeroRefinacionSalida: number;
}
export interface Derivado {
  idProducto: {
    _id: string;
    nombre: string;
    id: string;
  };
  porcentaje: number;
  _id: string;
}
export interface TipoProducto {
  id: string; // ID único del producto
  idRefineria: {
    id: string;
    nombre: string;
    procesamientoDia: number;
  }; // Relación con la refinería
  idProducto: Producto; // Relación con el modelo Producto
  nombre: string; // Nombre del producto
  clasificacion: string;
  gravedadAPI: number; // Gravedad API del producto
  azufre: number; // Porcentaje de azufre en el producto
  contenidoAgua: number; // Contenido de agua en el producto
  flashPoint: number; // Punto de inflamación (Flashpoint) del producto
  rendimientos: Rendimiento[]; // Lista de rendimientos asociados al producto
  costoOperacional?: number; // Costo operativo del producto
  transporte?: number; // Costo de transporte del producto
  convenio?: number; // Costo de convenio del producto
  estado: string; // Estado del producto (Activo o Inactivo)
  eliminado: boolean; // Indica si el producto ha sido eliminado (eliminación lógica)
  createdAt: string; // Fecha de creación
  updatedAt: string; // Fecha de última actualización
}

// Interfaz para los rendimientos asociados al producto
export interface Rendimiento {
  idProducto: {
    id: string;
    nombre: string;
    color: string;
  }; // Relación con el producto
  transporte?: number; // Costo de transporte
  bunker?: number; // Costo de bunker
  costoVenta?: number; // Costo de venta
  convenio?: number; // Costo de convenio
  porcentaje?: number; // Porcentaje de rendimiento
}

export interface CorteRefinacion {
  idRefineria: {
    _id: string;
    nombre: string;
    id: string;
  };
  numeroCorteRefinacion: number;
  corteTorre: Array<{
    idTorre: {
      _id: string;
      nombre: string;
      id: string;
    };
    detalles: Array<{
      idTanque: {
        _id: string;
        nombre: string;
        id: string;
      };
      idProducto: {
        _id: string;
        nombre: string;
        id: string;
      };
      cantidad: number;
      _id: string;
    }>;
    _id: string;
  }>;
  fechaCorte: string;
  observacion: string;
  idOperador: {
    nombre: string;
    id: string;
  };
  eliminado: boolean;
  estado: string;
  createdAt: string;
  updatedAt: string;
  id: string;
}

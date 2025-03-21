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
  };
  cantidadRecibida: number;
  cantidadEnviada: number;
  fechaInicio: string;
  fechaFin: string;
  fechaDespacho: string;
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
  createdAt: string;
  updatedAt: string;
  id: string;
}

export interface ChequeoCalidad {
  idRefineria: {
    nombre: string;
    id: string;
  };
  idProducto: {
    nombre: string;
    id: string;
  };
  idTanque: {
    nombre: string;
    id: string;
  };
  idTorre: {
    nombre: string;
    id: string;
  };
  idRefinacion: {
    id: string;
    descripcion: string;
  };
  operador: string;
  fechaChequeo: string;
  gravedadAPI: number;
  azufre: number;
  viscosidad: number;
  densidad: number;
  contenidoAgua: number;
  contenidoPlomo: string;
  octanaje: string;
  temperatura: number;
  estado: string;
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  numeroChequeoCalidad: number;
}

export interface ChequeoCantidad {
  idRefineria: {
    nombre: string;
    id: string;
  };
  idProducto: {
    nombre: string;
    id: string;
  } | null;
  idTanque: {
    nombre: string;
    id: string;
  };
  idTorre: {
    nombre: string;
    id: string;
  };
  operador: string;
  fechaChequeo: string;
  cantidad: number;
  estado: string;
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  numeroChequeoCantidad: number;
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
  }[];
  derivado: Derivado[];
  fechaInicio: string;
  fechaFin: string;
  operador: string;
  estado: boolean;
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
  _id: string;
  idRefineria: {
    nombre: string;
    id: string;
  };
  idProducto: Producto[];
  nombre: string;
  clasificacion: string;
  gravedadAPI: number;
  azufre: number;
  contenidoAgua: number;
  flashPoint: number;
  estado: string; // Puede ser "true" o "false", considera usar un boolean si es posible
  eliminado: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
}

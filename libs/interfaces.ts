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

export interface Contrato {
  idItems: any;
  idContacto: any;
  id: string;
  nombre: string;
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
  idRefineria: {
    id: string | undefined;
  };
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

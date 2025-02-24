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
  material: string[];
  createdAt: string;
  updatedAt: string;
  idRefineria: {
    id: string | undefined;
  };
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
      producto: string;
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
    producto: string;
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
  material: { estadoMaterial: string; posicion: string; nombre: string }[];
  createdAt: string;
  updatedAt: string;
  idRefineria: {
    id: string | undefined;
    nombre: string;
  };
}

export interface Refineria {
  id: string | undefined;
  nombre: string;
  correo: string;
  rol: string;
  acceso: string;
  estado: string;
  procesamientoDia: number;
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
  idRefineria: Refineria;
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
  idRefineria: Refineria;
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
  capacidad: number;
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
  porcentaje: number;

  estadoMaterial: string;
  _id?: string;
}

export interface Tanque {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  createdAt: string;
  updatedAt: string;
  idRefineria: Refineria;
  almacenamientoMateriaPrimaria: boolean;
  idProducto: Producto;
  almacenamiento: number;
  capacidad: number;
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

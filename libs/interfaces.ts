export interface LineaRecepcion {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  id_refineria: {
    _id: string | undefined;
    id: string;
  };
}

export interface Tanque {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  id_refineria: {
    _id: string | undefined;
    id: string;
  };
}

export interface Contrato {
  id: string;
  nombre: string;
  numeroContrato: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  id_refineria: {
    _id: string | undefined;
    id: string;
  };
}

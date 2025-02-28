// components/modeladoRefineriaRecepcionesList.tsx
"use client";

import { formatDateFH } from "@/utils/dateUtils";

interface Recepcion {
  id: string;
  cantidadRecibida: number;
  idTanque: { nombre: string } | null;
  idLinea: { nombre: string } | null;
  idContratoItems: { producto: string };
  fechaInicio: string;
  fechaFin: string;
  placa: string;
  nombreChofer: string;
  apellidoChofer: string;
  estadoCarga: string;
  idGuia: string;
  idContrato: { numeroContrato: string };
  updatedAt: string;
  fechaDespacho: string;
  estado: string;
}

interface ModeladoRefineriaRecepcionesListProps {
  recepciones: Recepcion[];
}

const ModeladoRefineriaRecepcionesList = ({
  recepciones,
}: ModeladoRefineriaRecepcionesListProps) => {
  return (
    <div className="col-12 md:col-6 lg:col-12">
      <h1 className="text-2xl font-bold mb-3">Recepciones</h1>
      <div className="flex flex-row">
        {recepciones.map((recepcion) => (
          <div key={recepcion.id} className="m-2 flex flex-column card">
            <div>
              <strong>Cantidad Recibida:</strong> {recepcion.cantidadRecibida}
            </div>
            <div>
              <strong>Tanque:</strong>{" "}
              {recepcion.idTanque
                ? recepcion.idTanque.nombre
                : "No tiene tanque asignado"}
            </div>
            <div>
              <strong>Línea:</strong>{" "}
              {recepcion.idLinea
                ? recepcion.idLinea.nombre
                : "No tiene línea asignada"}
            </div>
            <div>
              <strong>Producto:</strong> {recepcion.idContratoItems.producto}
            </div>
            <div>
              <strong>Fecha de Inicio:</strong>{" "}
              {formatDateFH(recepcion.fechaInicio)}
            </div>
            <div>
              <strong>Fecha de Fin:</strong> {formatDateFH(recepcion.fechaFin)}
            </div>
            <div>
              <strong>Placa:</strong> {recepcion.placa}
            </div>
            <div>
              <strong>Chofer:</strong> {recepcion.nombreChofer}{" "}
              {recepcion.apellidoChofer}
            </div>
            <div>
              <strong>Estado de Carga:</strong> {recepcion.estadoCarga}
            </div>
            <div>
              <strong>ID de Guía:</strong> {recepcion.idGuia}
            </div>
            <div>
              <strong>Número de Contrato:</strong>{" "}
              {recepcion.idContrato.numeroContrato}
            </div>
            <div>
              <strong>Última Actualización:</strong>{" "}
              {formatDateFH(recepcion.updatedAt)}
            </div>
            <div>
              <strong>Fecha de Despacho:</strong>{" "}
              {formatDateFH(recepcion.fechaDespacho)}
            </div>
            <div>
              <strong>Estado:</strong> {recepcion.estado}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ModeladoRefineriaRecepcionesList;

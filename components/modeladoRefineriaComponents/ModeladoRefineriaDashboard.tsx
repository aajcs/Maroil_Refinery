"use client";

import { useRefineriaStore } from "@/store/refineriaStore";
import ModeladoRefineriaTanque from "./ModeladoRefineriaTanque";
import ModeladoRefineriaTorre from "./ModeladoRefineriaTorre";

import ModeladoRefineriaLineaDescarga from "./ModeladoRefineriaLineaDescarga";
import ModeladoRefineriaTorreSVG from "./ModeladoRefineriaTorreSVG";
import { ProgressSpinner } from "primereact/progressspinner";
import ModeladoRefineriaLineaCarga from "./ModeladoRefineriaLineaCarga";

import { formatDateFH } from "@/utils/dateUtils";
import { useSocket } from "@/hooks/useSocket";
import { useRefineryData } from "@/hooks/useRefineryData";
function ModeladoRefineriaDashboard() {
  const { activeRefineria } = useRefineriaStore();
  const { recepcionModificado } = useSocket(); // Obtén recepcionModificado desde el socket
  const {
    tanques,
    torresDestilacion,
    lineaRecepcions,
    recepcions,
    contratos,
    loading,
  } = useRefineryData(
    activeRefineria?.id || "",
    recepcionModificado || undefined // Pasa recepcionModificado como dependencia
  );

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-content-center align-items-center h-screen">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-12">
            <h1 className="text-2xl font-bold mb-3">Contratos</h1>
            <div className="  flex flex-row">
              {/* <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(contratos, null, 2)}
              </pre> */}
              {contratos.map((contrato) => (
                <div key={contrato.id} className="m-2 flex flex-column card">
                  <div>
                    <strong>Número de Contrato:</strong>{" "}
                    {contrato.numeroContrato}
                  </div>
                  <div>
                    {/* <strong>Producto:</strong> {contrato.idItems} */}
                    <strong>Producto:</strong>{" "}
                    {contrato.idItems
                      .map((item: any) => item.producto)
                      .join(", ")}
                  </div>
                  <div>
                    <strong>Cliente:</strong> {contrato.idContacto.nombre}
                  </div>
                  <div>
                    <strong>Descripcion:</strong> {contrato.descripcion}
                  </div>
                  <div>
                    <strong>Fecha de inicio:</strong>{" "}
                    {formatDateFH(contrato.fechaInicio)}
                  </div>
                  <div>
                    <strong>Fecha de fin:</strong>{" "}
                    {formatDateFH(contrato.fechaFin)}
                  </div>
                  <div>
                    <strong>Estado:</strong>{" "}
                    {contrato.estado ? "Activo" : "Inactivo"}
                  </div>
                  <div>
                    <strong>Estado de Entrega:</strong> {contrato.estadoEntrega}
                  </div>
                  <div>
                    <strong>Estado de Contrato:</strong>{" "}
                    {contrato.estadoContrato}
                  </div>
                  <div>
                    <strong>Última Actualización:</strong>{" "}
                    {formatDateFH(contrato.updatedAt)}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="col-12 md:col-6 lg:col-12">
            <h1 className="text-2xl font-bold mb-3">Recepciones</h1>
            <div className="  flex flex-row">
              {/* <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(recepcions, null, 2)}
              </pre> */}

              {recepcions.map((recepcion) => (
                <div key={recepcion.id} className="m-2 flex flex-column card">
                  <div>
                    <strong>Cantidad Recibida:</strong>{" "}
                    {recepcion.cantidadRecibida}
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
                    <strong>Producto:</strong>{" "}
                    {recepcion.idContratoItems.producto}
                  </div>
                  <div>
                    <strong>Fecha de Inicio:</strong>{" "}
                    {formatDateFH(recepcion.fechaInicio)}
                  </div>
                  <div>
                    <strong>Fecha de Fin:</strong>{" "}
                    {formatDateFH(recepcion.fechaFin)}
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
                    <strong>Estado</strong> {recepcion.estado}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Línea de recepción */}
          <h1 className="text-2xl font-bold mb-3 col-12">
            Modelado de Refinería
          </h1>
          <div className="col-12 md:col-6 lg:col-2">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">Línea de Recepción</h1>

              {lineaRecepcions.map((lineaRecepcion) => (
                <div key={lineaRecepcion.id} className="mb-2">
                  <ModeladoRefineriaLineaCarga
                    lineaRecepcion={lineaRecepcion}
                    recepcions={recepcions}
                  />
                </div>
              ))}
            </div>
          </div>
          {/* Almacenamiento Crudo */}
          <div className="col-12 md:col-6 lg:col-2">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">Almacenamiento Crudo</h1>
              {tanques
                .filter((tanque) => tanque.material.includes("Petroleo Crudo"))
                .map((tanque) => (
                  <div key={tanque.id} className="mb-2">
                    <ModeladoRefineriaTanque
                      tanque={tanque}
                      recepcions={recepcions}
                    />
                  </div>
                ))}
            </div>
          </div>

          {/* Torres de Procesamiento */}
          <div className="col-12 md:col-6 lg:col-3">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">
                Torres de Procesamiento
              </h1>
              <div className="grid">
                {torresDestilacion.map((torre) => (
                  <div key={torre.id} className="col-12 md:col-6">
                    <ModeladoRefineriaTorre torre={torre} />
                    {/* <ModeladoRefineriaTorreSVG /> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Almacenamiento de Productos */}
          <div className="col-12 md:col-6 lg:col-3">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">
                Almacenamiento de Productos
              </h1>
              <div className="grid">
                {tanques
                  .filter(
                    (tanque) => !tanque.material.includes("Petroleo Crudo")
                  )
                  .map((tanque) => (
                    <div key={tanque.id} className="mb-2">
                      <ModeladoRefineriaTanque tanque={tanque} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Línea de Despacho */}
          <div className="col-12 md:col-6 lg:col-2">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">Línea de Despacho</h1>

              {tanques
                .filter((tanque) => !tanque.material.includes("Petroleo Crudo"))
                .map((tanque, index) => (
                  <div key={index} className="col-12 md:col-6">
                    <ModeladoRefineriaLineaDescarga />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Línea de Carga
      <div className="mt-4">
        <ModeladoRefineriaLinaCarga />
      </div> */}
    </div>
  );
}

export default ModeladoRefineriaDashboard;

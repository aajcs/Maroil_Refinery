// components/modeladoRefineriaRecepcionesList.tsx
"use client";

import { Marquee } from "@/components/magicui/marquee";
import { Recepcion } from "@/libs/interfaces";
import {
  formatDateFH,
  formatDateSinAnoFH,
  formatDuration,
} from "@/utils/dateUtils";
import { ProgressBar } from "primereact/progressbar";

interface ModeladoRefineriaRecepcionesListProps {
  recepciones: Recepcion[];
}

const ModeladoRefineriaRecepcionesList = ({
  recepciones,
}: ModeladoRefineriaRecepcionesListProps) => {
  return (
    <div className="col-12 md:col-6 lg:col-12">
      <h1 className="text-2xl font-bold mb-3">Recepciones</h1>
      <div className="grid">
        <div className="tw-relative tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-center tw-overflow-hidden">
          <Marquee pauseOnHover className="[--duration:50s]">
            {recepciones.map((recepcion) => (
              <div
                key={recepcion.id}
                // className="col-12 md:col-6 lg:col-4 xl:col-2 p-2"
              >
                <div className="p-3 surface-card border-round shadow-2">
                  <div className="flex justify-content-between align-items-start">
                    <div className="flex flex-column">
                      <span className="text-lg font-bold white-space-normal">
                        Nº: {recepcion.idContrato.numeroContrato}
                      </span>
                      <span className="text-sm text-500 mt-1">
                        {`(${recepcion.nombreChofer} ${recepcion.apellidoChofer} - ${recepcion.placa})`}
                      </span>
                    </div>
                    <div className="flex flex-column text-right">
                      <span className="text-sm font-semibold">
                        Guia: {recepcion.idGuia}
                      </span>
                      <span className="text-xs text-green-500">
                        Act-{formatDateSinAnoFH(recepcion.updatedAt)}
                      </span>
                    </div>
                  </div>
                  <hr className="my-2" />

                  <div className="text-sm">
                    <div>
                      <span className="font-medium">Inicio:</span>{" "}
                      {formatDateSinAnoFH(recepcion.fechaInicio)}
                      {" - "}
                      <span className="font-medium">Fin:</span>{" "}
                      {formatDateSinAnoFH(recepcion.fechaFin)}
                    </div>
                    <div>
                      <span className="font-medium">Timpo de carga:</span>{" "}
                      {formatDuration(
                        recepcion.fechaDespacho,
                        recepcion.fechaFin
                      )}
                    </div>
                  </div>
                  <hr className="my-2" />
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
                  <hr className="my-2" />
                  <div className="flex flex-column gap-2">
                    <div className="flex align-items-center gap-2">
                      <span className="font-bold min-w-8rem">
                        {recepcion.idContratoItems.producto.nombre}
                      </span>
                      <div className="flex-grow-1">
                        <ProgressBar
                          value={
                            (recepcion.cantidadRecibida /
                              recepcion.cantidadEnviada) *
                            100
                          }
                          showValue={false}
                          // className="h-1rem"
                          style={{ minWidth: "10rem", height: "0.6rem" }}
                          color={`#${recepcion.idContratoItems.producto.color}`}
                        />
                        <div className="flex justify-content-between text-xs mt-1">
                          <span>
                            {recepcion.cantidadEnviada?.toLocaleString("de-DE")}
                            Bbl
                          </span>
                          <span className="text-green-800">
                            {recepcion.cantidadRecibida.toLocaleString("de-DE")}
                            Bbl
                          </span>
                          <span className="text-red-800">
                            {(
                              recepcion.cantidadEnviada -
                              recepcion.cantidadRecibida
                            ).toLocaleString("de-DE")}
                            Bbl
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <div>
                <strong>Cantidad Recibida:</strong> {recepcion.cantidadRecibida}
              </div>
              <div>
                <strong>Producto:</strong> {recepcion.idContratoItems.producto}
              </div>
              <div>
                <strong>Estado de Carga:</strong> {recepcion.estadoCarga}
              </div> */}

                  {/* <div>
                <strong>Estado:</strong> {recepcion.estado}
              </div> */}
                </div>
              </div>
            ))}
          </Marquee>

          <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-left-0 tw-w-1/4 tw-bg-gradient-to-r tw-from-background"></div>
          <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-w-1/4 tw-bg-gradient-to-l tw-from-background"></div>
        </div>
      </div>
    </div>
  );
};
export default ModeladoRefineriaRecepcionesList;

// components/modeladoRefineriaDespachoesList.tsx
"use client";

import { Marquee } from "@/components/magicui/marquee";
import { Despacho } from "@/libs/interfaces";
import {
  formatDateFH,
  formatDateSinAnoFH,
  formatDuration,
} from "@/utils/dateUtils";
import { ProgressBar } from "primereact/progressbar";

interface ModeladoRefineriaDespachosListProps {
  despachos: Despacho[];
}

const ModeladoRefineriaDespachosList = ({
  despachos,
}: ModeladoRefineriaDespachosListProps) => {
  return (
    <div className="col-12 md:col-6 lg:col-12">
      <h1 className="text-2xl font-bold mb-3">Despachos</h1>
      <div className="grid">
        <div className="tw-relative tw-flex tw-w-full tw-flex-col tw-items-center tw-justify-center tw-overflow-hidden">
          {despachos.length > 5 ? (
            <Marquee pauseOnHover className="[--duration:50s]">
              {despachos.map((recepcion) => (
                <div key={recepcion.id}>
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
                        <span className="font-medium">Tiempo de carga:</span>{" "}
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
                      {recepcion.idLineaDespacho
                        ? recepcion.idLineaDespacho.nombre
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
                            style={{ minWidth: "10rem", height: "0.6rem" }}
                            color={`#${recepcion.idContratoItems.producto.color}`}
                          />
                          <div className="flex justify-content-between text-xs mt-1">
                            <span>
                              {recepcion.cantidadEnviada?.toLocaleString(
                                "de-DE"
                              )}{" "}
                              Bbl
                            </span>
                            <span className="text-green-800">
                              {recepcion.cantidadRecibida.toLocaleString(
                                "de-DE"
                              )}{" "}
                              Bbl
                            </span>
                            <span className="text-red-800">
                              {(
                                recepcion.cantidadEnviada -
                                recepcion.cantidadRecibida
                              ).toLocaleString("de-DE")}{" "}
                              Bbl
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Marquee>
          ) : (
            <div className="grid">
              {despachos.map((recepcion) => (
                <div key={recepcion.id}>
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
                        <span className="font-medium">Tiempo de carga:</span>{" "}
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
                      {recepcion.idLineaDespacho
                        ? recepcion.idLineaDespacho.nombre
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
                            style={{ minWidth: "10rem", height: "0.6rem" }}
                            color={`#${recepcion.idContratoItems.producto.color}`}
                          />
                          <div className="flex justify-content-between text-xs mt-1">
                            <span>
                              {recepcion.cantidadEnviada?.toLocaleString(
                                "de-DE"
                              )}{" "}
                              Bbl
                            </span>
                            <span className="text-green-800">
                              {recepcion.cantidadRecibida.toLocaleString(
                                "de-DE"
                              )}{" "}
                              Bbl
                            </span>
                            <span className="text-red-800">
                              {(
                                recepcion.cantidadEnviada -
                                recepcion.cantidadRecibida
                              ).toLocaleString("de-DE")}{" "}
                              Bbl
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-left-0 tw-w-1/4 tw-bg-gradient-to-r tw-from-background"></div>
          <div className="tw-pointer-events-none tw-absolute tw-inset-y-0 tw-right-0 tw-w-1/4 tw-bg-gradient-to-l tw-from-background"></div>
        </div>
      </div>
    </div>
  );
};
export default ModeladoRefineriaDespachosList;

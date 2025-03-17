// components/ContratosList.tsx
"use client";

import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { formatDateSinAnoFH } from "@/utils/dateUtils";
import { getFillColor } from "@/utils/getFillCollor";
import { Contrato } from "@/libs/interfaces";
interface Producto {
  producto: { id: string; nombre: string; color: string };
  cantidad: number;

  formula: string;
  precioUnitario: number;
  total: number;
  precioTransporte: number;
  totalTransporte: number;
}
interface ModeladoRefineriaContratosSalesListProps {
  contratos: Array<Contrato & { productos: Producto[] }>;
  tipo: string;
}

const ModeladoRefineriaContratosSalesList = ({
  contratos,
  tipo,
}: ModeladoRefineriaContratosSalesListProps) => {
  console.log(contratos);
  console.log(tipo);
  return (
    <div className="col-12">
      <h1 className="text-2xl font-bold mb-3">Contratos {tipo}</h1>
      <div className="grid">
        {contratos
          .filter((contrato) => contrato.tipoContrato === tipo)
          .map((contrato) => (
            <div
              key={contrato.id}
              className="col-12 md:col-6 lg:col-4 xl:col-3 p-2"
            >
              <div className="p-3 surface-card border-round shadow-2">
                <div className="flex justify-content-between align-items-start">
                  <div className="flex flex-column">
                    <span className="text-lg font-bold white-space-normal">
                      {contrato.descripcion.toLocaleUpperCase()}
                    </span>
                    <span className="text-sm text-500 mt-1">
                      {`(${contrato.idContacto.nombre})`}
                    </span>
                  </div>
                  <div className="flex flex-column text-right">
                    <span className="text-sm font-semibold">
                      Nº: {contrato.numeroContrato}
                    </span>
                    <span className="text-xs text-green-500">
                      Act-{formatDateSinAnoFH(contrato.updatedAt)}
                    </span>
                  </div>
                </div>
                <hr className="my-2" />
                <div className="text-sm">
                  <span className="font-medium">Inicio:</span>{" "}
                  {formatDateSinAnoFH(contrato.fechaInicio)}
                  {" - "}
                  <span className="font-medium">Fin:</span>{" "}
                  {formatDateSinAnoFH(contrato.fechaFin)}
                </div>
                <hr className="my-2" />
                <div className="flex flex-column gap-2">
                  {contrato.productos.map((item) => (
                    <div
                      key={item.producto.id}
                      className="flex align-items-center gap-2"
                    >
                      <span className="font-bold min-w-8rem">
                        {item.producto.nombre}
                      </span>
                      <div className="flex-grow-1">
                        {/* <ProgressBar
                          value={item.porcentaje}
                          showValue={false}
                          // className="h-1rem"
                          style={{ minWidth: "10rem", height: "0.6rem" }}
                          color={`#${item.producto.color}`}
                        /> */}
                        <div className="flex justify-content-between text-xs mt-1">
                          <span>
                            {item.cantidad.toLocaleString("de-DE")}Bbl
                          </span>
                          <span className="text-green-800">
                            {/* {item.cantidadRecibida.toLocaleString("de-DE")}Bbl */}
                          </span>
                          <span className="text-red-800">
                            {/* {item.cantidadFaltante.toLocaleString("de-DE")}Bbl */}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {tipo === "Compra" ? (
                  <div className="flex flex-column gap-2">
                    <div className="flex align-items-center gap-2">
                      <span className="font-bold min-w-8rem">
                        Cantidad de Barril{" "}
                        {(() => {
                          const totalCantidad = contrato.productos.reduce(
                            (acc, item) => acc + (item.cantidad || 0),
                            0
                          );

                          return `${totalCantidad.toLocaleString("de-DE")} Bbl`;
                        })()}
                      </span>
                    </div>
                    <div className="flex align-items-center gap-2">
                      <span className="font-bold min-w-8rem">
                        Monoto Total{" "}
                        {(contrato.montoTotal || 0).toLocaleString("de-DE", {
                          style: "currency",
                          currency: "USD",
                        })}
                      </span>
                    </div>
                    <div className="flex align-items-center gap-2">
                      <span className="font-bold min-w-8rem">
                        Monoto Transporte{" "}
                        {(contrato.montoTransporte || 0).toLocaleString(
                          "de-DE",
                          {
                            style: "currency",
                            currency: "USD",
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex align-items-center gap-2">
                      <span className="font-bold min-w-8rem">
                        Formula Brent-10(
                        {(() => {
                          const totalCantidad = contrato.productos.reduce(
                            (acc, item) => acc + (item.cantidad || 0),
                            0
                          );
                          const montoPorBarril =
                            totalCantidad > 0
                              ? (contrato.montoTotal ?? 0) / totalCantidad
                              : 0;
                          return montoPorBarril.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "USD",
                          });
                        })()}
                        )+ trans(
                        {(() => {
                          const totalCantidad = contrato.productos.reduce(
                            (acc, item) => acc + (item.cantidad || 0),
                            0
                          );
                          const montoPorBarril =
                            totalCantidad > 0
                              ? (contrato.montoTransporte ?? 0) / totalCantidad
                              : 0;
                          return montoPorBarril.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "USD",
                          });
                        })()}
                        )
                      </span>
                    </div>
                    <div className="flex align-items-center gap-2">
                      <span className="font-bold min-w-8rem">
                        Monto Por Barril{" "}
                        {(() => {
                          const totalCantidad = contrato.productos.reduce(
                            (acc, item) => acc + (item.cantidad || 0),
                            0
                          );
                          const montoPorBarril =
                            totalCantidad > 0
                              ? ((contrato.montoTransporte || 0) +
                                  (contrato.montoTotal || 0)) /
                                totalCantidad
                              : 0;
                          return montoPorBarril.toLocaleString("de-DE", {
                            style: "currency",
                            currency: "USD",
                          });
                        })()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-column gap-2">
                    <div className="flex align-items-center gap-2">
                      <h1>en construccion!!!✌🏻</h1>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ModeladoRefineriaContratosSalesList;

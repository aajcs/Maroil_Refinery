// components/ContratosList.tsx
"use client";

import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { formatDateSinAnoFH } from "@/utils/dateUtils";
import { useCallback } from "react";
import { getFillColor } from "@/utils/getFillCollor";

interface Contrato {
  id: string;
  descripcion: string;
  numeroContrato: string;
  updatedAt: string;
  fechaInicio: string;
  fechaFin: string;
  idContacto: { nombre: string };
  idItems: Array<{ producto: string; cantidad: number }>;
}

interface Producto {
  producto: string;
  cantidad: number;
  cantidadRecibida: number;
  cantidadFaltante: number;
  porcentaje: number;
  recepciones: any[];
}

interface ModeladoRefineriaContratosListProps {
  contratos: Array<Contrato & { productos: Producto[] }>;
  onShowDialog: (product: Producto) => void;
}

const valueTemplate =
  (cantidad: number, cantidadRecibida: number) =>
  (value: string | number | null | undefined): React.ReactNode => {
    return (
      <span>
        {cantidadRecibida} / {cantidad}Bbl ({value}%)
      </span>
    );
  };

const ModeladoRefineriaContratosList = ({
  contratos,
  onShowDialog,
}: ModeladoRefineriaContratosListProps) => {
  return (
    <div className="col-12 md:col-6 lg:col-12">
      <h1 className="text-2xl font-bold mb-3">Contratos</h1>
      <div className="flex flex-row">
        {contratos.map((contrato) => (
          <div key={contrato.id} className="m-2 flex flex-column card">
            <div className="flex flex-row justify-content-between">
              <div>
                {contrato.descripcion.toLocaleUpperCase()}
                <div className="text-xs mt-1 font-italic">
                  {`(${contrato.idContacto.nombre})`}
                </div>
              </div>
              <div className="ml-2 text-right">
                <strong>Nº:</strong> {contrato.numeroContrato}
                <div className="text-xs text-green-500">
                  <strong>Act-</strong>
                  {formatDateSinAnoFH(contrato.updatedAt)}
                </div>
              </div>
            </div>
            <hr />
            <div>
              <strong>Inicio:</strong>{" "}
              {formatDateSinAnoFH(contrato.fechaInicio)}
              {" -||- "}
              <strong>Fin:</strong> {formatDateSinAnoFH(contrato.fechaFin)}
            </div>
            <hr />
            <div>
              {contrato.productos.map((item) => (
                <div
                  key={item.producto}
                  className="flex align-items-center gap-2"
                >
                  <span className="font-bold" style={{ minWidth: "5rem" }}>
                    {item.producto}
                  </span>
                  <ProgressBar
                    value={item.porcentaje}
                    displayValueTemplate={valueTemplate(
                      item.cantidad,
                      item.cantidadRecibida
                    )}
                    className="w-8"
                    style={{ minWidth: "15rem" }}
                    color={getFillColor(item.producto)}
                  />
                  <Button
                    icon="pi pi-search"
                    onClick={() => onShowDialog(item)}
                    className="h-2rem"
                    tooltip="Mostrar todas las Recepciones"
                    severity="info"
                    text
                    size="small"
                    rounded
                    style={{ padding: "0.5rem" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ModeladoRefineriaContratosList;

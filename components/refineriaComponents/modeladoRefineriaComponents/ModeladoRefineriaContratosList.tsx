// components/ContratosList.tsx
"use client";

import { Button } from "primereact/button";
import { ProgressBar } from "primereact/progressbar";
import { formatDateSinAnoFH } from "@/utils/dateUtils";
import { Contrato } from "@/libs/interfaces";

interface Producto {
  producto: { id: string; nombre: string; color: string };
  cantidad: number;
  cantidadRecibida: number;
  cantidadFaltante: number;
  porcentaje: number;
}

interface ModeladoRefineriaContratosListProps {
  contratos: Array<Contrato & { productos: Producto[] }>;
  onShowDialog?: (product: Producto) => void;
  onShowDialogDespachos?: (contrato: Contrato) => void;
}

const ModeladoRefineriaContratosList = ({
  contratos,
  onShowDialog,
  onShowDialogDespachos,
}: ModeladoRefineriaContratosListProps) => {
  return (
    <div className="col-12">
      <h1 className="text-2xl font-bold mb-3">
        Contratos de compra de derivado
      </h1>
      <div className="grid">
        {contratos
          .filter((contrato) => contrato.tipoContrato === "Compra") // Filtrar por tipoContrato

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
                        <ProgressBar
                          value={item.porcentaje}
                          showValue={false}
                          // className="h-1rem"
                          style={{ minWidth: "10rem", height: "0.6rem" }}
                          color={`#${item.producto.color}`}
                        />
                        <div className="flex justify-content-between text-xs mt-1">
                          <span>
                            {item.cantidad.toLocaleString("de-DE")}Bbl
                          </span>
                          <span className="text-green-800">
                            {item.cantidadRecibida.toLocaleString("de-DE")}Bbl
                          </span>
                          <span className="text-red-800">
                            {item.cantidadFaltante.toLocaleString("de-DE")}Bbl
                          </span>
                        </div>
                      </div>
                      {onShowDialog && (
                        <Button
                          icon="pi pi-search"
                          onClick={() => onShowDialog(item)}
                          className="p-button-sm p-button-text p-button-rounded"
                          tooltip="Mostrar todas las Recepciones"
                          tooltipOptions={{ position: "top" }}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default ModeladoRefineriaContratosList;

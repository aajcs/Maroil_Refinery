import { formatDateSinAnoFH } from "@/utils/dateUtils";
import React from "react";

interface ModeladoRefineriaContratosProps {
  recepcionesPorContrato: any;
}

function ModeladoRefineriaContratos({
  recepcionesPorContrato,
}: ModeladoRefineriaContratosProps) {
  return (
    <div className="flex flex-row">
      {recepcionesPorContrato.map((contrato: any) => (
        <div key={contrato.id} className="m-2 flex flex-column card">
          <div className="flex flex-row justify-content-between">
            <div>
              {/* <strong>Descripcion:</strong> */}
              {contrato.descripcion.toLocaleUpperCase()}
              <div className="text-xs mt-1 font-italic">
                {/* <strong>Cliente:</strong>  */}
                {`(${contrato.idContacto.nombre})`}
              </div>
            </div>
            <div className="ml-2 text-right">
              <strong>Nº:</strong> {contrato.numeroContrato}
              <div className="text-xs   text-green-500">
                <strong>Act-</strong>
                {formatDateSinAnoFH(contrato.updatedAt)}
              </div>
            </div>
          </div>
          <hr />
          <div>
            <strong>Inicio:</strong> {formatDateSinAnoFH(contrato.fechaInicio)}
            {" -||- "}
            <strong>Fin:</strong> {formatDateSinAnoFH(contrato.fechaFin)}
          </div>
          {/* <div>
                       <strong>Estado:</strong>{" "}
                       {contrato.estado ? "Activo" : "Inactivo"}
                     </div>
                     <div>
                       <strong>Estado de Entrega:</strong> {contrato.estadoEntrega}
                     </div>
                     <div>
                       <strong>Estado de Contrato:</strong>{" "}
                       {contrato.estadoContrato}
                     </div> */}
          <hr />
          <div>
            {/* <strong>Producto:</strong> */}
            {contrato.productos.map((item: any) => (
              <div
                key={item.producto}
                className="flex align-items-center gap-2 "
              >
                <span className="font-bold " style={{ minWidth: "5rem" }}>
                  {item.producto}
                </span>

                <ProgressBar
                  value={item.porcentaje}
                  displayValueTemplate={valueTemplate(
                    item.cantidad,
                    item.cantidadRecibida
                  )}
                  className="w-8"
                  style={{
                    minWidth: "15rem",
                  }}
                  color="#77b6ea"
                ></ProgressBar>

                <Button
                  icon="pi pi-search"
                  onClick={() => showDialog(item)}
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
  );
}

export default ModeladoRefineriaContratos;

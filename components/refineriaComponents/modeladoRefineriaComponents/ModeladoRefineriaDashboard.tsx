"use client";

import { useRefineriaStore } from "@/store/refineriaStore";
import ModeladoRefineriaTanque from "./ModeladoRefineriaTanque";
import ModeladoRefineriaTorre from "./ModeladoRefineriaTorre";
import ModeladoRefineriaLineaDescarga from "./ModeladoRefineriaLineaDescarga";
import { ProgressSpinner } from "primereact/progressspinner";
import ModeladoRefineriaLineaCarga from "./ModeladoRefineriaLineaCarga";
import { formatDateFH, formatDuration } from "@/utils/dateUtils";
import { useSocket } from "@/hooks/useSocket";
import { useRefineryData } from "@/hooks/useRefineryData";
import { Dialog } from "primereact/dialog";
import { useState, useMemo, useCallback } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ModeladoRefineriaContratosList from "./ModeladoRefineriaContratosList";
import ModeladoRefineriaRecepcionesList from "./ModeladoRefineriaRecepcionesList";

const ModeladoRefineriaDashboard = () => {
  const { activeRefineria } = useRefineriaStore();
  const { recepcionModificado } = useSocket(); // Obtén recepcionModificado desde el socket
  const {
    tanques,
    torresDestilacion,
    lineaRecepcions,
    recepcions,
    contratos,
    loading,
    refinacions,
  } = useRefineryData(
    activeRefineria?.id || "",
    recepcionModificado || undefined // Pasa recepcionModificado como dependencia
  );

  const [visible, setVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const showDialog = useCallback((product: any) => {
    setSelectedProduct(product);
    setVisible(true);
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
    setSelectedProduct(null);
  }, []);

  // Agrupar recepciones por contrato y producto
  const recepcionesPorContrato = useMemo(() => {
    return contratos.map((contrato) => {
      const recepcionesContrato = recepcions.filter(
        (recepcion) => recepcion.idContrato.id === contrato.id
      );
      console.log(recepcionesContrato);
      const productos = contrato.idItems.map((item: any) => {
        const recepcionesProducto = recepcionesContrato.filter(
          (recepcion) =>
            recepcion.idContratoItems.producto.id === item.producto.id
        );

        const cantidadRecibida = recepcionesProducto.reduce(
          (total, recepcion) => total + recepcion.cantidadRecibida,
          0
        );
        const cantidadFaltante = item.cantidad - cantidadRecibida;
        const porcentaje = (cantidadRecibida / item.cantidad) * 100;

        return {
          producto: item.producto,
          cantidad: item.cantidad,
          cantidadRecibida,
          cantidadFaltante,
          recepciones: recepcionesProducto,
          porcentaje,
        };
      });

      return {
        ...contrato,
        productos,
      };
    });
  }, [contratos, recepcions]);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid">
        <ModeladoRefineriaContratosList
          contratos={recepcionesPorContrato}
          onShowDialog={showDialog}
        />
        <ModeladoRefineriaRecepcionesList recepciones={recepcions} />
        {refinacions.map((refinacion) => (
          <div key={refinacion.id} className="mb-2">
            <pre>{JSON.stringify(refinacion, null, 2)}</pre>
            <div className="card p-3">
              <p>
                <strong>Descripción:</strong> {refinacion.descripcion}
              </p>
              <p>
                <strong>Fecha de Inicio:</strong>{" "}
                {new Date(refinacion.fechaInicio).toLocaleString()}
              </p>
              <p>
                <strong>Fecha de Fin:</strong>{" "}
                {new Date(refinacion.fechaFin).toLocaleString()}
              </p>
              <p>
                <strong>Estado:</strong> {refinacion.estadoRefinacion}
              </p>
              <p>
                <strong>Operador:</strong> {refinacion.operador}
              </p>
              <p>
                <strong>Tanque:</strong> {refinacion.idTanque.nombre}
              </p>
              <p>
                <strong>Torre:</strong> {refinacion.idTorre.nombre}
              </p>
              <p>
                <strong>Producto:</strong> {refinacion.idProducto.nombre}
              </p>
              <p>
                <strong>Cantidad Total:</strong> {refinacion.cantidadTotal}
              </p>
              <h3 className="text-lg font-bold mt-3">Derivados:</h3>
              <ul>
                {refinacion.derivado.map((derivado) => (
                  <li key={derivado._id}>
                    <p>
                      <strong>Producto:</strong> {derivado.idProducto.nombre}
                    </p>
                    <p>
                      <strong>Porcentaje:</strong> {derivado.porcentaje}%
                    </p>
                  </li>
                ))}
              </ul>
              <ul>
                {refinacion.idRefinacionSalida.map((salida) => (
                  <li key={salida.id}>
                    <h1>salidas</h1>
                    <p>
                      <strong>Producto:</strong> {salida.idProducto.nombre}
                    </p>
                    <p>
                      <strong>Cantidad:</strong> {salida.cantidadTotal}
                    </p>
                    <p>
                      <strong>Descripción:</strong> {salida.descripcion}
                    </p>
                    <p>
                      <strong>Tanque:</strong> {salida.idTanque.nombre}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
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
              .filter((tanque) => tanque.almacenamientoMateriaPrimaria)
              .map((tanque) => (
                <div key={tanque.id} className="mb-2">
                  <ModeladoRefineriaTanque
                    tanque={tanque}
                    recepcions={recepcions}
                    refinacions={refinacions}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Torres de Procesamiento */}
        <div className="col-12 md:col-6 lg:col-3">
          <div className="card p-3">
            <h1 className="text-2xl font-bold mb-3">Torres de Procesamiento</h1>
            <div className="grid">
              {torresDestilacion.map((torre) => (
                <div key={torre.id} className="col-12 md:col-6">
                  <ModeladoRefineriaTorre
                    torre={torre}
                    refinacions={refinacions}
                  />
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
                .filter((tanque) => !tanque.almacenamientoMateriaPrimaria)
                .map((tanque) => (
                  <div key={tanque.id} className="mb-2">
                    <ModeladoRefineriaTanque
                      tanque={tanque}
                      refinacions={refinacions}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Línea de Despacho */}
        <div className="col-12 md:col-6 lg:col-2">
          <div className="card p-3">
            <h1 className="text-2xl font-bold mb-3">Línea de Despacho</h1>

            {lineaRecepcions.map((lineaRecepcion) => (
              <div key={lineaRecepcion.id} className="mb-2">
                <ModeladoRefineriaLineaDescarga
                  lineaRecepcion={lineaRecepcion}
                  recepcions={recepcions}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        header="Detalles de Recepciones"
        visible={visible}
        modal
        onHide={hideDialog}
        style={{ width: "80vw" }}
        breakpoints={{
          "960px": "75vw",
          "641px": "100vw",
        }}
      >
        {selectedProduct && (
          <>
            <DataTable
              value={selectedProduct.recepciones}
              size="small"
              tableStyle={{ minWidth: "50rem" }}
              footer={
                <div className="p-2 flex justify-content-between">
                  <div>
                    <strong>Producto:</strong> {selectedProduct.producto.nombre}
                  </div>
                  <div>
                    <strong>Cantidad:</strong>{" "}
                    {selectedProduct.cantidad.toLocaleString("de-DE")} Bbls
                  </div>
                  <div>
                    <strong>Cantidad Recibida:</strong>{" "}
                    {selectedProduct.cantidadRecibida.toLocaleString("de-DE")}{" "}
                    Bbls
                  </div>
                  <div>
                    <strong>Cantidad Faltante:</strong>{" "}
                    {selectedProduct.cantidadFaltante.toLocaleString("de-DE")}{" "}
                    Bbls
                  </div>
                </div>
              }
            >
              <Column field="placa" header="Placa"></Column>
              <Column
                field="nombreChofer"
                header="Chofer"
                body={(rowData: any) =>
                  rowData.nombreChofer + " " + rowData.apellidoChofer
                }
              ></Column>
              <Column field="idGuia" header="Guía"></Column>
              <Column field="idTanque.nombre" header="Tanque"></Column>
              <Column
                field="cantidadRecibida"
                header="Cantidad Recibida"
                body={(rowData: any) =>
                  `${Number(rowData.cantidadRecibida).toLocaleString(
                    "de-DE"
                  )} Bbls`
                }
              ></Column>

              <Column
                field="fechaInicio"
                header="Fecha Inicio"
                body={(rowData: any) => formatDateFH(rowData.fechaInicio)}
              ></Column>
              <Column
                field="fechaDespacho"
                header="Fecha Despacho"
                body={(rowData: any) => formatDateFH(rowData.fechaDespacho)}
              ></Column>
              <Column
                field="fechaFin"
                header="Fecha Fin"
                body={(rowData: any) => formatDateFH(rowData.fechaFin)}
              ></Column>
              <Column
                header="Tiempo de Carga"
                body={(rowData: any) =>
                  formatDuration(rowData.fechaInicio, rowData.fechaFin)
                }
              ></Column>
            </DataTable>
          </>
        )}
      </Dialog>
    </div>
  );
};

export default ModeladoRefineriaDashboard;

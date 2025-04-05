"use client";

import { useRefineriaStore } from "@/store/refineriaStore";
import ModeladoRefineriaTanque from "./ModeladoRefineriaTanque";
import ModeladoRefineriaTorre from "./ModeladoRefineriaTorre";
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
import ModeladoRefineriaLineaDespacho from "./ModeladoRefineriaLineaDespacho";
import ModeladoRefineriaDespachosList from "./ModeladoRefineriaDespachosList";
import { Contrato } from "@/libs/interfaces";
import ModeladoRefineriaContratosVentaList from "./ModeladoRefineriaContratosVentaList";

import { TabPanel, TabView } from "primereact/tabview";
import { InputSwitch } from "primereact/inputswitch";

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
    lineaDespachos,
    despachos,
  } = useRefineryData(
    activeRefineria?.id || "",
    recepcionModificado || undefined // Pasa recepcionModificado como dependencia
  );
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [visibleDespachos, setVisibleDespachos] = useState<boolean>(false);
  const [selectedContratoVenta, setSelectedContratoVenta] = useState<any>(null);
  const [checked, setChecked] = useState(false); // Estado para el InputSwitch

  const showDialog = useCallback((product: any) => {
    setSelectedProduct(product);
    setVisible(true);
  }, []);
  const onShowDialogDespachos = useCallback((contrato: any) => {
    setSelectedContratoVenta(contrato);
    setVisibleDespachos(true);
  }, []);

  const hideDialog = useCallback(() => {
    setVisible(false);
    setSelectedProduct(null);
  }, []);
  const hideDialogDespacho = useCallback(() => {
    setVisibleDespachos(false);
    setSelectedContratoVenta(null);
  }, []);
  const tanquesFiltradosOrdenados = useMemo(
    () =>
      (tanques || [])
        .filter((tanque) => !tanque.almacenamientoMateriaPrimaria)
        .sort(
          (a, b) =>
            (a.idProducto?.posicion || 0) - (b.idProducto?.posicion || 0)
        ),
    [tanques]
  );
  // Agrupar recepciones por contrato y producto
  const recepcionesPorContrato = useMemo(() => {
    return contratos.map((contrato) => {
      const recepcionesContrato = recepcions.filter(
        (recepcion) => recepcion.idContrato.id === contrato.id
      );
      const productos = contrato.idItems.map((item: any) => {
        const recepcionesProducto = recepcionesContrato.filter(
          (recepcion) =>
            recepcion.idContratoItems?.producto.id === item.producto.id
        );

        const cantidadRecibida = recepcionesProducto.reduce(
          (total, recepcion) => total + recepcion.cantidadRecibida,
          0
        );

        const cantidadFaltante = item.cantidad - cantidadRecibida;

        const porcentaje = (cantidadRecibida / item.cantidad) * 100;

        const despachosProducto = despachos.filter(
          (despacho) =>
            despacho.idContratoItems?.producto.id === item.producto.id
        );

        const cantidadDespachada = despachosProducto.reduce(
          (total, despacho) => total + despacho.cantidadRecibida,
          0
        );

        const porcentajeDespacho = (cantidadDespachada / item.cantidad) * 100;
        const cantidadFaltanteDespacho = item.cantidad - cantidadDespachada;

        return {
          producto: item.producto,
          cantidad: item.cantidad,

          recepciones: recepcionesProducto,
          cantidadRecibida,
          cantidadFaltante,
          porcentaje,

          despachos: despachosProducto,
          cantidadDespachada,
          cantidadFaltanteDespacho,
          porcentajeDespacho,
        };
      });

      return {
        ...contrato,
        productos,
      };
    });
  }, [contratos, recepcions]);

  const recepcionesEnTransito = useMemo(
    () => recepcions.filter((r) => r.estadoRecepcion === "EN_TRANSITO"),
    [recepcions]
  );

  const recepcionesEnRefineria = useMemo(
    () => recepcions.filter((r) => r.estadoRecepcion === "EN_REFINERIA"),
    [recepcions]
  );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex flex-wrap ">
        <TabView className="w-full">
          <TabPanel header="Compras de Crudos" leftIcon="pi pi-wallet mr-2">
            <ModeladoRefineriaContratosList
              contratos={recepcionesPorContrato}
              onShowDialog={showDialog}
            />
          </TabPanel>
          <TabPanel
            header="Ventas de Productos"
            leftIcon="pi pi-briefcase mr-2"
          >
            <ModeladoRefineriaContratosVentaList
              contratos={recepcionesPorContrato}
              onShowDialogDespachos={onShowDialogDespachos}
            />
          </TabPanel>
          <TabPanel header="Recepciones" leftIcon="pi pi-truck mr-2">
            <div>
              {/* Switch para alternar entre recepciones */}
              <div className="flex align-items-center gap-3 mb-3">
                <span>Mostrar Recepciones en Tránsito</span>
                <InputSwitch
                  checked={checked}
                  onChange={(e) => setChecked(e.value)}
                />
                <span>Mostrar Recepciones en Refinería</span>
              </div>

              {/* Mostrar el componente según el estado del switch */}
              {checked ? (
                <ModeladoRefineriaRecepcionesList
                  recepciones={recepcionesEnRefineria}
                />
              ) : (
                <ModeladoRefineriaRecepcionesList
                  recepciones={recepcionesEnTransito}
                />
              )}
            </div>
          </TabPanel>

          <TabPanel header="Despacho" leftIcon="pi pi-truck mr-2">
            <ModeladoRefineriaDespachosList despachos={despachos} />
          </TabPanel>
        </TabView>

        {/* Línea de recepción */}

        <div className="col-12 md:col-6 lg:col-2">
          <div className="card p-3 lg-h-fullScreen">
            <h1 className="text-2xl font-bold mb-3">Recepción de tractomula</h1>

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
          <div className="card p-3 lg-h-fullScreen">
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
          <div className="card p-3 lg-h-fullScreen">
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
          <div className="card p-3 lg-h-fullScreen">
            <h1 className="text-2xl font-bold mb-3">
              Almacenamiento de Productos
            </h1>
            <div className="grid">
              {tanquesFiltradosOrdenados.map((tanque) => (
                <div key={tanque.id} className="mb-2">
                  <ModeladoRefineriaTanque
                    tanque={tanque}
                    despachos={despachos}
                    refinacions={refinacions}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Línea de Despacho */}
        <div className="col-12 md:col-6 lg:col-2">
          <div className="card p-3 lg-h-fullScreen">
            <h1 className="text-2xl font-bold mb-3">Línea de Despacho</h1>

            {lineaDespachos.map((lineaDespacho) => (
              <div key={lineaDespacho.id} className="mb-2">
                <ModeladoRefineriaLineaDespacho
                  lineaDespacho={lineaDespacho}
                  despachos={despachos}
                />
              </div>
            ))}
          </div>
        </div>

        {/* {refinacions.map((refinacion) => (
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
        ))} */}
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
      <Dialog
        header="Detalles de Recepciones"
        visible={visibleDespachos}
        modal
        onHide={hideDialogDespacho}
        style={{ width: "80vw" }}
        breakpoints={{
          "960px": "75vw",
          "641px": "100vw",
        }}
      >
        {selectedContratoVenta && (
          <>
            <DataTable
              value={selectedContratoVenta.despachos}
              size="small"
              tableStyle={{ minWidth: "50rem" }}
              footer={
                <div className="p-2 flex justify-content-between">
                  <div>
                    <strong>Producto:</strong>{" "}
                    {selectedContratoVenta.producto.nombre}
                  </div>
                  <div>
                    <strong>Cantidad:</strong>{" "}
                    {selectedContratoVenta.cantidad.toLocaleString("de-DE")}{" "}
                    Bbls
                  </div>
                  <div>
                    <strong>Cantidad Recibida:</strong>{" "}
                    {selectedContratoVenta.cantidadDespachada.toLocaleString(
                      "de-DE"
                    )}{" "}
                    Bbls
                  </div>
                  <div>
                    <strong>Cantidad Faltante:</strong>{" "}
                    {selectedContratoVenta.cantidadFaltanteDespacho.toLocaleString(
                      "de-DE"
                    )}{" "}
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

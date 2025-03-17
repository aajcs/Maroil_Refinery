"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableFilterMeta,
} from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useRefineriaStore } from "@/store/refineriaStore";
import { deleteContrato, getContratos } from "@/app/api/contratoService";
import ContratoForm from "./ContratoForm";
import { Contrato } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";

const ContratoList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [contrato, setContrato] = useState<Contrato | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [contratoFormDialog, setContratoFormDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState<
    any[] | DataTableExpandedRows
  >([]);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchContratos();
  }, [activeRefineria]);

  const fetchContratos = async () => {
    try {
      const contratosDB = await getContratos();
      if (contratosDB && Array.isArray(contratosDB.contratos)) {
        console.log(contratosDB);
        const filteredContratos = contratosDB.contratos.filter(
          (contrato: Contrato) =>
            contrato.idRefineria.id === activeRefineria?.id
        );
        setContratos(filteredContratos);
      } else {
        console.error("La estructura de contratosDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los contratos:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideContratoFormDialog = () => {
    setContrato(null);
    setContratoFormDialog(false);
  };

  const handleDeleteContrato = async () => {
    if (contrato?.id) {
      await deleteContrato(contrato.id);
      setContratos(contratos.filter((val) => val.id !== contrato.id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Contrato Eliminada",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar la torre de destilación",
        life: 3000,
      });
    }
    setDeleteProductDialog(false);
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters({ global: { value, matchMode: FilterMatchMode.CONTAINS } });
    setGlobalFilterValue(value);
  };

  const renderHeader = () => (
    <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
      <span className="p-input-icon-left w-full sm:w-20rem flex-order-1 sm:flex-order-0">
        <i className="pi pi-search"></i>
        <InputText
          value={globalFilterValue}
          onChange={onGlobalFilterChange}
          placeholder="Búsqueda Global"
          className="w-full"
        />
      </span>
      <Button
        type="button"
        icon="pi pi-user-plus"
        label="Agregar Nuevo"
        outlined
        className="w-full sm:w-auto flex-order-0 sm:flex-order-1"
        onClick={() => setContratoFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: Contrato) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setContrato(rowData);
          setContratoFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => {
          setContrato(rowData);
          setDeleteProductDialog(true);
        }}
      />
    </>
  );

  const showToast = (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const rowExpansionTemplate = (data: any) => {
    return (
      <div className="orders-subtable">
        <h5>Items for {data.name}</h5>
        <DataTable value={data.idItems} responsiveLayout="scroll">
          <Column field="producto.nombre" header="Producto" sortable />
          <Column field="cantidad" header="Cantidad" sortable />
          <Column field="precioUnitario" header="Precio Unitario" sortable />
          <Column
            header="Total"
            body={(rowData: any) => rowData.cantidad * rowData.precioUnitario}
          />
          <Column field="brent" header="Brent" sortable />
          <Column field="convenio" header="Convenio" sortable />
          <Column field="montoTransporte" header="Monto Transporte" sortable />
          <Column field="gravedadAPI" header="Gravedad API" sortable />
          <Column field="azufre" header="Azufre" sortable />
          <Column field="viscosidad" header="Viscosidad" sortable />
          <Column field="densidad" header="Densidad" sortable />
          <Column field="contenidoAgua" header="Contenido de Agua" sortable />
          <Column field="origen" header="Origen" sortable />
          <Column field="temperatura" header="Temperatura" sortable />
          <Column field="presion" header="Presión" sortable />
        </DataTable>
      </div>
    );
  };
  return (
    <div className="card">
      <Toast ref={toast} />

      <DataTable
        ref={dt}
        value={contratos}
        header={renderHeader()}
        paginator
        rows={10}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay contratos disponibles"
      >
        <Column expander style={{ width: "3em" }} />
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        <Column field="tipoContrato" header="Tipo de Contrato" sortable />
        <Column field="numeroContrato" header="Número de Contrato" sortable />
        <Column field="descripcion" header="Descripción de Contrato" />
        <Column
          field="condicionesPago.tipo"
          header="Tipo de Condiciones de Pago"
        />
        <Column
          field="condicionesPago.plazo"
          header="Plazo de Condiciones de Pago"
        />
        <Column field="estadoEntrega" header="Estado de Entrega" />
        <Column field="estadoContrato" header="Estado de Contrato" />
        {/* <Column field="estado" header="Estado" /> */}
        <Column
          field="idContacto.nombre"
          header="Nombre de Contacto"
          sortable
        />
        <Column
          field="fechaInicio"
          header="Fecha de Inicio"
          body={(rowData: Contrato) => formatDateFH(rowData.fechaInicio)}
          sortable
        />
        <Column
          field="fechaFin"
          header="Fecha de Fin"
          body={(rowData: Contrato) => formatDateFH(rowData.fechaFin)}
          sortable
        />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: Contrato) => formatDateFH(rowData.createdAt)}
          sortable
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: Contrato) => formatDateFH(rowData.updatedAt)}
          sortable
        />
      </DataTable>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "450px" }}
        header="Confirmar"
        modal
        footer={
          <>
            <Button
              label="No"
              icon="pi pi-times"
              text
              onClick={hideDeleteProductDialog}
            />
            <Button
              label="Sí"
              icon="pi pi-check"
              text
              onClick={handleDeleteContrato}
            />
          </>
        }
        onHide={hideDeleteProductDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {contrato && (
            <span>
              ¿Estás seguro de que deseas eliminar el contrato de número{" "}
              <b>{contrato.numeroContrato}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={contratoFormDialog}
        style={{ width: "80vw" }}
        header={`${contrato ? "Editar" : "Agregar"} Contrato`}
        modal
        onHide={hideContratoFormDialog}
      >
        <ContratoForm
          contrato={contrato}
          hideContratoFormDialog={hideContratoFormDialog}
          contratos={contratos}
          setContratos={setContratos}
          setContrato={setContrato}
          showToast={showToast}
        />
      </Dialog>
    </div>
  );
};

export default ContratoList;

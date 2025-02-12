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

function ContratoList() {
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
        const filteredContratos = contratosDB.contratos.filter(
          (contrato: Contrato) =>
            contrato.id_refineria._id === activeRefineria?.id
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

  const rowExpansionTemplate = (data: any) => {
    return (
      <div className="orders-subtable">
        <h5>Items for {data.name}</h5>
        <DataTable value={data.id_items} responsiveLayout="scroll">
          <Column
            field="producto"
            header="Producto"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="cantidad"
            header="Cantidad"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="precioUnitario"
            header="Precio Unitario"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="gravedadAPI"
            header="Gravedad API"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="azufre"
            header="Azufre"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="viscosidad"
            header="Viscosidad"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="densidad"
            header="Densidad"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="contenidoAgua"
            header="Contenido de Agua"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="origen"
            header="Origen"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="temperatura"
            header="Temperatura"
            sortable
            style={{ width: "20%" }}
          />
          <Column
            field="presion"
            header="Presión"
            sortable
            style={{ width: "20%" }}
          />
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
        <Column
          field="numeroContrato"
          header="Número de Contrato"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="descripcion"
          header="Descripción de Contrato"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="condicionesPago.tipo"
          header="Tipo de Condiciones de Pago"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="condicionesPago.plazo"
          header="Plazo de Condiciones de Pago"
          sortable
          style={{ width: "20%" }}
        />

        <Column
          field="estadoEntrega"
          header="Estado de Entrega"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="estado_contrato"
          header="Estado de Contrato"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="estado"
          header="Estado"
          sortable
          style={{ width: "20%" }}
        />

        <Column
          field="id_refineria.nombre"
          header="Nombre de Refinería"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="id_contacto.nombre"
          header="Nombre de Contacto"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="fechaInicio"
          header="Fecha de Inicio"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="fechaFin"
          header="Fecha de Fin"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          sortable
          style={{ width: "20%" }}
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          sortable
          style={{ width: "20%" }}
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
              ¿Estás seguro de que deseas eliminar <b>{contrato.nombre}</b>?
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
        />
      </Dialog>
    </div>
  );
}

export default ContratoList;

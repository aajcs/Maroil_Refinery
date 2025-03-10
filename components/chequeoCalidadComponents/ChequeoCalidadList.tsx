"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useRefineriaStore } from "@/store/refineriaStore";
import ChequeoCalidadForm from "./ChequeoCalidadForm";

import { ChequeoCalidad } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";
import {
  deleteChequeoCalidad,
  getChequeoCalidads,
} from "@/app/api/chequeoCalidadService";

const ChequeoCalidadList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [chequeoCalidads, setChequeoCalidads] = useState<ChequeoCalidad[]>([]);
  const [chequeoCalidad, setChequeoCalidad] = useState<ChequeoCalidad | null>(
    null
  );
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [chequeoCalidadFormDialog, setChequeoCalidadFormDialog] =
    useState(false);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchChequeoCalidads();
  }, [activeRefineria]);

  const fetchChequeoCalidads = async () => {
    try {
      const chequeoCalidadsDB = await getChequeoCalidads();
      if (
        chequeoCalidadsDB &&
        Array.isArray(chequeoCalidadsDB.chequeoCalidads)
      ) {
        const filteredChequeoCalidads =
          chequeoCalidadsDB.chequeoCalidads.filter(
            (chequeoCalidad: ChequeoCalidad) =>
              chequeoCalidad.idRefineria.id === activeRefineria?.id
          );
        setChequeoCalidads(filteredChequeoCalidads);
      } else {
        console.error("La estructura de chequeoCalidadsDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los chequeoCalidads:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideChequeoCalidadFormDialog = () => {
    setChequeoCalidad(null);
    setChequeoCalidadFormDialog(false);
  };

  const handleDeleteChequeoCalidad = async () => {
    if (chequeoCalidad?.id) {
      await deleteChequeoCalidad(chequeoCalidad.id);
      setChequeoCalidads(
        chequeoCalidads.filter((val) => val.id !== chequeoCalidad.id)
      );
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "ChequeoCalidad Eliminada",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el chequeo de calidad",
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
        onClick={() => setChequeoCalidadFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: ChequeoCalidad) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setChequeoCalidad(rowData);
          setChequeoCalidadFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => {
          setChequeoCalidad(rowData);
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

  return (
    <div className="card">
      <Toast ref={toast} />

      <DataTable
        ref={dt}
        value={chequeoCalidads}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay chequeoCalidads disponibles"
      >
        <Column body={actionBodyTemplate} />
        <Column
          field="idRefineria.nombre"
          header="Nombre de la Refinería"
          sortable
        />
        <Column
          field="idProducto.nombre"
          header="Nombre del Producto"
          sortable
        />
        <Column field="idTanque.nombre" header="Nombre del Tanque" sortable />
        <Column field="idTorre.nombre" header="Nombre de la Torre" sortable />
        <Column field="operador" header="Operador" sortable />
        <Column
          field="fechaChequeo"
          header="Fecha de Chequeo"
          body={(rowData: ChequeoCalidad) => formatDateFH(rowData.fechaChequeo)}
        />
        <Column field="gravedadAPI" header="Gravedad API" sortable />
        <Column field="azufre" header="Azufre" sortable />
        <Column field="viscosidad" header="Viscosidad" sortable />
        <Column field="densidad" header="Densidad" sortable />
        <Column field="contenidoAgua" header="Contenido de Agua" sortable />
        <Column field="contenidoPlomo" header="Contenido de Plomo" sortable />
        <Column field="octanaje" header="Octanaje" sortable />
        <Column field="temperatura" header="Temperatura" sortable />
        <Column field="estado" header="Estado" sortable />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: ChequeoCalidad) => formatDateFH(rowData.createdAt)}
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: ChequeoCalidad) => formatDateFH(rowData.updatedAt)}
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
              onClick={handleDeleteChequeoCalidad}
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
          {chequeoCalidad && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{chequeoCalidad.id}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={chequeoCalidadFormDialog}
        style={{ width: "50vw" }}
        header={`${chequeoCalidad ? "Editar" : "Agregar"} ChequeoCalidad`}
        modal
        onHide={hideChequeoCalidadFormDialog}
      >
        <ChequeoCalidadForm
          chequeoCalidad={chequeoCalidad}
          hideChequeoCalidadFormDialog={hideChequeoCalidadFormDialog}
          chequeoCalidads={chequeoCalidads}
          setChequeoCalidads={setChequeoCalidads}
          setChequeoCalidad={setChequeoCalidad}
          showToast={showToast}
        />
      </Dialog>
    </div>
  );
};

export default ChequeoCalidadList;

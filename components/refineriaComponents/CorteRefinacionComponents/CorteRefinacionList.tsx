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

import { CorteRefinacion } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";

import {
  deleteCorteRefinacion,
  getCorteRefinacions,
} from "@/app/api/corteRefinacionService";
import CorteRefinacionForm from "./CorteRefinacionForm";

const CorteRefinacionList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [corteRefinacions, setCorteRefinacions] = useState<CorteRefinacion[]>(
    []
  );
  const [corteRefinacion, setCorteRefinacion] =
    useState<CorteRefinacion | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [formDialog, setFormDialog] = useState(false);

  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchCorteRefinacions();
  }, [activeRefineria]);

  const fetchCorteRefinacions = async () => {
    try {
      const corteRefinacionsDB = await getCorteRefinacions();
      if (
        corteRefinacionsDB &&
        Array.isArray(corteRefinacionsDB.corteRefinacions)
      ) {
        const filteredCorteRefinacions =
          corteRefinacionsDB.corteRefinacions.filter(
            (corte: CorteRefinacion) =>
              corte.idRefineria.id === activeRefineria?.id
          );
        setCorteRefinacions(filteredCorteRefinacions);
      } else {
        console.error("La estructura de corteRefinacionsDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los cortes de refinación:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteDialog = () => setDeleteDialog(false);
  const hideFormDialog = () => {
    setCorteRefinacion(null);
    setFormDialog(false);
  };

  const handleDeleteCorteRefinacion = async () => {
    if (corteRefinacion?.id) {
      await deleteCorteRefinacion(corteRefinacion.id);
      setCorteRefinacions(
        corteRefinacions.filter((val) => val.id !== corteRefinacion.id)
      );
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Corte de Refinación Eliminado",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el corte de refinación",
        life: 3000,
      });
    }
    setDeleteDialog(false);
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
        onClick={() => setFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: CorteRefinacion) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setCorteRefinacion(rowData);
          setFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        onClick={() => {
          setCorteRefinacion(rowData);
          setDeleteDialog(true);
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
        value={corteRefinacions}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay cortes de refinación disponibles"
      >
        {/* Acciones */}
        <Column body={actionBodyTemplate} />

        {/* Número de Corte de Refinación */}
        <Column
          field="numeroCorteRefinacion"
          header="Número de Corte"
          sortable
        />

        {/* Torres de Destilación */}
        <Column
          header="Torres de Destilación"
          body={(rowData: CorteRefinacion) =>
            rowData.corteTorre.map((torre) => (
              <div key={torre._id}>
                <strong>{torre.idTorre.nombre}</strong>
                <ul>
                  {torre.detalles.map((detalle) => (
                    <li key={detalle._id}>
                      Producto: {detalle.idProducto.nombre}, Tanque:{" "}
                      {detalle.idTanque?.nombre}, Cantidad: {detalle.cantidad}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          }
        />

        {/* Fecha de Corte */}
        <Column
          field="fechaCorte"
          header="Fecha de Corte"
          sortable
          body={(rowData: CorteRefinacion) =>
            rowData.fechaCorte ? formatDateFH(rowData.fechaCorte) : "Sin Fecha"
          }
        />

        {/* Observación */}
        <Column field="observacion" header="Observación" sortable />

        {/* Operador */}
        <Column field="idOperador.nombre" header="Operador" sortable />
        {/* 
        Estado
        <Column field="estado" header="Estado" sortable />

        Fecha de Creación
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: CorteRefinacion) => formatDateFH(rowData.createdAt)}
        />

        Última Actualización
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: CorteRefinacion) => formatDateFH(rowData.updatedAt)}
        /> */}
      </DataTable>

      {/* Diálogo para Confirmar Eliminación */}
      <Dialog
        visible={deleteDialog}
        style={{ width: "450px" }}
        header="Confirmar"
        modal
        footer={
          <>
            <Button
              label="No"
              icon="pi pi-times"
              text
              onClick={hideDeleteDialog}
            />
            <Button
              label="Sí"
              icon="pi pi-check"
              text
              onClick={handleDeleteCorteRefinacion}
            />
          </>
        }
        onHide={hideDeleteDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {corteRefinacion && (
            <span>
              ¿Estás seguro de que deseas eliminar el corte de refinación con el
              número <b>{corteRefinacion.numeroCorteRefinacion}</b>?
            </span>
          )}
        </div>
      </Dialog>

      {/* Diálogo para Formulario de Corte de Refinación */}
      <Dialog
        visible={formDialog}
        style={{ width: "50vw" }}
        header={`${corteRefinacion ? "Editar" : "Agregar"} Corte de Refinación`}
        modal
        onHide={hideFormDialog}
      >
        <CorteRefinacionForm
          corteRefinacion={corteRefinacion}
          hideCorteRefinacionFormDialog={hideFormDialog}
          corteRefinacions={corteRefinacions}
          setCorteRefinacions={setCorteRefinacions}
          showToast={showToast}
        />
      </Dialog>
    </div>
  );
};

export default CorteRefinacionList;

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
import ChequeoCantidadForm from "./ChequeoCantidadForm";

import { ChequeoCantidad } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";
import {
  deleteChequeoCantidad,
  getChequeoCantidads,
} from "@/app/api/chequeoCantidadService";
import CustomActionButtons from "@/components/common/CustomActionButtons";

const ChequeoCantidadList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [chequeoCantidads, setChequeoCantidads] = useState<ChequeoCantidad[]>(
    []
  );
  const [chequeoCantidad, setChequeoCantidad] =
    useState<ChequeoCantidad | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [chequeoCantidadFormDialog, setChequeoCantidadFormDialog] =
    useState(false);
  const [onDuplicate, setOnDuplicate] = useState(false);
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchChequeoCantidads();
  }, [activeRefineria]);

  const fetchChequeoCantidads = async () => {
    try {
      const chequeoCantidadsDB = await getChequeoCantidads();
      if (
        chequeoCantidadsDB &&
        Array.isArray(chequeoCantidadsDB.chequeoCantidads)
      ) {
        const filteredChequeoCantidads =
          chequeoCantidadsDB.chequeoCantidads.filter(
            (chequeoCantidad: ChequeoCantidad) =>
              chequeoCantidad.idRefineria.id === activeRefineria?.id
          );
        setChequeoCantidads(filteredChequeoCantidads);
      } else {
        console.error("La estructura de chequeoCantidadsDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los chequeoCantidads:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideChequeoCantidadFormDialog = () => {
    setChequeoCantidad(null);
    setOnDuplicate(false);
    setChequeoCantidadFormDialog(false);
  };

  const handleDeleteChequeoCantidad = async () => {
    if (chequeoCantidad?.id) {
      await deleteChequeoCantidad(chequeoCantidad.id);
      setChequeoCantidads(
        chequeoCantidads.filter((val) => val.id !== chequeoCantidad.id)
      );
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Chequeo de Cantidad Eliminada",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el chequeo de cantidad",
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
        onClick={() => setChequeoCantidadFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: ChequeoCantidad) => (
    <CustomActionButtons
      rowData={rowData}
      onEdit={(data) => {
        setChequeoCantidad(data);
        setChequeoCantidadFormDialog(true);
      }}
      onDelete={(data) => {
        setChequeoCantidad(data);
        setDeleteProductDialog(true);
      }}
      onDuplicate={(data) => {
        setChequeoCantidad(data);
        setOnDuplicate(true);
        setChequeoCantidadFormDialog(true);
      }}
    />
  );

  const showToast = (
    severity: "success" | "error" | "info" | "warn",
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
        value={chequeoCantidads}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay chequeos de cantidad disponibles"
      >
        <Column body={actionBodyTemplate} />
        <Column
          field="numeroChequeoCantidad"
          header="Número de Chequeo"
          sortable
        />
        <Column field="aplicar.tipo" header="Operacion" sortable />
        <Column
          header="Referencia"
          body={(rowData: ChequeoCantidad) => {
            const referencia = rowData.aplicar?.idReferencia;

            if (!referencia) {
              return "Sin Referencia";
            }

            // Renderizar según el tipo de referencia
            switch (rowData.aplicar?.tipo) {
              case "Recepcion":
                return `ID Guía: ${referencia.idGuia}`;
              case "Tanque":
                return `Nombre: ${referencia.nombre}`;
              case "Despacho":
                return `ID Guía: ${referencia.idGuia}`;
              default:
                return "Tipo Desconocido";
            }
          }}
        />
        <Column field="idProducto.nombre" header="Producto" sortable />
        <Column field="idOperador.nombre" header="Operador" sortable />
        <Column
          field="fechaChequeo"
          header="Fecha de Chequeo"
          body={(rowData: ChequeoCantidad) =>
            formatDateFH(rowData.fechaChequeo)
          }
          sortable
        />
        <Column field="cantidad" header="Cantidad" sortable />

        <Column field="estado" header="Estado" sortable />
        {/* <Column
          field="createdAt"
          header="Creado en"
          body={(rowData: ChequeoCantidad) => formatDateFH(rowData.createdAt)}
          sortable
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: ChequeoCantidad) => formatDateFH(rowData.updatedAt)}
          sortable
        /> */}
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
              onClick={handleDeleteChequeoCantidad}
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
          {chequeoCantidad && (
            <span>
              ¿Estás seguro de que deseas eliminar el chequeo de cantidad con el
              número de chequeo <b>{chequeoCantidad.numeroChequeoCantidad}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={chequeoCantidadFormDialog}
        style={{ width: "70vw" }}
        header={`${chequeoCantidad ? "Editar" : "Agregar"} Chequeo de Cantidad`}
        modal
        onHide={hideChequeoCantidadFormDialog}
        content={() => (
          <ChequeoCantidadForm
            chequeoCantidad={chequeoCantidad}
            hideChequeoCantidadFormDialog={hideChequeoCantidadFormDialog}
            chequeoCantidads={chequeoCantidads}
            setChequeoCantidads={setChequeoCantidads}
            setChequeoCantidad={setChequeoCantidad}
            showToast={showToast}
            onDuplicate={onDuplicate}
            setOnDuplicate={setOnDuplicate}
          />
        )}
      >
        {/* <ChequeoCantidadForm
          chequeoCantidad={chequeoCantidad}
          hideChequeoCantidadFormDialog={hideChequeoCantidadFormDialog}
          chequeoCantidads={chequeoCantidads}
          setChequeoCantidads={setChequeoCantidads}
          setChequeoCantidad={setChequeoCantidad}
          showToast={showToast}
        /> */}
      </Dialog>
    </div>
  );
};

export default ChequeoCantidadList;

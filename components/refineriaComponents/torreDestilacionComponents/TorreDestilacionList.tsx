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
import {
  deleteTorreDestilacion,
  getTorresDestilacion,
} from "@/app/api/torreDestilacionService";
import TorreDestilacionForm from "./TorreDestilacionForm";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Material, TorreDestilacion } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";

const TorreDestilacionList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [torresDestilacion, setTorresDestilacion] = useState<
    TorreDestilacion[]
  >([]);
  const [torreDestilacion, setTorreDestilacion] =
    useState<TorreDestilacion | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [torreDestilacionFormDialog, setTorreDestilacionFormDialog] =
    useState(false);
  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchTorresDestilacion();
  }, [activeRefineria]);

  const fetchTorresDestilacion = async () => {
    try {
      const torresDestilacionDB = await getTorresDestilacion();
      if (torresDestilacionDB && Array.isArray(torresDestilacionDB.torres)) {
        const filteredTorresDestilacion = torresDestilacionDB.torres.filter(
          (torre: TorreDestilacion) =>
            torre.idRefineria.id === activeRefineria?.id
        );
        setTorresDestilacion(filteredTorresDestilacion);
      } else {
        console.error("La estructura de torresDestilacionDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener las torres de destilación:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideTorreDestilacionFormDialog = () => {
    setTorreDestilacion(null);
    setTorreDestilacionFormDialog(false);
  };

  const handleDeleteTorreDestilacion = async () => {
    if (torreDestilacion?.id) {
      await deleteTorreDestilacion(torreDestilacion.id);
      setTorresDestilacion(
        torresDestilacion.filter((val) => val.id !== torreDestilacion.id)
      );
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Torre Destilacion Eliminada",
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
  // Mostrar notificaciones Toast
  const showToast = (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
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
        onClick={() => setTorreDestilacionFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: TorreDestilacion) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setTorreDestilacion(rowData);
          setTorreDestilacionFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        onClick={() => {
          setTorreDestilacion(rowData);
          setDeleteProductDialog(true);
        }}
      />
    </>
  );
  const materialBodyTemplate = (rowData: TorreDestilacion) => {
    return (
      <div>
        {Array.isArray(rowData.material) &&
          rowData.material.map((material, index) => (
            <span
              key={index}
              className={"customer-badge"}
              style={{ backgroundColor: `#${material.idProducto?.color}50` }}
            >
              {material.idProducto?.nombre}
            </span>
          ))}
      </div>
    );
  };

  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        ref={dt}
        value={torresDestilacion}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay torres de destilación disponibles"
        className="p-datatable-sm"
      >
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        <Column field="nombre" header="Nombre" />
        {/* <Column field="ubicacion" header="Ubicación" /> */}
        <Column
          field="material"
          header="Material"
          body={materialBodyTemplate}
        />
        {/* <Column field="estado" header="Estado" /> */}
        {/* <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: TorreDestilacion) => formatDateFH(rowData.createdAt)}
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: TorreDestilacion) => formatDateFH(rowData.updatedAt)}
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
              onClick={handleDeleteTorreDestilacion}
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
          {torreDestilacion && (
            <span>
              ¿Estás seguro de que deseas eliminar{" "}
              <b>{torreDestilacion.nombre}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={torreDestilacionFormDialog}
        style={{ width: "850px" }}
        header={`${
          torreDestilacion ? "Editar" : "Agregar"
        } Torre de Destilación`}
        modal
        onHide={hideTorreDestilacionFormDialog}
        content={() => (
          <TorreDestilacionForm
            torreDestilacion={torreDestilacion}
            hideTorreDestilacionFormDialog={hideTorreDestilacionFormDialog}
            torresDestilacion={torresDestilacion}
            setTorresDestilacion={setTorresDestilacion}
            setTorreDestilacion={setTorreDestilacion}
            showToast={showToast}
          />
        )}
      ></Dialog>
    </div>
  );
};

export default TorreDestilacionList;

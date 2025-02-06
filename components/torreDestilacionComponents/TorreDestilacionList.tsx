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

interface TorreDestilacion {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  id_refineria: {
    _id: string | undefined;
    id: string;
  };
}

function TorreDestilacionList() {
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
            torre.id_refineria._id === activeRefineria?.id
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
        severity="warning"
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
              className={`customer-badge status-${material.nombre
                .toLowerCase()
                .replace(/[()]/g, "")
                .replace(/\s+/g, "-")}`}
            >
              {material.nombre}
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
      >
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        <Column
          field="nombre"
          header="Nombre"
          sortable
          style={{ width: "25%" }}
        />
        <Column
          field="ubicacion"
          header="Ubicación"
          sortable
          style={{ width: "25%" }}
        />
        <Column
          field="material"
          header="Material"
          sortable
          style={{ width: "25%" }}
          body={materialBodyTemplate}
        />
        <Column
          field="estado"
          header="Estado"
          sortable
          style={{ width: "25%" }}
        />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          sortable
          style={{ width: "25%" }}
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          sortable
          style={{ width: "25%" }}
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
        header={`${torreDestilacion ? "Editar" : "Agregar"} Torre Destilacion`}
        modal
        onHide={hideTorreDestilacionFormDialog}
      >
        <TorreDestilacionForm
          torreDestilacion={torreDestilacion}
          hideTorreDestilacionFormDialog={hideTorreDestilacionFormDialog}
          torresDestilacion={torresDestilacion}
          setTorresDestilacion={setTorresDestilacion}
          setTorreDestilacion={setTorreDestilacion}
        />
      </Dialog>
    </div>
  );
}

export default TorreDestilacionList;

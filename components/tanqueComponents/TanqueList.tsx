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
import TanqueForm from "./TanqueForm";
import { useRefineriaStore } from "@/store/refineriaStore";
import { getTanques, deleteTanque } from "@/app/api/tanqueService";
import { Tanque } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";

const TanqueList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [tanque, setTanque] = useState<Tanque | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [tanqueFormDialog, setTanqueFormDialog] = useState(false);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchTanques();
  }, [activeRefineria]);

  const fetchTanques = async () => {
    try {
      const tanquesDB = await getTanques();
      if (tanquesDB && Array.isArray(tanquesDB.tanques)) {
        const filteredTanques = tanquesDB.tanques.filter(
          (tanque: Tanque) => tanque.idRefineria.id === activeRefineria?.id
        );
        setTanques(filteredTanques);
      } else {
        console.error("La estructura de tanquesDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los tanques:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideTanqueFormDialog = () => {
    setTanque(null);
    setTanqueFormDialog(false);
  };

  const handleDeleteTanque = async () => {
    if (tanque?.id) {
      await deleteTanque(tanque.id);
      setTanques(tanques.filter((val) => val.id !== tanque.id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Tanque Eliminada",
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
        onClick={() => setTanqueFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: Tanque) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setTanque(rowData);
          setTanqueFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => {
          setTanque(rowData);
          setDeleteProductDialog(true);
        }}
      />
    </>
  );
  const productoBodyTemplate = (rowData: Tanque) => {
    const { idProducto } = rowData;
    return (
      <div>
        <span
          className={"customer-badge"}
          style={{ backgroundColor: `#${idProducto?.color}50` }}
        >
          {idProducto?.nombre}
        </span>
      </div>
    );
  };
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
        value={tanques}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay tanques disponibles"
      >
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="ubicacion" header="Ubicación" sortable />

        <Column
          field="idProducto.nombre"
          header="Producto"
          body={productoBodyTemplate}
        />
        <Column
          field="almacenamientoMateriaPrimaria"
          header="Tipo Almacenamiento"
        />
        <Column field="estado" header="Estado" sortable />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: Tanque) => formatDateFH(rowData.createdAt)}
          sortable
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: Tanque) => formatDateFH(rowData.updatedAt)}
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
              onClick={handleDeleteTanque}
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
          {tanque && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{tanque.nombre}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={tanqueFormDialog}
        style={{ width: "850px" }}
        header={`${tanque ? "Editar" : "Agregar"} Tanque`}
        modal
        onHide={hideTanqueFormDialog}
      >
        <TanqueForm
          tanque={tanque}
          hideTanqueFormDialog={hideTanqueFormDialog}
          tanques={tanques}
          setTanques={setTanques}
          setTanque={setTanque}
          showToast={showToast}
        />
      </Dialog>
    </div>
  );
};

export default TanqueList;

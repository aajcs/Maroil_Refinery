"use client";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { deleteUser } from "@/app/api/userService";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import RefineriaForm from "./RefineriaForm";
import { deleteRefineria, getRefinerias } from "@/app/api/refineriaService";

function RefineriaList() {
  interface Refineria {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
    acceso: string;
    estado: string;
  }

  const [refinerias, setRefinerias] = useState<Refineria[]>([]);
  const [refineria, setRefineria] = useState<Refineria | null>(null);

  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [refineriaFormDialog, setRefineriaFormDialog] = useState(false);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);
  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const refineriasDB = await getRefinerias();
      const { refinerias } = refineriasDB;
      setRefinerias(refinerias);
      setLoading(false);
      initFilters();
    };

    fetchUsers();
  }, []);
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideRefineriaFormDialog = () => {
    setRefineriaFormDialog(false);
  };
  const deleteProduct = async () => {
    let _refinerias = refinerias.filter((val) => val.id !== refineria?.id);
    if (refineria?.id) {
      const refineriaElminado = await deleteRefineria(refineria.id);
      console.log(refineriaElminado);
      setRefinerias(_refinerias);
      setDeleteProductDialog(false);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Refineria Eliminado",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el refineria",
        life: 3000,
      });
    }
    // setRefineria(emptyProduct);
  };
  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    let _filters = { ...filters };
    (_filters["global"] as any).value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };
  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        text
        onClick={hideDeleteProductDialog}
      />
      <Button label="Yes" icon="pi pi-check" text onClick={deleteProduct} />
    </>
  );
  const renderHeader = () => {
    return (
      <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
        {/* <div>
          {refinerias.length > 0 ? (
            <pre>{JSON.stringify(refinerias, null, 2)}</pre>
          ) : (
            <p>No hay refinerias disponibles</p>
          )}
        </div> */}
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
          onClick={() => router.push("/profile/create")}
        />
      </div>
    );
  };

  const header = renderHeader();

  const editRefineria = (refineria: any) => {
    setRefineria(refineria);
    setRefineriaFormDialog(true);
    console.log(refineria);
  };
  const confirmDeleteProduct = (refineria: any) => {
    setRefineria(refineria);
    setDeleteProductDialog(true);
    console.log(refineria);
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          severity="success"
          className="mr-2"
          onClick={() => editRefineria(rowData)}
        />
        <Button
          icon="pi pi-trash"
          severity="warning"
          rounded
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </>
    );
  };
  return (
    <div className="card">
      <Toast ref={toast} />
      <DataTable
        ref={dt}
        value={refinerias}
        header={header}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
      >
        <Column
          body={actionBodyTemplate}
          headerStyle={{ minWidth: "10rem" }}
        ></Column>
        <Column
          field="img"
          header="Imagen"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="nombre"
          header="Nombre"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="ubicacion"
          header="Ubicación"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="nit"
          header="Identificación"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>

        <Column
          field="estado"
          header="Estado"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>
      </DataTable>

      <Dialog
        visible={deleteProductDialog}
        style={{ width: "450px" }}
        header="Confirmar"
        modal
        footer={deleteProductDialogFooter}
        onHide={hideDeleteProductDialog}
      >
        <div className="flex align-items-center justify-content-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {refineria && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{refineria.nombre}</b>{" "}
              <b>{refineria.correo}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={refineriaFormDialog}
        style={{ width: "850px" }}
        header="Editar Refineria"
        modal
        // footer={deleteProductDialogFooter}
        onHide={hideRefineriaFormDialog}
      >
        <RefineriaForm
          refineria={refineria}
          hideRefineriaFormDialog={hideRefineriaFormDialog}
          refinerias={refinerias}
          setRefinerias={setRefinerias}
        />
      </Dialog>
    </div>
  );
}

export default RefineriaList;

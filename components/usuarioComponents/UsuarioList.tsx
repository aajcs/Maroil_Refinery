"use client";
import { useRouter } from "next/navigation";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import React, { useEffect, useRef, useState } from "react";
import { deleteUser, getUsers } from "@/app/api/userService";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import UsuarioForm from "./UsuarioForm";

function UsuarioList() {
  interface Usuario {
    id: string;
    nombre: string;
    correo: string;
    rol: string;
    acceso: string;
    estado: string;
  }

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [usuarioFormDialog, setUsuarioFormDialog] = useState(false);

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
      const usuariosDB = await getUsers();
      const { usuarios } = usuariosDB;
      setUsuarios(usuarios);
      setLoading(false);
      initFilters();
    };

    fetchUsers();
  }, []);
  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };
  const hideUsuarioFormDialog = () => {
    setUsuarioFormDialog(false);
  };
  const deleteProduct = async () => {
    let _usuarios = usuarios.filter((val) => val.id !== usuario?.id);
    if (usuario?.id) {
      const usuarioElminado = await deleteUser(usuario.id);
      console.log(usuarioElminado);
      setUsuarios(_usuarios);
      setDeleteProductDialog(false);
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Usuario Eliminado",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo eliminar el usuario",
        life: 3000,
      });
    }
    // setUsuario(emptyProduct);
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
          {usuarios.length > 0 ? (
            <pre>{JSON.stringify(usuarios, null, 2)}</pre>
          ) : (
            <p>No hay usuarios disponibles</p>
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

  const editUsuario = (usuario: any) => {
    setUsuario(usuario);
    setUsuarioFormDialog(true);
    console.log(usuario);
  };
  const confirmDeleteProduct = (usuario: any) => {
    setUsuario(usuario);
    setDeleteProductDialog(true);
    console.log(usuario);
  };
  const actionBodyTemplate = (rowData: any) => {
    return (
      <>
        <Button
          icon="pi pi-pencil"
          rounded
          severity="success"
          className="mr-2"
          onClick={() => editUsuario(rowData)}
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
        value={usuarios}
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
          field="nombre"
          header="Nombre"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="correo"
          header="Correo"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="rol"
          header="Rol"
          sortable
          headerClassName="white-space-nowrap"
          style={{ width: "25%" }}
        ></Column>
        <Column
          field="acceso"
          header="Acceso"
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
          {usuario && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{usuario.nombre}</b>{" "}
              <b>{usuario.correo}</b>?
            </span>
          )}
        </div>
      </Dialog>
      <Dialog
        visible={usuarioFormDialog}
        style={{ width: "850px" }}
        header="Editar Usuario"
        modal
        // footer={deleteProductDialogFooter}
        onHide={hideUsuarioFormDialog}
      >
        <UsuarioForm
          usuario={usuario}
          hideUsuarioFormDialog={hideUsuarioFormDialog}
          usuarios={usuarios}
          setUsuarios={setUsuarios}
        />
      </Dialog>
    </div>
  );
}

export default UsuarioList;

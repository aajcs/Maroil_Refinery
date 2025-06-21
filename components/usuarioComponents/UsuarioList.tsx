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
import CustomActionButtons from "../common/CustomActionButtons";
import AuditHistoryDialog from "../common/AuditHistoryDialog";
import { Usuario } from "@/libs/interfaces";

const UsuarioList = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [usuarioFormDialog, setUsuarioFormDialog] = useState(false);
  const [auditDialogVisible, setAuditDialogVisible] = useState(false);
  const [selectedAuditUsuario, setSelectedAuditUsuario] =
    useState<Usuario | null>(null);
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

  const actionBodyTemplate = (rowData: any) => {
    return (
      <CustomActionButtons
        rowData={rowData}
        onInfo={(data) => {
          setSelectedAuditUsuario(data);

          setAuditDialogVisible(true);
        }}
        onEdit={(data) => {
          setUsuario(rowData);
          data;
          setUsuarioFormDialog(true);
        }}
        onDelete={(data) => {
          setUsuario(rowData);
          data;
          setDeleteProductDialog(true);
        }}
      />
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
        <Column field="nombre" header="Nombre" sortable></Column>
        <Column field="correo" header="Correo" sortable></Column>
        <Column field="rol" header="Rol" sortable></Column>
        <Column field="acceso" header="Acceso" sortable></Column>
        <Column field="estado" header="Estado" sortable></Column>
        <Column
          field="idRefineria"
          header="Refinerías"
          body={(rowData: Usuario) =>
            rowData.idRefineria && rowData.idRefineria.length > 0
              ? rowData.idRefineria
                  .map((refineria) => refineria.nombre)
                  .join(", ")
              : "Sin acceso"
          }
          headerClassName="white-space-nowrap"
          style={{ minWidth: "15rem" }}
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
      </Dialog>{" "}
      <AuditHistoryDialog
        visible={auditDialogVisible}
        onHide={() => setAuditDialogVisible(false)}
        title={
          <div className="mb-2 text-center md:text-left">
            <div className="border-bottom-2 border-primary pb-2">
              <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
                <i className="pi pi-check-circle mr-3 text-primary text-3xl"></i>
                Historial - {selectedAuditUsuario?.nombre}
              </h2>
            </div>
          </div>
        }
        createdBy={selectedAuditUsuario?.createdBy!}
        createdAt={selectedAuditUsuario?.createdAt!}
        historial={selectedAuditUsuario?.historial}
      />
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
};

export default UsuarioList;

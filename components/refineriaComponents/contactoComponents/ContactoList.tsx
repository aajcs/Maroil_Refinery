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
import { deleteContacto, getContactos } from "@/app/api/contactoService";
import ContactoForm from "./ContactoForm";
import { formatDateFH } from "@/utils/dateUtils";
import { Contacto } from "@/libs/interfaces/contratoInterface";

const ContactoList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [contacto, setContacto] = useState<Contacto | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [contactoFormDialog, setContactoFormDialog] = useState(false);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchContactos();
  }, [activeRefineria]);

  const fetchContactos = async () => {
    try {
      const contactosDB = await getContactos();
      if (contactosDB && Array.isArray(contactosDB.contactos)) {
        const filteredContactos = contactosDB.contactos.filter(
          (contacto: Contacto) =>
            contacto.idRefineria.id === activeRefineria?.id
        );
        setContactos(filteredContactos);
      } else {
        console.error("La estructura de contactosDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los contactos:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideContactoFormDialog = () => {
    setContacto(null);
    setContactoFormDialog(false);
  };

  const handleDeleteContacto = async () => {
    if (contacto?.id) {
      await deleteContacto(contacto.id);
      setContactos(contactos.filter((val) => val.id !== contacto.id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Contacto Eliminada",
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
        onClick={() => setContactoFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: Contacto) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setContacto(rowData);
          setContactoFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        onClick={() => {
          setContacto(rowData);
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
        value={contactos}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay contactos disponibles"
      >
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        <Column field="nombre" header="Razon Social" />
        <Column field="identificacionFiscal" header="NIT" />
        <Column field="correo" header="Correo" />
        <Column field="ciudad" header="Ciudad" />
        <Column field="direccion" header="Dirección" />
        <Column field="telefono" header="Teléfono" />
        <Column field="tipo" header="Tipo" sortable />

        <Column field="representanteLegal" header="Representante Legal" />
        {/* <Column
          field="estado"
          header="Estado"
        
          style={{ width: "20%" }}
        />
        <Column
          field="eliminado"
          header="Eliminado"
        
          style={{ width: "20%" }}
        />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: Contacto) => formatDateFH(rowData.createdAt)}
        
          style={{ width: "20%" }}
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: Contacto) => formatDateFH(rowData.updatedAt)}
        
          style={{ width: "20%" }}
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
              onClick={handleDeleteContacto}
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
          {contacto && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{contacto.nombre}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={contactoFormDialog}
        style={{ width: "850px" }}
        header={`${contacto ? "Editar" : "Agregar"} Contacto`}
        modal
        onHide={hideContactoFormDialog}
        content={
          <ContactoForm
            contacto={contacto}
            hideContactoFormDialog={hideContactoFormDialog}
            contactos={contactos}
            setContactos={setContactos}
            setContacto={setContacto}
            showToast={showToast}
          />
        }
      ></Dialog>
    </div>
  );
};

export default ContactoList;

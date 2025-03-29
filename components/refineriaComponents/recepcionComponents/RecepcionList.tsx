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
import RecepcionForm from "./RecepcionForm";
import { deleteRecepcion, getRecepcions } from "@/app/api/recepcionService";
import { Recepcion } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";

const RecepcionList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [recepcions, setRecepcions] = useState<Recepcion[]>([]);
  const [recepcion, setRecepcion] = useState<Recepcion | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [recepcionFormDialog, setRecepcionFormDialog] = useState(false);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchRecepcions();
  }, [activeRefineria]);

  const fetchRecepcions = async () => {
    try {
      const recepcionsDB = await getRecepcions();
      if (recepcionsDB && Array.isArray(recepcionsDB.recepcions)) {
        const filteredRecepcions = recepcionsDB.recepcions.filter(
          (recepcion: Recepcion) =>
            recepcion.idRefineria.id === activeRefineria?.id
        );
        setRecepcions(filteredRecepcions);
      } else {
        console.error("La estructura de recepcionsDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los recepcions:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideRecepcionFormDialog = () => {
    setRecepcion(null);
    setRecepcionFormDialog(false);
  };

  const handleDeleteRecepcion = async () => {
    if (recepcion?.id) {
      await deleteRecepcion(recepcion.id);
      setRecepcions(recepcions.filter((val) => val.id !== recepcion.id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Recepcion Eliminada",
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
        onClick={() => setRecepcionFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: Recepcion) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setRecepcion(rowData);
          setRecepcionFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="warning"
        rounded
        onClick={() => {
          setRecepcion(rowData);
          setDeleteProductDialog(true);
        }}
      />
    </>
  );

  return (
    <div className="card">
      <Toast ref={toast} />

      <DataTable
        ref={dt}
        value={recepcions}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay recepcions disponibles"
      >
        <Column body={actionBodyTemplate} />
        <Column field="idGuia" header="ID de la Guía" sortable />
        <Column field="placa" header="Placa" />
        <Column field="nombreChofer" header="Nombre del Chofer" sortable />
        <Column field="apellidoChofer" header="Apellido del Chofer" sortable />
        <Column
          field="idContrato.numeroContrato"
          header="Número de Contrato"
          sortable
        />
        <Column
          field="idContratoItems.producto.nombre"
          header="Nombre del Producto"
        />
        <Column
          field="cantidadEnviada"
          header="Cantidad Enviada"
          body={(rowData: Recepcion) =>
            ` ${Number(rowData.cantidadEnviada).toLocaleString("de-DE")}Bbl`
          }
        />
        <Column
          field="cantidadRecibida"
          header="Cantidad Recibida"
          body={(rowData: Recepcion) =>
            ` ${Number(rowData.cantidadRecibida).toLocaleString("de-DE")}Bbl`
          }
        />

        <Column field="idLinea.nombre" header="Nombre de la Línea" sortable />
        <Column field="idTanque.nombre" header="ID del Tanque" sortable />
        <Column
          field="fechaInicio"
          header="Fecha de Inicio"
          body={(rowData: Recepcion) => formatDateFH(rowData.fechaInicio)}
        />
        <Column
          field="fechaFin"
          header="Fecha de Fin"
          body={(rowData: Recepcion) => formatDateFH(rowData.fechaFin)}
        />

        <Column
          field="fechaInicioRecepcion"
          header="Fecha de Fin"
          body={(rowData: Recepcion) =>
            formatDateFH(rowData.fechaInicioRecepcion)
          }
        />
        <Column
          field="fechaFinRecepcion"
          header="Fecha de Fin"
          body={(rowData: Recepcion) => formatDateFH(rowData.fechaFinRecepcion)}
        />
        <Column
          field="fechaSalida"
          header="Fecha de Fin"
          body={(rowData: Recepcion) => formatDateFH(rowData.fechaSalida)}
        />
        <Column
          field="fechaLlegada"
          header="Fecha de Fin"
          body={(rowData: Recepcion) => formatDateFH(rowData.fechaLlegada)}
        />

        <Column field="estadoRecepcion" header="Estado de la Recepcion" />
        <Column field="estadoCarga" header="Estado de la Carga" />
        <Column field="estado" header="Estado" />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: Recepcion) => formatDateFH(rowData.createdAt)}
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: Recepcion) => formatDateFH(rowData.updatedAt)}
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
              onClick={handleDeleteRecepcion}
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
          {recepcion && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{recepcion.idGuia}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={recepcionFormDialog}
        style={{ width: "50vw" }}
        header={`${recepcion ? "Editar" : "Agregar"} Recepción`}
        modal
        onHide={hideRecepcionFormDialog}
      >
        <RecepcionForm
          recepcion={recepcion}
          hideRecepcionFormDialog={hideRecepcionFormDialog}
          recepcions={recepcions}
          setRecepcions={setRecepcions}
          setRecepcion={setRecepcion}
        />
      </Dialog>
    </div>
  );
};

export default RecepcionList;

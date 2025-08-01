"use client";
import React, { useEffect, useRef, useState } from "react";
import { FilterMatchMode } from "primereact/api";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, DataTableFilterMeta } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { useRefineriaStore } from "@/store/refineriaStore";
import { deleteRecepcion, getRecepcions } from "@/app/api/recepcionService";
import { Recepcion } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";
import RecepcionForm from "./RecepcionForm";
import CustomActionButtons from "@/components/common/CustomActionButtons";
import AuditHistoryDialog from "@/components/common/AuditHistoryDialog";
import RecepcionTemplate from "@/components/pdf/templates/recepcionTemplate";
import { ProgressSpinner } from "primereact/progressspinner";
import { motion } from "framer-motion";

const RecepcionList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [recepcions, setRecepcions] = useState<Recepcion[]>([]);
  const [recepcion, setRecepcion] = useState<Recepcion | null>(null);

  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [recepcionFormDialog, setRecepcionFormDialog] = useState(false);
  const [auditDialogVisible, setAuditDialogVisible] = useState(false);
  const [selectedAuditRecepcion, setSelectedAuditRecepcion] =
    useState<Recepcion | null>(null);
  const [mostrarTodas, setMostrarTodas] = useState(false);
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
    setRecepcion(null);
    setDeleteProductDialog(false);
  };

  const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFilters({ global: { value, matchMode: FilterMatchMode.CONTAINS } });
    setGlobalFilterValue(value);
  };

 const renderHeader = () => (
  <div className="flex flex-wrap gap-2 align-items-center justify-content-between">
    <div className="flex align-items-center gap-2 w-full sm:w-auto">
      <span className="p-input-icon-left w-full sm:w-20rem">
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
        icon={mostrarTodas ? "pi pi-eye-slash" : "pi pi-eye"}
        label={mostrarTodas ? "Ver solo activas" : "Ver todas"}
        className="p-button-secondary"
        onClick={() => setMostrarTodas((prev) => !prev)}
        style={{ minWidth: 160 }}
      />
    </div>
    <Button
      type="button"
      icon="pi pi-user-plus"
      label="Agregar Nuevo"
      outlined
      className="w-full sm:w-auto"
      onClick={() => setRecepcionFormDialog(true)}
    />
  </div>
);

  const actionBodyTemplate = (rowData: Recepcion) => (
    <CustomActionButtons
      rowData={rowData}
      onInfo={(data) => {
        setSelectedAuditRecepcion(data);

        setAuditDialogVisible(true);
      }}
      onEdit={(data) => {
        setRecepcion(rowData);
        data;
        setRecepcionFormDialog(true);
      }}
      onDelete={(data) => {
        setRecepcion(rowData);
        data;
        setDeleteProductDialog(true);
      }}
      pdfTemplate={(props) => (
        <RecepcionTemplate
          data={props.data}
          logoUrl="/layout/images/avatarHombre.png"
        />
      )}
      pdfFileName={`Recepcion${rowData.numeroRecepcion}.pdf`}
      pdfDownloadText="Descargar Recepcion"
    />
  );
  const showToast = (
    severity: "success" | "error" | "warn",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  // Filtrado según mostrarTodas
  const recepcionsFiltradas = mostrarTodas
    ? recepcions
    : recepcions.filter(
        (r) =>
          r.estadoRecepcion !== "COMPLETADO" &&
          r.estadoRecepcion !== "CANCELADO"
      );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }
  return (
    <>
      <Toast ref={toast} />
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 40,
          filter: "blur(8px)",
        }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="card"
      >
        <DataTable
          ref={dt}
          value={recepcionsFiltradas}
          header={renderHeader()}
          paginator
          rows={10}
          responsiveLayout="scroll"
          currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
          rowsPerPageOptions={[10, 25, 50]}
          filters={filters}
          loading={loading}
          emptyMessage="No hay recepcions disponibles"
          rowClassName={() => "animated-row"}
          size="small"
        >
          <Column body={actionBodyTemplate} />
          <Column field="idGuia" header="ID de la Guía" sortable />
          <Column field="placa" header="Placa" />
          <Column field="nombreChofer" header="Nombre del Chofer" sortable />
          {/* <Column field="apellidoChofer" header="Apellido del Chofer" sortable /> */}
          <Column
            field="idContrato.numeroContrato"
            header="Número de Contrato"
            sortable
          />
          {/* <Column
          field="idContratoItems.producto.nombre"
          header="Nombre del Producto"
        /> */}
          <Column
            field="cantidadEnviada"
            header="Cantidad Esperada"
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
            field="fechaSalida"
            header="Fecha de Salida"
            body={(rowData: Recepcion) => formatDateFH(rowData.fechaSalida)}
          />
          <Column
            field="fechaLlegada"
            header="Fecha de Llegada"
            body={(rowData: Recepcion) => formatDateFH(rowData.fechaLlegada)}
          />
          <Column
            field="fechaInicioRecepcion"
            header="Fecha de Inicio de Descarga"
            body={(rowData: Recepcion) =>
              formatDateFH(rowData.fechaInicioRecepcion)
            }
          />
          <Column
            field="fechaFinRecepcion"
            header="Fecha de Fin de Descarga"
            body={(rowData: Recepcion) =>
              formatDateFH(rowData.fechaFinRecepcion)
            }
          />

          <Column field="estadoRecepcion" header="Estado de la Recepcion" />
          <Column field="estadoCarga" header="Estado de la Carga" />
          {/* <Column field="estado" header="Estado" />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: Recepcion) => formatDateFH(rowData.createdAt)}
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: Recepcion) => formatDateFH(rowData.updatedAt)}
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
        </Dialog>{" "}
        <AuditHistoryDialog
          visible={auditDialogVisible}
          onHide={() => setAuditDialogVisible(false)}
          title={
            <div className="mb-2 text-center md:text-left">
              <div className="border-bottom-2 border-primary pb-2">
                <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
                  <i className="pi pi-check-circle mr-3 text-primary text-3xl"></i>
                  Historial - {selectedAuditRecepcion?.numeroRecepcion}
                </h2>
              </div>
            </div>
          }
          createdBy={selectedAuditRecepcion?.createdBy!}
          createdAt={selectedAuditRecepcion?.createdAt!}
          historial={selectedAuditRecepcion?.historial}
        />
        {recepcionFormDialog && (
          <RecepcionForm
            recepcion={recepcion}
            recepcionFormDialog={recepcionFormDialog}
            hideRecepcionFormDialog={hideRecepcionFormDialog}
            recepcions={recepcions}
            setRecepcions={setRecepcions}
            setRecepcion={setRecepcion}
            showToast={showToast}
            toast={toast}
          />
        )}
      </motion.div>
    </>
  );
};

export default RecepcionList;
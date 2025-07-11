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
import CustomActionButtons from "@/components/common/CustomActionButtons";

import SubPartidaForm from "./subPartidaForm";
import { SubPartida } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";
import {  deleteSubPartida,
  getSubPartidas,
} from "@/app/api/subPartidaService";
import AuditHistoryDialog from "@/components/common/AuditHistoryDialog";



const SubPartidaList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [subPartidas, setSubPartidas] = useState<SubPartida[]>([]);
  const [subPartida, setSubPartida] = useState<SubPartida | null>(
    null
  );
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [subPartidaFormDialog, setSubPartidaFormDialog] = useState(false);
  const [auditDialogVisible, setAuditDialogVisible] = useState(false);
  const [selectedAuditSubPartida, setSelectedAuditSubPartida] =
    useState<SubPartida | null>(null);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchSubPartidas();
  }, [activeRefineria]);

  const fetchSubPartidas = async () => {
    try {
      const subPartidasDB = await getSubPartidas();
      if (subPartidasDB && Array.isArray(subPartidasDB.subPartidas)) {
        console.log("SubPartidas obtenidas:", subPartidasDB.subPartidas);
        setSubPartidas(subPartidasDB.subPartidas);
      } else {
        console.error("La estructura de subPartidasDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los subPartidas:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideSubPartidaFormDialog = () => {
    setSubPartida(null);
    setSubPartidaFormDialog(false);
  };

  const handleDeleteSubPartida = async () => {
    if (subPartida?.id) {
      await deleteSubPartida(subPartida.id);
      setSubPartidas(
        subPartidas.filter((val) => val.id !== subPartida.id)
      );
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "SubPartida Eliminada",
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
    setSubPartida(null);
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
        onClick={() => setSubPartidaFormDialog(true)}
      />
    </div>
  );

const actionBodyTemplate = (rowData: SubPartida) => (
  <CustomActionButtons
    rowData={rowData}
    onInfo={(data) => {
      setSelectedAuditSubPartida(data);
      setAuditDialogVisible(true);
    }}
    onEdit={(data) => {
      setSubPartida(data);
      setSubPartidaFormDialog(true);
    }}
    onDelete={(data) => {
      setSubPartida(data);
      setDeleteProductDialog(true);
    }}
  />
);


// Agrupación por partida usando rowGroupMode="subheader"
const [expandedRows, setExpandedRows] = useState<any>(null);
const headerTemplate = (data: SubPartida) => (
  <span className="font-bold">
    {data.idPartida?.codigo ?? ""} - {data.idPartida?.descripcion ?? ""}
  </span>
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
      value={subPartidas}
      header={renderHeader()}
      paginator
      rows={10}
      responsiveLayout="scroll"
      currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
      rowsPerPageOptions={[10, 25, 50]}
      filters={filters}
      loading={loading}
      emptyMessage="No hay subPartidas disponibles"
      rowGroupMode="subheader"
      groupRowsBy="idPartida.codigo"
      sortMode="single"
      sortField="idPartida.codigo"
      sortOrder={1}
      expandableRowGroups
      expandedRows={expandedRows}
      onRowToggle={(e) => setExpandedRows(e.data)}
      rowGroupHeaderTemplate={headerTemplate}
      tableStyle={{ minWidth: '50rem' }}
    >
      <Column body={actionBodyTemplate} style={{ width: '10%' }} />
      <Column field="codigo" header="Código Subpartida" sortable style={{ width: '20%' }} />
      <Column field="descripcion" header="Descripción" sortable style={{ width: '40%' }} />
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
            onClick={handleDeleteSubPartida}
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
        {subPartida && (
          <span>
            ¿Estás seguro de que deseas eliminar <b>{subPartida.descripcion}</b>
            ?
          </span>
        )}
      </div>
    </Dialog>
    <AuditHistoryDialog
      visible={auditDialogVisible}
      onHide={() => setAuditDialogVisible(false)}
      title={
        <div className="mb-2 text-center md:text-left">
          <div className="border-bottom-2 border-primary pb-2">
            <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
              <i className="pi pi-check-circle mr-3 text-primary text-3xl"></i>
              Historial - {selectedAuditSubPartida?.descripcion}
            </h2>
          </div>
        </div>
      }
      createdBy={selectedAuditSubPartida?.createdBy!}
      createdAt={selectedAuditSubPartida?.createdAt!}
      historial={selectedAuditSubPartida?.historial}
    />
    <Dialog
      visible={subPartidaFormDialog}
      style={{ width: "850px" }}
      header={`${subPartida ? "Editar" : "Agregar"} Recepción de tractomula.`}
      modal
      onHide={hideSubPartidaFormDialog}
      content={() => (
        <SubPartidaForm
          subPartida={subPartida}
          hideSubPartidaFormDialog={hideSubPartidaFormDialog}
          subPartidas={subPartidas}
          setSubPartidas={setSubPartidas}
          setSubPartida={setSubPartida}
          showToast={showToast}
          toast={toast}
        />
      )}
    ></Dialog>
  </div>
  );
}

export default SubPartidaList;

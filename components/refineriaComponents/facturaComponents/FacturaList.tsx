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

import FacturaForm from "./FacturaForm";
import { Factura, Tanque } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";
import {
  deleteFactura,
  getFacturas,
} from "@/app/api/facturaService";
import AuditHistoryDialog from "@/components/common/AuditHistoryDialog";

const FacturaList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [factura, setFactura] = useState<Factura | null>(
    null
  );
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [facturaFormDialog, setFacturaFormDialog] = useState(false);
  const [auditDialogVisible, setAuditDialogVisible] = useState(false);
  const [selectedAuditFactura, setSelectedAuditFactura] =
    useState<Factura | null>(null);

  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchFacturas();
  }, [activeRefineria]);

  const fetchFacturas = async () => {
    try {
      const facturasDB = await getFacturas();
      if (facturasDB && Array.isArray(facturasDB.facturas)) {
        const filteredFacturas = facturasDB.facturas;
        setFacturas(filteredFacturas);
      } else {
        console.error("La estructura de facturasDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los facturas:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideFacturaFormDialog = () => {
    setFactura(null);
    setFacturaFormDialog(false);
  };

  const handleDeleteFactura = async () => {
    if (factura?.id) {
      await deleteFactura(factura.id);
      setFacturas(
        facturas.filter((val) => val.id !== factura.id)
      );
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Factura Eliminada",
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
    setFactura(null);
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
        onClick={() => setFacturaFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: Factura) => (
    <CustomActionButtons
      rowData={rowData}
      onInfo={(data) => {
        setSelectedAuditFactura(data);
        setAuditDialogVisible(true);
      }}
      onEdit={(data) => {
        setFactura(data);
        setFacturaFormDialog(true);
      }}
      onDelete={(data) => {
        setFactura(data);
        setDeleteProductDialog(true);
      }}
    />
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
        value={facturas}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay facturas disponibles"
      >
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        <Column field="concepto" header="Concepto" sortable />
        <Column field="total" header="Total" sortable />
        <Column field="fechaFactura" header="Fecha" sortable />
  
        
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
              onClick={handleDeleteFactura}
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
          {factura && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{factura.concepto}</b>
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
                Historial - {selectedAuditFactura?.concepto}
              </h2>
            </div>
          </div>
        }
        createdBy={selectedAuditFactura?.createdBy!}
        createdAt={selectedAuditFactura?.createdAt!}
        historial={selectedAuditFactura?.historial}
      />
      <Dialog
        visible={facturaFormDialog}
        style={{ width: "850px" }}
        header={`${
          factura ? "Editar" : "Agregar"
        } Recepción de tractomula.
`}
        modal
        onHide={hideFacturaFormDialog}
        content={() => (
          <FacturaForm
            factura={factura ?? undefined}
            hideFacturaFormDialog={hideFacturaFormDialog}
            facturas={facturas}
            setFacturas={setFacturas}
            setFactura={setFactura}
            showToast={showToast}
            facturaFormDialog={facturaFormDialog}
          />
        )}
      ></Dialog>
    </div>
  );
};

export default FacturaList;

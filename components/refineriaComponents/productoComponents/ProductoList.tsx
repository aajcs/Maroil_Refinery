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
import ProductoForm from "./ProductoForm";
import { Producto } from "@/libs/interfaces";
import { formatDateFH } from "@/utils/dateUtils";
import { deleteProducto, getProductos } from "@/app/api/productoService";

const ProductoList = () => {
  const { activeRefineria } = useRefineriaStore();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [filters, setFilters] = useState<DataTableFilterMeta>({});
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [productoFormDialog, setProductoFormDialog] = useState(false);
  const router = useRouter();
  const dt = useRef(null);
  const toast = useRef<Toast | null>(null);

  useEffect(() => {
    fetchProductos();
  }, [activeRefineria]);

  const fetchProductos = async () => {
    try {
      const productosDB = await getProductos();
      if (productosDB && Array.isArray(productosDB.productos)) {
        const filteredProductos = productosDB.productos.filter(
          (producto: Producto) =>
            producto.idRefineria.id === activeRefineria?.id
        );
        setProductos(filteredProductos);
      } else {
        console.error("La estructura de productosDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    } finally {
      setLoading(false);
    }
  };

  const hideDeleteProductDialog = () => setDeleteProductDialog(false);
  const hideProductoFormDialog = () => {
    setProducto(null);
    setProductoFormDialog(false);
  };

  const handleDeleteProducto = async () => {
    if (producto?.id) {
      await deleteProducto(producto.id);
      setProductos(productos.filter((val) => val.id !== producto.id));
      toast.current?.show({
        severity: "success",
        summary: "Éxito",
        detail: "Producto Eliminada",
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
        onClick={() => setProductoFormDialog(true)}
      />
    </div>
  );

  const actionBodyTemplate = (rowData: Producto) => (
    <>
      <Button
        icon="pi pi-pencil"
        rounded
        severity="success"
        className="mr-2"
        onClick={() => {
          setProducto(rowData);
          setProductoFormDialog(true);
        }}
      />
      <Button
        icon="pi pi-trash"
        severity="danger"
        rounded
        onClick={() => {
          setProducto(rowData);
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
        value={productos}
        header={renderHeader()}
        paginator
        rows={10}
        responsiveLayout="scroll"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} entradas"
        rowsPerPageOptions={[10, 25, 50]}
        filters={filters}
        loading={loading}
        emptyMessage="No hay productos disponibles"
      >
        <Column body={actionBodyTemplate} headerStyle={{ minWidth: "10rem" }} />
        <Column field="nombre" header="Nombre" sortable />
        <Column field="posicion" header="Posición" sortable />
        <Column
          field="color"
          header="Color"
          body={(rowData: Producto) => (
            <div className="flex items-center">
              <div
                className=" h-6 rounded-full mr-2"
                style={{ backgroundColor: `#${rowData.color}` }}
              >
                <span>{rowData.color}</span>
              </div>
            </div>
          )}
        />

        <Column field="tipoMaterial" header="Tipo de Material" sortable />
        <Column
          field="idTipoProducto"
          header="Tipo de Producto"
          body={(rowData: Producto) =>
            rowData.idTipoProducto
              ?.map((tipoProducto: { nombre: string }) => tipoProducto.nombre)
              .join(", ") || "N/A"
          }
          sortable
        />

        <Column field="estado" header="Estado" sortable />
        <Column
          field="createdAt"
          header="Fecha de Creación"
          body={(rowData: Producto) => formatDateFH(rowData.createdAt)}
          sortable
        />
        <Column
          field="updatedAt"
          header="Última Actualización"
          body={(rowData: Producto) => formatDateFH(rowData.updatedAt)}
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
              onClick={handleDeleteProducto}
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
          {producto && (
            <span>
              ¿Estás seguro de que deseas eliminar <b>{producto.nombre}</b>?
            </span>
          )}
        </div>
      </Dialog>

      <Dialog
        visible={productoFormDialog}
        style={{ width: "850px" }}
        header={`${producto ? "Editar" : "Agregar"} Producto`}
        modal
        onHide={hideProductoFormDialog}
      >
        <ProductoForm
          producto={producto}
          hideProductoFormDialog={hideProductoFormDialog}
          productos={productos}
          setProductos={setProductos}
          setProducto={setProducto}
          showToast={showToast}
        />
      </Dialog>
    </div>
  );
};

export default ProductoList;

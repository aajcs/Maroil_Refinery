import React, { useRef, useEffect, useState } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facturaSchema } from "@/libs/zods";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { createFactura, updateFactura } from "@/app/api/facturaService";
import { useRefineriaStore } from "@/store/refineriaStore";
import { handleFormError } from "@/utils/errorHandlers";
import { Factura, LineaFactura } from "@/libs/interfaces";
import { useByRefineryDataFull } from "@/hooks/useRefineryDataFull";
import { Column, ColumnEditorOptions } from "primereact/column";
import { DataTable } from "primereact/datatable";

type FormData = z.infer<typeof facturaSchema>;

const estadoOptions = [
  { label: "Pendiente", value: "Pendiente" },
  { label: "Aprobada", value: "Aprobada" },
  { label: "Rechazada", value: "Rechazada" },
];

interface FacturaFormProps {
  factura?: Factura;
  hideFacturaFormDialog: () => void;
  facturas: Factura[];
  setFacturas: (facturas: any[]) => void;
  setFactura: (factura: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
  facturaFormDialog: boolean;
}

function FacturaForm({
  factura,
  hideFacturaFormDialog,
  facturas,
  setFacturas,
  setFactura,
  showToast,
  facturaFormDialog,
}: FacturaFormProps) {
  const toast = useRef<Toast | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { activeRefineria } = useRefineriaStore();
  const { partidas, loading } = useByRefineryDataFull(
    activeRefineria?.id as string
  );
  const calendarRef = useRef<Calendar>(null);
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      id: "",
      idLineasFactura: [],
    },
  });

  const {
    fields: lineas,
    append,
    remove,
    update: updateLinea,
  } = useFieldArray({
    control,
    name: "idLineasFactura",
  });

  // Calcular el total
  const lineasFactura = watch("idLineasFactura") || [];
  const totalCalculado = lineasFactura.reduce((acc: number, linea: any) => {
    const subTotal = Number(linea?.subTotal) || 0;
    return acc + subTotal;
  }, 0);

  useEffect(() => {
    setValue("total", totalCalculado);
  }, [totalCalculado, setValue]);

  useEffect(() => {
    if (factura) {
      (Object.keys(factura) as (keyof Factura)[]).forEach((key) =>
        setValue(key as keyof Factura, factura[key])
      );
    }
  }, [factura, setValue]);

  // Guardar o actualizar factura
  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const lineasTransformadas = (data.idLineasFactura || []).map(
        (linea: any) => ({
          ...linea,
          idPartida: linea.idPartida?.id || linea.idPartida || null,
        })
      );

      const payload = {
        ...data,
        idLineasFactura: lineasTransformadas,
        lineas: lineasTransformadas,
        idRefineria: activeRefineria?.id,
      };

      if (factura) {
        const updatedFactura = await updateFactura(factura.id, payload);
        const updatedFacturas = facturas.map((t) =>
          t.id === updatedFactura.id ? updatedFactura : t
        );
        setFacturas(updatedFacturas);
        showToast("success", "Éxito", "Factura actualizada");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newFactura = await createFactura(payload);
        setFacturas([...facturas, newFactura]);
        showToast("success", "Éxito", "Factura creada");
      }
      hideFacturaFormDialog();
    } catch (error) {
      handleFormError(error, toast);
    } finally {
      setSubmitting(false);
    }
  };

  const addItem = () => {
    append({
      descripcion: "",
      idPartida: { id: "", descripcion: "" },
      subTotal: 0,
    });
  };

  const deleteItem = (index: number) => {
    remove(index);
  };

  // CORRECCIÓN: Actualizar solo el campo necesario
  const updateItem = (index: number, field: string, value: any) => {
    updateLinea(index, {
      ...lineas[index],
      [field]: value,
    });
  };

  const actionBodyTemplate = (rowData: any, options: any) => {
    return (
      <div className="flex justify-content-center">
        <Button
          type="button"
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => deleteItem(options.rowIndex)}
        />
      </div>
    );
  };

  const idPartidaEditor = (options: ColumnEditorOptions) => {
    return (
      <Dropdown
        value={options.value}
        onChange={(e) => options.editorCallback!(e.value)}
        options={partidas.map((partida) => ({
          label: partida.descripcion,
          value: {
            id: partida.id,
            _id: partida.id,
            descripcion: partida.descripcion,
            codigo: partida.codigo,
          },
        }))}
        placeholder="Seleccionar un Partida"
        // optionLabel="descripcion"
      />
    );
  };

  return (
    <Dialog
      visible={facturaFormDialog}
      style={{ width: "80vw", backgroundColor: "red" }}
      header={
        <div className="mb-2 text-center md:text-left surface-50">
          <div className="border-bottom-2 border-primary pb-2">
            <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
              <i className="pi pi-check-circle mr-3 text-primary text-3xl"></i>
              {factura?.id ? "Editar" : "Agregar"} Factura
            </h2>
          </div>
        </div>
      }
      headerStyle={{ backgroundColor: "transparent" }}
      modal
      onHide={hideFacturaFormDialog}
      className="card surface-50 p-3 border-round shadow-2xl"
      footer={
        <div className="flex justify-content-between align-items-center p-2">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text p-button-plain"
            onClick={hideFacturaFormDialog}
          />
          {!loading && (
            <Button
              type="submit"
              disabled={submitting}
              icon={submitting ? "pi pi-spinner pi-spin" : "pi pi-check"}
              label={factura ? "Modificar Factura" : "Crear Factura"}
              className={`p-button-raised ${
                submitting ? "p-button-secondary" : "p-button-primary"
              }`}
              onClick={handleSubmit(onSubmit)}
            />
          )}
        </div>
      }
    >
      <div>
        <Toast ref={toast} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Concepto */}
            <div className="flex-1 min-w-[220px] max-w-xs p-3 bg-white border-round shadow-1 surface-card">
              <label className="block font-medium text-900 mb-2 flex align-items-center">
                <i className="pi pi-align-left mr-2 text-primary"></i>
                Concepto
              </label>
              <Controller
                name="concepto"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id="concepto"
                      {...field}
                      className={classNames("w-full", {
                        "p-invalid": fieldState.error,
                      })}
                    />
                    {fieldState.error && (
                      <small className="p-error block mt-2 flex align-items-center">
                        <i className="pi pi-exclamation-circle mr-2"></i>
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>

            {/* Total */}
            <div className="flex-1 min-w-[220px] max-w-xs p-3 bg-white border-round shadow-1 surface-card">
              <label className="block font-medium text-900 mb-2 flex align-items-center">
                <i className="pi pi-dollar mr-2 text-primary"></i>
                Total
              </label>
              <Controller
                name="total"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <InputNumber
                      id="total"
                      value={totalCalculado}
                      mode="currency"
                      currency="USD"
                      locale="en-US"
                      className={classNames("w-full", {
                        "p-invalid": fieldState.error,
                      })}
                      disabled
                    />
                    {fieldState.error && (
                      <small className="p-error block mt-2 flex align-items-center">
                        <i className="pi pi-exclamation-circle mr-2"></i>
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>

            {/* Fecha Factura */}
            <div className="flex-1 min-w-[220px] max-w-xs p-3 bg-white border-round shadow-1 surface-card">
              <label className="block font-medium text-900 mb-2 flex align-items-center">
                <i className="pi pi-calendar mr-2 text-primary"></i>
                Fecha Factura
              </label>
              <Controller
                name="fechaFactura"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      id="fechaFactura"
                      value={field.value ? new Date(field.value) : null}
                      onChange={(e) => {
                        let val = "";
                        if (
                          e.value instanceof Date &&
                          !isNaN(e.value.getTime())
                        ) {
                          val = new Date(
                            Date.UTC(
                              e.value.getFullYear(),
                              e.value.getMonth(),
                              e.value.getDate()
                            )
                          ).toISOString();
                        }
                        if (!e.value) val = "";
                        field.onChange(val);
                      }}
                      dateFormat="yy-mm-dd"
                      className={classNames("w-full", {
                        "p-invalid": fieldState.error,
                      })}
                      showIcon
                    />
                    {fieldState.error && (
                      <small className="p-error block mt-2 flex align-items-center">
                        <i className="pi pi-exclamation-circle mr-2"></i>
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>

            {/* Estado */}
            <div className="flex-1 min-w-[220px] max-w-xs p-3 bg-white border-round shadow-1 surface-card">
              <label className="block font-medium text-900 mb-2 flex align-items-center">
                <i className="pi pi-flag mr-2 text-primary"></i>
                Estado
              </label>
              <Controller
                name="estado"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <Dropdown
                      id="estado"
                      {...field}
                      options={estadoOptions}
                      placeholder="Seleccionar estado"
                      className={classNames("w-full", {
                        "p-invalid": fieldState.error,
                      })}
                      showClear
                      filter
                    />
                    {fieldState.error && (
                      <small className="p-error block mt-2 flex align-items-center">
                        <i className="pi pi-exclamation-circle mr-2"></i>
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          <div className="border-bottom-2 border-primary mb-4 mt-2"></div>

          {/* Tabla de Items */}
          <div className="orders-subtable col-12">
            <DataTable
              value={lineas}
              responsiveLayout="scroll"
              scrollable
              className="datatable-responsive"
              size="small"
              editMode="cell"
            >
              {/* Columna Partida */}
              <Column
                field="idPartida.descripcion"
                header="Partida"
                style={{ minWidth: "200px" }}
                editor={(options) => idPartidaEditor(options)}
                body={(rowData: any) =>
                  rowData.idPartida?.descripcion || "Sin Partida"
                }
                onCellEditComplete={(e) => {
                  const { newValue, rowIndex } = e;
                  updateItem(rowIndex, "idPartida", newValue);
                }}
              />

              {/* CORRECCIÓN: Columna Descripción */}
              <Column
                field="descripcion"
                header="Descripción"
                style={{ minWidth: "180px" }}
                editor={(options) => (
                  <InputText
                    value={options.value}
                    onChange={(e) => options.editorCallback!(e.target.value)}
                  />
                )}
                onCellEditComplete={(e) => {
                  const { newValue, rowIndex } = e;
                  updateItem(rowIndex, "descripcion", newValue);
                }}
              />

              {/* Columna Sub Total */}
              <Column
                field="subTotal"
                header="Sub Total ($)"
                style={{ minWidth: "120px" }}
                body={(rowData: any) => `${rowData.subTotal} $`}
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) => options.editorCallback!(e.value)}
                    suffix=" $"
                  />
                )}
                onCellEditComplete={(e) => {
                  const { newValue, rowIndex } = e;
                  updateItem(rowIndex, "subTotal", newValue);
                }}
              />

              <Column
                body={actionBodyTemplate}
                header="Acciones"
                style={{ minWidth: "100px" }}
              />
            </DataTable>

            <Button
              type="button"
              label="Agregar Item"
              icon="pi pi-plus"
              className="mt-2"
              onClick={addItem}
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export default FacturaForm;

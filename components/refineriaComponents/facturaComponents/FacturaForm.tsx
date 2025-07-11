import React, { useRef, useEffect, useState } from "react";
import { getPartidas } from "@/app/api/partidaService";
import { getSubPartidas } from "@/app/api/subPartidaService";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { facturaSchema } from "@/libs/zods";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { Calendar } from "primereact/calendar";
import { createFactura, updateFactura } from "@/app/api/facturaService";
import { useRefineriaStore } from "@/store/refineriaStore";
import { handleFormError } from "@/utils/errorHandlers";

import { LineaFactura } from "@/libs/interfaces";
import { useByRefineryData } from "@/hooks/useByRefineryData";

type FormData = z.infer<typeof facturaSchema>;

const estadoOptions = [
  { label: "Pendiente", value: "Pendiente" },
  { label: "Aprobada", value: "Aprobada" },
  { label: "Rechazada", value: "Rechazada" },
];

interface FacturaFormProps {
  factura?: any;
  hideFacturaFormDialog: () => void;
  facturas: any[];
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
  const { partidas, subPartidas, loading } = useByRefineryData(
    activeRefineria?.id as string
  );

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>({
    resolver: zodResolver(facturaSchema),
    defaultValues: {
      id: "",
    },
  });

  // Cargar partidas y subpartidas

  const {
    fields: lineas,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "idLineasFactura",
  });

  // Calcular el total como la suma de los subtotales de las líneas
  const lineasFactura = watch("idLineasFactura") || [];
  const totalCalculado = lineasFactura.reduce((acc: number, linea: any) => {
    const cantidad = Number(linea?.cantidad) || 0;
    const precioUnitario = Number(linea?.precioUnitario) || 0;
    return acc + cantidad * precioUnitario;
  }, 0);

  // Actualizar el campo total cada vez que cambian las líneas
  useEffect(() => {
    setValue("total", totalCalculado);
  }, [totalCalculado, setValue]);

  useEffect(() => {
    if (factura) {
      Object.keys(factura).forEach((key) =>
        setValue(key as string, factura[key])
      );
    }
  }, [factura, setValue]);

  // Guardar o actualizar en la API Express
  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      // Transforma las líneas para que idSubPartida sea solo el id
      const lineasTransformadas = (data.idLineasFactura || []).map(
        (linea: LineaFactura) => ({
          ...linea,
          idSubPartida: linea.idSubPartida?.id || linea.idSubPartida || null,
        })
      );

      const payload = {
        ...data,
        idLineasFactura: lineasTransformadas,
        lineas: lineasTransformadas,
        idRefineria: activeRefineria?.id,
        idProducto: data.idProducto?.id,
      };

      if (factura) {
        const updatedFactura = await updateFactura(factura.id, payload);
        const updatedFacturas = facturas.map((t) =>
          t.id === updatedFactura.id ? updatedFactura : t
        );
        setFacturas(updatedFacturas);
        showToast("success", "Éxito", "Factura actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newFactura = await createFactura(payload);
        setFacturas([...facturas, newFactura]);
        showToast("success", "Éxito", "Factura creado");
      }
      hideFacturaFormDialog();
    } catch (error) {
      handleFormError(error, toast);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog
        visible={facturaFormDialog}
        style={{
          width: "90vw",
          maxWidth: "1200px",
          minHeight: "60vh",
          maxHeight: "85vh",
          margin: "0 auto",
        }}
        header={
          <div className="mb-2 text-center md:text-left surface-50">
            <div className="border-bottom-2 border-primary pb-2">
              <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
                <i className="pi pi-file-invoice mr-3 text-primary text-3xl"></i>
                {factura && factura.id ? "Editar" : "Agregar"} Factura
              </h2>
            </div>
          </div>
        }
        headerStyle={{ backgroundColor: "transparent" }}
        contentStyle={{
          backgroundColor: "transparent",
          minHeight: "50vh",
          maxHeight: "70vh",
          overflowY: "auto",
          paddingBottom: 0,
        }}
        modal
        onHide={hideFacturaFormDialog}
        className="card surface-50 p-3 border-round shadow-2xl"
      >
        <div>
          <Toast ref={toast} />
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Campos principales en tarjetas horizontales */}
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
                          // Convierte a string en formato ISO UTC: 2025-07-05T00:00:00.000Z
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
                          // Si el usuario borra la fecha, e.value será null o undefined
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
            {/* Línea divisoria */}
            <div className="border-bottom-2 border-primary mb-4 mt-2"></div>
            {/* Líneas de Factura */}
            <div className="p-3 bg-white border-round shadow-1 surface-card">
              <div className="flex justify-content-between align-items-center mb-3">
                <label className="block font-medium text-900 mb-0 flex align-items-center text-lg">
                  <i className="pi pi-list mr-2 text-primary"></i>
                  Líneas de Factura
                </label>
                <Button
                  type="button"
                  icon="pi pi-plus"
                  label="Agregar Línea"
                  className="p-button-sm"
                  onClick={() =>
                    append({
                      descripcion: "",
                      cantidad: 0,
                      precioUnitario: 0,
                      idPartida: "",
                      idSubPartida: null,
                    })
                  }
                />
              </div>
              {lineas.length === 0 && (
                <div className="p-2 text-600">No hay líneas de factura.</div>
              )}
              <div className="overflow-auto" style={{ minWidth: "1000px" }}>
                <div
                  className="grid grid-nogutter"
                  style={{ minWidth: "1000px" }}
                >
                  {/* Encabezados */}
                  <div className="col-2 font-bold text-900">Partida</div>
                  <div className="col-2 font-bold text-900">Subpartida</div>
                  <div className="col-3 font-bold text-900">Descripción</div>
                  <div className="col-1 font-bold text-900">Cantidad</div>
                  <div className="col-2 font-bold text-900">
                    Precio Unitario
                  </div>
                  <div className="col-1 font-bold text-900">Subtotal</div>
                  <div className="col-1"></div>
                </div>
                {lineas.map((linea, idx) => {
                  const selectedPartida = watch(
                    `idLineasFactura.${idx}.idPartida`
                  );
                  const filteredSubpartidas = subPartidas.filter(
                    (sp) =>
                      (sp.idPartida?.id ?? sp.idPartida) === selectedPartida
                  );
                  const cantidad =
                    watch(`idLineasFactura.${idx}.cantidad`) ?? 0;
                  const precioUnitario =
                    watch(`idLineasFactura.${idx}.precioUnitario`) ?? 0;
                  const subtotal =
                    (Number(cantidad) || 0) * (Number(precioUnitario) || 0);

                  return (
                    <div
                      key={linea.id}
                      className="grid grid-nogutter align-items-center mb-2 p-2 border-1 border-round surface-border"
                      style={{
                        minWidth: "1000px",
                        background: idx % 2 === 0 ? "#f8fafc" : "#fff",
                      }}
                    >
                      {/* Partida */}
                      <div className="col-2 px-1">
                        <Controller
                          name={`idLineasFactura.${idx}.idPartida`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Dropdown
                              {...field}
                              value={field.value}
                              options={partidas.map((p) => ({
                                label: p.codigo + " - " + (p.descripcion || ""),
                                value: p.id,
                              }))}
                              onChange={(e) => field.onChange(e.value)}
                              placeholder="Partida"
                              loading={loading}
                              className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              showClear
                              filter
                              style={{ fontSize: "0.95rem" }}
                              panelStyle={{ fontSize: "0.95rem" }}
                            />
                          )}
                        />
                      </div>
                      {/* Subpartida */}
                      <div className="col-2 px-1">
                        <Controller
                          name={`idLineasFactura.${idx}.idSubPartida`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <Dropdown
                              {...field}
                              value={field.value?.id || field.value || null}
                              options={filteredSubpartidas}
                              optionLabel="codigo"
                              optionValue="id"
                              onChange={(e) => {
                                const selected = filteredSubpartidas.find(
                                  (sp) => sp.id === e.value
                                );
                                field.onChange(selected || null);
                              }}
                              placeholder="Subpartida"
                              loading={loading}
                              className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              showClear
                              filter
                              disabled={!selectedPartida}
                              style={{ fontSize: "0.95rem" }}
                              panelStyle={{ fontSize: "0.95rem" }}
                              itemTemplate={(option) => (
                                <span>
                                  {option.codigo} - {option.descripcion}
                                </span>
                              )}
                            />
                          )}
                        />
                      </div>
                      {/* Descripción */}
                      <div className="col-3 px-1">
                        <Controller
                          name={`idLineasFactura.${idx}.descripcion`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <InputText
                              {...field}
                              placeholder="Descripción"
                              className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              style={{
                                fontSize: "0.95rem",
                                minWidth: 100,
                                maxWidth: "100%",
                                marginTop: 0,
                                marginBottom: 0,
                              }}
                            />
                          )}
                        />
                      </div>
                      {/* Cantidad */}
                      <div className="col-1 px-1">
                        <Controller
                          name={`idLineasFactura.${idx}.cantidad`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              value={field.value ?? 0}
                              onValueChange={(e) =>
                                field.onChange(e.value ?? 0)
                              }
                              placeholder="Cantidad"
                              className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              inputStyle={{
                                fontSize: "0.95rem",
                                minWidth: 60,
                                maxWidth: "100%",
                                marginTop: 0,
                                marginBottom: 0,
                              }}
                            />
                          )}
                        />
                      </div>
                      {/* Precio Unitario */}
                      <div className="col-2 px-1">
                        <Controller
                          name={`idLineasFactura.${idx}.precioUnitario`}
                          control={control}
                          render={({ field, fieldState }) => (
                            <InputNumber
                              value={field.value ?? 0}
                              onValueChange={(e) =>
                                field.onChange(e.value ?? 0)
                              }
                              placeholder="Precio Unitario"
                              mode="currency"
                              currency="USD"
                              locale="en-US"
                              className={classNames("w-full", {
                                "p-invalid": fieldState.error,
                              })}
                              inputStyle={{
                                fontSize: "0.95rem",
                                minWidth: 80,
                                maxWidth: "100%",
                                marginTop: 0,
                                marginBottom: 0,
                              }}
                            />
                          )}
                        />
                      </div>
                      {/* Subtotal */}
                      <div className="col-1 px-1">
                        <InputNumber
                          value={subtotal}
                          mode="currency"
                          currency="USD"
                          locale="en-US"
                          disabled
                          inputStyle={{
                            fontSize: "0.95rem",
                            minWidth: 80,
                            maxWidth: "100%",
                            marginTop: 0,
                            marginBottom: 0,
                            background: "#f4f4f5",
                          }}
                          className="w-full"
                        />
                      </div>
                      {/* Remove button */}
                      <div className="col-1 flex align-items-center justify-content-end px-1">
                        <Button
                          type="button"
                          icon="pi pi-trash"
                          className="p-button-danger p-button-sm"
                          onClick={() => remove(idx)}
                          tooltip="Eliminar línea"
                          style={{
                            fontSize: "1.1rem",
                            height: "2.2rem",
                            width: "2.2rem",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Botones de acción */}
            <div className="flex justify-content-between align-items-center p-2 mt-3">
              <Button
                type="submit"
                disabled={submitting}
                label={
                  factura && factura.id
                    ? "Modificar Factura"
                    : "Guardar Factura"
                }
                className={`p-button-raised ${
                  submitting ? "p-button-secondary" : "p-button-primary"
                }`}
                style={{ minWidth: 170 }}
              />
              <Button
                type="button"
                label="Salir"
                onClick={hideFacturaFormDialog}
                className="p-button-danger w-auto"
              />
            </div>
          </form>
        </div>
      </Dialog>
    </>
  );
}

export default FacturaForm;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";

import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { InputNumber } from "primereact/inputnumber";
import {
  createTipoProducto,
  updateTipoProducto,
} from "@/app/api/tipoProductoService";
import { useRefineryData } from "@/hooks/useRefineryData";
import { ProgressSpinner } from "primereact/progressspinner";
import { tipoProductoSchema } from "@/libs/zods";

type FormData = z.infer<typeof tipoProductoSchema>;

interface TipoProductoFormProps {
  tipoProducto: any;
  hideTipoProductoFormDialog: () => void;
  tipoProductos: any[];
  setTipoProductos: (tipoProductos: any[]) => void;
  setTipoProducto: (tipoProducto: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];
const clasificacionValues = ["Liviano", "Mediano", "Pesado"];

const TipoProductoForm = ({
  tipoProducto,
  hideTipoProductoFormDialog,
  tipoProductos,
  setTipoProductos,
  showToast,
}: TipoProductoFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const { productos, loading } = useRefineryData(activeRefineria?.id || "");
  const toast = useRef<Toast | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(tipoProductoSchema),
    defaultValues: {
      nombre: "",
      clasificacion: "",
      gravedadAPI: 0,
      azufre: 0,
      contenidoAgua: 0,
      flashPoint: 0,
      estado: "true",
    },
  });

  useEffect(() => {
    if (tipoProducto) {
      Object.keys(tipoProducto).forEach((key) =>
        setValue(key as keyof FormData, tipoProducto[key])
      );
    }
  }, [tipoProducto, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (tipoProducto) {
        const updatedTipoProducto = await updateTipoProducto(tipoProducto.id, {
          ...data,
          idRefineria: activeRefineria?.id,
          idProducto: data.idProducto?.id,
        });
        const updatedTipoProductos = tipoProductos.map((t) =>
          t.id === updatedTipoProducto.id ? updatedTipoProducto : t
        );
        setTipoProductos(updatedTipoProductos);
        showToast("success", "Éxito", "TipoProducto actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newTipoProducto = await createTipoProducto({
          ...data,
          idRefineria: activeRefineria.id,
          idProducto: data.idProducto?.id,
        });
        setTipoProductos([...tipoProductos, newTipoProducto]);
        showToast("success", "Éxito", "TipoProducto creado");
      }
      hideTipoProductoFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar tipoProducto:", error);
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setSubmitting(false);
    }
  };
  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }
  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card p-fluid surface-50 p-3 border-round shadow-2">
          {/* Header del Formulario */}
          <div className="mb-2 text-center md:text-left">
            <div className="border-bottom-2 border-primary pb-2">
              <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
                <i className="pi pi-check-circle mr-3 text-primary text-3xl"></i>
                {tipoProducto
                  ? "Modificar Tipo de Producto"
                  : "Crear Tipo de Producto"}
              </h2>
            </div>
          </div>

          {/* Cuerpo del Formulario */}
          <div className="grid formgrid row-gap-2">
            {/* Campo: Nombre del Producto */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-box mr-2 text-primary"></i>
                  Nombre del Producto
                </label>
                <Dropdown
                  id="idProducto"
                  value={watch("idProducto")}
                  onChange={(e) => setValue("idProducto", e.value)}
                  options={productos.map((producto) => ({
                    label: producto.nombre,
                    value: {
                      id: producto.id,
                      _id: producto.id,
                      nombre: producto.nombre,
                      color: producto.color,
                    },
                  }))}
                  placeholder="Seleccionar un producto"
                  className={classNames("w-full", {
                    "p-invalid": errors.idProducto?.nombre,
                  })}
                />
                {errors.idProducto?.nombre && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.idProducto.nombre.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Nombre */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-tag mr-2 text-primary"></i>
                  Nombre
                </label>
                <InputText
                  id="nombre"
                  type="text"
                  className={classNames("w-full", {
                    "p-invalid": errors.nombre,
                  })}
                  {...register("nombre")}
                />
                {errors.nombre && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.nombre.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Clasificación */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-list mr-2 text-primary"></i>
                  Clasificación
                </label>
                <Dropdown
                  id="clasificacion"
                  value={watch("clasificacion")}
                  onChange={(e) => setValue("clasificacion", e.value)}
                  options={clasificacionValues}
                  placeholder="Seleccionar"
                  className={classNames("w-full", {
                    "p-invalid": errors.clasificacion,
                  })}
                />
                {errors.clasificacion && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.clasificacion.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Gravedad API */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-sliders-h mr-2 text-primary"></i>
                  Gravedad API
                </label>
                <Controller
                  name="gravedadAPI"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      id={field.name}
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      className={classNames("w-full", {
                        "p-invalid": errors.gravedadAPI,
                      })}
                    />
                  )}
                />
                {errors.gravedadAPI && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.gravedadAPI.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Azufre */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-percentage mr-2 text-primary"></i>
                  Azufre (%)
                </label>
                <Controller
                  name="azufre"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      id={field.name}
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      className={classNames("w-full", {
                        "p-invalid": errors.azufre,
                      })}
                    />
                  )}
                />
                {errors.azufre && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.azufre.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Contenido de Agua */}
            <div className="col-12 md:col-6 lg:col-4 xl:col-3">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-water mr-2 text-primary"></i>
                  Contenido de Agua (%)
                </label>
                <Controller
                  name="contenidoAgua"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      min={0}
                      max={100}
                      suffix="%"
                      className="w-full"
                      locale="es"
                    />
                  )}
                />
                {errors.contenidoAgua && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.contenidoAgua.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Punto de Inflamación
            <div className="col-12 md:col-6 lg:col-4 xl:col-3">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-fire mr-2 text-primary"></i>
                  Punto de Inflamación (°C)
                </label>
                <Controller
                  name="puntoDeInflamacion"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      min={0}
                      suffix="°C"
                      className="w-full"
                      locale="es"
                    />
                  )}
                />
                {errors.puntoDeInflamacion && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.puntoDeInflamacion.message}
                  </small>
                )}
              </div>
            </div>
            Campo: Índice Cetano
            <div className="col-12 md:col-6 lg:col-4 xl:col-3">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-star mr-2 text-primary"></i>
                  Índice Cetano
                </label>
                <Controller
                  name="cetano"
                  control={control}
                  render={({ field }) => (
                    <InputNumber
                      value={field.value}
                      onValueChange={(e) => field.onChange(e.value)}
                      min={0}
                      max={100}
                      className="w-full"
                      locale="es"
                    />
                  )}
                />
                {errors.cetano && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.cetano.message}
                  </small>
                )}
              </div>
            </div> */}
            {/* Campo: Estado
            <div className="col-12 md:col-6 lg:col-4 xl:col-3">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-info-circle mr-2 text-primary"></i>
                  Estado
                </label>
                <Controller
                  name="estado"
                  control={control}
                  render={({ field }) => (
                    <Dropdown
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      options={[
                        { label: "Aprobado", value: "aprobado" },
                        { label: "Rechazado", value: "rechazado" },
                      ]}
                      placeholder="Seleccionar estado"
                      className="w-full"
                    />
                  )}
                />
                {errors.estado && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.estado.message}
                  </small>
                )}
              </div>
            </div> */}
          </div>

          {/* Botones */}
          <div className="col-12 flex justify-content-between align-items-center mt-3">
            <Button
              type="submit"
              disabled={submitting}
              icon={submitting ? "pi pi-spinner pi-spin" : ""}
              label={
                tipoProducto
                  ? "Modificar Tipo de Producto"
                  : "Crear Tipo de Producto"
              }
              className="w-auto"
            />

            <Button
              type="button"
              label="Salir"
              onClick={() => hideTipoProductoFormDialog()}
              className="w-auto"
              severity="danger"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TipoProductoForm;

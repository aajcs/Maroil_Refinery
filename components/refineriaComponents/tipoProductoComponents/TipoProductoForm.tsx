"use client";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { tipoProductoSchema } from "@/libs/zod";

import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { ColorPicker } from "primereact/colorpicker";
import {
  createTipoProducto,
  updateTipoProducto,
} from "@/app/api/tipoProductoService";
import { Producto } from "@/libs/interfaces";
import { useRefineryData } from "@/hooks/useRefineryData";
import { ProgressSpinner } from "primereact/progressspinner";

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
        <div className="grid formgrid p-fluid">
          {/* Campo: Nombre del Producto */}

          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre del Producto
            </label>
            <Dropdown
              id="idProducto.id"
              value={watch("idProducto")}
              // {...register("idProducto.id")}
              onChange={(e) => {
                setValue("idProducto", e.value);
              }}
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
              <small className="p-error">
                {errors.idProducto.nombre.message}
              </small>
            )}
          </div>
          {/* Nombre */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="nombre" className="font-medium text-900">
              Nombre
            </label>
            <InputText
              id="nombre"
              type="text"
              className={classNames("w-full", { "p-invalid": errors.nombre })}
              {...register("nombre")}
            />
            {errors.nombre && (
              <small className="p-error">{errors.nombre.message}</small>
            )}
          </div>

          {/* Clasificación */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="clasificacion" className="font-medium text-900">
              Clasificación
            </label>
            <Dropdown
              id="clasificacion"
              value={watch("clasificacion")}
              onChange={(e) => setValue("clasificacion", e.value)}
              options={clasificacionValues}
              placeholder="Seleccionar"
              className={classNames("w-full", { "p-invalid": errors.estado })}
            />
            {errors.clasificacion && (
              <small className="p-error">{errors.clasificacion.message}</small>
            )}
          </div>

          {/* Gravedad API */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="gravedadAPI" className="font-medium text-900">
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
              <small className="p-error">{errors.gravedadAPI.message}</small>
            )}
          </div>

          {/* Azufre */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="azufre" className="font-medium text-900">
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
              <small className="p-error">{errors.azufre.message}</small>
            )}
          </div>

          {/* Contenido de Agua */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="contenidoAgua" className="font-medium text-900">
              Contenido de Agua (%)
            </label>
            <Controller
              name="contenidoAgua"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.contenidoAgua,
                  })}
                />
              )}
            />
            {errors.contenidoAgua && (
              <small className="p-error">{errors.contenidoAgua.message}</small>
            )}
          </div>

          {/* Flash Point */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="flashPoint" className="font-medium text-900">
              Flash Point
            </label>

            <Controller
              name="flashPoint"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.flashPoint,
                  })}
                />
              )}
            />
            {errors.flashPoint && (
              <small className="p-error">{errors.flashPoint.message}</small>
            )}
          </div>

          {/* Estado */}
          <div className="field mb-4 col-12 md:col-6">
            <label htmlFor="estado" className="font-medium text-900">
              Estado
            </label>
            <Dropdown
              id="estado"
              value={watch("estado")}
              onChange={(e) => setValue("estado", e.value)}
              options={estatusValues}
              placeholder="Seleccionar"
              className={classNames("w-full", { "p-invalid": errors.estado })}
            />
            {errors.estado && (
              <small className="p-error">{errors.estado.message}</small>
            )}
          </div>

          {/* Botón de envío */}
          <div className="col-12">
            <Button
              type="submit"
              disabled={submitting}
              icon={submitting ? "pi pi-spinner pi-spin" : ""}
              label={
                tipoProducto ? "Modificar tipoProducto" : "Crear tipoProducto"
              }
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TipoProductoForm;

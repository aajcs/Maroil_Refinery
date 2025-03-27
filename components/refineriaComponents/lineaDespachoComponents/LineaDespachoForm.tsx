"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { lineaDespachoSchema } from "@/libs/zod";

import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import {
  createLineaDespacho,
  updateLineaDespacho,
} from "@/app/api/lineaDespachoService";

type FormData = z.infer<typeof lineaDespachoSchema>;

interface LineaDespachoFormProps {
  lineaDespacho: any;
  hideLineaDespachoFormDialog: () => void;
  lineaDespachos: any[];
  setLineaDespachos: (lineaDespachos: any[]) => void;
  setLineaDespacho: (lineaDespacho: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];

const LineaDespachoForm = ({
  lineaDespacho,
  hideLineaDespachoFormDialog,
  lineaDespachos,
  setLineaDespachos,
  showToast,
}: LineaDespachoFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(lineaDespachoSchema),
  });
  useEffect(() => {
    if (lineaDespacho) {
      Object.keys(lineaDespacho).forEach((key) =>
        setValue(key as keyof FormData, lineaDespacho[key])
      );
      if (Array.isArray(lineaDespacho.material)) {
      }
    }
  }, [lineaDespacho, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (lineaDespacho) {
        const updatedLineaDespacho = await updateLineaDespacho(
          lineaDespacho.id,
          {
            ...data,
            idRefineria: activeRefineria?.id,
          }
        );
        const updatedLineaDespachos = lineaDespachos.map((t) =>
          t.id === updatedLineaDespacho.id ? updatedLineaDespacho : t
        );
        setLineaDespachos(updatedLineaDespachos);
        showToast("success", "Éxito", "LineaDespacho actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newLineaDespacho = await createLineaDespacho({
          ...data,
          idRefineria: activeRefineria.id,
        });
        setLineaDespachos([...lineaDespachos, newLineaDespacho]);
        showToast("success", "Éxito", "LineaDespacho creado");
      }
      hideLineaDespachoFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar lineaDespacho:", error);
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setSubmitting(false); // Desactivar el estado de envío
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid formgrid p-fluid">
          <div className="field mb-4 col-12">
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

          <div className="field mb-4 col-12">
            <label htmlFor="ubicacion" className="font-medium text-900">
              Ubicación
            </label>
            <InputText
              id="ubicacion"
              type="text"
              className={classNames("w-full", {
                "p-invalid": errors.ubicacion,
              })}
              {...register("ubicacion")}
            />
            {errors.ubicacion && (
              <small className="p-error">{errors.ubicacion.message}</small>
            )}
          </div>

          <div className="col-12">
            <Button
              type="submit"
              disabled={submitting} // Deshabilitar el botón mientras se envía
              icon={submitting ? "pi pi-spinner pi-spin" : ""} // Mostrar ícono de carga
              label={
                lineaDespacho
                  ? "Modificar lineaDespacho"
                  : "Crear lineaDespacho"
              }
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default LineaDespachoForm;

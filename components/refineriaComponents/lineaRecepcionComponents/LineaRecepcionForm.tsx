"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { lineaRecepcionSchema } from "@/libs/zod";
import {
  createLineaRecepcion,
  updateLineaRecepcion,
} from "@/app/api/lineaRecepcionService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Checkbox } from "primereact/checkbox";

type FormData = z.infer<typeof lineaRecepcionSchema>;

interface LineaRecepcionFormProps {
  lineaRecepcion: any;
  hideLineaRecepcionFormDialog: () => void;
  lineaRecepcions: any[];
  setLineaRecepcions: (lineaRecepcions: any[]) => void;
  setLineaRecepcion: (lineaRecepcion: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];

const LineaRecepcionForm = ({
  lineaRecepcion,
  hideLineaRecepcionFormDialog,
  lineaRecepcions,
  setLineaRecepcions,
  showToast,
}: LineaRecepcionFormProps) => {
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
    resolver: zodResolver(lineaRecepcionSchema),
  });
  useEffect(() => {
    if (lineaRecepcion) {
      Object.keys(lineaRecepcion).forEach((key) =>
        setValue(key as keyof FormData, lineaRecepcion[key])
      );
      if (Array.isArray(lineaRecepcion.material)) {
      }
    }
  }, [lineaRecepcion, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (lineaRecepcion) {
        const updatedLineaRecepcion = await updateLineaRecepcion(
          lineaRecepcion.id,
          {
            ...data,
            idRefineria: activeRefineria?.id,
          }
        );
        const updatedLineaRecepcions = lineaRecepcions.map((t) =>
          t.id === updatedLineaRecepcion.id ? updatedLineaRecepcion : t
        );
        setLineaRecepcions(updatedLineaRecepcions);
        showToast("success", "Éxito", "LineaRecepcion actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newLineaRecepcion = await createLineaRecepcion({
          ...data,
          idRefineria: activeRefineria.id,
        });
        setLineaRecepcions([...lineaRecepcions, newLineaRecepcion]);
        showToast("success", "Éxito", "LineaRecepcion creado");
      }
      hideLineaRecepcionFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar lineaRecepcion:", error);
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
                lineaRecepcion
                  ? "Modificar lineaRecepcion"
                  : "Crear lineaRecepcion"
              }
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default LineaRecepcionForm;

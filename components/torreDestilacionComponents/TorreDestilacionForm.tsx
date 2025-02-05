"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { torreDestilacionSchema } from "@/libs/zod";
import {
  createTorreDestilacion,
  updateTorreDestilacion,
} from "@/app/api/torreDestilacionService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Checkbox } from "primereact/checkbox";

type FormData = z.infer<typeof torreDestilacionSchema>;

interface TorreDestilacionFormProps {
  torreDestilacion: any;
  hideTorreDestilacionFormDialog: () => void;
  torresDestilacion: any[];
  setTorresDestilacion: (torresDestilacion: any[]) => void;
  setTorreDestilacion: (torreDestilacion: any) => void;
}

const materiales = [
  "Nafta",
  "Fuel Oil 4 (MOG)",
  "Fuel Oil 6 (Fondo)",
  "Queroseno",
  "Petroleo Crudo",
];
const estatusValues = ["true", "false"];

function TorreDestilacionForm({
  torreDestilacion,
  hideTorreDestilacionFormDialog,
  torresDestilacion,
  setTorresDestilacion,
}: TorreDestilacionFormProps) {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(torreDestilacionSchema),
  });

  useEffect(() => {
    if (torreDestilacion) {
      Object.keys(torreDestilacion).forEach((key) =>
        setValue(key as keyof FormData, torreDestilacion[key])
      );
      if (Array.isArray(torreDestilacion.material)) {
        setCheckboxValue(torreDestilacion.material);
      }
    }
  }, [torreDestilacion, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (torreDestilacion) {
        const updatedTorre = await updateTorreDestilacion(
          torreDestilacion.id,
          data
        );
        const updatedTorres = torresDestilacion.map((t) =>
          t.id === updatedTorre.id ? updatedTorre : t
        );
        setTorresDestilacion(updatedTorres);
        showToast("success", "Éxito", "Torre de destilación actualizada");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newTorre = await createTorreDestilacion({
          ...data,
          id_refineria: activeRefineria.id,
        });
        setTorresDestilacion([...torresDestilacion, newTorre.torre]);
        showToast("success", "Éxito", "Torre de destilación creada");
      }
      hideTorreDestilacionFormDialog();
    } catch (error) {
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    }
  };

  const showToast = (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  const onCheckboxChange = (e: any) => {
    const selectedValues = e.checked
      ? [...checkboxValue, e.value]
      : checkboxValue.filter((val) => val !== e.value);
    setCheckboxValue(selectedValues);
    setValue("material", selectedValues);
  };
  console.log(errors);
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

          <div className="field mb-4 col-12">
            <label htmlFor="material" className="font-medium text-900">
              Material
            </label>
            {materiales.map((material) => (
              <div key={material} className="field-checkbox">
                <Checkbox
                  inputId={material}
                  name="material"
                  value={material}
                  checked={checkboxValue.includes(material)}
                  onChange={onCheckboxChange}
                />
                <label htmlFor={material}>{material}</label>
              </div>
            ))}
            {errors.material && (
              <small className="p-error">{errors.material.message}</small>
            )}
          </div>

          <div className="col-12">
            <Button
              type="submit"
              label={
                torreDestilacion
                  ? "Modificar torre de destilación"
                  : "Crear torre de destilación"
              }
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default TorreDestilacionForm;

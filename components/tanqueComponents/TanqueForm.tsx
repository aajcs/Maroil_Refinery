"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { tanqueSchema } from "@/libs/zod";
import { createTanque, updateTanque } from "@/app/api/tanqueService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Checkbox } from "primereact/checkbox";

type FormData = z.infer<typeof tanqueSchema>;

interface TanqueFormProps {
  tanque: any;
  hideTanqueFormDialog: () => void;
  tanques: any[];
  setTanques: (tanques: any[]) => void;
  setTanque: (tanque: any) => void;
}
const materiales = [
  "Nafta",
  "Fuel Oil 4 (MOG)",
  "Fuel Oil 6 (Fondo)",
  "Queroseno",
  "Petroleo Crudo",
];
const estatusValues = ["true", "false"];

function TanqueForm({
  tanque,
  hideTanqueFormDialog,
  tanques,
  setTanques,
}: TanqueFormProps) {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [checkboxValue, setCheckboxValue] = useState<string[]>([]);
  console.log(tanque);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(tanqueSchema),
  });
  // console.log("error del formulario", errors);
  useEffect(() => {
    if (tanque) {
      Object.keys(tanque).forEach((key) =>
        setValue(key as keyof FormData, tanque[key])
      );
      if (Array.isArray(tanque.material)) {
        setCheckboxValue(tanque.material);
      }
    }
  }, [tanque, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (tanque) {
        const updatedTorre = await updateTanque(tanque.id, data);
        console.log(updatedTorre);
        const updatedTanques = tanques.map((t) =>
          t.id === updatedTorre.id ? updatedTorre : t
        );
        setTanques(updatedTanques);
        showToast("success", "Éxito", "Tanque actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newTorre = await createTanque({
          ...data,
          id_refineria: activeRefineria.id,
        });
        console.log(newTorre);
        setTanques([...tanques, newTorre.tanque]);
        showToast("success", "Éxito", "Tanque creado");
      }
      hideTanqueFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar tanque:", error);
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
          <div className="field mb-4 col-12">
            <label htmlFor="capacidad" className="font-medium text-900">
              Capacidad
            </label>
            <InputText
              id="capacidad"
              type="number"
              className={classNames("w-full", {
                "p-invalid": errors.capacidad,
              })}
              {...register("capacidad", { valueAsNumber: true })}
            />
            {errors.capacidad && (
              <small className="p-error">{errors.capacidad.message}</small>
            )}
          </div>

          <div className="field mb-4 col-12">
            <label htmlFor="almacenamiento" className="font-medium text-900">
              Almacenamiento
            </label>
            <InputText
              id="almacenamiento"
              type="number"
              className={classNames("w-full", {
                "p-invalid": errors.almacenamiento,
              })}
              {...register("almacenamiento", { valueAsNumber: true })}
            />
            {errors.almacenamiento && (
              <small className="p-error">{errors.almacenamiento.message}</small>
            )}
          </div>
          <div className="col-12">
            <Button
              type="submit"
              label={tanque ? "Modificar tanque" : "Crear tanque"}
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default TanqueForm;

"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { set, z } from "zod";
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
  { estadoMaterial: "True", posicion: "1", nombre: "Nafta" },
  { estadoMaterial: "True", posicion: "2", nombre: "Queroseno" },
  { estadoMaterial: "True", posicion: "3", nombre: "Fuel Oil 4 (MOG)" },
  { estadoMaterial: "True", posicion: "4", nombre: "Fuel Oil 6 (Fondo)" },
  { estadoMaterial: "True", posicion: "5", nombre: "Petroleo Crudo" },
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
  const [selectedMaterials, setSelectedMaterials] = useState<
    { estadoMaterial: string; posicion: string; nombre: string }[]
  >([]);
  const [materialStates, setMaterialStates] = useState<{
    [key: string]: string;
  }>({});
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(torreDestilacionSchema),
  });

  // Inicializar el formulario con los datos de la torre de destilación
  useEffect(() => {
    if (torreDestilacion) {
      Object.keys(torreDestilacion).forEach((key) =>
        setValue(key as keyof FormData, torreDestilacion[key])
      );
      if (Array.isArray(torreDestilacion.material)) {
        setSelectedMaterials(torreDestilacion.material);

        // Crear un objeto para almacenar los estados de los materiales
        const materialStates = torreDestilacion.material.reduce(
          (
            acc: Record<string, string>,
            material: { estadoMaterial: string; posicion: string }
          ) => {
            acc[material.posicion] = material.estadoMaterial;
            return acc;
          },
          {} as Record<string, string>
        );

        setMaterialStates(materialStates);
      }
    }
  }, [torreDestilacion, setValue]);

  // Manejar el envío del formulario
  const onSubmit = async (data: FormData) => {
    try {
      const requestData = {
        ...data,
        material: selectedMaterials, // Enviamos el array de objetos completos
      };

      if (torreDestilacion) {
        const updatedTorre = await updateTorreDestilacion(
          torreDestilacion.id,
          requestData
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
          ...requestData,
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

  // Mostrar notificaciones Toast
  const showToast = (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };

  // Manejar cambios en los checkboxes de materiales
  const onMaterialChange = (e: {
    value: { estadoMaterial: string; posicion: string; nombre: string };
    checked: boolean;
  }) => {
    let _selectedMaterials = [...selectedMaterials];

    if (e.checked) {
      // Agregar el material seleccionado
      _selectedMaterials.push(e.value);
    } else {
      // Eliminar el material deseleccionado
      _selectedMaterials = _selectedMaterials.filter(
        (material) => material.posicion !== e.value.posicion
      );
    }
    console.log(_selectedMaterials);
    setValue("material", _selectedMaterials);
    setSelectedMaterials(_selectedMaterials);
  };
  const onMaterialStateChange = (
    e: { value: string; checked: boolean },
    posicion: string
  ) => {
    setMaterialStates({
      ...materialStates,
      [posicion]: e.checked ? "True" : "False",
    });

    let _selectedMaterials = [...selectedMaterials];
    const materialIndex = _selectedMaterials.findIndex(
      (material) => material.posicion === posicion
    );

    if (materialIndex !== -1) {
      _selectedMaterials[materialIndex].estadoMaterial = e.checked
        ? "True"
        : "False";
      console.log(_selectedMaterials);
      setSelectedMaterials(_selectedMaterials);
      setValue("material", _selectedMaterials);
    }
  };
  console.log(errors);
  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid formgrid p-fluid">
          {/* Campo: Nombre */}
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

          {/* Campo: Estado */}
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

          {/* Campo: Ubicación */}
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

          {/* Campo: Material */}
          <div className="field mb-4 col-12">
            <label htmlFor="material" className="font-medium text-900">
              Material
            </label>
            {materiales.map((material) => (
              <div key={material.posicion} className="field-checkbox">
                <Checkbox
                  inputId={material.posicion}
                  name="material"
                  value={material}
                  onChange={(e) =>
                    onMaterialChange({
                      value: material,
                      checked: e.checked ?? false,
                    })
                  }
                  checked={selectedMaterials.some(
                    (selected) => selected.posicion === material.posicion
                  )}
                />
                <label htmlFor={material.posicion}>{material.nombre}</label>
                <Checkbox
                  inputId={`estado-${material.posicion}`}
                  name={`estado-${material.posicion}`}
                  value={material.estadoMaterial}
                  onChange={(e) =>
                    onMaterialStateChange(
                      { value: e.value, checked: e.checked ?? false },
                      material.posicion
                    )
                  }
                  checked={materialStates[material.posicion] === "True"}
                />
                <label htmlFor={`estado-${material.posicion}`}>Estado</label>
              </div>
            ))}
          </div>

          {/* Botón de envío */}
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

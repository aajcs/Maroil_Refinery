"use client";
import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { refineriaSchema } from "@/libs/zod";
import { createRefineria, updateRefineria } from "@/app/api/refineriaService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";

type FormData = z.infer<typeof refineriaSchema>;

interface RefineriaFormProps {
  refineria: any;
  hideRefineriaFormDialog: () => void;
  refinerias: any[];
  setRefinerias: (refinerias: any[]) => void;
}

function RefineriaForm({
  refineria,
  hideRefineriaFormDialog,
  refinerias,
  setRefinerias,
}: RefineriaFormProps) {
  const toast = useRef<Toast | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(refineriaSchema),
  });

  useEffect(() => {
    if (refineria) {
      setValue("nombre", refineria.nombre);
      setValue("estado", refineria.estado);
      setValue("eliminado", refineria.eliminado);
      setValue("ubicacion", refineria.ubicacion);
      setValue("nit", refineria.nit);
      setValue("img", refineria.img);
      setValue("createdAt", refineria.createdAt);
      setValue("updatedAt", refineria.updatedAt);
      setValue("id", refineria.id);
    }
  }, [refineria, setValue]);

  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < refinerias.length; i++) {
      if (refinerias[i].id === id) {
        index = i;
        break;
      }
    }
    return index;
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (refineria) {
        // Actualizar la refinería en el backend
        const refineriaActualizada = await updateRefineria(refineria.id, data);

        // Encontrar el índice de la refinería actualizada en el arreglo local
        const index = findIndexById(refineria.id);

        if (index !== -1) {
          // Crear una copia del arreglo de refinerías
          const _refinerias = [...refinerias];

          // Actualizar la refinería en la copia del arreglo
          _refinerias[index] = refineriaActualizada;

          // Actualizar el estado local con el nuevo arreglo
          setRefinerias(_refinerias);

          // Mostrar notificación de éxito
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Refinería Actualizada",
            life: 3000,
          });

          // Cerrar el diálogo del formulario
          hideRefineriaFormDialog();
        } else {
          // Mostrar notificación de error si no se encuentra la refinería
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo encontrar la refinería",
            life: 3000,
          });
        }
      } else {
        // Crear una nueva refinería
        const refineriaCreada = await createRefineria(data);

        // Actualizar el estado local con la nueva refinería
        // setRefinerias([...refinerias, refineriaCreada]);

        // Mostrar notificación de éxito
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Refinería Creada",
          life: 3000,
        });

        // Cerrar el diálogo del formulario
        // hideRefineriaFormDialog();
      }
    } catch (error) {
      // Mostrar notificación de error si algo falla
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "Ocurrió un error al procesar la solicitud",
        life: 3000,
      });
      console.error("Error al procesar la solicitud:", error);
    }
  };

  const estatusValues = ["true", "false"];

  return (
    <div className="card">
      <Toast ref={toast} />
      {!refineria && (
        <span className="text-900 text-xl font-bold mb-4 block">
          Crear Refinería
        </span>
      )}
      <div className="grid">
        {!refineria && (
          <div className="col-12 lg:col-2">
            <div className="text-900 font-medium text-xl mb-3">Perfil</div>
            <p className="m-0 p-0 text-600 line-height-3 mr-3">
              Todos los campos son obligatorios.
            </p>
          </div>
        )}
        <div className="col-12 lg:col-10">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid formgrid p-fluid">
              <div className="field mb-4 col-12">
                <label htmlFor="nombre" className="font-medium text-900">
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
                  className={classNames("w-full", {
                    "p-invalid": errors.estado,
                  })}
                />
                {errors.estado && (
                  <small className="p-error">{errors.estado.message}</small>
                )}
              </div>

              <div className="field mb-4 col-12 md:col-6">
                <label htmlFor="eliminado" className="font-medium text-900">
                  Eliminado
                </label>
                <Dropdown
                  id="eliminado"
                  value={watch("eliminado")}
                  onChange={(e) => setValue("eliminado", e.value)}
                  options={estatusValues}
                  placeholder="Seleccionar"
                  className={classNames("w-full", {
                    "p-invalid": errors.eliminado,
                  })}
                />
                {errors.eliminado && (
                  <small className="p-error">{errors.eliminado.message}</small>
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
                <label htmlFor="nit" className="font-medium text-900">
                  NIT
                </label>
                <InputText
                  id="nit"
                  type="text"
                  className={classNames("w-full", {
                    "p-invalid": errors.nit,
                  })}
                  {...register("nit")}
                />
                {errors.nit && (
                  <small className="p-error">{errors.nit.message}</small>
                )}
              </div>

              <div className="field mb-4 col-12">
                <label htmlFor="img" className="font-medium text-900">
                  Imagen
                </label>
                <InputText
                  id="img"
                  type="text"
                  className={classNames("w-full", {
                    "p-invalid": errors.img,
                  })}
                  {...register("img")}
                />
                {errors.img && (
                  <small className="p-error">{errors.img.message}</small>
                )}
              </div>

              <div className="col-12">
                <Button
                  type="submit"
                  label={refineria ? "Modificar Refinería" : "Crear Refinería"}
                  className="w-auto mt-3"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RefineriaForm;

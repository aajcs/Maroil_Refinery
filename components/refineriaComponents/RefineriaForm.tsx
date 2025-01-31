"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import { profileSchema } from "@/libs/zod";
import { createUser, updateUser } from "@/app/api/userService";
import { Toast } from "primereact/toast";

type FormData = z.infer<typeof profileSchema>;

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
  console.log(refineria);
  const toast = useRef<Toast | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(profileSchema),
  });
  useEffect(() => {
    if (refineria) {
      setValue("nombre", refineria.nombre);
      setValue("correo", refineria.correo);
      setValue("password", refineria.password);
      setValue("rol", refineria.rol);
      setValue("acceso", refineria.acceso);
      setValue("estado", refineria.estado);
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
        // Actualizar el refineria en el backend
        const refineriaActualizado = await updateUser(refineria.id, data);

        // Encontrar el índice del refineria actualizado en el arreglo local
        const index = findIndexById(refineria.id);

        if (index !== -1) {
          // Crear una copia del arreglo de refinerias
          const _refinerias = [...refinerias];

          // Actualizar el refineria en la copia del arreglo
          _refinerias[index] = refineriaActualizado;

          // Actualizar el estado local con el nuevo arreglo
          setRefinerias(_refinerias);

          // Mostrar notificación de éxito
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Refineria Actualizado",
            life: 3000,
          });

          // Cerrar el diálogo del formulario
          hideRefineriaFormDialog();
        } else {
          // Mostrar notificación de error si no se encuentra el refineria
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo encontrar el refineria",
            life: 3000,
          });
        }
      } else {
        // Crear un nuevo refineria
        const refineriaCreado = await createUser(data);

        // Actualizar el estado local con el nuevo refineria
        // setRefinerias([...refinerias, refineriaCreado]);

        // Mostrar notificación de éxito
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Refineria Creado",
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

  const rolValues = ["superAdmin", "admin", "operador", "user", "lectura"];

  const accesoValues = ["completo", "limitado", "ninguno"];

  return (
    <div className="card">
      <Toast ref={toast} />
      {!refineria && (
        <span className="text-900 text-xl font-bold mb-4 block">
          Crear Refineria
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
                <label htmlFor="correo" className="font-medium text-900">
                  Correo Electrónico
                </label>
                <InputText
                  id="correo"
                  type="text"
                  className={classNames("w-full", {
                    "p-invalid": errors.correo,
                  })}
                  {...register("correo")}
                />
                {errors.correo && (
                  <small className="p-error">{errors.correo.message}</small>
                )}
              </div>

              <div className="field mb-4 col-12 md:col-6">
                <label htmlFor="password" className="font-medium text-900">
                  Contraseña
                </label>
                <InputText
                  id="password"
                  type="password"
                  className={classNames("w-full", {
                    "p-invalid": errors.password,
                  })}
                  {...register("password")}
                />
                {errors.password && (
                  <small className="p-error">{errors.password.message}</small>
                )}
              </div>

              <div className="field mb-4 col-12 md:col-6">
                <label htmlFor="rol" className="font-medium text-900">
                  Rol
                </label>
                <Dropdown
                  id="rol"
                  value={watch("rol")}
                  onChange={(e) => setValue("rol", e.value)}
                  options={rolValues}
                  //   optionLabel="name"
                  placeholder="Seleccionar"
                  className={classNames("w-full", {
                    "p-invalid": errors.rol,
                  })}
                />
                {errors.rol && (
                  <small className="p-error">{errors.rol.message}</small>
                )}
              </div>
              <div className="field mb-4 col-12 md:col-6">
                <label htmlFor="acceso" className="font-medium text-900">
                  acceso
                </label>
                <Dropdown
                  id="acceso"
                  value={watch("acceso")}
                  onChange={(e) => setValue("acceso", e.value)}
                  options={accesoValues}
                  //   optionLabel="name"
                  placeholder="Seleccionar"
                  className={classNames("w-full", {
                    "p-invalid": errors.acceso,
                  })}
                />
                {errors.rol && (
                  <small className="p-error">{errors.rol.message}</small>
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
                  //   optionLabel="name"
                  placeholder="Seleccionar"
                  className={classNames("w-full", {
                    "p-invalid": errors.estado,
                  })}
                />
                {errors.estado && (
                  <small className="p-error">{errors.estado.message}</small>
                )}
              </div>

              <div className="col-12">
                <Button
                  type="submit"
                  label={refineria ? "Modificar Refineria" : "Crear Refineria"}
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

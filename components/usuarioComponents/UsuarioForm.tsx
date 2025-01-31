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

interface UsuarioFormProps {
  usuario: any;
  hideUsuarioFormDialog: () => void;
  usuarios: any[];
  setUsuarios: (usuarios: any[]) => void;
}
function UsuarioForm({
  usuario,
  hideUsuarioFormDialog,
  usuarios,
  setUsuarios,
}: UsuarioFormProps) {
  console.log(usuario);
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
    if (usuario) {
      setValue("nombre", usuario.nombre);
      setValue("correo", usuario.correo);
      setValue("password", usuario.password);
      setValue("rol", usuario.rol);
      setValue("acceso", usuario.acceso);
      setValue("estado", usuario.estado);
    }
  }, [usuario, setValue]);
  const findIndexById = (id: string) => {
    let index = -1;
    for (let i = 0; i < usuarios.length; i++) {
      if (usuarios[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const onSubmit = async (data: FormData) => {
    try {
      if (usuario) {
        // Actualizar el usuario en el backend
        const usuarioActualizado = await updateUser(usuario.id, data);

        // Encontrar el índice del usuario actualizado en el arreglo local
        const index = findIndexById(usuario.id);

        if (index !== -1) {
          // Crear una copia del arreglo de usuarios
          const _usuarios = [...usuarios];

          // Actualizar el usuario en la copia del arreglo
          _usuarios[index] = usuarioActualizado;

          // Actualizar el estado local con el nuevo arreglo
          setUsuarios(_usuarios);

          // Mostrar notificación de éxito
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Usuario Actualizado",
            life: 3000,
          });

          // Cerrar el diálogo del formulario
          hideUsuarioFormDialog();
        } else {
          // Mostrar notificación de error si no se encuentra el usuario
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo encontrar el usuario",
            life: 3000,
          });
        }
      } else {
        // Crear un nuevo usuario
        const usuarioCreado = await createUser(data);

        // Actualizar el estado local con el nuevo usuario
        // setUsuarios([...usuarios, usuarioCreado]);

        // Mostrar notificación de éxito
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Usuario Creado",
          life: 3000,
        });

        // Cerrar el diálogo del formulario
        // hideUsuarioFormDialog();
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
      {!usuario && (
        <span className="text-900 text-xl font-bold mb-4 block">
          Crear Usuario
        </span>
      )}
      <div className="grid">
        {!usuario && (
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
                  label={usuario ? "Modificar Usuario" : "Crear Usuario"}
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

export default UsuarioForm;

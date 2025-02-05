"use client";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { contactoSchema } from "@/libs/zod";
import { createContacto, updateContacto } from "@/app/api/contactoService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Checkbox } from "primereact/checkbox";

type FormData = z.infer<typeof contactoSchema>;

interface ContactoFormProps {
  contacto: any;
  hideContactoFormDialog: () => void;
  contactos: any[];
  setContactos: (contactos: any[]) => void;
  setContacto: (contacto: any) => void;
}

const estatusValues = ["true", "false"];
const tipoValues = ["cliente", "proveedor"]; // Valores para el campo "tipo"

function ContactoForm({
  contacto,
  hideContactoFormDialog,
  contactos,
  setContactos,
}: ContactoFormProps) {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(contactoSchema),
  });

  useEffect(() => {
    if (contacto) {
      Object.keys(contacto).forEach((key) =>
        setValue(key as keyof FormData, contacto[key])
      );
    }
  }, [contacto, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      if (contacto) {
        const updatedContacto = await updateContacto(contacto.id, data);
        const updatedContactos = contactos.map((t) =>
          t.id === updatedContacto.id ? updatedContacto : t
        );
        setContactos(updatedContactos);
        showToast("success", "Éxito", "Contacto actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newContacto = await createContacto({
          ...data,
          id_refineria: activeRefineria.id,
        });
        setContactos([...contactos, newContacto.contacto]);
        showToast("success", "Éxito", "Contacto creado");
      }
      hideContactoFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar contacto:", error);
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

          {/* Campo: identificacionFiscal */}
          <div className="field mb-4 col-12">
            <label
              htmlFor="identificacionFiscal"
              className="font-medium text-900"
            >
              Identificación Fiscal
            </label>
            <InputText
              id="identificacionFiscal"
              type="text"
              className={classNames("w-full", {
                "p-invalid": errors.identificacionFiscal,
              })}
              {...register("identificacionFiscal")}
            />
            {errors.identificacionFiscal && (
              <small className="p-error">
                {errors.identificacionFiscal.message}
              </small>
            )}
          </div>

          {/* Campo: Correo */}
          <div className="field mb-4 col-12">
            <label htmlFor="correo" className="font-medium text-900">
              Correo
            </label>
            <InputText
              id="correo"
              type="email"
              className={classNames("w-full", { "p-invalid": errors.correo })}
              {...register("correo")}
            />
            {errors.correo && (
              <small className="p-error">{errors.correo.message}</small>
            )}
          </div>

          {/* Campo: Dirección */}
          <div className="field mb-4 col-12">
            <label htmlFor="direccion" className="font-medium text-900">
              Dirección
            </label>
            <InputText
              id="direccion"
              type="text"
              className={classNames("w-full", {
                "p-invalid": errors.direccion,
              })}
              {...register("direccion")}
            />
            {errors.direccion && (
              <small className="p-error">{errors.direccion.message}</small>
            )}
          </div>

          {/* Campo: Teléfono */}
          <div className="field mb-4 col-12">
            <label htmlFor="telefono" className="font-medium text-900">
              Teléfono
            </label>
            <InputText
              id="telefono"
              type="text"
              className={classNames("w-full", { "p-invalid": errors.telefono })}
              {...register("telefono")}
            />
            {errors.telefono && (
              <small className="p-error">{errors.telefono.message}</small>
            )}
          </div>

          {/* Campo: Tipo (Cliente/Proveedor) */}
          <div className="field mb-4 col-12">
            <label htmlFor="tipo" className="font-medium text-900">
              Tipo
            </label>
            <Dropdown
              id="tipo"
              value={watch("tipo")}
              onChange={(e) => setValue("tipo", e.value)}
              options={tipoValues}
              placeholder="Seleccionar"
              className={classNames("w-full", { "p-invalid": errors.tipo })}
            />
            {errors.tipo && (
              <small className="p-error">{errors.tipo.message}</small>
            )}
          </div>

          {/* Campo: Representante Legal */}
          <div className="field mb-4 col-12">
            <label
              htmlFor="representanteLegal"
              className="font-medium text-900"
            >
              Representante Legal
            </label>
            <InputText
              id="representanteLegal"
              type="text"
              className={classNames("w-full", {
                "p-invalid": errors.representanteLegal,
              })}
              {...register("representanteLegal")}
            />
            {errors.representanteLegal && (
              <small className="p-error">
                {errors.representanteLegal.message}
              </small>
            )}
          </div>

          {/* Campo: Estado */}
          <div className="field mb-4 col-12">
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

          {/* Botón de Envío */}
          <div className="col-12">
            <Button
              type="submit"
              label={contacto ? "Modificar contacto" : "Crear contacto"}
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContactoForm;

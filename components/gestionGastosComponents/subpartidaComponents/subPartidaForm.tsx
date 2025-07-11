"use client";

import React, { useEffect, useRef, useState } from "react";
import { getPartidas } from "@/app/api/partidaService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { subPartidaSchema } from "@/libs/zods";

import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import {
  createSubPartida, 
  updateSubPartida,
} from "@/app/api/subPartidaService"; 
import { useRefineryData } from "@/hooks/useRefineryData";
import { ProgressSpinner } from "primereact/progressspinner";
import { handleFormError } from "@/utils/errorHandlers";

type SubPartidaFormProps = {
  subPartida: any;
  hideSubPartidaFormDialog: () => void;
  subPartidas: any[];
  setSubPartidas: (subPartidas: any[]) => void;
  setSubPartida: (subPartida: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
  toast: React.RefObject<Toast> | null;
};

// MinimalSubPartida solo con los campos requeridos para el formulario
type MinimalSubPartida = Pick<z.infer<typeof subPartidaSchema>, 'codigo' | 'descripcion' | 'idPartida'>;

const SubPartidaForm = ({
  subPartida,
  toast,
  hideSubPartidaFormDialog,
  subPartidas,
  setSubPartidas,
  showToast,
}: SubPartidaFormProps) => {
  // Estado y carga de partidas para el dropdown
  const [partidas, setPartidas] = useState<any[]>([]);
  const [loadingPartidas, setLoadingPartidas] = useState(false);
console.log (partidas)
  useEffect(() => {
    setLoadingPartidas(true);
    getPartidas()
      .then((data) => {
        // Si la respuesta es un array, úsala directamente. Si es un objeto con "partidas", usa ese array.
        if (Array.isArray(data)) {
          setPartidas(data);
        } else if (data && Array.isArray(data.partidas)) {
          setPartidas(data.partidas);
        } else {
          setPartidas([]);
        }
      })
      .finally(() => setLoadingPartidas(false));
  }, []);
  const { activeRefineria } = useRefineriaStore();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<MinimalSubPartida>({
    resolver: zodResolver(subPartidaSchema.pick({ codigo: true, descripcion: true, idPartida: true })),
  });
  const watchIdPartida = watch("idPartida");
  useEffect(() => {
    if (subPartida) {
      setValue("codigo", subPartida.codigo);
      setValue("descripcion", subPartida.descripcion);
      setValue("idPartida", subPartida.idPartida);
    }
  }, [subPartida, setValue]);
  const onSubmit = async (data: MinimalSubPartida) => {
    setSubmitting(true);
    try {
      if (subPartida) {
        const updatedSubPartida = await updateSubPartida(
          subPartida.id,
          {
            codigo: data.codigo,
            descripcion: data.descripcion,
            idPartida: data.idPartida,
            idRefineria: activeRefineria?.id,
          }
        );
        const updatedSubPartidas = subPartidas.map((t: any) =>
          t.id === updatedSubPartida.id ? updatedSubPartida : t
        );
        setSubPartidas(updatedSubPartidas);
        showToast("success", "Éxito", "SubPartida actualizada");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newSubPartida = await createSubPartida({
          codigo: data.codigo,
          descripcion: data.descripcion,
          idPartida: data.idPartida,
          idRefineria: activeRefineria.id,
        });
        setSubPartidas([...subPartidas, newSubPartida]);
        showToast("success", "Éxito", "SubPartida creada");
      }
      hideSubPartidaFormDialog();
    } catch (error) {
      handleFormError(error, toast);
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card p-fluid surface-50 p-3 border-round shadow-2">
          <div className="mb-2 text-center md:text-left">
            <div className="border-bottom-2 border-primary pb-2">
              <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
                <i className="pi pi-check-circle mr-3 text-primary text-3xl"></i>
                {subPartida ? "Modificar SubPartida" : "Crear SubPartida"}
              </h2>
            </div>
          </div>
          <div className="grid formgrid row-gap-2">
            {/* Campo: Partida */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-list mr-2 text-primary"></i>
                  Partida
                </label>
                <Dropdown
                  id="idPartida"
                  value={watch("idPartida")}
                  onChange={(e) => setValue("idPartida", e.value)}
                  options={Array.isArray(partidas)
                    ? partidas.map((partida) => ({
                        label: partida.descripcion,
                        value: partida.id,
                      }))
                    : []}
                  placeholder={loadingPartidas ? "Cargando partidas..." : (partidas.length === 0 ? "No hay partidas disponibles" : "Seleccionar un producto")}
                  className={classNames("w-full", {
                    "p-invalid": errors.idPartida,
                  })}
                  disabled={loadingPartidas || partidas.length === 0}
                />
                {errors.idPartida && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.idPartida?.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Código */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-hashtag mr-2 text-primary"></i>
                  Código
                </label>
                <InputText
                  id="codigo"
                  type="number"
                  className={classNames("w-full", {
                    "p-invalid": errors.codigo,
                  })}
                  {...register("codigo", { valueAsNumber: true })}
                />
                {errors.codigo && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.codigo?.message}
                  </small>
                )}
              </div>
            </div>
            {/* Campo: Descripción */}
            <div className="col-12 md:col-6 lg:col-4">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-align-left mr-2 text-primary"></i>
                  Descripción
                </label>
                <InputText
                  id="descripcion"
                  type="text"
                  className={classNames("w-full", {
                    "p-invalid": errors.descripcion,
                  })}
                  {...register("descripcion")}
                />
                {errors.descripcion && (
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.descripcion?.message}
                  </small>
                )}
              </div>
            </div>
          </div>
          <div className="col-12 flex justify-content-between align-items-center mt-3">
            <Button
              type="submit"
              disabled={submitting}
              icon={submitting ? "pi pi-spinner pi-spin" : ""}
              label={subPartida ? "Modificar SubPartida" : "Crear SubPartida"}
              className="w-auto"
            />
            <Button
              type="button"
              label="Salir"
              onClick={() => hideSubPartidaFormDialog()}
              className="w-auto"
              severity="danger"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default SubPartidaForm;

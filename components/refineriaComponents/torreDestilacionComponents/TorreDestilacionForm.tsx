"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Material, Producto } from "@/libs/interfaces";
import { getProductos } from "@/app/api/productoService";
import { MultiSelect } from "primereact/multiselect";

type FormData = z.infer<typeof torreDestilacionSchema>;

interface TorreDestilacionFormProps {
  torreDestilacion: any;
  hideTorreDestilacionFormDialog: () => void;
  torresDestilacion: any[];
  setTorresDestilacion: (torresDestilacion: any[]) => void;
  setTorreDestilacion: (torreDestilacion: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];

const TorreDestilacionForm = ({
  torreDestilacion,
  hideTorreDestilacionFormDialog,
  torresDestilacion,
  setTorresDestilacion,
  showToast,
}: TorreDestilacionFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Estado para materiales seleccionados
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(torreDestilacionSchema),
  });

  const fetchData = useCallback(async () => {
    try {
      const productosDB = await getProductos();
      if (productosDB && Array.isArray(productosDB.productos)) {
        const filteredProductos = productosDB.productos.filter(
          (producto: Producto) =>
            producto.idRefineria.id === activeRefineria?.id
        );
        setProductos(filteredProductos);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [activeRefineria]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (torreDestilacion && torreDestilacion.material) {
      Object.keys(torreDestilacion).forEach((key) =>
        setValue(key as keyof FormData, torreDestilacion[key])
      );
      setSelectedMaterials(torreDestilacion.material);
    }
  }, [torreDestilacion]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const requestData = {
        ...data,
        material: selectedMaterials,
      };

      if (torreDestilacion) {
        const updatedTorre = await updateTorreDestilacion(torreDestilacion.id, {
          ...requestData,
          idRefineria: activeRefineria?.id,
        });
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
          idRefineria: activeRefineria.id,
        });
        setTorresDestilacion([...torresDestilacion, newTorre]);
        showToast("success", "Éxito", "Torre de destilación creada");
      }
      hideTorreDestilacionFormDialog();
    } catch (error) {
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="card p-fluid surface-50 p-3 border-round shadow-2">
          {/* Header del Formulario */}
          <div className="mb-2 text-center md:text-left">
            <div className="border-bottom-2 border-primary pb-2">
              <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
                <i className="pi pi-check-circle mr-3 text-primary text-3xl"></i>
                {torreDestilacion
                  ? "Modificar Torre de Destilación"
                  : "Crear Torre de Destilación"}
              </h2>
            </div>
          </div>

          {/* Cuerpo del Formulario */}
          <div className="grid formgrid row-gap-2">
            {/* Campo: Nombre */}
            <div className="col-12 md:col-6 ">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-tag mr-2 text-primary"></i>
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
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.nombre.message}
                  </small>
                )}
              </div>
            </div>

            {/* Campo: Estado
            <div className="col-12 md:col-6 lg:col-4 xl:col-3">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-info-circle mr-2 text-primary"></i>
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
                  <small className="p-error block mt-2 flex align-items-center">
                    <i className="pi pi-exclamation-circle mr-2"></i>
                    {errors.estado.message}
                  </small>
                )}
              </div>
            </div> */}

            {/* Campo: Materiales */}
            <div className="col-12 ">
              <div className="p-2 bg-white border-round shadow-1 surface-card">
                <label className="block font-medium text-900 mb-3 flex align-items-center">
                  <i className="pi pi-box mr-2 text-primary"></i>
                  Materiales
                </label>
                <MultiSelect
                  value={selectedMaterials.map((m) => m.idProducto)}
                  options={productos}
                  optionLabel="nombre"
                  onChange={(e) => {
                    const selected = e.value as Producto[];
                    const materials: any[] = selected.map((producto) => ({
                      idProducto: producto,
                      estadoMaterial: "True",
                    }));
                    setSelectedMaterials(materials as any);
                  }}
                  display="chip"
                  placeholder="Seleccionar materiales"
                  maxSelectedLabels={3}
                  className="w-full"
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="col-12 flex justify-content-between align-items-center mt-3">
            <Button
              type="submit"
              disabled={submitting}
              icon={submitting ? "pi pi-spinner pi-spin" : ""}
              label={
                torreDestilacion
                  ? "Modificar Torre de Destilación"
                  : "Crear Torre de Destilación"
              }
              className="w-auto"
            />

            <Button
              type="button"
              label="Salir"
              onClick={() => hideTorreDestilacionFormDialog()}
              className="w-auto"
              severity="danger"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TorreDestilacionForm;

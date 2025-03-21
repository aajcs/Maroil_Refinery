"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { getProductos } from "@/app/api/productoService";
import { Producto } from "@/libs/interfaces";
import { InputSwitch } from "primereact/inputswitch";

type FormData = z.infer<typeof tanqueSchema>;

interface TanqueFormProps {
  tanque: any;
  hideTanqueFormDialog: () => void;
  tanques: any[];
  setTanques: (tanques: any[]) => void;
  setTanque: (tanque: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}
const materiales = [
  "Nafta",
  "Fuel Oil 4 (MGO)",
  "Fuel Oil 6 (Fondo)",
  "Queroseno",
  "Petroleo Crudo",
];
const estatusValues = ["true", "false"];

const TanqueForm = ({
  tanque,
  hideTanqueFormDialog,
  tanques,
  setTanques,
  showToast,
}: TanqueFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(tanqueSchema),
  });
  useEffect(() => {
    if (tanque) {
      Object.keys(tanque).forEach((key) =>
        setValue(key as keyof FormData, tanque[key])
      );
    }
  }, [tanque, setValue]);
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

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    console.log(data);
    try {
      if (tanque) {
        const updatedTorre = await updateTanque(tanque.id, {
          ...data,
          idRefineria: activeRefineria?.id,
          idProducto: data.idProducto.id,
        });
        const updatedTanques = tanques.map((t) =>
          t.id === updatedTorre.id ? updatedTorre : t
        );
        setTanques(updatedTanques);
        showToast("success", "Éxito", "Tanque actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newTanque = await createTanque({
          ...data,
          idRefineria: activeRefineria.id,
          idProducto: data.idProducto.id,
        });
        setTanques([...tanques, newTanque]);
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
    } finally {
      setSubmitting(false); // Desactivar el estado de envío
    }
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

          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre de Producto
            </label>
            <Dropdown
              id="idProducto.id"
              value={watch("idProducto")}
              // {...register("idProducto.id")}
              onChange={(e) => {
                setValue("idProducto", e.value);
              }}
              options={productos.map((producto) => ({
                label: producto.nombre,
                value: {
                  id: producto.id,
                  _id: producto.id,
                  nombre: producto.nombre,
                  color: producto.color,
                },
              }))}
              placeholder="Seleccionar un producto"
              className={classNames("w-full", {
                "p-invalid": errors.idProducto?.nombre,
              })}
            />
            {errors.idProducto?.nombre && (
              <small className="p-error">
                {errors.idProducto.nombre.message}
              </small>
            )}
          </div>
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="almacenamientoMateriaPrimaria"
              className="font-medium text-900"
            >
              Almacenamiento de Materia Prima
            </label>
            <div>
              <InputSwitch
                id="almacenamientoMateriaPrimaria"
                checked={watch("almacenamientoMateriaPrimaria") ?? false}
                className={classNames("", {
                  "p-invalid": errors.almacenamientoMateriaPrimaria,
                })}
                {...register("almacenamientoMateriaPrimaria")}
              />
            </div>
            {errors.almacenamientoMateriaPrimaria && (
              <small className="p-error">
                {errors.almacenamientoMateriaPrimaria.message}
              </small>
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
              disabled={submitting} // Deshabilitar el botón mientras se envía
              icon={submitting ? "pi pi-spinner pi-spin" : ""} // Mostrar ícono de carga
              label={tanque ? "Modificar tanque" : "Crear tanque"}
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TanqueForm;

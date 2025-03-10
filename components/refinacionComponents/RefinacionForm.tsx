import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { refinacionSchema } from "@/libs/zod";
import { Toast } from "primereact/toast";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";

import { InputNumber } from "primereact/inputnumber";

import { Calendar } from "primereact/calendar";
import {
  Contrato,
  Producto,
  Tanque,
  TorreDestilacion,
} from "@/libs/interfaces";
import { getTanques } from "@/app/api/tanqueService";
import { ProgressSpinner } from "primereact/progressspinner";
import { getProductos } from "@/app/api/productoService";
import {
  getTorreDestilacion,
  getTorresDestilacion,
} from "@/app/api/torreDestilacionService";
import {
  createRefinacion,
  updateRefinacion,
} from "@/app/api/refinacionService";

type FormData = z.infer<typeof refinacionSchema>;

interface RefinacionFormProps {
  refinacion: any;
  hideRefinacionFormDialog: () => void;
  refinacions: any[];
  setRefinacions: (refinacions: any[]) => void;
  setRefinacion: (refinacion: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];

const RefinacionForm = ({
  refinacion,
  hideRefinacionFormDialog,
  refinacions,
  setRefinacions,
  showToast,
}: RefinacionFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [torresDestilacion, setTorresDestilacion] = useState<
    TorreDestilacion[]
  >([]);

  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(refinacionSchema),
    defaultValues: {
      cantidadTotal: 0,
    },
  });

  useEffect(() => {
    if (refinacion) {
      Object.keys(refinacion).forEach((key) =>
        setValue(key as keyof FormData, refinacion[key])
      );
    }
  }, [refinacion, setValue]);
  const fetchData = useCallback(async () => {
    try {
      const [productosDB, tanquesDB, torresDestilacionDB] = await Promise.all([
        getProductos(),
        getTanques(),
        getTorresDestilacion(),
      ]);

      if (productosDB && Array.isArray(productosDB.productos)) {
        const filteredProductos = productosDB.productos.filter(
          (producto: Producto) =>
            producto.idRefineria.id === activeRefineria?.id
        );
        setProductos(filteredProductos);
      }
      if (tanquesDB && Array.isArray(tanquesDB.tanques)) {
        const filteredTanques = tanquesDB.tanques.filter(
          (tanque: Tanque) => tanque.idRefineria.id === activeRefineria?.id
        );
        setTanques(filteredTanques);
      }
      if (torresDestilacionDB && Array.isArray(torresDestilacionDB.torres)) {
        const filteredTorresDestilacion = torresDestilacionDB.torres.filter(
          (torre: TorreDestilacion) =>
            torre.idRefineria.id === activeRefineria?.id
        );
        setTorresDestilacion(filteredTorresDestilacion);
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
    console.log(data);
    try {
      if (refinacion) {
        const updatedRefinacion = await updateRefinacion(refinacion.id, {
          ...data,
          idProducto: data.idProducto?.id,
          idTanque: data.idTanque?.id,
          idTorre: data.idTorre?.id,

          idRefineria: activeRefineria?.id,
        });
        const updatedRefinacions = refinacions.map((t) =>
          t.id === updatedRefinacion.id ? updatedRefinacion : t
        );
        setRefinacions(updatedRefinacions);
        showToast("success", "Éxito", "Refinacion actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newRefinacion = await createRefinacion({
          ...data,

          idProducto: data.idProducto?.id,
          idTanque: data.idTanque?.id,
          idTorre: data.idTorre?.id,

          idRefineria: activeRefineria?.id,
        });
        setRefinacions([...refinacions, newRefinacion]);
        showToast("success", "Éxito", "Refinacion creado");
      }
      hideRefinacionFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar refinacion:", error);
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    }
  };

  // console.log(errors);
  // console.log(JSON.stringify(watch("idContrato"), null, 2));
  // console.log(watch("idContrato"));
  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <ProgressSpinner />
        {/* <p className="ml-3">Cargando datos...</p> */}
      </div>
    );
  }
  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid formgrid p-fluid">
          {/* Campo: Nombre del Producto */}

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
                  nombre: producto.nombre,
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

          {/* Campo: Nombre del Tanque */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre de Tanque
            </label>
            <Dropdown
              id="idTanque.id"
              value={watch("idTanque")}
              // {...register("idTanque.id")}
              onChange={(e) => {
                setValue("idTanque", e.value);
              }}
              options={tanques.map((tanque) => ({
                label: tanque.nombre,
                value: {
                  id: tanque.id,
                  nombre: tanque.nombre,
                },
              }))}
              placeholder="Seleccionar un proveedor"
              className={classNames("w-full", {
                "p-invalid": errors.idTanque?.nombre,
              })}
            />
            {errors.idTanque?.nombre && (
              <small className="p-error">
                {errors.idTanque.nombre.message}
              </small>
            )}
          </div>

          {/* Campo: Nombre de la Torre */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre de Torre
            </label>
            <Dropdown
              id="idTorre.id"
              value={watch("idTorre")}
              // {...register("idTorre.id")}
              onChange={(e) => {
                setValue("idTorre", e.value);
              }}
              options={torresDestilacion.map((torre) => ({
                label: torre.nombre,
                value: {
                  id: torre.id,
                  nombre: torre.nombre,
                },
              }))}
              placeholder="Seleccionar un torre"
              className={classNames("w-full", {
                "p-invalid": errors.idTorre?.nombre,
              })}
            />
            {errors.idTorre?.nombre && (
              <small className="p-error">{errors.idTorre.nombre.message}</small>
            )}
          </div>

          {/* Campo: Operador */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="operador" className="font-medium text-900">
              Operador
            </label>
            <InputText
              id="operador"
              value={watch("operador")}
              {...register("operador")}
              className={classNames("w-full", {
                "p-invalid": errors.operador,
              })}
            />
            {errors.operador && (
              <small className="p-error">{errors.operador.message}</small>
            )}
          </div>
          {/* Campo: Fecha de Chequeo */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="fechaChequeo" className="font-medium text-900">
              Fecha de Chequeo
            </label>
            <Calendar
              id="fechaChequeo"
              value={
                watch("fechaChequeo")
                  ? new Date(watch("fechaChequeo") as string | Date)
                  : undefined
              }
              {...register("fechaChequeo")}
              showTime
              hourFormat="24"
              className={classNames("w-full", {
                "p-invalid": errors.fechaChequeo,
              })}
              locale="es"
            />
            {errors.fechaChequeo && (
              <small className="p-error">{errors.fechaChequeo.message}</small>
            )}
          </div>
          {/* Campo: Cantidad Total*/}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="cantidadTotal" className="font-medium text-900">
              Cantidad Total
            </label>
            <Controller
              name="cantidadTotal"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="cantidadTotal"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.cantidadTotal,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.cantidadTotal && (
              <small className="p-error">{errors.cantidadTotal.message}</small>
            )}
          </div>

          {/* Campo: Estado */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estado" className="font-medium text-900">
              Estado
            </label>
            <Dropdown
              id="estado"
              value={watch("estado")}
              {...register("estado")}
              options={estatusValues.map((value) => ({
                label: value,
                value,
              }))}
              placeholder="Seleccionar estado"
              className={classNames("w-full", { "p-invalid": errors.estado })}
            />
            {errors.estado && (
              <small className="p-error">{errors.estado.message}</small>
            )}
          </div>
        </div>
        <div className="col-12">
          <Button
            type="submit"
            label={
              refinacion
                ? "Modificar Chequeo de Cantidad"
                : "Crear Chequeo de Cantidad"
            }
            className="w-auto mt-3"
          />
        </div>
      </form>
    </div>
  );
};

export default RefinacionForm;

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { chequeoCalidadSchema } from "@/libs/zod";
import { Toast } from "primereact/toast";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import {
  createChequeoCalidad,
  updateChequeoCalidad,
} from "@/app/api/chequeoCalidadService";
import { InputNumber } from "primereact/inputnumber";

import { Calendar } from "primereact/calendar";
import {
  Producto,
  Refinacion,
  Tanque,
  TorreDestilacion,
} from "@/libs/interfaces";
import { getTanques } from "@/app/api/tanqueService";
import { ProgressSpinner } from "primereact/progressspinner";
import { getProductos } from "@/app/api/productoService";
import { getTorresDestilacion } from "@/app/api/torreDestilacionService";
import { getRefinacions } from "@/app/api/refinacionService";

type FormData = z.infer<typeof chequeoCalidadSchema>;

interface ChequeoCalidadFormProps {
  chequeoCalidad: any;
  hideChequeoCalidadFormDialog: () => void;
  chequeoCalidads: any[];
  setChequeoCalidads: (chequeoCalidads: any[]) => void;
  setChequeoCalidad: (chequeoCalidad: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];

const ChequeoCalidadForm = ({
  chequeoCalidad,
  hideChequeoCalidadFormDialog,
  chequeoCalidads,
  setChequeoCalidads,
  showToast,
}: ChequeoCalidadFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [productos, setProductos] = useState<Producto[]>([]);

  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [torresDestilacion, setTorresDestilacion] = useState<
    TorreDestilacion[]
  >([]);
  const [refinacions, setRefinacions] = useState<Refinacion[]>([]);

  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(chequeoCalidadSchema),
    defaultValues: {
      azufre: 0,
      contenidoAgua: 0,
      densidad: 0,

      gravedadAPI: 0,

      temperatura: 0,
      viscosidad: 0,
    },
  });

  useEffect(() => {
    if (chequeoCalidad) {
      Object.keys(chequeoCalidad).forEach((key) =>
        setValue(key as keyof FormData, chequeoCalidad[key])
      );
    }
  }, [chequeoCalidad, setValue]);
  const fetchData = useCallback(async () => {
    try {
      const [refinacionsDB, productosDB, tanquesDB, torresDestilacionDB] =
        await Promise.all([
          getRefinacions(),
          getProductos(),
          getTanques(),
          getTorresDestilacion(),
        ]);
      if (refinacionsDB && Array.isArray(refinacionsDB.refinacions)) {
        const filteredRefinacions = refinacionsDB.refinacions.filter(
          (refinacion: Refinacion) =>
            refinacion.idRefineria.id === activeRefineria?.id
        );
        setRefinacions(filteredRefinacions);
      }
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
      if (chequeoCalidad) {
        const updatedChequeoCalidad = await updateChequeoCalidad(
          chequeoCalidad.id,
          {
            ...data,
            idProducto: data.idProducto?.id,
            idTanque: data.idTanque?.id,
            idTorre: data.idTorre?.id,
            idRefinacion: data.idRefinacion?.id,
            idRefineria: activeRefineria?.id,
          }
        );
        const updatedChequeoCalidads = chequeoCalidads.map((t) =>
          t.id === updatedChequeoCalidad.id ? updatedChequeoCalidad : t
        );
        setChequeoCalidads(updatedChequeoCalidads);
        showToast("success", "Éxito", "ChequeoCalidad actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newChequeoCalidad = await createChequeoCalidad({
          ...data,

          idProducto: data.idProducto?.id,
          idTanque: data.idTanque?.id,
          idTorre: data.idTorre?.id,
          idRefinacion: data.idRefinacion?.id,

          idRefineria: activeRefineria?.id,
        });
        setChequeoCalidads([...chequeoCalidads, newChequeoCalidad]);
        showToast("success", "Éxito", "ChequeoCalidad creado");
      }
      hideChequeoCalidadFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar chequeoCalidad:", error);
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
          {/* Campo: Refinacion */}
          <div className="field mb-4 col-12 sm:col-6 lg:4">
            <label htmlFor="idRefinacion" className="font-medium text-900">
              Refinacion
            </label>
            <Dropdown
              id="idRefinacion.id"
              value={watch("idRefinacion")}
              // {...register("idRefinacion.id")}
              onChange={(e) => {
                setValue("idRefinacion", e.value);
              }}
              options={refinacions.map((refinacion) => ({
                label: refinacion.descripcion,
                value: {
                  id: refinacion.id,
                  descripcion: refinacion.descripcion,
                },
              }))}
              placeholder="Seleccionar una refinacion"
              className={classNames("w-full", {
                "p-invalid": errors.idRefinacion?.descripcion,
              })}
            />
            {errors.idRefinacion?.descripcion && (
              <small className="p-error">
                {errors.idRefinacion.descripcion.message}
              </small>
            )}
          </div>

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
                  _id: producto.id,
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
                  _id: tanque.id,
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
                  _id: torre.id,
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
          {/* Campo: Gravedad API */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="gravedadAPI" className="font-medium text-900">
              Gravedad API
            </label>
            <Controller
              name="gravedadAPI"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="gravedadAPI"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.gravedadAPI,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.gravedadAPI && (
              <small className="p-error">{errors.gravedadAPI.message}</small>
            )}
          </div>
          {/* Campo: Azufre */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="azufre" className="font-medium text-900">
              Azufre
            </label>
            <Controller
              name="azufre"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="azufre"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.azufre,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.azufre && (
              <small className="p-error">{errors.azufre.message}</small>
            )}
          </div>
          {/* Campo: Viscosidad */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="viscosidad" className="font-medium text-900">
              Viscosidad
            </label>
            <Controller
              name="viscosidad"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="viscosidad"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.viscosidad,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.viscosidad && (
              <small className="p-error">{errors.viscosidad.message}</small>
            )}
          </div>
          {/* Campo: Densidad */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="densidad" className="font-medium text-900">
              Densidad
            </label>
            <Controller
              name="densidad"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="densidad"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.densidad,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.densidad && (
              <small className="p-error">{errors.densidad.message}</small>
            )}
          </div>
          {/* Campo: Contenido de Agua */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="contenidoAgua" className="font-medium text-900">
              Contenido de Agua
            </label>
            <Controller
              name="contenidoAgua"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="contenidoAgua"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.contenidoAgua,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.contenidoAgua && (
              <small className="p-error">{errors.contenidoAgua.message}</small>
            )}
          </div>
          {/* Campo: Contenido de Plomo */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="contenidoPlomo" className="font-medium text-900">
              Contenido de Plomo
            </label>
            <InputText
              id="contenidoPlomo"
              value={watch("contenidoPlomo")}
              {...register("contenidoPlomo")}
              className={classNames("w-full", {
                "p-invalid": errors.contenidoPlomo,
              })}
            />
            {errors.contenidoPlomo && (
              <small className="p-error">{errors.contenidoPlomo.message}</small>
            )}
          </div>
          {/* Campo: Octanaje */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="octanaje" className="font-medium text-900">
              Octanaje
            </label>
            <InputText
              id="octanaje"
              value={watch("octanaje")}
              {...register("octanaje")}
              className={classNames("w-full", {
                "p-invalid": errors.octanaje,
              })}
            />
            {errors.octanaje && (
              <small className="p-error">{errors.octanaje.message}</small>
            )}
          </div>
          {/* Campo: Temperatura */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="temperatura" className="font-medium text-900">
              Temperatura
            </label>
            <Controller
              name="temperatura"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="temperatura"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.temperatura,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.temperatura && (
              <small className="p-error">{errors.temperatura.message}</small>
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
              chequeoCalidad
                ? "Modificar Chequeo de Calidad"
                : "Crear Chequeo de Calidad"
            }
            className="w-auto mt-3"
          />
        </div>
      </form>
    </div>
  );
};

export default ChequeoCalidadForm;

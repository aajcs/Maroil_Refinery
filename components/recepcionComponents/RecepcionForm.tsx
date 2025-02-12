import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { recepcionSchema } from "@/libs/zod";
import { Toast } from "primereact/toast";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { createRecepcion, updateRecepcion } from "@/app/api/recepcionService";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { Tag } from "primereact/tag";
import { getContactos } from "@/app/api/contactoService";
import { Calendar } from "primereact/calendar";
import { getLineaRecepcions } from "@/app/api/lineaRecepcionService";
import { Contrato, LineaRecepcion, Tanque } from "@/libs/interfaces";
import { getTanques } from "@/app/api/tanqueService";
import { getContratos } from "@/app/api/contratoService";

type FormData = z.infer<typeof recepcionSchema>;

interface RecepcionFormProps {
  recepcion: any;
  hideRecepcionFormDialog: () => void;
  recepcions: any[];
  setRecepcions: (recepcions: any[]) => void;
  setRecepcion: (recepcion: any) => void;
}

interface Contacto {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string;
  createdAt: string;
  updatedAt: string;
  id_refineria: {
    _id: string | undefined;
    id: string;
  };
}
const estatusValues = ["true", "false"];

function RecepcionForm({
  recepcion,
  hideRecepcionFormDialog,
  recepcions,
  setRecepcions,
}: RecepcionFormProps) {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [lineaRecepcions, setLineaRecepcions] = useState<LineaRecepcion[]>([]);
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(recepcionSchema),
  });

  const [productos] = useState<string[]>([
    "Nafta",
    "Queroseno",
    "Fuel Oil 4 (MOG)",
    "Fuel Oil 6 (Fondo)",
    "Petroleo Crudo",
  ]);
  useEffect(() => {
    if (recepcion) {
      Object.keys(recepcion).forEach((key) =>
        setValue(key as keyof FormData, recepcion[key])
      );
    }
  }, [recepcion, setValue]);
  useEffect(() => {
    fetchLineaRecepcions();
    fetchTanques();
  }, [activeRefineria]);

  const fetchLineaRecepcions = async () => {
    try {
      const lineaRecepcionsDB = await getLineaRecepcions();
      if (lineaRecepcionsDB && Array.isArray(lineaRecepcionsDB.linea_cargas)) {
        const filteredLineaRecepcions = lineaRecepcionsDB.linea_cargas.filter(
          (lineaRecepcion: LineaRecepcion) =>
            lineaRecepcion.id_refineria._id === activeRefineria?.id
        );
        setLineaRecepcions(filteredLineaRecepcions);
      } else {
        console.error("La estructura de lineaRecepcionsDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los lineaRecepcions:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchTanques = async () => {
    try {
      const tanquesDB = await getTanques();
      if (tanquesDB && Array.isArray(tanquesDB.tanques)) {
        const filteredTanques = tanquesDB.tanques.filter(
          (tanque: Tanque) => tanque.id_refineria._id === activeRefineria?.id
        );
        setTanques(filteredTanques);
      } else {
        console.error("La estructura de tanquesDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los tanques:", error);
    } finally {
      setLoading(false);
    }
  };
  const fetchContratos = async () => {
    try {
      const contratosDB = await getContratos();
      if (contratosDB && Array.isArray(contratosDB.contratos)) {
        const filteredContratos = contratosDB.contratos.filter(
          (contrato: Contrato) =>
            contrato.id_refineria._id === activeRefineria?.id
        );
        setContratos(filteredContratos);
      } else {
        console.error("La estructura de contratosDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los contratos:", error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data: FormData) => {
    try {
      if (recepcion) {
        const updatedRecepcion = await updateRecepcion(recepcion.id, data);
        const updatedRecepcions = recepcions.map((t) =>
          t.id === updatedRecepcion.id ? updatedRecepcion : t
        );
        setRecepcions(updatedRecepcions);
        showToast("success", "Éxito", "Recepcion actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newRecepcion = await createRecepcion({
          ...data,
          id_refineria: activeRefineria.id,
        });
        console.log(newRecepcion);
        setRecepcions([...recepcions, newRecepcion.nuevoRecepcion]);
        showToast("success", "Éxito", "Recepcion creado");
      }
      hideRecepcionFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar recepcion:", error);
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
          {/* Campo: Estado */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estado" className="font-medium text-900">
              Estado
            </label>
            <Dropdown
              id="estado"
              value={watch("estado")}
              {...register("estado")}
              options={estatusValues}
              placeholder="Seleccionar estado"
              className={classNames("w-full", { "p-invalid": errors.estado })}
            />
            {errors.estado && (
              <small className="p-error">{errors.estado.message}</small>
            )}
          </div>

          {/* Campo: Cantidad Recibida */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="cantidadRecibida" className="font-medium text-900">
              Cantidad Recibida
            </label>
            <Controller
              name="cantidadRecibida"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="cantidadRecibida"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.cantidadRecibida,
                  })}
                  min={0}
                />
              )}
            />
            {errors.cantidadRecibida && (
              <small className="p-error">
                {errors.cantidadRecibida.message}
              </small>
            )}
          </div>

          {/* Campo: Fecha de Inicio */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="fechaInicio" className="font-medium text-900">
              Fecha de Inicio
            </label>
            <Calendar
              id="fechaInicio"
              value={
                watch("fechaInicio")
                  ? new Date(watch("fechaInicio") as string | Date)
                  : undefined
              }
              {...register("fechaInicio")}
              showTime
              hourFormat="24"
              className={classNames("w-full", {
                "p-invalid": errors.fechaInicio,
              })}
              locale="es"
            />
            {errors.fechaInicio && (
              <small className="p-error">{errors.fechaInicio.message}</small>
            )}
          </div>

          {/* Campo: Fecha de Fin */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="fechaFin" className="font-medium text-900">
              Fecha de Fin
            </label>
            <Calendar
              id="fechaFin"
              value={
                watch("fechaFin")
                  ? new Date(watch("fechaFin") as string | Date)
                  : undefined
              }
              {...register("fechaFin")}
              showTime
              hourFormat="24"
              className={classNames("w-full", { "p-invalid": errors.fechaFin })}
              locale="es"
            />
            {errors.fechaFin && (
              <small className="p-error">{errors.fechaFin.message}</small>
            )}
          </div>

          {/* Campo: Número de Contrato */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Numero de Contrato
            </label>
            <Dropdown
              id="id_contrato._id"
              value={watch("id_contrato")}
              // {...register("id_linea._id")}
              onChange={(e) => {
                setValue("id_contrato", e.value);
              }}
              options={contratos.map((contrato) => ({
                label: contrato.numeroContrato,
                value: {
                  _id: contrato.id,
                  nombre: contrato.numeroContrato,
                },
              }))}
              placeholder="Seleccionar un proveedor"
              className={classNames("w-full", {
                "p-invalid": errors.id_contrato?.numeroContrato,
              })}
            />
            {errors.id_contrato?.numeroContrato && (
              <small className="p-error">
                {errors.id_contrato.numeroContrato.message}
              </small>
            )}
          </div>
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contrato.numeroContrato"
              className="font-medium text-900"
            >
              Número de Contrato
            </label>
            <InputText
              id="id_contrato.numeroContrato"
              {...register("id_contrato.numeroContrato")}
              className={classNames("w-full", {
                "p-invalid": errors.id_contrato?.numeroContrato,
              })}
            />
            {errors.id_contrato?.numeroContrato && (
              <small className="p-error">
                {errors.id_contrato.numeroContrato.message}
              </small>
            )}
          </div>
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre de la Línea
            </label>
            <Dropdown
              id="id_linea._id"
              value={watch("id_linea")}
              // {...register("id_linea._id")}
              onChange={(e) => {
                setValue("id_linea", e.value);
              }}
              options={lineaRecepcions.map((lineaRecepcion) => ({
                label: lineaRecepcion.nombre,
                value: {
                  _id: lineaRecepcion.id,
                  nombre: lineaRecepcion.nombre,
                },
              }))}
              placeholder="Seleccionar un proveedor"
              className={classNames("w-full", {
                "p-invalid": errors.id_linea?.nombre,
              })}
            />
            {errors.id_linea?.nombre && (
              <small className="p-error">
                {errors.id_linea.nombre.message}
              </small>
            )}
          </div>
          {/* Campo: Nombre de la Línea */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="id_linea.nombre" className="font-medium text-900">
              Nombre de la Línea
            </label>
            <InputText
              id="id_linea.nombre"
              {...register("id_linea.nombre")}
              className={classNames("w-full", {
                "p-invalid": errors.id_linea?.nombre,
              })}
            />
            {errors.id_linea?.nombre && (
              <small className="p-error">
                {errors.id_linea.nombre.message}
              </small>
            )}
          </div>
          {/* Campo:  del Tanque */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre de Tanque
            </label>
            <Dropdown
              id="id_tanque._id"
              value={watch("id_tanque")}
              // {...register("id_tanque._id")}
              onChange={(e) => {
                setValue("id_tanque", e.value);
              }}
              options={tanques.map((tanque) => ({
                label: tanque.nombre,
                value: {
                  _id: tanque.id,
                  nombre: tanque.nombre,
                },
              }))}
              placeholder="Seleccionar un proveedor"
              className={classNames("w-full", {
                "p-invalid": errors.id_tanque?.nombre,
              })}
            />
            {errors.id_tanque?.nombre && (
              <small className="p-error">
                {errors.id_tanque.nombre.message}
              </small>
            )}
          </div>
          {/* Campo: ID del Tanque */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="id_tanque._id" className="font-medium text-900">
              Nombre del Tanque
            </label>
            <InputText
              id="id_tanque.nombre"
              {...register("id_tanque.nombre")}
              className={classNames("w-full", {
                "p-invalid": errors.id_tanque?.nombre,
              })}
            />
            {errors.id_tanque?.nombre && (
              <small className="p-error">
                {errors.id_tanque.nombre.message}
              </small>
            )}
          </div>

          {/* Campo: Placa */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="placa" className="font-medium text-900">
              Placa
            </label>
            <InputText
              id="placa"
              {...register("placa")}
              className={classNames("w-full", { "p-invalid": errors.placa })}
            />
            {errors.placa && (
              <small className="p-error">{errors.placa.message}</small>
            )}
          </div>

          {/* Campo: Nombre del Chofer */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="nombre_chofer" className="font-medium text-900">
              Nombre del Chofer
            </label>
            <InputText
              id="nombre_chofer"
              {...register("nombre_chofer")}
              className={classNames("w-full", {
                "p-invalid": errors.nombre_chofer,
              })}
            />
            {errors.nombre_chofer && (
              <small className="p-error">{errors.nombre_chofer.message}</small>
            )}
          </div>

          {/* Campo: Apellido del Chofer */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="apellido_chofer" className="font-medium text-900">
              Apellido del Chofer
            </label>
            <InputText
              id="apellido_chofer"
              {...register("apellido_chofer")}
              className={classNames("w-full", {
                "p-invalid": errors.apellido_chofer,
              })}
            />
            {errors.apellido_chofer && (
              <small className="p-error">
                {errors.apellido_chofer.message}
              </small>
            )}
          </div>

          {/* Campo: ID de la Guía */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="id_guia" className="font-medium text-900">
              ID de la Guía
            </label>
            <Controller
              name="id_guia"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="id_guia"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.id_guia,
                  })}
                  min={0}
                />
              )}
            />
            {errors.id_guia && (
              <small className="p-error">{errors.id_guia.message}</small>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

export default RecepcionForm;

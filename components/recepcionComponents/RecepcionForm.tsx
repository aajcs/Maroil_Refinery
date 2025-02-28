import React, { useCallback, useEffect, useRef, useState } from "react";
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

import { Calendar } from "primereact/calendar";
import { getLineaRecepcions } from "@/app/api/lineaRecepcionService";
import { Contrato, LineaRecepcion, Tanque } from "@/libs/interfaces";
import { getTanques } from "@/app/api/tanqueService";
import { getContratos } from "@/app/api/contratoService";
import { RadioButton } from "primereact/radiobutton";
import { ProgressSpinner } from "primereact/progressspinner";

type FormData = z.infer<typeof recepcionSchema>;

interface RecepcionFormProps {
  recepcion: any;
  hideRecepcionFormDialog: () => void;
  recepcions: any[];
  setRecepcions: (recepcions: any[]) => void;
  setRecepcion: (recepcion: any) => void;
}

const estatusValues = ["true", "false"];
const estadoCargaOptions = [
  { label: "EN_TRANSITO", value: "EN_TRANSITO" },
  { label: "ENTREGADO", value: "ENTREGADO" },
];

const RecepcionForm = ({
  recepcion,
  hideRecepcionFormDialog,
  recepcions,
  setRecepcions,
}: RecepcionFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [lineaRecepcions, setLineaRecepcions] = useState<LineaRecepcion[]>([]);
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Contrato | null>(
    null
  );
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
  const fetchData = useCallback(async () => {
    try {
      const [lineaRecepcionsDB, tanquesDB, contratosDB] = await Promise.all([
        getLineaRecepcions(),
        getTanques(),
        getContratos(),
      ]);

      if (lineaRecepcionsDB && Array.isArray(lineaRecepcionsDB.lineaCargas)) {
        const filteredLineaRecepcions = lineaRecepcionsDB.lineaCargas.filter(
          (lineaRecepcion: LineaRecepcion) =>
            lineaRecepcion.idRefineria.id === activeRefineria?.id
        );
        setLineaRecepcions(filteredLineaRecepcions);
      }

      if (tanquesDB && Array.isArray(tanquesDB.tanques)) {
        const filteredTanques = tanquesDB.tanques.filter(
          (tanque: Tanque) => tanque.idRefineria.id === activeRefineria?.id
        );
        setTanques(filteredTanques);
      }

      if (contratosDB && Array.isArray(contratosDB.contratos)) {
        const filteredContratos = contratosDB.contratos.filter(
          (contrato: Contrato) =>
            contrato.idRefineria.id === activeRefineria?.id
        );
        setContratos(filteredContratos);
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
      if (recepcion) {
        const updatedRecepcion = await updateRecepcion(recepcion.id, {
          ...data,
          idContrato: data.idContrato?.id,
          idLinea: data.idLinea?.id,
          idContratoItems: data.idContratoItems?.id,
          idTanque: data.idTanque?.id,
          idRefineria: activeRefineria?.id,
        });
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
          idContrato: data.idContrato?.id,
          idLinea: data.idLinea?.id,
          idTanque: data.idTanque?.id,
          idContratoItems: data.idContratoItems?.id,
          idRefineria: activeRefineria?.id,
        });
        setRecepcions([...recepcions, newRecepcion.recepcion]);
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
          {/* Campo: ID de la Guía */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-2">
            <label htmlFor="idGuia" className="font-medium text-900">
              ID de la Guía
            </label>
            <Controller
              name="idGuia"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id="idGuia"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.idGuia,
                  })}
                  min={0}
                  locale="es"
                />
              )}
            />
            {errors.idGuia && (
              <small className="p-error">{errors.idGuia.message}</small>
            )}
          </div>
          {/* Campo: Placa */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-2">
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
            <label htmlFor="nombreChofer" className="font-medium text-900">
              Nombre del Chofer
            </label>
            <InputText
              id="nombreChofer"
              {...register("nombreChofer")}
              className={classNames("w-full", {
                "p-invalid": errors.nombreChofer,
              })}
            />
            {errors.nombreChofer && (
              <small className="p-error">{errors.nombreChofer.message}</small>
            )}
          </div>
          {/* Campo: Apellido del Chofer */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="apellidoChofer" className="font-medium text-900">
              Apellido del Chofer
            </label>
            <InputText
              id="apellidoChofer"
              {...register("apellidoChofer")}
              className={classNames("w-full", {
                "p-invalid": errors.apellidoChofer,
              })}
            />
            {errors.apellidoChofer && (
              <small className="p-error">{errors.apellidoChofer.message}</small>
            )}
          </div>

          {/* Campo: Número de Contrato */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="idContacto.nombre" className="font-medium text-900">
              Numero de Contrato
            </label>
            <Dropdown
              id="idContrato.id"
              value={watch("idContrato")}
              // {...register("idLinea.id")}
              onChange={(e) => {
                setValue("idContrato", e.value);
              }}
              options={contratos.map((contrato) => ({
                label: contrato.numeroContrato,
                value: {
                  id: contrato.id,
                  idContacto: contrato.idContacto,
                  idItems: contrato.idItems,
                  idRefineria: contrato.idRefineria,
                  numeroContrato: contrato.numeroContrato,
                },
              }))}
              // options={contratos}
              // optionLabel="numeroContrato"
              placeholder="Seleccionar un proveedor"
              className={classNames("w-full", {
                "p-invalid": errors.idContrato?.numeroContrato,
              })}
            />
            {errors.idContrato?.numeroContrato && (
              <small className="p-error">
                {errors.idContrato.numeroContrato.message}
              </small>
            )}
          </div>
          {/* Campo: Nombre del producto*/}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="idContacto.nombre" className="font-medium text-900">
              Seleccione Producto
            </label>
            <Controller
              name="idContratoItems"
              control={control}
              render={({ field }) => (
                <>
                  {watch("idContrato.idItems")?.map((items) => (
                    <div key={items.id} className="flex align-items-center">
                      <RadioButton
                        inputId={items.id}
                        name="items"
                        value={items}
                        onChange={(e) => field.onChange(e.value)}
                        checked={field.value?.id === items.id}
                      />
                      <label htmlFor={items.id} className="ml-2">
                        {items.producto + "-" + items.cantidad + "Bbl"}
                      </label>
                    </div>
                  ))}
                </>
              )}
            />
            {errors.idContratoItems && (
              <small className="p-error">
                {errors.idContratoItems.message}
              </small>
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
                  locale="es"
                />
              )}
            />
            {errors.cantidadRecibida && (
              <small className="p-error">
                {errors.cantidadRecibida.message}
              </small>
            )}
          </div>
          {/* Campo: Nombre de la Línea */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre de la Línea
            </label>
            <Dropdown
              id="idLinea.id"
              value={watch("idLinea")}
              // {...register("idLinea.id")}
              onChange={(e) => {
                setValue("idLinea", e.value);
              }}
              options={lineaRecepcions.map((lineaRecepcion) => ({
                label: lineaRecepcion.nombre,
                value: {
                  id: lineaRecepcion.id,
                  nombre: lineaRecepcion.nombre,
                },
              }))}
              placeholder="Seleccionar un proveedor"
              className={classNames("w-full", {
                "p-invalid": errors.idLinea?.nombre,
              })}
            />
            {errors.idLinea?.nombre && (
              <small className="p-error">{errors.idLinea.nombre.message}</small>
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

          {/* Campo: Estado de carga*/}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estadoEntrega" className="font-medium text-900">
              Estado de Carga
            </label>
            <Dropdown
              id="estadoCarga"
              value={watch("estadoCarga")}
              {...register("estadoCarga")}
              options={estadoCargaOptions}
              placeholder="Seleccionar estado de entrega"
              className={classNames("w-full", {
                "p-invalid": errors.estadoCarga,
              })}
            />
            {errors.estadoCarga && (
              <small className="p-error">{errors.estadoCarga.message}</small>
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
        </div>
        <div className="col-12">
          <Button
            type="submit"
            label={recepcion ? "Modificar Refinería" : "Crear Refinería"}
            className="w-auto mt-3"
          />
        </div>
      </form>
    </div>
  );
};

export default RecepcionForm;

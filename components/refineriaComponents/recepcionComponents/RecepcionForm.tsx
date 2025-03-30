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
import { truncateText } from "@/utils/funcionesUtiles";
import { Steps } from "primereact/steps";

type FormData = z.infer<typeof recepcionSchema>;

interface RecepcionFormProps {
  recepcion: any;
  hideRecepcionFormDialog: () => void;
  recepcions: any[];
  setRecepcions: (recepcions: any[]) => void;
  setRecepcion: (recepcion: any) => void;
}

const estatusValues = ["true", "false"];

// Estados de Recepción (Flujo principal)
const estadoRecepcionOptions = [
  { label: "Programado", value: "PROGRAMADO" }, // Cuando está agendado
  { label: "En Tránsito", value: "EN_TRANSITO" }, // Reemplaza "En Recepción" para cuando viene en camino
  { label: "En Refineria", value: "EN_REFINERIA" }, // Cuando llega físicamente
  { label: "Descargando", value: "DESCARGANDO" }, // Estado activo de descarga
  { label: "Descarga Completa", value: "COMPLETADO" }, // Finalización exitosa
  { label: "Rechazado", value: "RECHAZADO" }, // Si no cumple requisitos
  { label: "Cancelado", value: "CANCELADO" }, // Si no se presenta
];

// Estados de Carga/Descarga (Detalle operativo)
const estadoCargaOptions = [
  { label: "Pendiente Muestreo", value: "PENDIENTE_MUESTREO" }, // Antes de iniciar
  { label: "Muestreo Aprobado", value: "MUESTREO_APROBADO" }, // Permite descarga
  { label: "En Proceso", value: "EN_PROCESO" }, // Descarga activa
  { label: "Pausado", value: "PAUSADO" }, // Interrupciones
  { label: "Finalizado", value: "FINALIZADO" }, // Fin del proceso
];

const RecepcionForm = ({
  recepcion,
  hideRecepcionFormDialog,
  recepcions,
  setRecepcions,
}: RecepcionFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const calendarRef = useRef<Calendar>(null);
  const [lineaRecepcions, setLineaRecepcions] = useState<LineaRecepcion[]>([]);
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Contrato | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(recepcionSchema),
    defaultValues: {
      idGuia: 0,
      cantidadEnviada: 0,
      cantidadRecibida: 0,
    },
  });

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
    setSubmitting(true);
    console.log(data);
    try {
      if (recepcion) {
        const updatedRecepcion = await updateRecepcion(recepcion.id, {
          ...data,
          idContrato: data.idContrato?.id,
          idLinea: data.idLinea?.id || null,
          idContratoItems: data.idContratoItems?.id,
          idTanque: data.idTanque?.id || null,
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
          idLinea: data.idLinea?.id || null,
          idTanque: data.idTanque?.id || null,
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
    } finally {
      setSubmitting(false); // Desactivar el estado de envío
    }
  };

  const showToast = (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
  };
  const estadoRecepcion = watch("estadoRecepcion");
  const estadoCarga = watch("estadoCarga");
  console.log(errors);
  // console.log(JSON.stringify(watch("idContrato"), null, 2));
  console.log(watch("estadoCarga"));
  console.log(watch("estadoRecepcion"));
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

  const fieldRules = {
    PROGRAMADO: {
      idContrato: true,
      idContratoItems: true,
      cantidadEnviada: true,
      idGuia: false,
      placa: false,
      nombreChofer: false,
      fechaSalida: false,
      fechaLlegada: false,
      idTanque: false,
      cantidadRecibida: false,
    },
    EN_TRANSITO: {
      idContrato: false,
      idContratoItems: false,
      cantidadEnviada: false,
      idGuia: true,
      placa: true,
      nombreChofer: true,
      fechaSalida: true,
      fechaLlegada: true,
      idTanque: false,
      cantidadRecibida: false,
    },
    EN_REFINERIA: {
      idContrato: false,
      idContratoItems: false,
      cantidadEnviada: false,
      idGuia: false,
      placa: false,
      nombreChofer: false,
      fechaSalida: false,
      fechaLlegada: true,
      idTanque: true,
      cantidadRecibida: false,
    },
    DESCARGANDO: {
      idContrato: false,
      idContratoItems: false,
      cantidadEnviada: false,
      idGuia: false,
      placa: false,
      nombreChofer: false,
      fechaSalida: false,
      fechaLlegada: false,
      idTanque: true,
      cantidadRecibida: true,
    },
    COMPLETADO: {
      idContrato: false,
      idContratoItems: false,
      cantidadEnviada: false,
      idGuia: false,
      placa: false,
      nombreChofer: false,
      fechaSalida: false,
      fechaLlegada: false,
      idTanque: false,
      cantidadRecibida: false,
    },
  };

  const isFieldEnabled = (
    fieldName: keyof (typeof fieldRules)["PROGRAMADO"],
    estadoRecepcion: keyof typeof fieldRules
  ): boolean => {
    return fieldRules[estadoRecepcion]?.[fieldName] ?? false;
  };

  const footerTemplate = () => (
    <div className="flex justify-content-between">
      <Button
        label="Aceptar"
        onClick={() => calendarRef.current?.hide()}
        className="p-button-text"
      />
      <Button
        label="Hoy"
        onClick={() => {
          const today = new Date();
          setValue("fechaInicio", today); // Establece la fecha actual
          calendarRef.current?.hide(); // Cierra el calendario
        }}
        className="p-button-text p-button-sm"
      />
      <Button
        label="Limpiar"
        onClick={() => {
          setValue("fechaInicio", ""); // Limpia la fecha
          calendarRef.current?.hide(); // Cierra el calendario
        }}
        className="p-button-text p-button-sm"
      />
    </div>
  );
  return (
    <div>
      <Toast ref={toast} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid formgrid p-fluid border-1 border-gray-200 rounded-lg">
          {/* Campo: Estado de la Recepción */}
          <div className="field mb-4 col-12 hidden lg:block">
            <label htmlFor="estadoRecepcion" className="font-medium text-900">
              Estado de la Recepción
            </label>
            <Controller
              name="estadoRecepcion"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Steps
                    model={estadoRecepcionOptions.map((option) => ({
                      label: option.label,
                      command: () => {
                        field.onChange(option.value); // Actualiza el valor en el formulario
                      },
                    }))}
                    activeIndex={estadoRecepcionOptions.findIndex(
                      (option) => option.value === field.value
                    )} // Marca el estado actual como activo
                    onSelect={(e) => {
                      const selectedOption = estadoRecepcionOptions[e.index];
                      field.onChange(selectedOption.value); // Actualiza el valor seleccionado
                    }}
                    readOnly={false} // Permite seleccionar pasos
                  />
                  {fieldState.error && (
                    <small className="p-error">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>
          <div className="field mb-4 col-12 sm:col-6 lg:4 lg:hidden">
            <label htmlFor="estadoRecepcion" className="font-medium text-900">
              Estado de la Recepción
            </label>
            <Controller
              name="estadoRecepcion"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  id="estadoRecepcion"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={estadoRecepcionOptions}
                  placeholder="Seleccionar estado de la recepción"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {errors.estadoRecepcion && (
              <small className="p-error">
                {errors.estadoRecepcion.message}
              </small>
            )}
          </div>
          {/* Campo: Número de Contrato */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="idContacto.nombre" className="font-medium text-900">
              Número de Contrato
            </label>
            <Controller
              name="idContrato"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  id="idContrato.id"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={contratos.map((contrato) => ({
                    label: `${contrato.numeroContrato} - ${truncateText(
                      contrato.descripcion || "Sin descripción",
                      30
                    )}`, // Formato: "N123 - Descripción..."
                    value: { ...contrato }, // 👈 ¡Envía el objeto completo!
                  }))}
                  placeholder="Seleccionar un proveedor"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                  showClear
                  filter
                  disabled={
                    !isFieldEnabled(
                      "idContrato",
                      estadoRecepcion as keyof typeof fieldRules
                    )
                  }
                />
              )}
            />
            {errors.idContrato?.numeroContrato && (
              <small className="p-error">
                {errors.idContrato.numeroContrato.message}
              </small>
            )}
          </div>
          {/* Campo: Nombre del producto*/}
          <div className="field mb-4 col-12 sm:col-6 lg:col-6">
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
                        disabled={
                          !isFieldEnabled(
                            "idContratoItems",
                            estadoRecepcion as keyof typeof fieldRules
                          )
                        }
                      />
                      <label htmlFor={items.id} className="ml-2">
                        {items.producto.nombre + "-" + items.cantidad + "Bbl"}
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
          {/* Campo: Cantidad Enviada */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-2">
            <label htmlFor="cantidadEnviada" className="font-medium text-900">
              Cantidad Enviada
            </label>
            <Controller
              name="cantidadEnviada"
              control={control}
              defaultValue={0} // Valor inicial como número
              render={({ field }) => (
                <InputNumber
                  id="cantidadEnviada"
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value ?? 0)} // Manejo de valores nulos
                  className={classNames("w-full", {
                    "p-invalid": errors.cantidadEnviada,
                  })}
                  min={0}
                  locale="es"
                  disabled={
                    !isFieldEnabled(
                      "cantidadEnviada",
                      estadoRecepcion as keyof typeof fieldRules
                    )
                  }
                />
              )}
            />
            {errors.cantidadEnviada && (
              <small className="p-error">
                {errors.cantidadEnviada.message}
              </small>
            )}
          </div>
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
                  disabled={
                    !isFieldEnabled(
                      "idGuia",
                      estadoRecepcion as keyof typeof fieldRules
                    )
                  }
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
              disabled={
                !isFieldEnabled(
                  "placa",
                  estadoRecepcion as keyof typeof fieldRules
                )
              }
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
              disabled={
                !isFieldEnabled(
                  "nombreChofer",
                  estadoRecepcion as keyof typeof fieldRules
                )
              }
            />
            {errors.nombreChofer && (
              <small className="p-error">{errors.nombreChofer.message}</small>
            )}
          </div>

          {/* Campo: Fecha Salida */}
          <div className="field mb-4 col-12 sm:col-4 lg:4">
            <label htmlFor="fechaSalida" className="font-medium text-900">
              Fecha Salida
            </label>
            <Calendar
              id="fechaSalida"
              value={
                watch("fechaSalida")
                  ? new Date(watch("fechaSalida") as string | Date)
                  : undefined
              }
              {...register("fechaSalida")}
              showTime
              hourFormat="24"
              className={classNames("w-full", {
                "p-invalid": errors.fechaSalida,
              })}
              locale="es"
              disabled={
                !isFieldEnabled(
                  "fechaSalida",
                  estadoRecepcion as keyof typeof fieldRules
                )
              }
            />
            {errors.fechaSalida && (
              <small className="p-error">{errors.fechaSalida.message}</small>
            )}
          </div>
          {/* Campo: Fecha Llegada */}
          <div className="field mb-4 col-12 sm:col-4 lg:4">
            <label htmlFor="fechaLlegada" className="font-medium text-900">
              {" "}
              Fecha Llegada{" "}
            </label>
            <Calendar
              id="fechaLlegada"
              value={
                watch("fechaLlegada")
                  ? new Date(watch("fechaLlegada") as string | Date)
                  : undefined
              }
              {...register("fechaLlegada")}
              showTime
              hourFormat="24"
              className={classNames("w-full", {
                "p-invalid": errors.fechaLlegada,
              })}
              locale="es"
              disabled={
                !isFieldEnabled(
                  "fechaLlegada",
                  estadoRecepcion as keyof typeof fieldRules
                )
              }
            />
            {errors.fechaLlegada && (
              <small className="p-error">{errors.fechaLlegada.message}</small>
            )}
          </div>
          <h3>falta el tema del chequeo de cantidad y calidad</h3>
        </div>

        <div className="grid formgrid p-fluid border-1 border-gray-200 rounded-lg">
          {/* Campo: Estado de carga*/}
          {/* <div className="field mb-4 col-12 sm:col-6 lg:col-4 lg:hidden "> */}
          <div className="field mb-4 col-12   ">
            <label htmlFor="estadoCarga" className="font-medium text-900">
              Estado de Carga
            </label>
            <Controller
              name="estadoCarga"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Steps
                    model={estadoCargaOptions.map((option) => ({
                      label: option.label,
                      command: () => {
                        field.onChange(option.value); // Actualiza el valor en el formulario
                      },
                    }))}
                    activeIndex={estadoCargaOptions.findIndex(
                      (option) => option.value === field.value
                    )} // Marca el estado actual como activo
                    onSelect={(e) => {
                      const selectedOption = estadoCargaOptions[e.index];
                      field.onChange(selectedOption.value); // Actualiza el valor seleccionado
                    }}
                    readOnly={false} // Permite seleccionar pasos
                  />
                  {fieldState.error && (
                    <small className="p-error">
                      {fieldState.error.message}
                    </small>
                  )}
                </>
              )}
            />
          </div>
          <div className="field mb-4 col-12 sm:col-6 lg:col-4 hidden lg:block ">
            <label htmlFor="estadoEntrega" className="font-medium text-900 ">
              Estado de Carga
            </label>
            <Controller
              name="estadoCarga"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  id="estadoCarga"
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={estadoCargaOptions}
                  placeholder="Seleccionar estado de entrega"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                />
              )}
            />
            {errors.estadoCarga && (
              <small className="p-error">{errors.estadoCarga.message}</small>
            )}
          </div>
          {/* Campo: Cantidad Recibida */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-2">
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
            <Controller
              name="idLinea"
              control={control}
              render={({ field, fieldState }) => (
                <Dropdown
                  id="idLinea.id"
                  value={field.value}
                  onChange={(e) => {
                    field.onChange(e.value); // Actualiza el valor seleccionado
                    if (!e.value) {
                      field.onChange(null); // Limpia el valor en el formulario
                    }
                  }}
                  options={lineaRecepcions.map((lineaRecepcion) => ({
                    label: lineaRecepcion.nombre,
                    value: {
                      id: lineaRecepcion.id,
                      nombre: lineaRecepcion.nombre,
                    },
                  }))}
                  placeholder="Seleccionar una línea"
                  className={classNames("w-full", {
                    "p-invalid": fieldState.error,
                  })}
                  showClear
                  filter
                />
              )}
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
              Nombre del Tanque
            </label>
            <Controller
              name="idTanque"
              control={control}
              render={({ field, fieldState }) => {
                // Obtener el producto seleccionado en idContratoItems
                const selectedProducto = watch("idContratoItems")?.producto;

                // Filtrar los tanques que almacenan el producto seleccionado
                const filteredTanques = tanques.filter(
                  (tanque) => tanque.idProducto?.id === selectedProducto?.id
                );
                // Condición para inhabilitar el campo
                const isDisabled =
                  estadoRecepcion !== "EN_PROCESO" &&
                  estadoCarga !== "EN_PROCESO";

                return (
                  <>
                    <Dropdown
                      id="idTanque.id"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(e.value); // Actualiza el valor seleccionado
                        if (!e.value) {
                          field.onChange(null); // Limpia el valor en el formulario
                        }
                      }}
                      options={filteredTanques.map((tanque) => ({
                        label: `${tanque.nombre} - ${
                          tanque.idProducto?.nombre || "Sin producto"
                        } (${tanque.almacenamiento || 0} Bbl)`,
                        value: {
                          id: tanque.id,
                          nombre: tanque.nombre,
                          _id: tanque.id,
                        },
                      }))}
                      placeholder="Seleccionar un tanque"
                      className={classNames("w-full", {
                        "p-invalid": fieldState.error,
                      })}
                      showClear
                      filter
                      disabled={isDisabled} // Inhabilitar el campo si no está en proceso
                    />
                    {fieldState.error && (
                      <small className="p-error">
                        {fieldState.error.message}
                      </small>
                    )}
                  </>
                );
              }}
            />
          </div>

          {/* Campo: Fecha Inicio Receocion */}
          <div className="field mb-4 col-12 sm:col-4 lg:4">
            <label
              htmlFor="fechaInicioRecepcion"
              className="font-medium text-900"
            >
              Fecha Inicio Recepción
            </label>
            <Calendar
              id="fechaInicioRecepcion"
              value={
                watch("fechaInicioRecepcion")
                  ? new Date(watch("fechaInicioRecepcion") as string | Date)
                  : undefined
              }
              {...register("fechaInicioRecepcion")}
              showTime
              hourFormat="24"
              className={classNames("w-full", {
                "p-invalid": errors.fechaInicioRecepcion,
              })}
              locale="es"
            />
            {errors.fechaInicioRecepcion && (
              <small className="p-error">
                {errors.fechaInicioRecepcion.message}
              </small>
            )}
          </div>
          {/* Campo: Fecha Fin Recepcion */}
          <div className="field mb-4 col-12 sm:col-4 lg:4">
            <label htmlFor="fechaFinRecepcion" className="font-medium text-900">
              Fecha Fin Recepción
            </label>
            <Calendar
              id="fechaFinRecepcion"
              value={
                watch("fechaFinRecepcion")
                  ? new Date(watch("fechaFinRecepcion") as string | Date)
                  : undefined
              }
              {...register("fechaFinRecepcion")}
              showTime
              hourFormat="24"
              className={classNames("w-full", {
                "p-invalid": errors.fechaFinRecepcion,
              })}
              locale="es"
            />
            {errors.fechaFinRecepcion && (
              <small className="p-error">
                {errors.fechaFinRecepcion.message}
              </small>
            )}
          </div>
        </div>

        <div className="col-12">
          <Button
            type="submit"
            disabled={submitting} // Deshabilitar el botón mientras se envía
            icon={submitting ? "pi pi-spinner pi-spin" : ""} // Mostrar ícono de carga
            label={recepcion ? "Modificar Recepción" : "Crear Recepción"}
            className="w-auto mt-3"
          />
        </div>
      </form>
    </div>
  );
};

export default RecepcionForm;
//   {/* Campo: Fecha de Inicio */}
//   <div className="field mb-4 col-12 sm:col-6 lg:col-4">
//   <label htmlFor="fechaInicio" className="font-medium text-900">
//     Fecha de Inicio
//   </label>

//   <Controller
//     name="fechaInicio"
//     control={control}
//     render={({ field, fieldState }) => (
//       <Calendar
//         id="fechaInicio"
//         value={field.value ? new Date(field.value) : null}
//         onChange={(e) => field.onChange(e.value)}
//         // onSelect={() => calendarRef.current?.hide()}
//         showTime
//         hourFormat="24"
//         className={classNames("w-full", {
//           "p-invalid": fieldState.error,
//         })}
//         locale="es"
//         ref={calendarRef}
//         // showButtonBar
//         footerTemplate={footerTemplate}
//       />
//     )}
//   />

//   {errors.fechaInicio && (
//     <small className="p-error">{errors.fechaInicio.message}</small>
//   )}
// </div>

// {/* Campo: Fecha de Fin */}
// <div className="field mb-4 col-12 sm:col-6 lg:col-4">
//   <label htmlFor="fechaFin" className="font-medium text-900">
//     Fecha de Fin
//   </label>
//   <Calendar
//     id="fechaFin"
//     value={
//       watch("fechaFin")
//         ? new Date(watch("fechaFin") as string | Date)
//         : undefined
//     }
//     {...register("fechaFin")}
//     showTime
//     hourFormat="24"
//     className={classNames("w-full", { "p-invalid": errors.fechaFin })}
//     locale="es"
//   />
//   {/* <Controller
//     name="fechaFin"
//     control={control}
//     render={({ field, fieldState }) => (
//       <Calendar
//         id="fechaFin"
//         value={field.value ? new Date(field.value) : null}
//         onChange={(e) => {
//           field.onChange(e.value); // Actualiza el valor del campo
//           calendarRef.current?.hide(); // Cierra el calendario
//         }}
//         showTime
//         hourFormat="24"
//         className={classNames("w-full", {
//           "p-invalid": fieldState.error,
//         })}
//         locale="es"
//         ref={calendarRef} // Asigna la referencia
//         showButtonBar
//       />
//     )}
//   /> */}
//   {errors.fechaFin && (
//     <small className="p-error">{errors.fechaFin.message}</small>
//   )}
// </div>
//  {/* Campo: Estado */}
//  <div className="field mb-4 col-12 sm:col-6 lg:col-4">
//  <label htmlFor="estado" className="font-medium text-900">
//    Estado
//  </label>
//  <Controller
//    name="estado"
//    control={control}
//    render={({ field, fieldState }) => (
//      <Dropdown
//        id="estado"
//        value={field.value}
//        onChange={(e) => field.onChange(e.value)}
//        options={estatusValues.map((value) => ({
//          label: value === "true" ? "Activo" : "Inactivo", // Etiquetas personalizadas
//          value,
//        }))}
//        placeholder="Seleccionar estado"
//        className={classNames("w-full", {
//          "p-invalid": fieldState.error,
//        })}
//      />
//    )}
//  />
//  {errors.estado && (
//    <small className="p-error">{errors.estado.message}</small>
//  )}
// </div>

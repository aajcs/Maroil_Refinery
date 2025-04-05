import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { recepcionSchema } from "@/libs/zod";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { createRecepcion, updateRecepcion } from "@/app/api/recepcionService";
import { InputNumber } from "primereact/inputnumber";

import { Calendar } from "primereact/calendar";

import { ProgressSpinner } from "primereact/progressspinner";
import { truncateText } from "@/utils/funcionesUtiles";
import { Steps } from "primereact/steps";
import { useRefineryData } from "@/hooks/useRefineryData";

import {
  fieldRulesCarga,
  fieldRulesRecepcion,
  getValidTransitionsRecepcion,
  EstadoRecepcion,
  estadoCargaOptions,
  estadoRecepcionOptions,
  EstadoCarga,
  estadoValidacionesRecepcion,
  estadoValidacionesCarga,
  getValidTransitionsCarga,
} from "@/libs/recepcionWorkflow";
import { RepecionFormRecepcion } from "./RepecionFormRecepcion";
import { ProgressBar } from "primereact/progressbar";
import CustomCalendar from "@/components/common/CustomCalendar";
import { Dialog } from "primereact/dialog";

type FormData = z.infer<typeof recepcionSchema>;

interface RecepcionFormProps {
  recepcion: any;
  hideRecepcionFormDialog: () => void;
  recepcionFormDialog: boolean;
  recepcions: any[];
  setRecepcions: (recepcions: any[]) => void;
  setRecepcion: (recepcion: any) => void;
  showToast: (
    severity: "success" | "error" | "warn",
    summary: string,
    detail: string
  ) => void;
}

const RecepcionForm = ({
  recepcion,
  hideRecepcionFormDialog,
  recepcionFormDialog,
  recepcions,
  setRecepcions,
  showToast,
}: RecepcionFormProps) => {
  const { activeRefineria } = useRefineriaStore();

  const { tanques, contratos, lineaRecepcions, loading } = useRefineryData(
    activeRefineria?.id || ""
  );
  const calendarRef = useRef<Calendar>(null);

  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(recepcionSchema),
    defaultValues: {
      idGuia: 0,
      cantidadEnviada: 250,
      cantidadRecibida: 0,
      estadoRecepcion: "PROGRAMADO", // Default initial state
      estadoCarga: "PENDIENTE_MUESTREO", // Default initial state for carga
      fechaInicioRecepcion: new Date(),
      fechaFinRecepcion: new Date(),
    },
  });
  useEffect(() => {
    if (recepcion) {
      Object.keys(recepcion).forEach((key) =>
        setValue(key as keyof FormData, recepcion[key])
      );
    }
  }, [recepcion, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const payload = {
        ...data,
        idContrato: data.idContrato?.id,
        idLinea: data.idLinea?.id,
        idTanque: data.idTanque?.id,
        idContratoItems: data.idContratoItems?.id,
        idRefineria: activeRefineria?.id,
      };

      if (recepcion) {
        const updatedRecepcion = await updateRecepcion(recepcion.id, payload);
        setRecepcions(
          recepcions.map((t) =>
            t.id === updatedRecepcion.id ? updatedRecepcion : t
          )
        );
      } else {
        const newRecepcion = await createRecepcion(payload);
        setRecepcions([...recepcions, newRecepcion.recepcion]);
      }
      hideRecepcionFormDialog();
    } catch (error) {
      console.log(error);
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Error desconocido"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const estadoRecepcion = watch("estadoRecepcion") as EstadoRecepcion;
  const estadoCarga = watch("estadoCarga") as EstadoCarga;
  // console.log(watch("idContrato"));
  const contrato = watch("idContrato");

  const validarCamposRequeridosRecepcion = (estadoDestino: string): boolean => {
    const camposRequeridos =
      estadoValidacionesRecepcion[
        estadoDestino as keyof typeof estadoValidacionesRecepcion
      ] || [];
    let isValid = true;

    for (const campo of camposRequeridos) {
      const valor = watch(campo as keyof FormData);

      if (!valor || (typeof valor === "number" && valor <= 0)) {
        isValid = false;

        // Marcar el campo como error
        setError(campo as keyof FormData, {
          type: "required",
          message: `El campo "${campo}" es obligatorio para cambiar a ${estadoDestino}`,
        });

        // Mostrar el mensaje de advertencia
        showToast(
          "warn",
          "Transición no válida",
          `El campo "${campo}" es obligatorio para cambiar a ${estadoDestino}`
        );
      } else {
        // Limpiar el error si el campo es válido
        clearErrors(campo as keyof FormData);
      }
    }

    return isValid;
  };

  const validarCamposRequeridosCarga = (estadoDestino: string): boolean => {
    const camposRequeridos =
      estadoValidacionesCarga[
        estadoDestino as keyof typeof estadoValidacionesCarga
      ] || [];
    let isValid = true;
    for (const campo of camposRequeridos) {
      const valor = watch(campo as keyof FormData);
      if (!valor || (typeof valor === "number" && valor <= 0)) {
        isValid = false;
        setError(campo as keyof FormData, {
          type: "required",
          message: `El campo "${campo}" es obligatorio para cambiar a ${estadoDestino}`,
        });
        showToast(
          "warn",
          "Transición no válida",
          `El campo "${campo}" es obligatorio para cambiar a ${estadoDestino}`
        );
      } else {
        clearErrors(campo as keyof FormData);
      }
    }
    return isValid;
  };

  const isFieldEnabledRecepcion = (
    fieldName: string,
    estadoRecepcion: EstadoRecepcion
  ): boolean => {
    return fieldRulesRecepcion[estadoRecepcion]?.[fieldName] ?? false;
  };

  const isFieldEnabledCarga = (
    fieldName: any,
    estadoCarga: EstadoCarga
  ): boolean => {
    return fieldRulesCarga[estadoCarga]?.[fieldName] ?? false;
  };

  return (
    <Dialog
      visible={recepcionFormDialog}
      style={{ width: "70vw", padding: "0px" }}
      header={`${recepcion ? "Editar" : "Agregar"} Recepción`}
      modal
      onHide={hideRecepcionFormDialog}
      footer={
        <div className="flex justify-content-between align-items-center p-2">
          <Button
            label="Cancelar"
            icon="pi pi-times"
            className="p-button-text p-button-plain"
            onClick={hideRecepcionFormDialog}
          />
          {!loading && (
            <Button
              type="submit"
              disabled={submitting}
              icon={submitting ? "pi pi-spinner pi-spin" : "pi pi-check"}
              label={recepcion ? "Modificar Recepción" : "Crear Recepción"}
              className={`p-button-raised ${
                submitting ? "p-button-secondary" : "p-button-primary"
              }`}
              onClick={handleSubmit(onSubmit)}
            />
          )}
        </div>
      }
    >
      <div>
        {loading ? (
          <div className="flex justify-content-center align-items-center">
            <ProgressSpinner />
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <RepecionFormRecepcion
              control={control}
              errors={errors}
              watch={watch}
              showToast={showToast}
              isFieldEnabledRecepcion={(fieldName: string, estado: string) =>
                isFieldEnabledRecepcion(fieldName, estado as EstadoRecepcion)
              }
              estadoRecepcion={estadoRecepcion || "PROGRAMADO"}
              estadoRecepcionOptions={estadoRecepcionOptions}
              validarCamposRequeridosRecepcion={
                validarCamposRequeridosRecepcion
              }
              getValidTransitionsRecepcion={
                getValidTransitionsRecepcion as (
                  currentState: string
                ) => string[]
              }
              contratos={contratos}
              truncateText={truncateText}
              register={register}
            />
            {watch("estadoRecepcion") === "EN_REFINERIA" ||
            watch("estadoRecepcion") === "COMPLETADO" ? (
              <div className="card p-fluid surface-50 p-2 border-round shadow-2">
                {/* Header del Proceso */}
                <div className="mb-2 text-center md:text-left">
                  <div className="border-bottom-2 border-primary pb-2">
                    <h2 className="text-2xl font-bold text-900 mb-2 flex align-items-center justify-content-center md:justify-content-start">
                      <i className="pi pi-cloud-download mr-3 text-primary text-3xl"></i>
                      Proceso de Descarga en Refinería
                    </h2>

                    {/* Stepper Estado de Carga */}
                    <div className="hidden lg:block">
                      <Controller
                        name="estadoCarga"
                        control={control}
                        render={({ field }) => (
                          <Steps
                            model={estadoCargaOptions.map((option) => ({
                              label: option.label,
                              command: () => {
                                const validTransitions =
                                  getValidTransitionsCarga(estadoCarga);
                                if (
                                  validTransitions.includes(
                                    option.value as EstadoCarga
                                  )
                                ) {
                                  if (
                                    validarCamposRequeridosCarga(option.value)
                                  ) {
                                    field.onChange(option.value);
                                  }
                                } else {
                                  showToast(
                                    "warn",
                                    "Transición no válida",
                                    `No puedes cambiar a ${option.label} desde ${estadoCarga}`
                                  );
                                }
                              },
                            }))}
                            activeIndex={estadoCargaOptions.findIndex(
                              (option) => option.value === field.value
                            )}
                            className="bg-white p-3 border-round shadow-1"
                            readOnly={false}
                          />
                        )}
                      />
                    </div>
                    <h1>
                      Numero de Chequeo de Calidad:{" "}
                      {recepcion.idChequeoCalidad?.numeroChequeoCalidad}
                    </h1>
                    <h1>
                      Numero de Chequeo de Cantidad:{" "}
                      {recepcion.idChequeoCantidad?.numeroChequeoCantidad}
                    </h1>
                    {/* Dropdown Mobile */}
                    <div className="lg:hidden mt-3">
                      <Controller
                        name="estadoCarga"
                        control={control}
                        render={({ field }) => (
                          <Dropdown
                            value={field.value}
                            onChange={(e) => field.onChange(e.value)}
                            options={estadoCargaOptions}
                            optionLabel="label"
                            placeholder="Estado de Carga"
                            className="w-full"
                            panelClassName="shadow-3"
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Cuerpo del Formulario */}
                <div className="grid formgrid  row-gap-2">
                  {/* Línea de Descarga */}
                  <div className="col-12 md:col-6 lg:col-3">
                    <div className="p-2 bg-white border-round shadow-1 surface-card">
                      <label className="block font-medium text-900 mb-3 flex align-items-center">
                        <i className="pi pi-link mr-2 text-primary"></i>
                        Línea de Descarga
                      </label>
                      <Controller
                        name="idLinea"
                        control={control}
                        render={({ field }) => {
                          watch("idLinea");
                          const filteredLineas = !watch("idLinea")
                            ? lineaRecepcions.filter(
                                (lineaRecepcion) =>
                                  !recepcions.some(
                                    (recepcion) =>
                                      recepcion.idLinea?.id ===
                                        lineaRecepcion.id &&
                                      recepcion.estadoRecepcion ===
                                        "EN_REFINERIA" &&
                                      recepcion.estadoCarga === "EN_PROCESO"
                                  )
                              )
                            : lineaRecepcions;
                          const isDisabled = isFieldEnabledCarga(
                            "idLinea",
                            estadoCarga
                          );

                          return (
                            <Dropdown
                              value={field.value}
                              onChange={(e) => field.onChange(e.value)}
                              options={filteredLineas.map((lineaRecepcion) => ({
                                label: lineaRecepcion.nombre,
                                value: {
                                  id: lineaRecepcion.id,
                                  nombre: lineaRecepcion.nombre,
                                },
                              }))}
                              // optionLabel="nombre"
                              placeholder="Seleccionar línea"
                              className="w-full"
                              showClear
                              filter
                              disabled={isDisabled}
                            />
                          );
                        }}
                      />
                      {errors.idLinea && (
                        <small className="p-error block mt-2 flex align-items-center">
                          <i className="pi pi-exclamation-circle mr-2"></i>
                          {errors.idLinea.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Tanque Destino */}
                  <div className="col-12 md:col-6 lg:col-3">
                    <div className="p-2 bg-white border-round shadow-1 surface-card">
                      <label className="block font-medium text-900 mb-3 flex align-items-center">
                        <i className="pi pi-database mr-2 text-primary"></i>
                        Tanque Destino
                      </label>
                      <Controller
                        name="idTanque"
                        control={control}
                        render={({ field, fieldState }) => {
                          const selectedProducto =
                            watch("idContratoItems")?.producto;
                          const filteredTanques = tanques.filter(
                            (tanque) =>
                              tanque.idProducto?.id === selectedProducto?.id
                          );
                          const isDisabled = isFieldEnabledCarga(
                            "idTanque",
                            estadoCarga
                          );

                          return (
                            <>
                              <Dropdown
                                value={field.value}
                                onChange={(e) => field.onChange(e.value)}
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
                                placeholder="Seleccionar tanque"
                                className={classNames("w-full", {
                                  "p-invalid": fieldState.error,
                                })}
                                showClear
                                filter
                                disabled={isDisabled}
                              />
                              {fieldState.error && (
                                <small className="p-error block mt-2 flex align-items-center">
                                  <i className="pi pi-exclamation-circle mr-2"></i>
                                  {fieldState.error.message}
                                </small>
                              )}
                            </>
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-12 md:col-6 lg:col-2">
                    <div className="p-2 bg-white border-round shadow-1 surface-card">
                      <label className="block font-medium text-900 mb-3 flex align-items-center">
                        <i className="pi pi-calendar-plus mr-2 text-primary"></i>
                        Inicio Descarga
                      </label>
                      {/* <Controller
                          name="fechaInicioRecepcion"
                          control={control}
                          render={({ field, fieldState }) => (
                            <>
                              <Calendar
                                id="fechaInicioRecepcion"
                                value={
                                  field.value
                                    ? new Date(field.value as string | Date)
                                    : undefined
                                }
                                onChange={(e) => field.onChange(e.value)}
                                showTime
                                hourFormat="24"
                                className={classNames("w-full", {
                                  "p-invalid": fieldState.error, // Aplica la clase de error si existe
                                })}
                                inputClassName="w-full"
                                locale="es"
                              />
                              {fieldState.error && (
                                <small className="p-error block mt-2 flex align-items-center">
                                  <i className="pi pi-exclamation-circle mr-2"></i>
                                  {fieldState.error.message}
                                </small>
                              )}
                            </>
                          )}
                        /> */}
                      <Controller
                        name="fechaInicioRecepcion"
                        defaultValue={new Date()}
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <CustomCalendar
                              {...field}
                              name="fechaInicioRecepcion"
                              control={control}
                              setValue={setValue}
                              calendarRef={calendarRef}
                              isFieldEnabled={isFieldEnabledCarga(
                                "fechaInicioRecepcion",
                                estadoCarga as EstadoCarga
                              )}
                              value={field.value ? new Date(field.value) : null}
                              onChange={field.onChange}
                            />

                            {fieldState.error && (
                              <small className="p-error block mt-2 flex align-items-center">
                                <i className="pi pi-exclamation-circle mr-2"></i>
                                {fieldState.error.message}
                              </small>
                            )}
                          </>
                        )}
                      />
                    </div>
                  </div>

                  <div className="col-12 md:col-6 lg:col-2">
                    <div className="p-2 bg-white border-round shadow-1 surface-card">
                      <label className="block font-medium text-900 mb-3 flex align-items-center">
                        <i className="pi pi-calendar-minus mr-2 text-primary"></i>
                        Fin Recepción
                      </label>
                      <Controller
                        name="fechaFinRecepcion"
                        control={control}
                        render={({ field, fieldState }) => (
                          <>
                            <CustomCalendar
                              {...field}
                              name="fechaFinRecepcion"
                              control={control}
                              setValue={setValue}
                              calendarRef={calendarRef}
                              isFieldEnabled={
                                isFieldEnabledCarga(
                                  "fechaFinRecepcion",
                                  estadoCarga as EstadoCarga
                                ) ||
                                isFieldEnabledRecepcion(
                                  "cantidadRecibida",
                                  estadoRecepcion as EstadoRecepcion
                                )
                              }
                              value={field.value ? new Date(field.value) : null}
                              onChange={field.onChange}
                            />

                            {fieldState.error && (
                              <small className="p-error block mt-2 flex align-items-center">
                                <i className="pi pi-exclamation-circle mr-2"></i>
                                {fieldState.error.message}
                              </small>
                            )}
                          </>
                        )}
                      />
                      {/* <Controller
                          name="fechaFinRecepcion"
                          control={control}
                          render={({ field, fieldState }) => (
                            <>
                              <Calendar
                                id="fechaFinRecepcion"
                                value={
                                  field.value
                                    ? new Date(field.value as string | Date)
                                    : undefined
                                }
                                onChange={(e) => field.onChange(e.value)}
                                showTime
                                hourFormat="24"
                                className={classNames("w-full", {
                                  "p-invalid": fieldState.error, // Aplica la clase de error si existe
                                })}
                                inputClassName="w-full"
                                locale="es"
                              />
                              {fieldState.error && (
                                <small className="p-error block mt-2 flex align-items-center">
                                  <i className="pi pi-exclamation-circle mr-2"></i>
                                  {fieldState.error.message}
                                </small>
                              )}
                            </>
                          )}
                        /> */}
                    </div>
                  </div>

                  {/* Cantidad Recibida */}
                  <div className="col-12 md:col-6 lg:col-2">
                    <div className="p-2 bg-white border-round shadow-1 surface-card">
                      <label className="block font-medium text-900 mb-3 flex align-items-center">
                        <i className="pi pi-chart-line mr-2 text-primary"></i>
                        Cantidad Recibida
                      </label>
                      <Controller
                        name="cantidadRecibida"
                        control={control}
                        render={({ field }) => (
                          <InputNumber
                            value={field.value}
                            onValueChange={(e) => field.onChange(e.value)}
                            mode="decimal"
                            min={0}
                            max={100000}
                            className="w-full"
                            inputClassName="w-full"
                            suffix=" Bbl"
                            locale="es"
                            disabled={
                              isFieldEnabledCarga(
                                "cantidadRecibida",
                                estadoCarga as EstadoCarga
                              ) ||
                              isFieldEnabledRecepcion(
                                "cantidadRecibida",
                                estadoRecepcion as EstadoRecepcion
                              )
                            }
                          />
                        )}
                      />
                      {errors.cantidadRecibida && (
                        <small className="p-error block mt-2 flex align-items-center">
                          <i className="pi pi-exclamation-circle mr-2"></i>
                          {errors.cantidadRecibida.message}
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Nota Final */}
                  <div className="col-12 mt-2">
                    <div className="p-2 bg-blue-100 border-round-lg flex align-items-center surface-help">
                      <i className="pi pi-info-circle text-2xl text-primary mr-3"></i>
                      <span className="text-700">
                        Verifique todos los datos antes de finalizar el proceso.
                        <br />
                        <strong>Nota:</strong> La cantidad recibida no podrá ser
                        modificada después de completar la operación.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="card p-fluid shadow-1 p-2 surface-50">
                {/* Header Estado General */}
                <div className="flex flex-column md:flex-row align-items-center justify-content-between mb-3 p-2 bg-white border-round">
                  <div className="text-center md:text-left mb-3 md:mb-0">
                    <h2 className="text-2xl font-bold text-900 mb-1">
                      <i className="pi pi-map-marker text-primary mr-2"></i>
                      Estado de la Operación
                    </h2>
                    <p className="text-600 mt-2 flex align-items-center">
                      <i className="pi pi-info-circle mr-2"></i>
                      Actualmente no estás en estado de refinería
                    </p>
                  </div>
                  <i className="pi pi-truck text-6xl text-primary hidden md:block"></i>
                </div>

                {/* Tarjetas Informativas */}
                <div className="grid row-gap-2 ">
                  {/* Programaciones */}
                  <div className="col-12 md:col-6 lg:col-4">
                    <div className="p-3 bg-white border-round shadow-1 surface-card">
                      <div className="flex align-items-center justify-content-between mb-2">
                        <h3 className="font-medium text-900">
                          <i className="pi pi-calendar mr-2 text-primary"></i>
                          Programaciones
                        </h3>
                        <i className="pi pi-clock text-xl text-primary"></i>
                      </div>
                      <ul className="list-none p-0 m-0">
                        <li className="mb-3 flex align-items-center">
                          <i className="pi pi-history mr-2 text-600"></i>
                          Pendientes: <strong className="ml-2">2</strong>
                        </li>
                        <li className="flex align-items-center">
                          <i className="pi pi-check-circle mr-2 text-green-500"></i>
                          Actualización: <strong className="ml-2">Hoy</strong>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="col-12 md:col-6 lg:col-4">
                    <div className="p-3 bg-white border-round shadow-1 surface-card">
                      <div className="flex align-items-center justify-content-between mb-2">
                        <h3 className="font-medium text-900">
                          <i className="pi pi-bolt mr-2 text-primary"></i>
                          Acciones Rápidas
                        </h3>
                        <i className="pi pi-star text-xl text-primary"></i>
                      </div>
                      <div className="grid gap-2">
                        <Button
                          label="Nueva Programación"
                          icon="pi pi-plus"
                          className="p-button-sm w-full mb-2"
                          severity="help"
                          outlined
                        />
                        <Button
                          label="Ver Contratos"
                          icon="pi pi-file"
                          className="p-button-sm w-full"
                          severity="help"
                          outlined
                        />
                      </div>
                    </div>
                  </div>

                  {/* Progreso */}
                  <div className="col-12 lg:col-4">
                    <div className="p-3 bg-white border-round shadow-1 surface-card">
                      <div className="flex align-items-center justify-content-between mb-2">
                        <h3 className="font-medium text-900">
                          <i className="pi pi-chart-bar mr-2 text-primary"></i>
                          Progreso
                        </h3>
                        <i className="pi pi-chart-line text-xl text-primary"></i>
                      </div>
                      <div className="flex flex-column">
                        <ProgressBar
                          value={40}
                          showValue={false}
                          className="h-1rem mb-3"
                          style={{ borderRadius: "10px" }}
                        />
                        <span className="text-sm text-600 flex align-items-center">
                          <i className="pi pi-info-circle mr-2"></i>
                          Progreso general de operaciones
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerta Final */}
                <div className="mt-2 p-2 bg-yellow-100 border-round flex align-items-center surface-warning">
                  <i className="pi pi-exclamation-triangle text-2xl text-yellow-600 mr-3"></i>
                  <div>
                    <h4 className="text-900 mb-1">Acción Requerida</h4>
                    <p className="text-600 m-0">
                      Completa los datos de transporte para habilitar la
                      refinación
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* <div className="col-12">
              <Button
                type="submit"
                disabled={submitting} // Deshabilitar el botón mientras se envía
                icon={submitting ? "pi pi-spinner pi-spin" : ""} // Mostrar ícono de carga
                label={recepcion ? "Modificar Recepción" : "Crear Recepción"}
                className="w-auto mt-3"
              />
            </div> */}
          </form>
        )}
      </div>
    </Dialog>
  );
};

export default RecepcionForm;

// <div className="grid formgrid p-fluid border-1 border-gray-200 rounded-lg">
//   {/* Campo: Estado de carga*/}
//   {/* <div className="field mb-4 col-12 sm:col-6 lg:col-4 lg:hidden "> */}
//   <div className="field mb-4 col-12 hidden lg:block  ">
//     <label htmlFor="estadoCarga" className="font-medium text-900">
//       Estado de Carga
//     </label>
//     <Controller
//       name="estadoCarga"
//       control={control}
//       render={({ field, fieldState }) => (
//         <>
//           <Steps
//             model={estadoCargaOptions.map((option) => ({
//               label: option.label,
//               command: () => {
//                 field.onChange(option.value); // Actualiza el valor en el formulario
//               },
//             }))}
//             activeIndex={estadoCargaOptions.findIndex(
//               (option) => option.value === field.value
//             )} // Marca el estado actual como activo
//             onSelect={(e) => {
//               const selectedOption = estadoCargaOptions[e.index];
//               field.onChange(selectedOption.value); // Actualiza el valor seleccionado
//             }}
//             readOnly={false} // Permite seleccionar pasos
//           />
//           {fieldState.error && (
//             <small className="p-error">
//               {fieldState.error.message}
//             </small>
//           )}
//         </>
//       )}
//     />
//   </div>
//   <div className="field mb-4 col-12 sm:col-6 lg:col-4 lg:hidden ">
//     <label htmlFor="estadoEntrega" className="font-medium text-900 ">
//       Estado de Carga
//     </label>
//     <Controller
//       name="estadoCarga"
//       control={control}
//       render={({ field, fieldState }) => (
//         <Dropdown
//           id="estadoCarga"
//           value={field.value}
//           onChange={(e) => field.onChange(e.value)}
//           options={estadoCargaOptions}
//           placeholder="Seleccionar estado de entrega"
//           className={classNames("w-full", {
//             "p-invalid": fieldState.error,
//           })}
//         />
//       )}
//     />
//     {errors.estadoCarga && (
//       <small className="p-error">{errors.estadoCarga.message}</small>
//     )}
//   </div>

//   {/* Campo: Nombre de la Línea */}
//   <div className="field mb-4 col-12 sm:col-6 lg:col-4">
//     <label
//       htmlFor="id_contacto.nombre"
//       className="font-medium text-900"
//     >
//       Nombre de la Línea
//     </label>
//     <Controller
//       name="idLinea"
//       control={control}
//       render={({ field, fieldState }) => (
//         <Dropdown
//           id="idLinea.id"
//           value={field.value}
//           onChange={(e) => {
//             field.onChange(e.value); // Actualiza el valor seleccionado
//             if (!e.value) {
//               field.onChange(null); // Limpia el valor en el formulario
//             }
//           }}
//           options={lineaRecepcions.map((lineaRecepcion) => ({
//             label: lineaRecepcion.nombre,
//             value: {
//               id: lineaRecepcion.id,
//               nombre: lineaRecepcion.nombre,
//             },
//           }))}
//           placeholder="Seleccionar una línea"
//           className={classNames("w-full", {
//             "p-invalid": fieldState.error,
//           })}
//           showClear
//           filter
//           disabled={isFieldEnabledCarga(
//             "idLinea",
//             estadoCarga as EstadoCarga
//           )}
//         />
//       )}
//     />
//     {errors.idLinea?.nombre && (
//       <small className="p-error">
//         {errors.idLinea.nombre.message}
//       </small>
//     )}
//   </div>

//   {/* Campo:  del Tanque */}
//   <div className="field mb-4 col-12 sm:col-6 lg:col-4">
//     <label
//       htmlFor="id_contacto.nombre"
//       className="font-medium text-900"
//     >
//       Nombre del Tanque
//     </label>
//     <Controller
//       name="idTanque"
//       control={control}
//       render={({ field, fieldState }) => {
//         // Obtener el producto seleccionado en idContratoItems
//         const selectedProducto = watch("idContratoItems")?.producto;

//         // Filtrar los tanques que almacenan el producto seleccionado
//         const filteredTanques = tanques.filter(
//           (tanque) => tanque.idProducto?.id === selectedProducto?.id
//         );
//         // Condición para inhabilitar el campo
//         const isDisabled = isFieldEnabledCarga(
//           "idTanque",
//           estadoCarga as EstadoCarga
//         );

//         return (
//           <>
//             <Dropdown
//               id="idTanque.id"
//               value={field.value}
//               onChange={(e) => {
//                 field.onChange(e.value); // Actualiza el valor seleccionado
//                 if (!e.value) {
//                   field.onChange(null); // Limpia el valor en el formulario
//                 }
//               }}
//               options={filteredTanques.map((tanque) => ({
//                 label: `${tanque.nombre} - ${
//                   tanque.idProducto?.nombre || "Sin producto"
//                 } (${tanque.almacenamiento || 0} Bbl)`,
//                 value: {
//                   id: tanque.id,
//                   nombre: tanque.nombre,
//                   _id: tanque.id,
//                 },
//               }))}
//               placeholder="Seleccionar un tanque"
//               className={classNames("w-full", {
//                 "p-invalid": fieldState.error,
//               })}
//               showClear
//               filter
//               disabled={isDisabled} // Inhabilitar el campo si no está en proceso
//             />
//             {fieldState.error && (
//               <small className="p-error">
//                 {fieldState.error.message}
//               </small>
//             )}
//           </>
//         );
//       }}
//     />
//   </div>

//   {/* Campo: Fecha Inicio Receocion */}
//   <div className="field mb-4 col-12 sm:col-4 lg:4">
//     <label
//       htmlFor="fechaInicioRecepcion"
//       className="font-medium text-900"
//     >
//       Fecha Inicio Recepción
//     </label>
//     <Calendar
//       id="fechaInicioRecepcion"
//       value={
//         watch("fechaInicioRecepcion")
//           ? new Date(watch("fechaInicioRecepcion") as string | Date)
//           : undefined
//       }
//       {...register("fechaInicioRecepcion")}
//       showTime
//       hourFormat="24"
//       className={classNames("w-full", {
//         "p-invalid": errors.fechaInicioRecepcion,
//       })}
//       locale="es"
//       disabled={isFieldEnabledCarga(
//         "fechaInicioRecepcion",
//         estadoCarga as EstadoCarga
//       )}
//     />
//     {errors.fechaInicioRecepcion && (
//       <small className="p-error">
//         {errors.fechaInicioRecepcion.message}
//       </small>
//     )}
//   </div>
//   {/* Campo: Fecha Fin Recepcion */}
//   <div className="field mb-4 col-12 sm:col-4 lg:4">
//     <label
//       htmlFor="fechaFinRecepcion"
//       className="font-medium text-900"
//     >
//       Fecha Fin Recepción
//     </label>
//     <Calendar
//       id="fechaFinRecepcion"
//       value={
//         watch("fechaFinRecepcion")
//           ? new Date(watch("fechaFinRecepcion") as string | Date)
//           : undefined
//       }
//       {...register("fechaFinRecepcion")}
//       showTime
//       hourFormat="24"
//       className={classNames("w-full", {
//         "p-invalid": errors.fechaFinRecepcion,
//       })}
//       locale="es"
//       disabled={isFieldEnabledCarga(
//         "fechaFinRecepcion",
//         estadoCarga as EstadoCarga
//       )}
//     />
//     {errors.fechaFinRecepcion && (
//       <small className="p-error">
//         {errors.fechaFinRecepcion.message}
//       </small>
//     )}
//   </div>
//   {/* Campo: Cantidad Recibida */}
//   <div className="field mb-4 col-12 sm:col-6 lg:col-2">
//     <label
//       htmlFor="cantidadRecibida"
//       className="font-medium text-900"
//     >
//       Cantidad Recibida
//     </label>
//     <Controller
//       name="cantidadRecibida"
//       control={control}
//       render={({ field }) => (
//         <InputNumber
//           id="cantidadRecibida"
//           value={field.value}
//           onValueChange={(e) => field.onChange(e.value)}
//           className={classNames("w-full", {
//             "p-invalid": errors.cantidadRecibida,
//           })}
//           min={0}
//           locale="es"
//           disabled={isFieldEnabledCarga(
//             "cantidadRecibida",
//             estadoCarga as EstadoCarga
//           )}
//         />
//       )}
//     />
//     {errors.cantidadRecibida && (
//       <small className="p-error">
//         {errors.cantidadRecibida.message}
//       </small>
//     )}
//   </div>
// </div>

import { Controller } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { Steps } from "primereact/steps";
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import CustomCalendar from "@/components/common/CustomCalendar";
import { useEffect, useRef } from "react";

interface RepecionFormRecepcionProps {
  control: any;
  errors: any;
  watch: any;
  showToast: (
    severity: "success" | "error" | "warn",
    summary: string,
    detail: string
  ) => void;
  isFieldEnabledRecepcion: (
    fieldName: string,
    estadoRecepcion: string
  ) => boolean;
  estadoRecepcion: string;
  estadoRecepcionOptions: { label: string; value: string }[];
  validarCamposRequeridosRecepcion: (estadoDestino: string) => boolean;
  getValidTransitionsRecepcion: (currentState: string) => string[];
  contratos: any[];
  truncateText: (text: string, maxLength: number) => string;
  register: any;
  setValue: any;
  calendarRef: any;
}

export const RepecionFormRecepcion = ({
  control,
  errors,
  watch,
  showToast,
  isFieldEnabledRecepcion,
  estadoRecepcion,
  estadoRecepcionOptions,
  validarCamposRequeridosRecepcion,
  getValidTransitionsRecepcion,
  contratos,
  truncateText,
  register,
  setValue,
  calendarRef,
}: RepecionFormRecepcionProps) => {
  console.log(watch("idContrato.idItems"));
  return (
    <div className="card p-fluid surface-50 p-2 border-round shadow-2">
      {/* Sección Estado Recepción */}
      <div className="col-12 mb-1">
        <div className="border-bottom-2 border-primary pb-3">
          {/* Versión Desktop */}
          <div className="hidden lg:block">
            <label className="block font-medium text-900 mb-3 flex align-items-center">
              <i className="pi pi-map-marker text-primary mr-2"></i>
              Estado de la Recepción
            </label>
            <Controller
              name="estadoRecepcion"
              control={control}
              render={({ field, fieldState }) => (
                <div className="bg-white p-3 border-round shadow-1">
                  <Steps
                    model={estadoRecepcionOptions.map((option) => ({
                      label: option.label,
                      command: () => {
                        const validTransitions =
                          getValidTransitionsRecepcion(estadoRecepcion);
                        if (validTransitions.includes(option.value)) {
                          if (validarCamposRequeridosRecepcion(option.value)) {
                            field.onChange(option.value);
                          }
                        } else {
                          showToast(
                            "warn",
                            "Transición no válida",
                            `No puedes cambiar a ${option.label} desde ${estadoRecepcion}`
                          );
                        }
                      },
                    }))}
                    activeIndex={estadoRecepcionOptions.findIndex(
                      (option) => option.value === field.value
                    )}
                    readOnly={false}
                    className="surface-card"
                  />
                  {fieldState.error && (
                    <small className="p-error block mt-2 flex align-items-center">
                      <i className="pi pi-exclamation-circle mr-2"></i>
                      {fieldState.error.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>

          {/* Versión Mobile */}
          <div className="lg:hidden">
            <label className="block font-medium text-900 mb-3 flex align-items-center">
              <i className="pi pi-map-marker text-primary mr-2"></i>
              Estado de la Recepción
            </label>
            <Controller
              name="estadoRecepcion"
              control={control}
              render={({ field, fieldState }) => (
                <div className="bg-white p-3 border-round shadow-1">
                  <Dropdown
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={estadoRecepcionOptions}
                    placeholder="Seleccionar estado"
                    className="w-full"
                    panelClassName="shadow-3"
                  />
                  {fieldState.error && (
                    <small className="p-error block mt-2 flex align-items-center">
                      <i className="pi pi-exclamation-circle mr-2"></i>
                      {fieldState.error.message}
                    </small>
                  )}
                </div>
              )}
            />
          </div>
        </div>
      </div>

      {/* Campos del Formulario */}
      <div className="grid formgrid row-gap-2 ">
        {/* Fila 1 */}
        <div className="col-12 lg:col-4">
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-file text-primary mr-2"></i>
              Número de Contrato
            </label>
            <Controller
              name="idContrato"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <Dropdown
                    id="idContrato.id"
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    options={contratos.map((contrato) => ({
                      label: `${contrato.numeroContrato} - ${truncateText(
                        contrato.descripcion || "Sin descripción",
                        30
                      )}`,
                      value: {
                        id: contrato.id,
                        numeroContrato: contrato.numeroContrato,
                        idItems: contrato.idItems,
                        _id: contrato._id,
                      },
                    }))}
                    placeholder="Seleccionar un proveedor"
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    showClear
                    filter
                    disabled={
                      !isFieldEnabledRecepcion("idContrato", estadoRecepcion)
                    }
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

        <div className="col-12 lg:col-6">
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-box text-primary mr-2"></i>
              Seleccione Producto
            </label>
            <Controller
              name="idContratoItems"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <div className="grid gap-2">
                    {watch("idContrato.idItems")?.map((items: any) => (
                      <div
                        key={items.id}
                        className="col-12 md:col-6 flex align-items-center"
                      >
                        <RadioButton
                          inputId={items.id}
                          name="items"
                          value={items}
                          onChange={(e) => field.onChange(e.value)}
                          checked={field.value?.id === items.id}
                          className="mr-2"
                          disabled={
                            !isFieldEnabledRecepcion(
                              "idContratoItems",
                              estadoRecepcion
                            )
                          }
                        />
                        <label htmlFor={items.id} className="text-900">
                          {`${items.producto.nombre}- ${items.idTipoProducto.nombre} - ${items.cantidad}Bbl`}
                        </label>
                      </div>
                    ))}
                  </div>
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

        {/* Fila 2 */}
        <div className="col-12 md:col-6 lg:col-2">
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-arrow-right text-primary mr-2"></i>
              Cantidad Esperada
            </label>
            <Controller
              name="cantidadEnviada"
              control={control}
              defaultValue={0} // Valor inicial
              render={({ field, fieldState }) => (
                <>
                  <InputNumber
                    id="cantidadEnviada"
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value ?? 0)}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    min={0}
                    locale="es"
                    disabled={
                      !isFieldEnabledRecepcion(
                        "cantidadEnviada",
                        estadoRecepcion
                      )
                    }
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
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-id-card text-primary mr-2"></i>
              ID de la Guía
            </label>
            <Controller
              name="idGuia"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputNumber
                    id="idGuia"
                    value={field.value}
                    onValueChange={(e) => field.onChange(e.value)}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    min={0}
                    locale="es"
                    disabled={
                      !isFieldEnabledRecepcion("idGuia", estadoRecepcion)
                    }
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

        {/* Fila 3 */}
        <div className="col-12 md:col-6 lg:col-2">
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-car text-primary mr-2"></i>
              Placa
            </label>
            <Controller
              name="placa"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    id="placa"
                    {...field}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    disabled={
                      !isFieldEnabledRecepcion("placa", estadoRecepcion)
                    }
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
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-user text-primary mr-2"></i>
              Nombre del Chofer
            </label>
            <Controller
              name="nombreChofer"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    {...field}
                    className={classNames("w-full", {
                      "p-invalid": fieldState.error,
                    })}
                    disabled={
                      !isFieldEnabledRecepcion("nombreChofer", estadoRecepcion)
                    }
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

        {/* Fila 4 - Fechas */}
        {/* Campo: Fecha Salida */}
        <div className="col-12 md:col-6 lg:col-3">
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-calendar-minus text-primary mr-2"></i>
              Fecha Salida
            </label>
            <Controller
              name="fechaSalida"
              control={control}
              render={({ field, fieldState }) => (
                <>
                  <CustomCalendar
                    {...field}
                    name="fechaSalida"
                    control={control}
                    setValue={setValue}
                    calendarRef={calendarRef}
                    isFieldEnabled={
                      !isFieldEnabledRecepcion("fechaSalida", estadoRecepcion)
                    }
                    value={
                      field.value
                        ? new Date(field.value as string | Date)
                        : null
                    }
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

        {/* Campo: Fecha Llegada */}
        <div className="col-12 md:col-6 lg:col-3">
          <div className="p-3 bg-white border-round shadow-1">
            <label className="block font-medium text-900 mb-2 flex align-items-center">
              <i className="pi pi-calendar-plus text-primary mr-2"></i>
              {watch("estadoRecepcion") === "EN_TRANSITO"
                ? "Fecha estimada de llegada"
                : "Fecha de llegada real"}
            </label>

            <Controller
              name="fechaLlegada"
              control={control}
              render={({ field, fieldState }) => {
                // Usar useEffect para manejar el cambio de estado
                const previousEstadoRecepcion = useRef<string | null>(null); // Estado previo
                useEffect(() => {
                  const currentEstadoRecepcion = watch("estadoRecepcion");

                  // Detectar la transición de EN_TRANSITO a EN_REFINERIA
                  if (
                    previousEstadoRecepcion.current === "EN_TRANSITO" &&
                    currentEstadoRecepcion === "EN_REFINERIA"
                  ) {
                    field.onChange(new Date()); // Actualizar la fecha de llegada
                  }

                  // Actualizar el estado previo
                  previousEstadoRecepcion.current = currentEstadoRecepcion;
                }, [watch("estadoRecepcion")]); // Ejecutar cuando cambie estadoRecepcion

                return (
                  <>
                    <CustomCalendar
                      {...field}
                      name="fechaLlegada"
                      control={control}
                      setValue={setValue}
                      calendarRef={calendarRef}
                      isFieldEnabled={
                        !isFieldEnabledRecepcion(
                          "fechaLlegada",
                          estadoRecepcion
                        )
                      }
                      value={
                        field.value
                          ? new Date(field.value as string | Date)
                          : null
                      }
                      onChange={field.onChange}
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

        {/* Sección Chequeo Calidad */}
        <div className="col-12 mt-2">
          <div className="p-2 bg-blue-100 border-round-lg flex align-items-center surface-help">
            <i className="pi pi-info-circle text-2xl text-primary mr-3"></i>
            <span className="text-700">
              Control de Calidad y Cantidad
              <br />
              <strong>Nota:</strong> Realizar mediciones de API, azufre y
              contenido de agua antes de confirmar la recepción
            </span>
          </div>
        </div>
        {/* <div className="col-12 mt-2">
          <div className="p-2 bg-blue-100 border-round flex align-items-center surface-help">
            <i className="pi pi-check-circle text-2xl text-primary mr-3"></i>
            <div>
              <h4 className="text-900 mb-1">Control de Calidad y Cantidad</h4>
              <p className="text-600 m-0">
                Realizar mediciones de API, azufre y contenido de agua antes de
                confirmar la recepción
              </p>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};
//  <div className="grid formgrid p-fluid border-1 border-gray-200 rounded-lg">
//       {/* Campo: Estado de la Recepción */}
//       <div className="field mb-4 col-12 hidden lg:block">
//         <label htmlFor="estadoRecepcion" className="font-medium text-900">
//           Estado de la Recepción
//         </label>
//         <Controller
//           name="estadoRecepcion"
//           control={control}
//           render={({ field, fieldState }) => (
//             <>
//               <Steps
//                 model={estadoRecepcionOptions.map((option) => ({
//                   label: option.label,
//                   command: () => {
//                     const validTransitions =
//                       getValidTransitionsRecepcion(estadoRecepcion);
//                     if (validTransitions.includes(option.value)) {
//                       if (validarCamposRequeridosRecepcion(option.value)) {
//                         field.onChange(option.value);
//                       }
//                     } else {
//                       showToast(
//                         "warn",
//                         "Transición no válida",
//                         `No puedes cambiar a ${option.label} desde ${estadoRecepcion}`
//                       );
//                     }
//                   },
//                 }))}
//                 activeIndex={estadoRecepcionOptions.findIndex(
//                   (option) => option.value === field.value
//                 )}
//                 readOnly={false}
//               />
//               {fieldState.error && (
//                 <small className="p-error">{fieldState.error.message}</small>
//               )}
//             </>
//           )}
//         />
//       </div>
//       <div className="field mb-4 col-12 sm:col-6 lg:4 lg:hidden">
//         <label htmlFor="estadoRecepcion" className="font-medium text-900">
//           Estado de la Recepción
//         </label>
//         <Controller
//           name="estadoRecepcion"
//           control={control}
//           render={({ field, fieldState }) => (
//             <Dropdown
//               id="estadoRecepcion"
//               value={field.value}
//               onChange={(e) => field.onChange(e.value)}
//               options={estadoRecepcionOptions}
//               placeholder="Seleccionar estado de la recepción"
//               className={classNames("w-full", {
//                 "p-invalid": fieldState.error,
//               })}
//             />
//           )}
//         />
//         {errors.estadoRecepcion && (
//           <small className="p-error">{errors.estadoRecepcion.message}</small>
//         )}
//       </div>

//       {/* Campo: Número de Contrato */}
//       <div className="field mb-4 col-12 sm:col-6 lg:col-4">
//         <label htmlFor="idContacto.nombre" className="font-medium text-900">
//           Número de Contrato
//         </label>
//         <Controller
//           name="idContrato"
//           control={control}
//           render={({ field, fieldState }) => {
//             console.log("fieldState", fieldState.error);
//             return (
//               <>
//                 <Dropdown
//                   id="idContrato.id"
//                   value={field.value}
//                   onChange={(e) => field.onChange(e.value)}
//                   options={contratos.map((contrato) => ({
//                     label: `${contrato.numeroContrato} - ${truncateText(
//                       contrato.descripcion || "Sin descripción",
//                       30
//                     )}`,
//                     value: { ...contrato },
//                   }))}
//                   placeholder="Seleccionar un proveedor"
//                   className={classNames("w-full", {
//                     "p-invalid": fieldState.error,
//                   })}
//                   showClear
//                   filter
//                   disabled={
//                     !isFieldEnabledRecepcion("idContrato", estadoRecepcion)
//                   }
//                 />
//                 {fieldState.error && (
//                   <small className="p-error">{fieldState.error.message}</small>
//                 )}
//               </>
//             );
//           }}
//         />
//         {errors.idContrato?.numeroContrato && (
//           <small className="p-error">
//             {errors.idContrato.numeroContrato.message}
//           </small>
//         )}
//       </div>

//       {/* Campo: Nombre del producto*/}
//       <div className="field mb-4 col-12 sm:col-6 lg:col-6">
//         <label htmlFor="idContacto.nombre" className="font-medium text-900">
//           Seleccione Producto
//         </label>
//         <Controller
//           name="idContratoItems"
//           control={control}
//           render={({ field }) => (
//             <>
//               {watch("idContrato.idItems")?.map((items: any) => (
//                 <div key={items.id} className="flex align-items-center">
//                   <RadioButton
//                     inputId={items.id}
//                     name="items"
//                     value={items}
//                     onChange={(e) => field.onChange(e.value)}
//                     checked={field.value?.id === items.id}
//                     disabled={
//                       !isFieldEnabledRecepcion(
//                         "idContratoItems",
//                         estadoRecepcion
//                       )
//                     }
//                   />
//                   <label htmlFor={items.id} className="ml-2">
//                     {items.producto.nombre + "-" + items.cantidad + "Bbl"}
//                   </label>
//                 </div>
//               ))}
//             </>
//           )}
//         />
//         {errors.idContratoItems && (
//           <small className="p-error">{errors.idContratoItems.message}</small>
//         )}
//       </div>

//       {/* Campo: Cantidad Enviada */}
//       <div className="field mb-4 col-12 sm:col-6 lg:col-2">
//         <label htmlFor="cantidadEnviada" className="font-medium text-900">
//           Cantidad Enviada
//         </label>
//         <Controller
//           name="cantidadEnviada"
//           control={control}
//           defaultValue={0}
//           render={({ field }) => (
//             <InputNumber
//               id="cantidadEnviada"
//               value={field.value}
//               onValueChange={(e) => field.onChange(e.value ?? 0)}
//               className={classNames("w-full", {
//                 "p-invalid": errors.cantidadEnviada,
//               })}
//               min={0}
//               locale="es"
//               disabled={
//                 !isFieldEnabledRecepcion("cantidadEnviada", estadoRecepcion)
//               }
//             />
//           )}
//         />
//         {errors.cantidadEnviada && (
//           <small className="p-error">{errors.cantidadEnviada.message}</small>
//         )}
//       </div>

//       {/* Campo: ID de la Guía */}
//       <div className="field mb-4 col-12 sm:col-6 lg:col-2">
//         <label htmlFor="idGuia" className="font-medium text-900">
//           ID de la Guía
//         </label>
//         <Controller
//           name="idGuia"
//           control={control}
//           render={({ field }) => (
//             <InputNumber
//               id="idGuia"
//               value={field.value}
//               onValueChange={(e) => field.onChange(e.value)}
//               className={classNames("w-full", {
//                 "p-invalid": errors.idGuia,
//               })}
//               min={0}
//               locale="es"
//               disabled={!isFieldEnabledRecepcion("idGuia", estadoRecepcion)}
//             />
//           )}
//         />
//         {errors.idGuia && (
//           <small className="p-error">{errors.idGuia.message}</small>
//         )}
//       </div>

//       {/* Campo: Placa */}
//       <div className="field mb-4 col-12 sm:col-6 lg:col-2">
//         <label htmlFor="placa" className="font-medium text-900">
//           Placa
//         </label>
//         <InputText
//           id="placa"
//           {...register("placa")}
//           className={classNames("w-full", { "p-invalid": errors.placa })}
//           disabled={!isFieldEnabledRecepcion("placa", estadoRecepcion)}
//         />
//         {errors.placa && (
//           <small className="p-error">{errors.placa.message}</small>
//         )}
//       </div>

//       {/* Campo: Nombre del Chofer */}
//       <div className="field mb-4 col-12 sm:col-6 lg:col-4">
//         <label htmlFor="nombreChofer" className="font-medium text-900">
//           Nombre del Chofer
//         </label>
//         <InputText
//           id="nombreChofer"
//           {...register("nombreChofer")}
//           className={classNames("w-full", {
//             "p-invalid": errors.nombreChofer,
//           })}
//           disabled={!isFieldEnabledRecepcion("nombreChofer", estadoRecepcion)}
//         />
//         {errors.nombreChofer && (
//           <small className="p-error">{errors.nombreChofer.message}</small>
//         )}
//       </div>

//       {/* Campo: Fecha Salida */}
//       <div className="field mb-4 col-12 sm:col-4 lg:4">
//         <label htmlFor="fechaSalida" className="font-medium text-900">
//           Fecha Salida
//         </label>
//         <Calendar
//           id="fechaSalida"
//           value={
//             watch("fechaSalida")
//               ? new Date(watch("fechaSalida") as string | Date)
//               : undefined
//           }
//           {...register("fechaSalida")}
//           showTime
//           hourFormat="24"
//           className={classNames("w-full", {
//             "p-invalid": errors.fechaSalida,
//           })}
//           locale="es"
//           disabled={!isFieldEnabledRecepcion("fechaSalida", estadoRecepcion)}
//         />
//         {errors.fechaSalida && (
//           <small className="p-error">{errors.fechaSalida.message}</small>
//         )}
//       </div>

//       {/* Campo: Fecha Llegada */}
//       <div className="field mb-4 col-12 sm:col-4 lg:4">
//         <label htmlFor="fechaLlegada" className="font-medium text-900">
//           Fecha Llegada
//         </label>
{
  /* <Calendar
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
  disabled={!isFieldEnabledRecepcion("fechaLlegada", estadoRecepcion)}
/>; */
}
//         {errors.fechaLlegada && (
//           <small className="p-error">{errors.fechaLlegada.message}</small>
//         )}
//       </div>

//       <h3>falta el tema del chequeo de cantidad y calidad</h3>
//     </div>

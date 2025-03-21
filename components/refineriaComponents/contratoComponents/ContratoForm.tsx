import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { contratoSchema } from "@/libs/zod";
import { Toast } from "primereact/toast";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { createContrato, updateContrato } from "@/app/api/contratoService";
import { InputNumber } from "primereact/inputnumber";
import { DataTable, DataTableRowEditCompleteEvent } from "primereact/datatable";
import { Column, ColumnEditorOptions } from "primereact/column";
import { Tag } from "primereact/tag";
import { getContactos } from "@/app/api/contactoService";
import { Calendar } from "primereact/calendar";
import { Contacto } from "@/libs/interfaces";
import { useRefineryData } from "@/hooks/useRefineryData";
import { ProgressSpinner } from "primereact/progressspinner";

type FormData = z.infer<typeof contratoSchema>;

interface ContratoFormProps {
  contrato: any;
  hideContratoFormDialog: () => void;
  contratos: any[];
  setContratos: (contratos: any[]) => void;
  setContrato: (contrato: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];
const tipoContatroValues = ["Compra", "Venta"];
const estadoEntregaOptions = [
  { label: "Pendiente", value: "Pendiente" },
  { label: "En Tránsito", value: "En Tránsito" },
  { label: "Entregado", value: "Entregado" },
  { label: "Cancelado", value: "Cancelado" },
];
const estado_contratoOptions = [
  { label: "Adjudicado", value: "Adjudicado" },
  { label: "Activo", value: "Activo" },
  { label: "Inactivo", value: "Inactivo" },
];

function ContratoForm({
  contrato,
  hideContratoFormDialog,
  contratos,
  setContratos,
  showToast,
}: ContratoFormProps) {
  const { activeRefineria } = useRefineriaStore();
  const { productos, tipoProductos, contactos, loading } = useRefineryData(
    activeRefineria?.id || ""
  );
  const toast = useRef<Toast | null>(null);
  const [items, setItems] = useState(contrato?.idItems || []);

  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(contratoSchema),
    defaultValues: {
      condicionesPago: {
        plazo: 0,
      },
    },
  });

  useEffect(() => {
    if (contrato) {
      Object.keys(contrato).forEach((key) =>
        setValue(key as keyof FormData, contrato[key])
      );
    }
  }, [contrato, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      data.items = items;
      console.log("data", data);
      if (contrato) {
        const updatedContrato = await updateContrato(contrato.id, {
          ...data,
          idRefineria: activeRefineria?.id,
          idContacto: data.idContacto.id,
        });
        const updatedContratos = contratos.map((t) =>
          t.id === updatedContrato.id ? updatedContrato : t
        );
        setContratos(updatedContratos);
        showToast("success", "Éxito", "Contrato actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newContrato = await createContrato({
          ...data,
          idRefineria: activeRefineria.id,
          idContacto: data.idContacto.id,
        });
        console.log("nuevoContrato", newContrato);
        setContratos([...contratos, newContrato]);
        console.log(contratos);
        showToast("success", "Éxito", "Contrato creado");
      }
      hideContratoFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar contrato:", error);
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setSubmitting(false); // Desactivar el estado de envío
    }
  };
  const addItem = () => {
    setItems([
      ...items,
      {
        nombre: "", // El nombre del crudo es obligatorio
        // clasificacion: undefined, // La clasificación es opcional
        gravedadAPI: 0, // Gravedad API del producto (opcional, debe ser no negativa)
        azufre: 0, // Porcentaje de azufre (opcional, debe ser no negativo)
        contenidoAgua: 0, // Contenido de agua en porcentaje (opcional, debe ser no negativo)
        flashPoint: 0, // Flashpoint del producto (opcional)
        cantidad: 0, // Cantidad de producto (opcional, debe ser no negativa)
        brent: 0, // Precio de Brent (opcional, debe ser no negativo)
        convenio: 0, // Precio de convenio (opcional, debe ser no negativo)
        precioUnitario: 0, // Precio unitario (opcional, debe ser no negativo)
        montoTransporte: 0, // Monto de transporte (opcional, debe ser no negativo)
      },
    ]);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const deleteItem = (index: number) => {
    const newItems = items.filter((_: any, i: number) => i !== index);
    setItems(newItems);
    setValue("idItems", newItems);
  };

  const actionBodyTemplate = (rowData: any, options: any) => {
    return (
      <div className="flex justify-content-center">
        <Button
          type="button"
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => deleteItem(options.rowIndex)}
        />
      </div>
    );
  };
  const calculatePrecioUnitario = (brent: number, convenio: number) => {
    return (brent || 0) + (convenio || 0);
  };
  const productoEditor = (options: ColumnEditorOptions) => {
    console.log(options);
    const onChange = (e: DropdownChangeEvent) => {
      options.editorCallback!(e.value);
    };

    return (
      <>
        <Dropdown
          id="idProducto.id"
          // value={watch("idProducto")}
          // onChange={(e) => {
          //   setValue("idProducto", e.value);
          // }}
          value={options.value}
          onChange={onChange}
          options={productos.map((producto) => ({
            label: producto.nombre,
            value: {
              id: producto.id,
              _id: producto.id,
              nombre: producto.nombre,
            },
          }))}
          placeholder="Seleccionar un producto"
          // className={classNames("w-full", {
          //   "p-invalid": errors.idProducto?.nombre,
          // })}
        />

        {/* <Dropdown
          value={options.value}
          options={productos}
          onChange={(e: DropdownChangeEvent) =>
            options.editorCallback!(e.value)
          }
          placeholder="Selecionar un producto"
          itemTemplate={(option) => {
            return (
              <Tag
                value={option}
                className={`customer-badge status-${option
                  .toLowerCase()
                  .replace(/[()]/g, "")
                  .replace(/\s+/g, "-")}`}
              ></Tag>
            );
          }}
        /> */}
      </>
    );
  };
  const idTipoProductoEditor = (options: ColumnEditorOptions) => {
    const onChange = (e: DropdownChangeEvent) => {
      options.editorCallback!(e.value);
      updateRowDataTipoProducto(options, e.value);
    };

    return (
      <Dropdown
        id="idTipoProducto.id"
        value={options.value}
        onChange={onChange}
        options={tipoProductos.map((tipoProducto) => ({
          label: tipoProducto.nombre,
          value: {
            id: tipoProducto.id,
            _id: tipoProducto.id,
            nombre: tipoProducto.nombre,
          },
        }))}
        placeholder="Seleccionar un tipo producto"
      />
    );
  };

  const updateRowDataTipoProducto = (
    options: ColumnEditorOptions,
    tipoProductoValue: any
  ) => {
    const caracteristicasTipoProducto = tipoProductos.find(
      (tipoProducto) => tipoProducto.id === tipoProductoValue?.id
    );

    // // Actualizar directamente el rowData
    options.rowData.idTipoProducto = tipoProductoValue;
    options.rowData.clasificacion =
      caracteristicasTipoProducto?.clasificacion || "";
    options.rowData.gravedadAPI = caracteristicasTipoProducto?.gravedadAPI || 0;
    options.rowData.azufre = caracteristicasTipoProducto?.azufre || 0;
    options.rowData.contenidoAgua =
      caracteristicasTipoProducto?.contenidoAgua || 0;
    options.rowData.flashPoint = caracteristicasTipoProducto?.flashPoint || 0;

    setItems(() =>
      items.map((item: any, index: number) => {
        if (index === options.rowIndex) {
          return {
            ...item,
            idTipoProducto: tipoProductoValue,
            clasificacion: caracteristicasTipoProducto?.clasificacion || "",
            gravedadAPI: caracteristicasTipoProducto?.gravedadAPI || 0,
            azufre: caracteristicasTipoProducto?.azufre || 0,
            contenidoAgua: caracteristicasTipoProducto?.contenidoAgua || 0,
            flashPoint: caracteristicasTipoProducto?.flashPoint || 0,
          };
        }
        return item;
      })
    );

    // Actualizar el estado de items para que la tabla se re-renderice
    // setItems((prevItems: any) => {
    //   const newItems = [...prevItems];
    //   newItems[options.rowIndex] = { ...options.rowData }; // Crear una nueva referencia para activar la re-renderización
    //   return newItems;
    // });
  };
  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }
  console.log(watch());
  console.log(errors);
  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid">
          {/* Campo: Número de Contrato */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="numeroContrato" className="font-medium text-900">
              Número de Contrato
            </label>
            <InputText
              id="numeroContrato"
              {...register("numeroContrato")}
              className={classNames("w-full", {
                "p-invalid": errors.numeroContrato,
              })}
            />
            {errors.numeroContrato && (
              <small className="p-error">{errors.numeroContrato.message}</small>
            )}
          </div>
          {/* Campo: Descripcion de Contrato */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-8">
            <label htmlFor="numeroContrato" className="font-medium text-900">
              Descripción de Contrato
            </label>
            <InputText
              id="descripcion"
              {...register("descripcion")}
              className={classNames("w-full", {
                "p-invalid": errors.descripcion,
              })}
            />
            {errors.descripcion && (
              <small className="p-error">{errors.descripcion.message}</small>
            )}
          </div>
          {/* Campo: Nombre de Contacto */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-3">
            <label htmlFor="idContacto.nombre" className="font-medium text-900">
              Nombre de Proveedor
            </label>
            <Dropdown
              id="idContacto.id"
              value={watch("idContacto")}
              // {...register("idContacto.id")}
              onChange={(e) => {
                setValue("idContacto", e.value);
              }}
              options={contactos.map((contacto) => ({
                label: contacto.nombre,
                value: { id: contacto.id, nombre: contacto.nombre },
              }))}
              placeholder="Seleccionar un proveedor"
              className={classNames("w-full", {
                "p-invalid": errors.idContacto?.nombre,
              })}
            />
            {errors.idContacto?.nombre && (
              <small className="p-error">
                {errors.idContacto.nombre.message}
              </small>
            )}
          </div>
          {/* Campo: Tipo de contrato */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-3">
            <label htmlFor="estado" className="font-medium text-900">
              Tipo de Contrato
            </label>
            <Dropdown
              id="tipoContrato"
              value={watch("tipoContrato")}
              onChange={(e) => setValue("tipoContrato", e.value)}
              options={tipoContatroValues}
              placeholder="Seleccionar"
              className={classNames("w-full", {
                "p-invalid": errors.tipoContrato,
              })}
            />
            {errors.tipoContrato && (
              <small className="p-error">{errors.tipoContrato.message}</small>
            )}
          </div>
          {/* Campo: Tipo de Condiciones de Pago */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-3">
            <label
              htmlFor="condicionesPago.tipo"
              className="font-medium text-900"
            >
              Tipo de Condiciones de Pago
            </label>
            <Dropdown
              id="condicionesPago.tipo"
              value={watch("condicionesPago.tipo")}
              {...register("condicionesPago.tipo")}
              options={["Contado", "Crédito"]}
              placeholder="Seleccionar un tipo de condiciones de pago"
              className={classNames("w-full", {
                "p-invalid": errors.condicionesPago?.tipo,
              })}
            />
            {errors.condicionesPago?.tipo && (
              <small className="p-error">
                {errors.condicionesPago.tipo.message}
              </small>
            )}
          </div>

          {/* Campo: Plazo de Condiciones de Pago */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-3">
            <label
              htmlFor="condicionesPago.plazo"
              className="font-medium text-900"
            >
              {" Plazo de Condiciones de Pago (Dias)"}
            </label>
            <Controller
              name="condicionesPago.plazo"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.condicionesPago?.plazo,
                  })}
                />
              )}
            />
            {errors.condicionesPago?.plazo && (
              <small className="p-error">
                {errors.condicionesPago.plazo.message}
              </small>
            )}
          </div>

          {/* Campo: Estado de Entrega */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estadoEntrega" className="font-medium text-900">
              Estado de Contrato
            </label>
            <Dropdown
              id="estadoContrato"
              value={watch("estadoContrato")}
              {...register("estadoContrato")}
              options={estado_contratoOptions}
              placeholder="Seleccionar estado de entrega"
              className={classNames("w-full", {
                "p-invalid": errors.estadoContrato,
              })}
            />
            {errors.estadoContrato && (
              <small className="p-error">{errors.estadoContrato.message}</small>
            )}
          </div>
          {/* Campo: Estado de Entrega */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estadoEntrega" className="font-medium text-900">
              Estado de Entrega
            </label>
            <Dropdown
              id="estadoEntrega"
              value={watch("estadoEntrega")}
              {...register("estadoEntrega")}
              options={estadoEntregaOptions}
              placeholder="Seleccionar estado de entrega"
              className={classNames("w-full", {
                "p-invalid": errors.estadoEntrega,
              })}
            />
            {errors.estadoEntrega && (
              <small className="p-error">{errors.estadoEntrega.message}</small>
            )}
          </div>
          {/* Campo: Fecha Inicio */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estadoEntrega" className="font-medium text-900">
              Fecha de Inicio
            </label>

            <Calendar
              id="fechaInicio"
              value={
                watch("fechaInicio")
                  ? new Date(watch("fechaInicio") as any)
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
          {/* Campo: Fecha Fin */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estadoEntrega" className="font-medium text-900">
              Fecha de Fin
            </label>

            <Calendar
              id="fechaFin"
              value={
                watch("fechaFin")
                  ? new Date(watch("fechaFin") as any)
                  : undefined
              }
              {...register("fechaFin")}
              showTime
              hourFormat="24"
              className={classNames("w-full", {
                "p-invalid": errors.fechaFin,
              })}
              locale="es"
            />
            {errors.fechaFin && (
              <small className="p-error">{errors.fechaFin.message}</small>
            )}
          </div>
          {/* Tabla de Items del Contrato */}
          <div className="orders-subtable col-12">
            {/* <h5>Items for {contrato?.name}</h5> */}
            <DataTable
              value={items}
              responsiveLayout="scroll"
              scrollable
              className="datatable-responsive"
              size="small"
              editMode="cell"
            >
              <Column
                field="producto.nombre"
                header="Producto"
                editor={(options) => productoEditor(options)}
                onCellEditComplete={(e) => {
                  const {
                    rowData,
                    newValue,
                    rowIndex,
                    originalEvent: event,
                  } = e;
                  if (!newValue || !newValue.id) {
                    event.preventDefault();
                    return;
                  }
                  rowData.producto = newValue;
                  const updated = [...items];
                  updated[rowIndex].producto = newValue;
                  setItems(updated);
                }}
              />
              <Column
                field="idTipoProducto.nombre"
                header="Tipo de Producto"
                editor={(options) => idTipoProductoEditor(options)}
                onCellEditComplete={(e) => {
                  const {
                    rowData,
                    newValue,
                    rowIndex,
                    originalEvent: event,
                  } = e;
                  if (!newValue || !newValue.id) {
                    event.preventDefault();
                    return;
                  }
                  rowData.idTipoProducto = newValue;
                  const updated = [...items];
                  updated[rowIndex].idTipoProducto = newValue;
                  setItems(updated);
                }}
              />

              <Column
                field="clasificacion"
                header="Clasificación"
                editor={(options) => (
                  <InputText
                    value={options.value}
                    onChange={(e) =>
                      updateItem(
                        options.rowIndex,
                        "clasificacion",
                        e.target.value
                      )
                    }
                  />
                )}
              />
              <Column
                field="gravedadAPI"
                header="Gravedad API"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "gravedadAPI", e.value)
                    }
                  />
                )}
              />
              <Column
                field="azufre"
                header="Azufre"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "azufre", e.value)
                    }
                  />
                )}
              />

              <Column
                field="contenidoAgua"
                header="Contenido de Agua"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "contenidoAgua", e.value)
                    }
                  />
                )}
              />

              <Column
                field="flashPoint"
                header="Flash Point"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "flashPoint", e.value)
                    }
                  />
                )}
              />
              <Column
                field="cantidad"
                header="Cantidad"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "cantidad", e.value)
                    }
                  />
                )}
              />
              {/* Columnas agregadas */}
              <Column
                field="brent"
                header="Brent"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) => {
                      updateItem(options.rowIndex, "brent", e.value);
                      options.editorCallback!(e.value);
                    }}
                  />
                )}
                onCellEditComplete={(e) => {
                  const {
                    rowData,
                    newValue,
                    rowIndex,
                    originalEvent: event,
                  } = e;
                  if (newValue === undefined) {
                    event.preventDefault();
                    return;
                  }
                  const newPrecio = calculatePrecioUnitario(
                    newValue,
                    rowData.convenio
                  );
                  updateItem(rowIndex, "brent", newValue);
                  updateItem(rowIndex, "precioUnitario", newPrecio);
                }}
              />

              <Column
                field="convenio"
                header="Convenio"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) => {
                      updateItem(options.rowIndex, "convenio", e.value);
                      options.editorCallback!(e.value);
                    }}
                  />
                )}
                onCellEditComplete={(e) => {
                  const {
                    rowData,
                    newValue,
                    rowIndex,
                    originalEvent: event,
                  } = e;
                  if (newValue === undefined) {
                    event.preventDefault();
                    return;
                  }
                  const newPrecio = calculatePrecioUnitario(
                    rowData.brent,
                    newValue
                  );
                  updateItem(rowIndex, "convenio", newValue);
                  updateItem(rowIndex, "precioUnitario", newPrecio);
                }}
              />

              <Column
                field="precioUnitario"
                header="Precio Unitario"
                body={(rowData: any) =>
                  calculatePrecioUnitario(rowData.brent, rowData.convenio)
                }
              />
              {/* <Column
                field="brent"
                header="Brent"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) => {
                      updateItem(options.rowIndex, "brent", e.value);
                      options.editorCallback!(e.value);
                    }}
                    // onKeyDown={(e) => e.stopPropagation()}
                  />
                )}
                onCellEditComplete={(e) => {
                  const {
                    rowData,
                    newValue,
                    rowIndex,
                    originalEvent: event,
                  } = e;
                  if (newValue === undefined) {
                    event.preventDefault();
                    return;
                  }
                  rowData.brent = newValue;
                  rowData.precioUnitario = rowData.brent + rowData.convenio;
                  const updated = [...items];
                  updated[rowIndex] = rowData;
                  setItems(updated);
                  const newPrecio = newValue + (rowData.convenio || 0);
                  updateItem(rowIndex, "precioUnitario", newPrecio);
                }}
              />

              <Column
                field="convenio"
                header="Convenio"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) => {
                      updateItem(options.rowIndex, "convenio", e.value);
                      options.editorCallback!(e.value);
                    }}
                    // onKeyDown={(e) => e.stopPropagation()}
                  />
                )}
                onCellEditComplete={(e) => {
                  const {
                    rowData,
                    newValue,
                    rowIndex,
                    originalEvent: event,
                  } = e;
                  console.log(newValue);
                  if (newValue === undefined) {
                    event.preventDefault();
                    return;
                  }
                  rowData.convenio = newValue;
                  rowData.precioUnitario = rowData.brent + rowData.convenio;
                  const updated = [...items];
                  updated[rowIndex] = rowData;
                  setItems(updated);
                  const newPrecio = newValue + (rowData.convenio || 0);
                  updateItem(rowIndex, "precioUnitario", newPrecio);
                }}
              />

              <Column
                field="precioUnitario"
                header="Precio Unitario"
                body={(rowData: any) => rowData.brent + rowData.convenio}
              /> */}

              <Column
                header="Total"
                body={(rowData: any) =>
                  rowData.cantidad * rowData.precioUnitario
                }
                footer={() =>
                  items.reduce(
                    (
                      acc: number,
                      item: { cantidad: number; precioUnitario: number }
                    ) => acc + item.cantidad * item.precioUnitario,
                    0
                  )
                }
              />

              <Column
                field="montoTransporte"
                header="Monto Transporte"
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "montoTransporte", e.value)
                    }
                  />
                )}
              />

              <Column body={actionBodyTemplate} header="Acciones" />
            </DataTable>
            <Button
              type="button"
              label="Agregar Item"
              icon="pi pi-plus"
              className="mt-2"
              onClick={addItem}
            />
          </div>

          {/* Campo: Estado */}
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

          {/* Botón de Envío */}
          <div className="col-12">
            <Button
              type="submit"
              disabled={submitting} // Deshabilitar el botón mientras se envía
              icon={submitting ? "pi pi-spinner pi-spin" : ""} // Mostrar ícono de carga
              label={contrato ? "Modificar contrato" : "Crear contrato"}
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
}

export default ContratoForm;

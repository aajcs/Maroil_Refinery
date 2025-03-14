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
  const { productos } = useRefineryData(activeRefineria?.id || "");
  const toast = useRef<Toast | null>(null);
  const [items, setItems] = useState(contrato?.idItems || []);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [loading, setLoading] = useState(true);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(contratoSchema),
  });
  console.log("quetiene", contrato);

  useEffect(() => {
    if (contrato) {
      Object.keys(contrato).forEach((key) =>
        setValue(key as keyof FormData, contrato[key])
      );
    }
  }, [contrato, setValue]);
  useEffect(() => {
    fetchContactos();
  }, [contrato, setValue]);

  const fetchContactos = async () => {
    try {
      const contactosDB = await getContactos();
      if (contactosDB && Array.isArray(contactosDB.contactos)) {
        const filteredContactos = contactosDB.contactos.filter(
          (contacto: Contacto) =>
            contacto.idRefineria.id === activeRefineria?.id
        );
        setContactos(filteredContactos);
      } else {
        console.error("La estructura de contactosDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los contactos:", error);
    } finally {
      setLoading(false);
    }
  };
  const onSubmit = async (data: FormData) => {
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
    }
  };

  const addItem = () => {
    setItems([...items, { producto: "" }]);
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
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
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
          {/* Campo: Tipo de Condiciones de Pago */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
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
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
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
            <h5>Items for {contrato?.name}</h5>
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
                // style={{ width: "20%" }}
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
                field="cantidad"
                header="Cantidad"
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "cantidad", e.value)
                    }
                  />
                )}
              />
              <Column
                field="precioUnitario"
                header="Precio Unitario"
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "precioUnitario", e.value)
                    }
                  />
                )}
              />
              <Column
                header="Total"
                body={(rowData: any) =>
                  rowData.cantidad * rowData.precioUnitario
                }
                // footer="Total"
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
                field="gravedadAPI"
                header="Gravedad API"
                // style={{ width: "20%" }}
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
                // style={{ width: "20%" }}
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
                field="viscosidad"
                header="Viscosidad"
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "viscosidad", e.value)
                    }
                  />
                )}
              />
              <Column
                field="densidad"
                header="Densidad"
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "densidad", e.value)
                    }
                  />
                )}
              />
              <Column
                field="contenidoAgua"
                header="Contenido de Agua"
                // style={{ width: "20%" }}
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
                field="origen"
                header="Origen"
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputText
                    value={options.value}
                    onChange={(e) =>
                      updateItem(options.rowIndex, "origen", e.target.value)
                    }
                  />
                )}
              />
              <Column
                field="temperatura"
                header="Temperatura"
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "temperatura", e.value)
                    }
                  />
                )}
              />
              <Column
                field="presion"
                header="Presión"
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputNumber
                    value={options.value}
                    onValueChange={(e) =>
                      updateItem(options.rowIndex, "presion", e.value)
                    }
                  />
                )}
              />

              <Column
                body={actionBodyTemplate}
                header="Acciones"
                // style={{ width: "20%" }}
              />
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

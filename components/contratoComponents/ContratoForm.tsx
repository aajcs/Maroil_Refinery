import React, { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { contratoSchema } from "@/libs/zod";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { createContrato, updateContrato } from "@/app/api/contratoService";
import { InputNumber } from "primereact/inputnumber";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

type FormData = z.infer<typeof contratoSchema>;

interface ContratoFormProps {
  contrato: any;
  hideContratoFormDialog: () => void;
  contratos: any[];
  setContratos: (contratos: any[]) => void;
  setContrato: (contrato: any) => void;
}

const estatusValues = ["true", "false"];

function ContratoForm({
  contrato,
  hideContratoFormDialog,
  contratos,
  setContratos,
}: ContratoFormProps) {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [items, setItems] = useState(contrato?.id_contrato_items || []);
  console.log(items);
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

  useEffect(() => {
    if (contrato) {
      Object.keys(contrato).forEach((key) =>
        setValue(key as keyof FormData, contrato[key])
      );
    }
  }, [contrato, setValue]);

  const onSubmit = async (data: FormData) => {
    try {
      data.id_contrato_items = items; // Add items to the form data
      if (contrato) {
        const updatedContrato = await updateContrato(contrato.id, data);
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
          id_refineria: activeRefineria.id,
        });
        setContratos([...contratos, newContrato.contrato]);
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

  const showToast = (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => {
    toast.current?.show({ severity, summary, detail, life: 3000 });
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
    console.log(index);
    const newItems = items.filter((_: any, i: number) => i !== index);
    setItems(newItems);
    setValue("id_contrato_items", newItems);
  };

  const actionBodyTemplate = (rowData: any, options: any) => {
    return (
      <div className="flex justify-content-center">
        <Button
          type="button"
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() =>
            updateItem(options.rowIndex, "producto", rowData.producto)
          }
        />
        <Button
          type="button"
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => deleteItem(options.rowIndex)}
        />
      </div>
    );
  };
  const onRowEditComplete = (e: any) => {
    let _items = [...items];
    let { newData, index } = e;

    _items[index] = newData;

    setItems(_items);
  };
  const allowEdit = (rowData: any) => {
    return rowData.name !== "Blue Band";
  };
  console.log(errors);
  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid">
          {/* Campo: Tipo de Condiciones de Pago */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="condicionesPago.tipo"
              className="font-medium text-900"
            >
              Tipo de Condiciones de Pago
            </label>
            <InputText
              id="condicionesPago.tipo"
              {...register("condicionesPago.tipo")}
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
              Plazo de Condiciones de Pago
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
              Estado de Entrega
            </label>
            <InputText
              id="estadoEntrega"
              {...register("estadoEntrega")}
              className={classNames("w-full", {
                "p-invalid": errors.estadoEntrega,
              })}
            />
            {errors.estadoEntrega && (
              <small className="p-error">{errors.estadoEntrega.message}</small>
            )}
          </div>

          {/* Campo: Estado */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="estado" className="font-medium text-900">
              Estado
            </label>
            <InputText
              id="estado"
              {...register("estado")}
              className={classNames("w-full", { "p-invalid": errors.estado })}
            />
            {errors.estado && (
              <small className="p-error">{errors.estado.message}</small>
            )}
          </div>

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

          {/* Tabla de Items del Contrato */}
          <div className="orders-subtable col-12">
            <h5>Items for {contrato?.name}</h5>
            <DataTable
              value={items}
              responsiveLayout="scroll"
              scrollable
              className="datatable-responsive"
              editMode="row"
              onRowEditComplete={onRowEditComplete}
            >
              <Column
                field="producto"
                header="Producto"
                sortable
                // style={{ width: "20%" }}
                editor={(options) => (
                  <InputText
                    value={options.value}
                    onChange={(e) =>
                      updateItem(options.rowIndex, "producto", e.target.value)
                    }
                  />
                )}
              />
              <Column
                field="cantidad"
                header="Cantidad"
                sortable
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
                sortable
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
                field="gravedadAPI"
                header="Gravedad API"
                sortable
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
                sortable
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
                sortable
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
                sortable
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
                sortable
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
                sortable
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
                sortable
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
                sortable
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
                rowEditor={allowEdit}
                headerStyle={{ width: "10%", minWidth: "8rem" }}
                bodyStyle={{ textAlign: "center" }}
              ></Column>
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

          {/* Campo: ID de Refinería */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="id_refineria._id" className="font-medium text-900">
              ID de Refinería
            </label>
            <InputText
              id="id_refineria._id"
              {...register("id_refineria._id")}
              className={classNames("w-full", {
                "p-invalid": errors.id_refineria?._id,
              })}
            />
            {errors.id_refineria?._id && (
              <small className="p-error">
                {errors.id_refineria._id.message}
              </small>
            )}
          </div>

          {/* Campo: Nombre de Refinería */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_refineria.nombre"
              className="font-medium text-900"
            >
              Nombre de Refinería
            </label>
            <InputText
              id="id_refineria.nombre"
              {...register("id_refineria.nombre")}
              className={classNames("w-full", {
                "p-invalid": errors.id_refineria?.nombre,
              })}
            />
            {errors.id_refineria?.nombre && (
              <small className="p-error">
                {errors.id_refineria.nombre.message}
              </small>
            )}
          </div>

          {/* Campo: ID de Contacto */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label htmlFor="id_contacto._id" className="font-medium text-900">
              ID de Contacto
            </label>
            <InputText
              id="id_contacto._id"
              {...register("id_contacto._id")}
              className={classNames("w-full", {
                "p-invalid": errors.id_contacto?._id,
              })}
            />
            {errors.id_contacto?._id && (
              <small className="p-error">
                {errors.id_contacto._id.message}
              </small>
            )}
          </div>

          {/* Campo: Nombre de Contacto */}
          <div className="field mb-4 col-12 sm:col-6 lg:col-4">
            <label
              htmlFor="id_contacto.nombre"
              className="font-medium text-900"
            >
              Nombre de Contacto
            </label>
            <InputText
              id="id_contacto.nombre"
              {...register("id_contacto.nombre")}
              className={classNames("w-full", {
                "p-invalid": errors.id_contacto?.nombre,
              })}
            />
            {errors.id_contacto?.nombre && (
              <small className="p-error">
                {errors.id_contacto.nombre.message}
              </small>
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

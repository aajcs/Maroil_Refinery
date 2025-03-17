"use client";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { productoSchema } from "@/libs/zod";
import { createProducto, updateProducto } from "@/app/api/productoService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Checkbox } from "primereact/checkbox";
import { InputNumber } from "primereact/inputnumber";
import { ColorPicker } from "primereact/colorpicker";

type FormData = z.infer<typeof productoSchema>;

interface ProductoFormProps {
  producto: any;
  hideProductoFormDialog: () => void;
  productos: any[];
  setProductos: (productos: any[]) => void;
  setProducto: (producto: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];

const ProductoForm = ({
  producto,
  hideProductoFormDialog,
  productos,
  setProductos,
  showToast,
}: ProductoFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
  } = useForm<FormData>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      posicion: 0,
    },
  });
  useEffect(() => {
    if (producto) {
      Object.keys(producto).forEach((key) =>
        setValue(key as keyof FormData, producto[key])
      );
      if (Array.isArray(producto.material)) {
      }
    }
  }, [producto, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      if (producto) {
        const updatedProducto = await updateProducto(producto.id, {
          ...data,
          idRefineria: activeRefineria?.id,
        });
        const updatedProductos = productos.map((t) =>
          t.id === updatedProducto.id ? updatedProducto : t
        );
        setProductos(updatedProductos);
        showToast("success", "Éxito", "Producto actualizado");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newProducto = await createProducto({
          ...data,
          idRefineria: activeRefineria.id,
        });
        setProductos([...productos, newProducto]);
        showToast("success", "Éxito", "Producto creado");
      }
      hideProductoFormDialog();
    } catch (error) {
      console.error("Error al crear/modificar producto:", error);
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setSubmitting(false); // Desactivar el estado de envío
    }
  };
  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid formgrid p-fluid">
          <div className="field mb-4 col-12">
            <label htmlFor="nombre" className="font-medium text-900">
              Nombre
            </label>
            <InputText
              id="nombre"
              type="text"
              className={classNames("w-full", { "p-invalid": errors.nombre })}
              {...register("nombre")}
            />
            {errors.nombre && (
              <small className="p-error">{errors.nombre.message}</small>
            )}
          </div>
          <div className="field mb-4 col-12">
            <label htmlFor="posicion" className="font-medium text-900">
              Posición
            </label>
            <Controller
              name="posicion"
              control={control}
              render={({ field }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  className={classNames("w-full", {
                    "p-invalid": errors.posicion,
                  })}
                />
              )}
            />

            {errors.posicion && (
              <small className="p-error">{errors.posicion.message}</small>
            )}
          </div>
          <div className="field mb-4 col-12">
            <label htmlFor="color" className="font-medium text-900">
              Color
            </label>
            <ColorPicker
              id="color"
              inputId="cp-hex"
              format="hex"
              value={watch("color")}
              {...register("color")}
              className={classNames("ml-3", {
                "p-invalid": errors.color,
              })}
            />
            {errors.color && (
              <small className="p-error">{errors.color.message}</small>
            )}
          </div>

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

          <div className="col-12">
            <Button
              type="submit"
              disabled={submitting} // Deshabilitar el botón mientras se envía
              icon={submitting ? "pi pi-spinner pi-spin" : ""} // Mostrar ícono de carga
              label={producto ? "Modificar producto" : "Crear producto"}
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductoForm;

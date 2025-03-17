"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { torreDestilacionSchema } from "@/libs/zod";
import {
  createTorreDestilacion,
  updateTorreDestilacion,
} from "@/app/api/torreDestilacionService";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { useRefineriaStore } from "@/store/refineriaStore";
import { Material, Producto } from "@/libs/interfaces";
import { getProductos } from "@/app/api/productoService";

type FormData = z.infer<typeof torreDestilacionSchema>;

interface TorreDestilacionFormProps {
  torreDestilacion: any;
  hideTorreDestilacionFormDialog: () => void;
  torresDestilacion: any[];
  setTorresDestilacion: (torresDestilacion: any[]) => void;
  setTorreDestilacion: (torreDestilacion: any) => void;
  showToast: (
    severity: "success" | "error",
    summary: string,
    detail: string
  ) => void;
}

const estatusValues = ["true", "false"];

const TorreDestilacionForm = ({
  torreDestilacion,
  hideTorreDestilacionFormDialog,
  torresDestilacion,
  setTorresDestilacion,
  showToast,
}: TorreDestilacionFormProps) => {
  const { activeRefineria } = useRefineriaStore();
  const toast = useRef<Toast | null>(null);
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  console.log(torreDestilacion);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(torreDestilacionSchema),
  });

  // Obtener productos al cargar el componente
  const fetchData = useCallback(async () => {
    try {
      const productosDB = await getProductos();
      if (productosDB && Array.isArray(productosDB.productos)) {
        const filteredProductos = productosDB.productos.filter(
          (producto: Producto) =>
            producto.idRefineria.id === activeRefineria?.id
        );
        setProductos(filteredProductos);
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

  // Inicializar materiales si hay una torre de destilación
  useEffect(() => {
    if (torreDestilacion && torreDestilacion.material) {
      Object.keys(torreDestilacion).forEach((key) =>
        setValue(key as keyof FormData, torreDestilacion[key])
      );
      setSelectedMaterials(torreDestilacion.material);
    }
  }, [torreDestilacion]);

  // Manejar el envío del formulario
  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const requestData = {
        ...data,
        material: selectedMaterials, // Incluir los materiales seleccionados
      };

      if (torreDestilacion) {
        const updatedTorre = await updateTorreDestilacion(torreDestilacion.id, {
          ...requestData,
          idRefineria: activeRefineria?.id,
        });
        const updatedTorres = torresDestilacion.map((t) =>
          t.id === updatedTorre.id ? updatedTorre : t
        );
        setTorresDestilacion(updatedTorres);
        showToast("success", "Éxito", "Torre de destilación actualizada");
      } else {
        if (!activeRefineria)
          throw new Error("No se ha seleccionado una refinería");
        const newTorre = await createTorreDestilacion({
          ...requestData,
          idRefineria: activeRefineria.id,
        });
        setTorresDestilacion([...torresDestilacion, newTorre]);
        showToast("success", "Éxito", "Torre de destilación creada");
      }
      hideTorreDestilacionFormDialog();
    } catch (error) {
      showToast(
        "error",
        "Error",
        error instanceof Error ? error.message : "Ocurrió un error inesperado"
      );
    } finally {
      setSubmitting(false); // Desactivar el estado de envío
    }
  };

  // Componente para manejar materiales
  const MaterialForm = ({
    materials,
    onAddMaterial,
    onRemoveMaterial,
  }: {
    materials: Material[];
    onAddMaterial: (material: Material) => void;
    onRemoveMaterial: (index: number) => void;
  }) => {
    const [newMaterial, setNewMaterial] = useState<Material>({
      idProducto: undefined,
      estadoMaterial: "True",
    });

    const handleAddMaterial = () => {
      if (newMaterial.idProducto) {
        onAddMaterial({
          ...newMaterial,
          idProducto: {
            _id: newMaterial.idProducto.id,
            nombre: newMaterial.idProducto.nombre,
            posicion: newMaterial.idProducto.posicion,
            color: "#000000",
            id: newMaterial.idProducto.id,
          },
        });
        setNewMaterial({
          idProducto: undefined,
          estadoMaterial: "True",
        });
      }
    };

    return (
      <div className="mb-4">
        <h3 className="font-medium text-900 mb-2">Materiales</h3>
        {materials.map((material, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <span>{material.idProducto?.nombre}</span>
            <Button
              type="button"
              icon="pi pi-times"
              className="p-button-danger p-button-sm"
              onClick={() => onRemoveMaterial(index)}
            />
          </div>
        ))}
        <div className="flex gap-2">
          {/* Campo: Selección de producto */}
          <Dropdown
            value={newMaterial.idProducto}
            options={productos.map((producto) => ({
              label: producto.nombre,
              value: { id: producto.id, nombre: producto.nombre },
            }))}
            onChange={(e) =>
              setNewMaterial({ ...newMaterial, idProducto: e.value })
            }
            placeholder="Seleccionar producto"
            optionLabel="label"
            className="w-full"
          />

          <Button
            type="button"
            label="Agregar"
            className="p-button-success"
            onClick={handleAddMaterial}
          />
        </div>
      </div>
    );
  };

  // Agregar un material
  const handleAddMaterial = (material: Material) => {
    setSelectedMaterials([...selectedMaterials, material]);
  };

  // Eliminar un material
  const handleRemoveMaterial = (index: number) => {
    const updatedMaterials = selectedMaterials.filter((_, i) => i !== index);
    setSelectedMaterials(updatedMaterials);
  };
  console.log(errors);
  return (
    <div>
      <Toast ref={toast} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid formgrid p-fluid">
          {/* Campo: Nombre */}
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

          {/* Campo: Ubicación */}
          <div className="field mb-4 col-12">
            <label htmlFor="ubicacion" className="font-medium text-900">
              Ubicación
            </label>
            <InputText
              id="ubicacion"
              type="text"
              className={classNames("w-full", {
                "p-invalid": errors.ubicacion,
              })}
              {...register("ubicacion")}
            />
            {errors.ubicacion && (
              <small className="p-error">{errors.ubicacion.message}</small>
            )}
          </div>

          {/* Componente de materiales */}
          <MaterialForm
            materials={selectedMaterials}
            onAddMaterial={handleAddMaterial}
            onRemoveMaterial={handleRemoveMaterial}
          />

          {/* Botón de envío */}
          <div className="col-12">
            <Button
              type="submit"
              label={
                torreDestilacion
                  ? "Modificar torre de destilación"
                  : "Crear torre de destilación"
              }
              className="w-auto mt-3"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default TorreDestilacionForm;

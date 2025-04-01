// components/recepcion/sections/EstadoRecepcionSection.tsx
import { Steps } from "primereact/steps";
import { useFormContext } from "react-hook-form";
import { workflowConfig } from "@/libs/recepcionWorkflow";

export const EstadoRecepcionSection = () => {
  const { setValue, watch } = useFormContext();
  const estadoRecepcion = watch("estadoRecepcion");

  const handleEstadoChange = (newState: string) => {
    if (validarTransicion(newState)) {
      setValue("estadoRecepcion", newState);
    }
  };

  const validarTransicion = (newState: string) => {
    // Lógica de validación de transición
    return true;
  };

  return (
    <div className="field mb-4 col-12 hidden lg:block">
      <label className="font-medium text-900">Estado de la Recepción</label>
      <Steps
        model={workflowConfig.estadosRecepcion.opciones.map((option) => ({
          ...option,
          command: () => handleEstadoChange(option.value),
        }))}
        activeIndex={workflowConfig.estadosRecepcion.opciones.findIndex(
          (o) => o.value === estadoRecepcion
        )}
      />
    </div>
  );
};

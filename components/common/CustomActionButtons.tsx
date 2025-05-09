import React from "react";
import { Button } from "primereact/button";

interface CustomActionButtonsProps<T> {
  rowData: T; // Datos de la fila
  onInfo?: (rowData: T) => void; // nueva prop para info
  onEdit?: (rowData: T) => void; // Acción para editar
  onDelete?: (rowData: T) => void; // Acción para eliminar
  onDuplicate?: (rowData: T) => void; // Acción para copiar
}

const CustomActionButtons = <T,>({
  rowData,
  onInfo,
  onEdit,
  onDelete,
  onDuplicate,
}: CustomActionButtonsProps<T>) => {
  return (
    <div className="flex gap-1  flex-column justify-content-center align-items-center sm:flex-row ">
      {/* Botón de Info */}
      {onInfo && (
        <Button
          icon="pi pi-info-circle"
          rounded
          size="small"
          severity="info"
          className="p-button-xs w-full sm:w-auto"
          tooltip="Ver Historial"
          tooltipOptions={{ position: "top" }}
          onClick={() => onInfo(rowData)}
        />
      )}

      {/* Botón de Editar */}
      {onEdit && (
        <Button
          icon="pi pi-pencil"
          rounded
          size="small"
          severity="success"
          className="p-button-xs w-full sm:w-auto"
          tooltip="Editar"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
        />
      )}

      {/* Botón de Eliminar */}
      {onDelete && (
        <Button
          icon="pi pi-trash"
          rounded
          size="small"
          severity="danger"
          className="p-button-xs w-full sm:w-auto"
          tooltip="Eliminar"
          tooltipOptions={{ position: "top" }}
          onClick={() => onDelete(rowData)}
        />
      )}

      {/* Botón de Copiar */}
      {onDuplicate && (
        <Button
          icon="pi pi-copy"
          rounded
          size="small"
          severity="info"
          className="p-button-xs w-full sm:w-auto"
          tooltip="Copiar Información"
          tooltipOptions={{ position: "top" }}
          onClick={() => {
            onDuplicate(rowData);
          }}
        />
      )}
    </div>
  );
};

export default CustomActionButtons;

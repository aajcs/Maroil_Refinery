import React from "react";
import { useUserRoles } from "../../hooks/useUserRoles";
import { Button } from "primereact/button";
import PDFGenerator from "../pdf/PDFGenerator";
import {
  infoAllowedRoles,
  editAllowedRoles,
  deleteAllowedRoles,
  duplicateAllowedRoles,
  pdfAllowedRoles,
  hasRole,
} from "../../lib/roles";

interface CustomActionButtonsProps<T> {
  rowData: T; // Datos de la fila
  onInfo?: (rowData: T) => void; // nueva prop para info
  onEdit?: (rowData: T) => void; // Acción para editar
  onDelete?: (rowData: T) => void; // Acción para eliminar
  onDuplicate?: (rowData: T) => void; // Acción para copiar
  /** Plantilla dinámica para generar el PDF */
  pdfTemplate?: React.ComponentType<{ data: T }>;
  /** Nombre de archivo para descarga */
  pdfFileName?: string;
  /** Texto del botón de descarga */
  pdfDownloadText?: string;
  /** Roles permitidos para mostrar acciones (opcional, por defecto ["admin"]) */
  allowedRoles?: string[];
}

function CustomActionButtons<T>(props: CustomActionButtonsProps<T>) {
  const {
    rowData,
    onInfo,
    onEdit,
    onDelete,
    onDuplicate,
    pdfTemplate: Template,
    pdfFileName = "documento.pdf",
    pdfDownloadText = "Descargar PDF",
  } = props;
  // Obtener roles del usuario con hook reutilizable
  const userRoles = useUserRoles();

  // Usar función y arrays reutilizables
  const can = (allowed: string[]) => hasRole(allowed, userRoles);

  // Si el usuario no tiene acceso a ningún botón, no renderizar nada
  if (
    !can(infoAllowedRoles) &&
    !can(editAllowedRoles) &&
    !can(deleteAllowedRoles) &&
    !can(duplicateAllowedRoles) &&
    !can(pdfAllowedRoles)
  ) {
    return null;
  }

  return (
    <div className="flex gap-1  flex-column justify-content-center align-items-center sm:flex-row ">
      {/* Botón de Info */}
      {onInfo && can(infoAllowedRoles) && (
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
      {onEdit && can(editAllowedRoles) && (
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
      {onDelete && can(deleteAllowedRoles) && (
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
      {onDuplicate && can(duplicateAllowedRoles) && (
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
      {/* Botón PDF dinámico */}
      {Template && can(pdfAllowedRoles) && (
        <PDFGenerator
          template={Template}
          data={rowData}
          fileName={pdfFileName}
          downloadText={pdfDownloadText}
        />
      )}
    </div>
  );
}

export default CustomActionButtons;

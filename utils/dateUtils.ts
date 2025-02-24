import { format } from "date-fns";

export const formatDateFH = (dateString: Date | string) => {
  if (!dateString) {
    return ""; // O puedes devolver un valor predeterminado como "Fecha no disponible"
  }
  return format(new Date(dateString), "dd/MM/yyyy HH:mm");
};

import { format } from "date-fns";

export const formatDateFH = (dateString: Date | string) => {
  if (!dateString) {
    return ""; // O puedes devolver un valor predeterminado como "Fecha no disponible"
  }
  return format(new Date(dateString), "dd/MM/yyyy HH:mm");
};
export const formatDateSinAnoFH = (dateString: Date | string) => {
  if (!dateString) {
    return ""; // O puedes devolver un valor predeterminado como "Fecha no disponible"
  }
  return format(new Date(dateString), "dd/MM HH:mm");
};
export const formatDuration = (milliseconds: number) => {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const remainingHours = hours % 24;
  const remainingMinutes = minutes % 60;
  const remainingSeconds = seconds % 60;

  return `${days}d ${remainingHours}h ${remainingMinutes}m `;
};

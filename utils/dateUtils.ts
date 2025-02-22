import { format } from "date-fns";

export const formatDateFH = (dateString: Date | string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm");
};

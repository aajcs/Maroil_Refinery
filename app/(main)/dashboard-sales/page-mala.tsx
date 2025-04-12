"use client";

import { useRefineryData } from "@/hooks/useRefineryData";
import { useSocket } from "@/hooks/useSocket";
import { useRefineriaStore } from "@/store/refineriaStore";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMemo } from "react";

const DashboardSales = () => {
  const { activeRefineria } = useRefineriaStore();
  const { recepcionModificado } = useSocket(); // Obtén recepcionModificado desde el socket
  const {
    tanques,
    torresDestilacion,
    lineaRecepcions,
    recepcions,
    contratos,
    loading,
  } = useRefineryData(
    activeRefineria?.id || "",
    recepcionModificado || undefined // Pasa recepcionModificado como dependencia
  );

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }
  return <></>;
};
export default DashboardSales;

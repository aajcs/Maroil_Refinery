"use client";

import { useRefineryData } from "@/hooks/useRefineryData";
import { useSocket } from "@/hooks/useSocket";
import { useRefineriaStore } from "@/store/refineriaStore";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMemo } from "react";
import ModeladoRefineriaContratosSalesList from "./ModeladoRefineriaContratosSalesList";
import SimulatorPage from "@/components/SimulatorPage";

const ModeladoRefineriaDashboardSales = () => {
  const { activeRefineria } = useRefineriaStore();
  const { recepcionModificado } = useSocket(); // Obtén recepcionModificado desde el socket
  const { recepcions, contratos, loading } = useRefineryData(
    activeRefineria?.id || "",
    recepcionModificado || undefined // Pasa recepcionModificado como dependencia
  );
  // Agrupar recepciones por contrato y producto
  const recepcionesPorContrato = useMemo(() => {
    return contratos.map((contrato) => {
      const productos = contrato.idItems.map((item: any) => {
        const formula = `Cantidad(${item.cantidad}) * [Brent(${item.brent}) + Conv(${item.convenio}) + Trans(${item.montoTransporte})]`;
        console.log(JSON.stringify(item, null, 2));

        return {
          producto: item.producto,
          cantidad: item.cantidad,
          brent: item.brent,
          convenio: item.convenio,
          precioTransporte: item.montoTransporte,
          precioUnitario: item.precioUnitario,
          formula: formula,
          total: item.cantidad * item.precioUnitario,
          totalTransporte: item.cantidad * item.montoTransporte,
        };
      });

      return {
        ...contrato,
        productos,
      };
    });
  }, [contratos, recepcions]);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center h-screen">
        <ProgressSpinner />
      </div>
    );
  }
  return (
    <>
      <SimulatorPage />
      <ModeladoRefineriaContratosSalesList
        contratos={recepcionesPorContrato}
        tipo="Compra"
      />
      <ModeladoRefineriaContratosSalesList
        contratos={recepcionesPorContrato}
        tipo="Venta"
      />
    </>
  );
};
export default ModeladoRefineriaDashboardSales;

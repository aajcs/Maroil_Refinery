"use client";

import { useRefineryData } from "@/hooks/useRefineryData";
import { useSocket } from "@/hooks/useSocket";
import { useRefineriaStore } from "@/store/refineriaStore";
import { ProgressSpinner } from "primereact/progressspinner";
import { useMemo } from "react";
import ModeladoRefineriaContratosSalesList from "./ModeladoRefineriaContratosSalesList";

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
        const formula = `Brent${item.brent}+(${item.convenio})`;
        console.log(JSON.stringify(item, null, 2));

        return {
          producto: item.producto,
          cantidad: item.cantidad,
          formula: formula,
          precioUnitario: item.precioUnitario,
          total: item.cantidad * item.precioUnitario,
          precioTransporte: item.precioTransporte,
          totalTransporte: item.cantidad * item.precioTransporte,
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

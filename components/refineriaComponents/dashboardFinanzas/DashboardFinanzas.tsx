import React, { useState, useEffect } from "react";
import { ProductService } from "../../../demo/service/ProductService";
import { Demo } from "../../../types/demo";
import SummaryCards from "./SummaryCards";
import RecentSales from "./RecentSales";
import LiveSupport from "./LiveSupport";
import RevenueStream from "./RevenueStream";
import BlogCard from "./BlogCard";
import BestSellers from "./BestSellers";
import CustomerStories from "./CustomerStories";
import PotentialInfluencers from "./PotentialInfluencers";
import Header from "./Header";
import AbonosOverview from "./AbonosOverview";
import GastosResumen from "./GastosResumen";
import { useByRefineryData } from "@/hooks/useByRefineryData";
import { useRefineriaStore } from "@/store/refineriaStore";
import { AnalisisContratos } from "./AnalisisContratos";

const DashboardFinanzas = () => {
  const { activeRefineria } = useRefineriaStore();

  const {
    facturas = [],
    balances = [],
    cuentas = [],
    abonos = [],
    loading,
  } = useByRefineryData(activeRefineria?.id || "");
  console.log("facturas", facturas);
  // --- Meses disponibles y selección de mes global para abonos y facturas ---
  // Obtener meses únicos de abonos y facturas en formato YYYY-MM
  const mesesDisponibles = React.useMemo(() => {
    const set = new Set<string>();
    abonos.forEach((abono) => {
      if (
        abono.fecha &&
        typeof abono.fecha === "string" &&
        abono.fecha.length >= 7
      ) {
        // Extrae YYYY-MM directamente del string
        set.add(abono.fecha.slice(0, 7));
      }
    });
    facturas.forEach((factura) => {
      if (
        factura.fechaFactura &&
        typeof factura.fechaFactura === "string" &&
        factura.fechaFactura.length >= 7
      ) {
        set.add(factura.fechaFactura.slice(0, 7));
      }
    });
    // Ordenar descendente (más reciente primero) usando comparación de fechas
    return Array.from(set).sort((a, b) => {
      // a y b son strings tipo 'YYYY-MM'
      const dateA = new Date(a + "-01");
      const dateB = new Date(b + "-01");
      return dateB.getTime() - dateA.getTime();
    });
  }, [abonos, facturas]);

  // Estado para el mes seleccionado
  const [mesSeleccionado, setMesSeleccionado] = useState<string>("");
  console.log("mesesDisponibles", mesesDisponibles);

  // Cuando cambian los abonos o los meses disponibles, setear el mes más reciente por defecto
  useEffect(() => {
    if (mesesDisponibles.length > 0) {
      setMesSeleccionado((prev) =>
        prev && mesesDisponibles.includes(prev) ? prev : mesesDisponibles[0]
      );
    }
  }, [mesesDisponibles]);

  // Handler para cambio de mes
  const handleMesChange = (mes: string) => {
    setMesSeleccionado(mes);
  };

  return (
    <div className="grid">
      <div className="col-12">
        <Header
          // operationalData={{
          //   productionRate: "22,100",
          //   efficiency: "94.2",
          //   status: "alert",
          //   lastUpdate: "Actualizado hace 5 min",
          //   alertMessage: "Temperatura elevada en intercambiador E-205",
          // }}
          financialMetrics={{
            marginBruto: 78.4, // $78.4 millones
            costoProduccion: 23.8, // $23.80 por barril
            precioVentaPromedio: 68.5, // $68.50 por barril
            flujoCaja: 42.6, // $42.6 millones
            inventarioCrudo: 1850, // 1,850 miles de barriles
            status: "warning",
            lastUpdate: new Date().toLocaleString(),
            alertMessage: "Variación >5% en costos de refinación",
          }}
          mesSeleccionado={mesSeleccionado}
          mesesDisponibles={mesesDisponibles}
          onMesChange={handleMesChange}
        />
      </div>

      <div className="col-12">
        <SummaryCards cuentas={cuentas} />
      </div>

      <div className="col-12 lg:col-6">
        <AbonosOverview
          abonos={abonos}
          loading={loading}
          mesSeleccionado={mesSeleccionado}
        />
      </div>

      {/* <div className="col-12 lg:col-6">
        <RecentSales
          productsThisWeek={productsThisWeek}
          productsLastWeek={productsLastWeek}
        />
      </div> */}

      {/* <div className="col-12 md:col-6 xl:col-6">
        <LiveSupport />
      </div> */}

      {/* <div className="col-12 md:col-6 xl:col-3">
        <RevenueStream />
      </div>

      <div className="col-12 md:col-6 xl:col-3">
        <BlogCard />
      </div>

      <div className="col-12 md:col-6 xl:col-3">
        <BestSellers />
      </div> */}

      <div className="col-12  lg:col-6">
        <GastosResumen
          facturas={facturas}
          loading={loading}
          mesSeleccionado={mesSeleccionado}
        />
      </div>

      <div className="col-12 lg:col-8 ">
        <AnalisisContratos balances={balances} loading={loading} />
      </div>
      {/* 
      <div className="col-12 md:col-6 lg:col-6">
        <CustomerStories />
        <PotentialInfluencers />
      </div> */}
    </div>
  );
};

export default DashboardFinanzas;

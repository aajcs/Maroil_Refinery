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
  const [productsThisWeek, setProductsThisWeek] = useState<Demo.Product[]>([]);
  const [productsLastWeek, setProductsLastWeek] = useState<Demo.Product[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedDrop, setSelectedDrop] = useState<any>(0);
  const [dates, setDates] = useState<any[]>([]);

  useEffect(() => {
    ProductService.getProductsSmall().then((data) =>
      setProductsThisWeek(data.slice(0, 5) as Demo.Product[])
    );
    ProductService.getProductsMixed().then((data) =>
      setProductsLastWeek(data.slice(0, 5) as Demo.Product[])
    );
  }, []);

  return (
    <div className="grid">
      <div className="col-12">
        <Header
          selectedDrop={selectedDrop}
          setSelectedDrop={setSelectedDrop}
          dates={dates}
          setDates={setDates}
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
        />
      </div>

      <div className="col-12">
        <SummaryCards cuentas={cuentas} />
      </div>

      <div className="col-12 lg:col-6">
        <AbonosOverview abonos={abonos} loading={loading} />
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

      <div className="col-12 md:col-6 lg:col-6">
        <GastosResumen facturas={facturas} loading={loading} />
      </div>

      <div className="col-12 ">
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

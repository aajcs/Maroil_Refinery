import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { analytics } from "./constants";
import { formatCurrency } from "@/utils/funcionesUtiles";
import { Card } from "primereact/card";
import { Badge } from "primereact/badge";

interface HeaderProps {
  selectedDrop: any;
  setSelectedDrop: (value: any) => void;
  dates: any[];
  setDates: (dates: any[]) => void;
  operationalData?: {
    productionRate: string;
    efficiency: string;
    status: "normal" | "alert" | "critical";
    lastUpdate?: string;
    alertMessage?: string;
  };
  financialMetrics?: {
    marginBruto: number; // En millones USD
    costoProduccion: number; // USD por barril
    precioVentaPromedio: number; // USD por barril
    flujoCaja: number; // En millones USD
    inventarioCrudo: number; // En miles de barriles
    status: "positive" | "warning" | "critical";
    lastUpdate: string;
    alertMessage?: string;
  };
}

const Header = ({
  selectedDrop,
  setSelectedDrop,
  dates,
  setDates,
  operationalData,
  financialMetrics,
}: HeaderProps) => (
  <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-3 gap-3">
    {operationalData && (
      <div className="flex flex-column md:flex-row align-items-start md:align-items-center gap-3 w-full">
        <div className="flex flex-wrap gap-3 flex-1">
          {/* KPI de Producción */}
          <div className="text-center p-3 border-round surface-card flex-1">
            <span className="text-2xl font-bold block text-primary">
              {operationalData.productionRate}
            </span>
            <span className="text-color-secondary">Producción (bbl/d)</span>
            {operationalData.lastUpdate && (
              <div className="text-xs mt-1 text-color-secondary">
                <i className="pi pi-clock mr-1"></i>
                {operationalData.lastUpdate}
              </div>
            )}
          </div>

          {/* KPI de Eficiencia */}
          <div className="text-center p-3 border-round surface-card flex-1">
            <span
              className={`text-2xl font-bold block ${
                parseFloat(operationalData.efficiency) > 95
                  ? "text-green-500"
                  : parseFloat(operationalData.efficiency) > 90
                  ? "text-yellow-500"
                  : "text-red-500"
              }`}
            >
              {operationalData.efficiency}%
            </span>
            <span className="text-color-secondary">Eficiencia</span>
          </div>

          {/* Estado Operacional */}
          <div className="flex align-items-center p-3 border-round surface-card flex-1">
            <div className="flex align-items-center">
              <i
                className={`pi pi-circle-fill mr-3 text-xl ${
                  operationalData.status === "normal"
                    ? "text-green-500"
                    : operationalData.status === "alert"
                    ? "text-yellow-500"
                    : "text-red-500"
                }`}
              ></i>
              <div>
                <div className="font-bold">Estado Operacional</div>
                <div className="text-sm text-color-secondary capitalize">
                  {operationalData.status}
                </div>
                {operationalData.alertMessage &&
                  operationalData.status !== "normal" && (
                    <div className="text-xs mt-1 flex align-items-center">
                      <i className="pi pi-exclamation-circle mr-1"></i>
                      {operationalData.alertMessage}
                    </div>
                  )}
              </div>
            </div>
          </div>
        </div>

        {/* Controles */}
        <div className="flex align-items-center justify-content-end gap-3">
          <Dropdown
            options={analytics}
            value={selectedDrop}
            onChange={(e) => setSelectedDrop(e.value)}
            placeholder="Category"
            className="w-full sm:w-10rem"
            optionLabel="label"
          />
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value as any)}
            showIcon={true}
            selectionMode="range"
            className="w-full sm:w-14rem"
            placeholder="Select Range"
          />
        </div>
      </div>
    )}
    {financialMetrics && (
      <div className="flex flex-column md:flex-row align-items-start md:align-items-center gap-3 w-full">
        <div className="flex flex-wrap gap-3 flex-1">
          {/* Margen Bruto */}
          <div className="text-center p-3 border-round surface-card flex-1">
            <span className="text-2xl font-bold block text-primary">
              {formatCurrency(financialMetrics.marginBruto)}
              <span className="text-sm ml-2">MM</span>
            </span>
            <span className="text-color-secondary">Margen Bruto</span>
            <div className="mt-2">
              <Badge
                value={financialMetrics.marginBruto > 50 ? "+" : "-"}
                severity={
                  financialMetrics.marginBruto > 50 ? "success" : "danger"
                }
              />
            </div>
            <div className="text-xs mt-1 text-color-secondary">
              Último trimestre
            </div>
          </div>

          {/* Costo de Producción */}
          <div className="text-center p-3 border-round surface-card flex-1">
            <span className="text-2xl font-bold block">
              {formatCurrency(financialMetrics.costoProduccion)}
            </span>
            <span className="text-color-secondary">Costo/Barril</span>
            <div className="mt-2">
              <i
                className={`pi ${
                  financialMetrics.costoProduccion < 25
                    ? "pi-arrow-down text-green-500"
                    : "pi-arrow-up text-red-500"
                }`}
              ></i>
            </div>
            <div className="text-xs mt-1 text-color-secondary">
              vs referencia: {formatCurrency(22.5)}
            </div>
          </div>

          {/* Flujo de Caja */}
          <div className="text-center p-3 border-round surface-card flex-1">
            <span className="text-2xl font-bold block">
              {formatCurrency(financialMetrics.flujoCaja)}
              <span className="text-sm ml-2">MM</span>
            </span>
            <span className="text-color-secondary">Flujo de Caja</span>
            <div className="mt-2">
              <span
                className={`font-medium ${
                  financialMetrics.flujoCaja > 0
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                {financialMetrics.flujoCaja > 0 ? "Positivo" : "Negativo"} este
                mes
              </span>
            </div>
          </div>

          {/* Inventario Crudo */}
          <div className="text-center p-3 border-round surface-card flex-1">
            <span className="text-2xl font-bold block">
              {financialMetrics.inventarioCrudo.toLocaleString()}
              <span className="text-sm ml-2">Mbbl</span>
            </span>
            <span className="text-color-secondary">Inventario Crudo</span>
            <div className="flex justify-content-between mt-2">
              <small className="text-color-secondary">
                Capacidad: 2,500 Mbbl
              </small>
              <small
                className={`font-medium ${
                  financialMetrics.inventarioCrudo > 2000
                    ? "text-yellow-500"
                    : "text-green-500"
                }`}
              >
                {((financialMetrics.inventarioCrudo / 2500) * 100).toFixed(1)}%
              </small>
            </div>
          </div>

          {/* Alertas */}
          {financialMetrics.alertMessage && (
            <div className="text-center p-3 border-round surface-card flex-1">
              <div
                className={`flex align-items-center justify-content-center p-2 border-round ${
                  financialMetrics.status === "critical"
                    ? "bg-red-100"
                    : financialMetrics.status === "warning"
                    ? "bg-yellow-100"
                    : ""
                }`}
                style={{ cursor: "pointer" }}
              >
                <i
                  className={`pi ${
                    financialMetrics.status === "critical"
                      ? "pi-exclamation-triangle text-red-500"
                      : "pi-exclamation-circle text-yellow-500"
                  } mr-3`}
                ></i>
                <span>{financialMetrics.alertMessage}</span>
              </div>
            </div>
          )}
        </div>
        {/* Controles */}
        <div className="flex align-items-center justify-content-end gap-3">
          <Dropdown
            options={analytics}
            value={selectedDrop}
            onChange={(e) => setSelectedDrop(e.value)}
            placeholder="Category"
            className="w-full sm:w-10rem"
            optionLabel="label"
          />
          <Calendar
            value={dates}
            onChange={(e) => setDates(e.value as any)}
            showIcon={true}
            selectionMode="range"
            className="w-full sm:w-14rem"
            placeholder="Select Range"
          />
        </div>
      </div>
    )}
  </div>
);

export default Header;

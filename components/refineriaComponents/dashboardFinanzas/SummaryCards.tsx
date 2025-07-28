import React from "react";
import { Avatar } from "primereact/avatar";
import { Badge } from "primereact/badge";
import { Tooltip } from "primereact/tooltip";
import { Chart } from "primereact/chart";
import { classNames } from "primereact/utils";
import { Cuenta } from "@/libs/interfaces";

interface FinancialCard {
  icon: string;
  color: string;
  title: string;
  currentValue: number;
  comparison: {
    value: number;
    percentage: number;
    trend: "up" | "down" | "neutral";
    period: string;
  };
  format: "currency" | "number";
  tooltip?: string;
  trendData?: number[];
}
interface SummaryCardsProps {
  cuentas: Cuenta[]; // Adjust type as needed
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ cuentas }) => {
  const cards: FinancialCard[] = [
    {
      icon: "pi pi-credit-card",
      color: "#2563eb", // blue-600 hex
      title: "Cuentas por Pagar",
      currentValue: 4500000,
      comparison: {
        value: 3800000,
        percentage: 18.4,
        trend: "up",
        period: "mes anterior",
      },
      format: "currency",
      tooltip: "Obligaciones pendientes con proveedores de crudo y servicios",
      trendData: [3.8, 4.1, 4.3, 4.5], // Valores en millones
    },
    {
      icon: "pi pi-wallet",
      color: "green",
      title: "Cuentas por Cobrar",
      currentValue: 6200000,
      comparison: {
        value: 6800000,
        percentage: 8.8,
        trend: "down",
        period: "trimestre anterior",
      },
      format: "currency",
      tooltip: "Facturas pendientes de pago por clientes y distribuidores",
      trendData: [6.8, 6.5, 6.3, 6.2],
    },
    {
      icon: "pi pi-shopping-cart",
      color: "orange",
      title: "Compras Crudo",
      currentValue: 12500000,
      comparison: {
        value: 11800000,
        percentage: 5.9,
        trend: "up",
        period: "mes anterior",
      },
      format: "currency",
      tooltip: "Inversión total en adquisición de crudo y materias primas",
      trendData: [11.8, 12.1, 12.3, 12.5],
    },
    {
      icon: "pi pi-chart-line",
      color: "purple",
      title: "Ventas Derivados",
      currentValue: 18400000,
      comparison: {
        value: 17600000,
        percentage: 4.5,
        trend: "up",
        period: "año anterior",
      },
      format: "currency",
      tooltip: "Ingresos por venta de productos refinados y derivados",
      trendData: [17.6, 17.9, 18.2, 18.4],
    },
  ];

  const formatValue = (value: number, type: "currency" | "number") => {
    if (type === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: value < 1000000 ? 2 : 0,
      }).format(value);
    }
    return value.toLocaleString();
  };

  const getTrendChart = (data: number[] = [], color: string) => {
    const chartData = {
      labels: Array(data.length).fill(""),
      datasets: [
        {
          data: data,
          fill: true,
          borderColor: `var(--${color}-500)`,
          backgroundColor: `var(--${color}-100)`,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
        },
      ],
    };

    const chartOptions = {
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
          min: Math.min(...data) * 0.95,
          max: Math.max(...data) * 1.05,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };

    return { data: chartData, options: chartOptions };
  };

  return (
    <div className="card p-0 grid grid-nogutter">
      <pre>{JSON.stringify(cuentas, null, 2)}</pre>
      {cards.map((card, index) => {
        const chartConfig = getTrendChart(card.trendData, card.color);
        const tooltipId = `tooltip-${index}`;

        return (
          <div
            key={index}
            className={`col-12 md:col-6 lg:col-3 py-5 px-6 border-none ${
              index < 3 ? "md:border-right-1 surface-border" : ""
            }`}
          >
            {/* Tooltip */}
            <Tooltip
              // id={tooltipId}
              target={`.tooltip-target-${index}`}
              content={card.tooltip}
              position="top"
              className="text-xs max-w-10rem"
            />

            {/* Encabezado con tooltip */}
            <div
              className={`flex align-items-center mb-3 cursor-help tooltip-target-${index}`}
              data-pr-tooltip={card.tooltip}
              data-pr-position="top"
              data-pr-at="center top-4"
              data-pr-id={tooltipId}
            >
              <Avatar
                icon={card.icon}
                size="large"
                shape="circle"
                className={`text-base bg-${card.color}-100 text-${card.color}-700`}
              />
              <span className="text-xl ml-2">{card.title}</span>
              <i className="pi pi-info-circle ml-2 text-sm text-color-secondary"></i>
            </div>

            {/* Valor principal */}
            <div className="flex align-items-center justify-content-between mb-3">
              <span className="block font-bold text-4xl mb-3">
                {formatValue(card.currentValue, card.format)}
                {card.currentValue >= 1000000 && (
                  <span className="text-sm ml-1">USD</span>
                )}
              </span>
              <Badge
                value={`${card.comparison.percentage}%`}
                severity={
                  card.comparison.trend === "up"
                    ? card.title.includes("Pagar") ||
                      card.title.includes("Compras")
                      ? "danger"
                      : "success"
                    : card.comparison.trend === "down"
                    ? card.title.includes("Cobrar")
                      ? "danger"
                      : "success"
                    : "info"
                }
                className="mr-2"
              />
            </div>

            {/* Mini gráfico de tendencia mejorado
            <div className="h-4rem mb-2">
              <Chart
                type="line"
                data={{
                  labels: card.trendData?.map((_, i) => `T${i + 1}`) ?? [],
                  datasets: [
                    {
                      data: card.trendData ?? [],
                      borderColor: card.color,
                      backgroundColor: "rgba(0,0,0,0)",
                      borderWidth: 3,
                      pointRadius: 0,
                      tension: 0.5,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false },
                  },
                  scales: {
                    x: { display: false },
                    y: { display: false },
                  },
                  elements: {
                    line: { borderJoinStyle: "round" },
                  },
                  responsive: true,
                  maintainAspectRatio: false,
                }}
                height="60px"
              />
            </div> */}

            {/* Comparación */}
            <div className="flex justify-content-between text-sm text-color-secondary">
              <span>vs {card.comparison.period}:</span>
              <span
                className={classNames("font-medium", {
                  "text-green-500":
                    card.comparison.trend === "up" &&
                    !card.title.includes("Pagar") &&
                    !card.title.includes("Compras"),
                  "text-red-500":
                    card.comparison.trend === "up" &&
                    (card.title.includes("Pagar") ||
                      card.title.includes("Compras")),
                  "text-blue-500":
                    card.comparison.trend === "down" &&
                    card.title.includes("Cobrar"),
                  "text-orange-500": card.comparison.trend === "neutral",
                })}
              >
                {formatValue(card.comparison.value, card.format)}
                <i
                  className={classNames("ml-2", {
                    "pi pi-arrow-up": card.comparison.trend === "up",
                    "pi pi-arrow-down": card.comparison.trend === "down",
                    "pi pi-minus": card.comparison.trend === "neutral",
                  })}
                ></i>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryCards;

"use client";
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useRefineriaStore } from "@/store/refineriaStore";
import { useRefineryData } from "@/hooks/useRefineryData";
import { Card } from "primereact/card";
import {
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  format,
  parseISO,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { MultiSelect } from "primereact/multiselect";
import { Chart } from "primereact/chart";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Nullable } from "primereact/ts-helpers";

// Componente memoizado para el gráfico de almacenamiento
const StorageBarChart = React.memo(({ recepcions }: { recepcions: any[] }) => {
  const barChartData = useMemo(() => {
    const totals: Record<string, { storage: number; color: string }> = {};
    recepcions.forEach((r) => {
      const name = r.idTanque?.nombre || "Desconocido";
      const color = `#${r.idContratoItems?.producto?.color}` || "#66BB6A";
      if (totals[name]) {
        totals[name].storage += r.cantidadRecibida;
      } else {
        totals[name] = {
          storage: r.cantidadRecibida,
          color: color,
        };
      }
    });

    const storageData = Object.entries(totals).map(([tanque, data]) => ({
      tanque,
      storage: data.storage,
      color: data.color,
    }));

    return {
      labels: storageData.map((d) => d.tanque),
      datasets: [
        {
          label: "Almacenamiento (Bbl)",
          data: storageData.map((d) => d.storage),
          backgroundColor: storageData.map((d) => d.color),
        },
      ],
    };
  }, [recepcions]);

  const barChartOptions = useMemo(
    () => ({
      indexAxis: "x",
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { beginAtZero: true, title: { display: true, text: "Barriles" } },
      },
      plugins: {
        legend: { display: false },
        title: { display: false, text: "Almacenamiento por Tanque" },
      },
    }),
    []
  );

  return (
    <Card
      title="Almacenamiento por Tanque"
      className="p-0 "
      //   style={{ height: "350px" }}
    >
      <div style={{ height: "300px" }}>
        <Chart
          type="bar"
          data={barChartData}
          options={barChartOptions}
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </Card>
  );
});

// Componente memoizado para los controles de filtrado
const FilterControls = React.memo(
  ({
    filterType,
    setFilterType,
    customRange,
    setCustomRange,
    selectedDay,
    setSelectedDay,
    selectedMonth,
    setSelectedMonth,
  }: {
    filterType: string;
    setFilterType: (value: any) => void;
    customRange: Nullable<(Date | null)[]>;
    setCustomRange: (value: any) => void;
    selectedDay: Nullable<Date>;
    setSelectedDay: (value: any) => void;
    selectedMonth: Nullable<Date>;
    setSelectedMonth: (value: any) => void;
  }) => {
    const filterOptions = useMemo(
      () => [
        { label: "Día", value: "day" },
        { label: "Mes", value: "month" },
        { label: "Año", value: "year" },
        { label: "Personalizado", value: "custom" },
      ],
      []
    );

    return (
      <div className="flex flex-col md:flex-row items-start gap-3">
        <Dropdown
          value={filterType}
          options={filterOptions}
          onChange={(e) => setFilterType(e.value)}
          placeholder="Selecciona filtro"
          className="w-full md:w-6"
        />
        {filterType === "custom" && (
          <div className="mt-3 md:mt-0">
            <Calendar
              value={customRange}
              onChange={(e) => setCustomRange(e.value)}
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
            />
          </div>
        )}
        {filterType === "day" && (
          <div className="mt-3 md:mt-0">
            <Calendar
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.value)}
              selectionMode="single"
              placeholder="Selecciona un día"
              className="w-full "
            />
          </div>
        )}
        {filterType === "month" && (
          <div className="mt-3 md:mt-0">
            <Calendar
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.value)}
              view="month"
              dateFormat="mm/yy"
              placeholder="Selecciona un mes"
            />
          </div>
        )}
      </div>
    );
  }
);

// Componente principal refactorizado
const TanqueGraficaList: React.FC = () => {
  const { activeRefineria } = useRefineriaStore();
  const { recepcions, chequeoCantidads } = useRefineryData(
    activeRefineria?.id || ""
  );

  // Filtrar chequeos aplicados a tanques y extraer tanques únicos
  const tanks = useMemo(() => {
    const map: Record<string, { nombre: string; color?: string }> = {};
    chequeoCantidads.forEach((c) => {
      if (c.aplicar.tipo === "Tanque" && c.aplicar.idReferencia) {
        const tanqueId = c.aplicar.idReferencia.id;
        const tanqueNombre = c.aplicar.idReferencia.nombre ?? "Desconocido";
        const color = c.idProducto?.color;
        map[tanqueId] = { nombre: tanqueNombre, color: color };
      }
    });
    return Object.entries(map).map(([id, data]) => ({
      id,
      nombre: data.nombre,
      color: data.color,
    }));
  }, [chequeoCantidads]);

  // Estados
  const [selectedTanks, setSelectedTanks] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<
    "day" | "week" | "month" | "quarter" | "semester" | "year" | "custom"
  >("day");
  const [customRange, setCustomRange] =
    useState<Nullable<(Date | null)[]>>(null);
  const [selectedDay, setSelectedDay] = useState<Nullable<Date>>(null);
  const [selectedMonth, setSelectedMonth] = useState<Nullable<Date>>(null);
  const [dateRange, setDateRange] = useState<[Date, Date] | null>(null);

  // Efecto para establecer día por defecto
  useEffect(() => {
    if (filterType === "day" && !selectedDay) {
      setSelectedDay(new Date());
    }
  }, [filterType, selectedDay]);

  // Calcular rango de fechas
  useEffect(() => {
    const now = new Date();
    let start: Date, end: Date;

    switch (filterType) {
      case "day":
        if (selectedDay) {
          start = new Date(selectedDay);
          end = new Date(selectedDay);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          setDateRange([start, end]);
        }
        break;
      case "month":
        start = startOfMonth(selectedMonth || now);
        end = endOfMonth(selectedMonth || now);
        setDateRange([start, end]);
        break;
      case "year":
        start = startOfYear(now);
        end = endOfYear(now);
        setDateRange([start, end]);
        break;
      case "custom":
        if (customRange && customRange[0] && customRange[1]) {
          start = new Date(customRange[0]);
          end = new Date(customRange[1]);
          start.setHours(0, 0, 0, 0);
          end.setHours(23, 59, 59, 999);
          setDateRange([start, end]);
        }
        break;
      default:
        setDateRange(null);
    }
  }, [filterType, selectedDay, customRange, selectedMonth]);

  // Datos filtrados para múltiples tanques (memoizado)
  const filteredData = useMemo(() => {
    if (selectedTanks.length === 0 || !dateRange) return {};

    const [startDate, endDate] = dateRange;
    const result: Record<
      string,
      { date: Date; cantidad: number; hora: string }[]
    > = {};

    selectedTanks.forEach((tankId) => {
      result[tankId] = [];
    });

    if (filterType === "day") {
      chequeoCantidads
        .filter(
          (c) =>
            c.aplicar.tipo === "Tanque" &&
            c.aplicar.idReferencia &&
            selectedTanks.includes(c.aplicar.idReferencia.id) &&
            parseISO(c.fechaChequeo) >= startDate &&
            parseISO(c.fechaChequeo) <= endDate
        )
        .forEach((c) => {
          const tankId = c.aplicar.idReferencia.id;
          const fecha = parseISO(c.fechaChequeo);
          result[tankId].push({
            date: fecha,
            cantidad: c.cantidad,
            hora: format(fecha, "HH:mm"),
          });
        });

      selectedTanks.forEach((tankId) => {
        result[tankId].sort((a, b) => a.date.getTime() - b.date.getTime());
      });
    } else {
      const daysInRange = eachDayOfInterval({ start: startDate, end: endDate });

      daysInRange.forEach((day) => {
        const chequeosDia = chequeoCantidads
          .filter(
            (c) =>
              c.aplicar.tipo === "Tanque" &&
              c.aplicar.idReferencia &&
              selectedTanks.includes(c.aplicar.idReferencia.id) &&
              isSameDay(parseISO(c.fechaChequeo), day)
          )
          .sort(
            (a, b) =>
              parseISO(b.fechaChequeo).getTime() -
              parseISO(a.fechaChequeo).getTime()
          );

        const byTank: Record<string, (typeof chequeosDia)[0]> = {};
        chequeosDia.forEach((c) => {
          const tankId = c.aplicar.idReferencia.id;
          if (!byTank[tankId]) byTank[tankId] = c;
        });

        Object.entries(byTank).forEach(([tankId, chequeo]) => {
          result[tankId].push({
            date: parseISO(chequeo.fechaChequeo),
            cantidad: chequeo.cantidad,
            hora: format(day, "dd/MM"),
          });
        });
      });

      selectedTanks.forEach((tankId) => {
        result[tankId].sort((a, b) => a.date.getTime() - b.date.getTime());
      });
    }

    return result;
  }, [chequeoCantidads, selectedTanks, filterType, dateRange]);

  // Configuración de gráficos para múltiples tanques
  const lineChartData = useMemo(() => {
    if (selectedTanks.length === 0) return { labels: [], datasets: [] };

    const colors = [
      "#42A5F5",
      "#FFA726",
      "#66BB6A",
      "#26C6DA",
      "#7E57C2",
      "#EC407A",
      "#D4E157",
      "#FF7043",
      "#5C6BC0",
      "#AB47BC",
      "#78909C",
      "#26A69A",
    ];

    const datasets = selectedTanks.map((tankId, index) => {
      const tank = tanks.find((t) => t.id === tankId);
      const tankName = tank?.nombre || "Tanque";
      const color = `#${tank?.color}` || "#42A5F5";
      const tankData = filteredData[tankId] || [];
      const data = tankData.map((d) => d.cantidad);
      const labels = tankData.map((d) => d.hora);

      return {
        label: tankName,
        data,
        borderColor: color,
        tension: 0.4,
        fill: false,
        pointRadius: tankData.length > 30 ? 2 : 5,
      };
    });

    const firstTankId = selectedTanks.reduce((maxId, currId) => {
      const currLength = filteredData[currId]?.length || 0;
      const maxLength = filteredData[maxId]?.length || 0;
      return currLength > maxLength ? currId : maxId;
    }, selectedTanks[0]);

    const firstTankData = filteredData[firstTankId] || [];
    const labels = firstTankData.map((d) => d.hora);

    return { labels, datasets };
  }, [filteredData, selectedTanks, tanks]);

  const lineChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "Bbl" },
        },
        x: {
          title: {
            display: true,
            text: filterType === "day" ? "Hora del día" : "Fecha",
          },
        },
      },
      plugins: {
        legend: { position: "top", display: false },
        title: {
          display: false,
          text: "Nivel de Tanques",
        },
      },
    }),
    [filterType]
  );

  // Memoizar opciones de tanques
  const tankOptions = useMemo(
    () => tanks.map((t) => ({ label: t.nombre, value: t.id })),
    [tanks]
  );

  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <Card
          title="Nivel de Tanque"
          className="p-0 mb-3"
          //   style={{ height: "350px" }}
        >
          <div
            style={
              {
                // height: "300px"
              }
            }
          >
            <div className="grid formgrid ">
              {/* Campo: Nombre */}
              <div className="col-12 md:col-6 ">
                <MultiSelect
                  value={selectedTanks}
                  options={tankOptions}
                  onChange={(e) => setSelectedTanks(e.value)}
                  placeholder="Selecciona tanques"
                  className="w-full "
                  display="chip"
                  selectionLimit={5}
                />
              </div>
              <div className="col-12 md:col-6 ">
                <FilterControls
                  filterType={filterType}
                  setFilterType={setFilterType}
                  customRange={customRange}
                  setCustomRange={setCustomRange}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                />
              </div>
            </div>
            <Chart
              type="line"
              data={lineChartData}
              options={lineChartOptions}
              style={{ width: "100%", height: "300px" }}
            />
          </div>
        </Card>
      </div>

      <div className="col-12 md:col-6">
        <StorageBarChart recepcions={recepcions} />
      </div>
    </div>
  );
};

export default TanqueGraficaList;

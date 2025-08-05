import React, { useState, useEffect } from "react";
import { Chart } from "primereact/chart";
import { TabView, TabPanel } from "primereact/tabview";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";

import { Factura, Partida } from "@/libs/interfaces";

// Colores para las diferentes partidas
const COLORES_PARTIDAS: { [key: string]: string } = {
  Alquiler: "orange",
  Nomina: "blue",
  Servicios: "green",
  Mantenimiento: "purple",
  Materiales: "yellow",
  Impuestos: "red",
  Otros: "teal",
};

// Extiende la interface Partida para agregar los campos usados en partidasMap
export interface PartidaResumen extends Partida {
  total: number;
  porcentaje: number;
  color: string;
}
interface GastosResumenProps {
  facturas: Factura[] | null;
  loading: boolean;
}

const GastosResumen: React.FC<GastosResumenProps> = ({ facturas, loading }) => {
  console.log("Facturas cargadas:", facturas);
  const [activeTab, setActiveTab] = useState(0);
  const [partidas, setPartidas] = useState<PartidaResumen[]>([]);
  const [totalGastos, setTotalGastos] = useState(0);
  const [selectedPartida, setSelectedPartida] = useState<PartidaResumen | null>(
    null
  );

  // Procesar datos para agrupar por partidas
  useEffect(() => {
    if (!facturas) return;

    const partidasMap: { [key: string]: PartidaResumen } = {};
    let total = 0;

    // Recorremos todas las facturas y sus líneas
    facturas.forEach((factura) => {
      factura.idLineasFactura.forEach((linea) => {
        const partidaDesc = linea.idPartida?.descripcion;
        const monto = linea.subTotal;

        if (partidaDesc) {
          if (!partidasMap[partidaDesc]) {
            partidasMap[partidaDesc] = {
              id: linea.idPartida?.id ?? "",
              descripcion: partidaDesc,
              codigo: linea.idPartida?.codigo ?? 0,
              eliminado: linea.idPartida?.eliminado ?? false,
              total: 0,
              porcentaje: 0,
              color: COLORES_PARTIDAS[partidaDesc] || "gray",
            };
          }

          partidasMap[partidaDesc].total += monto;
          total += monto;
        }
      });
    });

    // Calcular porcentajes
    Object.values(partidasMap).forEach((partida) => {
      partida.porcentaje = Math.round((partida.total / total) * 100);
    });

    // Ordenar por monto descendente
    const sortedPartidas = Object.values(partidasMap).sort(
      (a, b) => b.total - a.total
    );

    setPartidas(sortedPartidas);
    setTotalGastos(total);
  }, [facturas]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getEstadoTag = (estado: string) => {
    const severity =
      estado === "Aprobada"
        ? "success"
        : estado === "Pendiente"
        ? "warning"
        : "danger";
    return <Tag value={estado} severity={severity} />;
  };

  const getFacturasByPartida = (partidaId: string) => {
    if (!facturas) return [];

    return facturas.filter((factura) =>
      factura.idLineasFactura.some((linea) => linea.idPartida?.id === partidaId)
    );
  };

  // Datos para gráficos
  const getChartData = () => {
    return {
      labels: partidas.map((p) => p.descripcion),
      datasets: [
        {
          data: partidas.map((p) => p.total),
          backgroundColor: partidas.map((p) => `var(--${p.color}-500)`),
          borderWidth: 0,
        },
      ],
    };
  };

  const chartOptions = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          padding: 20,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.raw || 0;
            const percentage = Math.round((value / totalGastos) * 100);
            return `${label}: ${formatCurrency(value)} (${percentage}%)`;
          },
        },
      },
    },
    maintainAspectRatio: false,
  };
  if (loading) {
    return (
      <div className="card h-full">
        <h5>Gastos por Partida</h5>
        <ul className="list-none m-0 p-0">
          {[1, 2, 3, 4].map((_, i) => (
            <li key={i} className="mb-4">
              <div className="flex align-items-center justify-content-between mb-2">
                <Skeleton width="10rem" height="1rem" />
                <Skeleton width="3rem" height="1rem" />
              </div>
              <Skeleton width="100%" height="0.5rem" />
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <div className="flex justify-content-between align-items-center mb-4">
        <h5>Análisis de Gastos</h5>
        <div className="bg-blue-100 text-blue-800 border-round px-3 py-1">
          <span className="font-bold">Total: </span>
          <span>{formatCurrency(totalGastos)}</span>
        </div>
      </div>

      <TabView
        activeIndex={activeTab}
        onTabChange={(e) => setActiveTab(e.index)}
      >
        {/* Vista Resumen */}
        <TabPanel header="Resumen">
          <div className="grid">
            <div className="col-12 lg:col-6">
              <div className="p-4 border-round surface-card">
                <h6>Distribución por Partidas</h6>
                <div
                  className="flex justify-content-center"
                  style={{ height: "300px" }}
                >
                  <Chart
                    type="pie"
                    data={getChartData()}
                    options={chartOptions}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            <div className="col-12 lg:col-6">
              <div className="p-4 border-round surface-card h-full">
                <h6>Top Partidas</h6>
                <ul className="list-none m-0 p-0">
                  {partidas.slice(0, 5).map((partida, i) => (
                    <li
                      key={i}
                      className={classNames(
                        "p-3 border-bottom-1 surface-border cursor-pointer",
                        {
                          "bg-primary-50": selectedPartida?.id === partida.id,
                        }
                      )}
                      onClick={() => setSelectedPartida(partida)}
                    >
                      <div className="flex align-items-center justify-content-between">
                        <div className="flex align-items-center">
                          <i
                            className="pi pi-circle-fill mr-2"
                            style={{ color: `var(--${partida.color}-500)` }}
                          ></i>
                          <span className="font-bold">
                            {partida.descripcion}
                          </span>
                        </div>
                        <div className="flex align-items-center">
                          <span className="font-bold mr-2">
                            {formatCurrency(partida.total)}
                          </span>
                          <span
                            className={classNames(
                              "font-bold",
                              `text-${partida.color}-500`
                            )}
                          >
                            {partida.porcentaje}%
                          </span>
                        </div>
                      </div>
                      <div
                        className="border-round overflow-hidden surface-200 mt-2"
                        style={{ height: "0.5rem" }}
                      >
                        <div
                          className={`h-full bg-${partida.color}-500`}
                          style={{ width: `${partida.porcentaje}%` }}
                        ></div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </TabPanel>

        {/* Vista Detalle */}
        <TabPanel header="Detalle">
          <div className="p-4 border-round surface-card">
            <DataTable
              value={facturas || []}
              paginator
              rows={5}
              rowsPerPageOptions={[5, 10, 25]}
              className="p-datatable-sm"
            >
              <Column field="numeroFactura" header="N° Factura" sortable />
              <Column
                field="concepto"
                header="Concepto"
                sortable
                body={(rowData) => (
                  <div>
                    <div className="font-bold">{rowData.concepto}</div>
                    <div className="text-sm text-color-secondary">
                      {formatDate(rowData.fechaFactura)}
                    </div>
                  </div>
                )}
              />
              <Column
                field="total"
                header="Monto"
                sortable
                body={(rowData) => formatCurrency(rowData.total)}
              />
              <Column
                field="estado"
                header="Estado"
                body={(rowData) => getEstadoTag(rowData.estado)}
              />
              <Column
                header="Partidas"
                body={(rowData) => (
                  <div>
                    {rowData.idLineasFactura.map(
                      (
                        linea: {
                          idPartida: { descripcion: string };
                        },
                        i: number
                      ) => (
                        <Tag
                          key={i}
                          value={linea.idPartida.descripcion}
                          className="mr-2 mb-1"
                          style={{
                            backgroundColor: `var(--${
                              COLORES_PARTIDAS[linea.idPartida.descripcion] ||
                              "gray"
                            }-100)`,
                          }}
                        />
                      )
                    )}
                  </div>
                )}
              />
            </DataTable>
          </div>
        </TabPanel>

        {/* Vista por Partida */}
        {selectedPartida && (
          <TabPanel header={`Partida: ${selectedPartida.descripcion}`}>
            <div className="p-4 border-round surface-card">
              <div className="flex align-items-center justify-content-between mb-4">
                <div>
                  <h6>{selectedPartida.descripcion}</h6>
                  <div className="text-color-secondary">
                    Código: {selectedPartida.codigo}
                  </div>
                </div>
                <div className="text-xl font-bold">
                  {formatCurrency(selectedPartida.total)} (
                  {selectedPartida.porcentaje}%)
                </div>
              </div>

              <DataTable
                value={getFacturasByPartida(selectedPartida.id)}
                paginator
                rows={5}
                rowsPerPageOptions={[5, 10, 25]}
                className="p-datatable-sm"
              >
                <Column field="numeroFactura" header="Factura" />
                <Column
                  field="concepto"
                  header="Concepto"
                  body={(rowData) => (
                    <div>
                      <div className="font-bold">{rowData.concepto}</div>
                      <div className="text-sm text-color-secondary">
                        {formatDate(rowData.fechaFactura)}
                      </div>
                    </div>
                  )}
                />
                <Column
                  header="Monto"
                  body={(rowData) => {
                    const linea = rowData.idLineasFactura.find(
                      (l: any) => l.idPartida.id === selectedPartida.id
                    );
                    return formatCurrency(linea?.subTotal || 0);
                  }}
                />
                <Column
                  field="estado"
                  header="Estado"
                  body={(rowData) => getEstadoTag(rowData.estado)}
                />
                <Column
                  header="Registrado por"
                  body={(rowData) => rowData.createdBy.nombre}
                />
              </DataTable>
            </div>
          </TabPanel>
        )}
      </TabView>
    </div>
  );
};

export default GastosResumen;

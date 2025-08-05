import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { Avatar } from "primereact/avatar";
import { Chart } from "primereact/chart";
import { Tag } from "primereact/tag";
import { Skeleton } from "primereact/skeleton";
import { Abono } from "@/libs/interfaces";

// Interfaz para los datos del backend
// interface AbonoBackend {
//   id: string;
//   idRefineria: {
//     id: string;
//     nombre: string;
//     img: string;
//   };
//   idContrato: {
//     id: string;
//     numeroContrato: string;
//     descripcion: string;
//     idContacto: {
//       id: string;
//       nombre: string;
//       representanteLegal: string;
//       telefono: string;
//       correo: string;
//       direccion: string;
//     };
//     montoTotal: number;
//     montoPagado: number;
//     montoPendiente: number;
//   };
//   monto: number;
//   fecha: string;
//   tipoOperacion: string;
//   tipoAbono: "Cuentas por Cobrar" | "Cuentas por Pagar";
//   referencia: string;
//   numeroAbono: number;
//   createdAt: string;
//   createdBy: {
//     id: string;
//     nombre: string;
//     correo: string;
//   };
// }

// interface AbonosResponse {
//   total: number;
//   abonos: AbonoBackend[];
// }
interface AbonosOverviewProps {
  abonos: Abono[];
  loading: boolean;
}

const AbonosOverview = ({ abonos, loading }: AbonosOverviewProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [selectedAbono, setSelectedAbono] = useState<Abono | null>(null);

  // Datos para el gráfico (en una app real vendrían del backend)
  const abonosMes = {
    labels: ["Sem 1", "Sem 2", "Sem 3", "Sem 4"],
    ingresos: [850000, 1120000, 980000, 1250000],
    egresos: [450000, 380000, 420000, 320000],
  };

  // Configuración del gráfico
  const chartData = {
    labels: abonosMes.labels,
    datasets: [
      {
        label: "Ingresos",
        backgroundColor: "#4CAF50",
        data: abonosMes.ingresos,
      },
      {
        label: "Egresos",
        backgroundColor: "#F44336",
        data: abonosMes.egresos,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: false,
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: function (value: number) {
            return "$" + (value / 1000).toLocaleString() + "K";
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                maximumFractionDigits: 0,
              }).format(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const getTipoAbonoClass = (
    tipo: "Cuentas por Cobrar" | "Cuentas por Pagar"
  ) => {
    return tipo === "Cuentas por Cobrar"
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getTipoAbonoTag = (
    tipo: "Cuentas por Cobrar" | "Cuentas por Pagar"
  ) => {
    const severity = tipo === "Cuentas por Cobrar" ? "success" : "danger";
    return <Tag value={tipo} severity={severity} className="ml-2" />;
  };

  if (loading) {
    return (
      <div className="card h-full">
        <h5>Registro de Abonos</h5>
        <div className="flex flex-column lg:flex-row gap-5">
          <div className="flex-1">
            <div className="flex justify-content-between align-items-center mb-3">
              <Skeleton width="10rem" height="1.5rem" />
              <Skeleton width="5rem" height="1rem" />
            </div>
            <div className="border-round overflow-hidden border-1 surface-border">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="p-3 flex border-bottom-1 surface-border"
                >
                  <Skeleton shape="circle" size="3rem" className="mr-3" />
                  <div className="flex-1">
                    <Skeleton width="60%" height="1.2rem" className="mb-2" />
                    <Skeleton width="40%" height="1rem" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-column gap-3">
            <div className="surface-card p-4 border-round">
              <Skeleton width="12rem" height="1.5rem" className="mb-4" />
              <div className="grid">
                {[1, 2, 3, 4].map((_, i) => (
                  <div key={i} className="col-6 mt-3">
                    <Skeleton width="80%" height="1rem" className="mb-1" />
                    <Skeleton width="90%" height="1.2rem" />
                  </div>
                ))}
              </div>
            </div>
            <div className="surface-card p-4 border-round">
              <Skeleton width="10rem" height="1.5rem" className="mb-4" />
              <Skeleton height="200px" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-full">
      <h5>Registro de Abonos</h5>
      <div className="flex flex-column lg:flex-row gap-5">
        {/* Lista de últimos abonos */}
        <div className="flex-1">
          <div className="flex justify-content-between align-items-center mb-3">
            <h6>Últimos Movimientos</h6>
            <span className="text-sm text-color-secondary">
              {abonos.length || 0} registros
            </span>
          </div>
          <div className="border-round overflow-hidden border-1 surface-border">
            {abonos.map((abono) => (
              <div
                key={abono.id}
                className={classNames(
                  "p-3 flex cursor-pointer border-bottom-1 surface-border",
                  {
                    "bg-primary-50": selectedAbono?.id === abono.id,
                    "hover:surface-hover": selectedAbono?.id !== abono.id,
                  }
                )}
                onClick={() => setSelectedAbono(abono)}
              >
                <Avatar
                  icon={
                    abono.tipoAbono === "Cuentas por Cobrar"
                      ? "pi pi-arrow-down"
                      : "pi pi-arrow-up"
                  }
                  size="large"
                  shape="circle"
                  className={classNames(
                    "mr-3",
                    getTipoAbonoClass(
                      abono.tipoAbono === "Cuentas por Cobrar" ||
                        abono.tipoAbono === "Cuentas por Pagar"
                        ? abono.tipoAbono
                        : "Cuentas por Cobrar"
                    )
                  )}
                />
                <div className="flex-1">
                  <div className="flex justify-content-between align-items-start">
                    <div>
                      <span className="font-bold block">
                        {abono.idContrato.numeroContrato}
                      </span>
                      <span className="text-sm text-color-secondary">
                        #{abono.numeroAbono} • {formatDate(abono.fecha)}
                      </span>
                    </div>
                    <span
                      className={classNames("font-bold", {
                        "text-green-500":
                          abono.tipoAbono === "Cuentas por Cobrar",
                        "text-red-500": abono.tipoAbono === "Cuentas por Pagar",
                      })}
                    >
                      {formatCurrency(abono.monto)}
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm">{abono.referencia}</span>
                    {getTipoAbonoTag(
                      abono.tipoAbono === "Cuentas por Cobrar" ||
                        abono.tipoAbono === "Cuentas por Pagar"
                        ? abono.tipoAbono
                        : "Cuentas por Cobrar"
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Detalle del abono seleccionado y gráfico */}
        <div className="flex-1 flex flex-column gap-3">
          {selectedAbono ? (
            <div className="surface-card p-4 border-round">
              <div className="flex justify-content-between align-items-center mb-4">
                <h6>Detalle del Abono</h6>
                <Tag
                  value={selectedAbono.tipoAbono}
                  severity={
                    selectedAbono.tipoAbono === "Cuentas por Cobrar"
                      ? "success"
                      : "danger"
                  }
                />
              </div>
              <div className="grid">
                <div className="col-6">
                  <span className="text-sm text-color-secondary block">
                    Número de Abono
                  </span>
                  <span className="font-medium">
                    #{selectedAbono.numeroAbono}
                  </span>
                </div>
                <div className="col-6">
                  <span className="text-sm text-color-secondary block">
                    Contrato
                  </span>
                  <span className="font-medium">
                    {selectedAbono.idContrato.numeroContrato}
                  </span>
                </div>
                <div className="col-6 mt-3">
                  <span className="text-sm text-color-secondary block">
                    Fecha
                  </span>
                  <span className="font-medium">
                    {formatDate(selectedAbono.fecha)}
                  </span>
                </div>
                <div className="col-6 mt-3">
                  <span className="text-sm text-color-secondary block">
                    Tipo de Operación
                  </span>
                  <span className="font-medium">
                    {selectedAbono.tipoOperacion}
                  </span>
                </div>
                <div className="col-6 mt-3">
                  <span className="text-sm text-color-secondary block">
                    Monto
                  </span>
                  <span
                    className={classNames("font-bold", {
                      "text-green-500":
                        selectedAbono.tipoAbono === "Cuentas por Cobrar",
                      "text-red-500":
                        selectedAbono.tipoAbono === "Cuentas por Pagar",
                    })}
                  >
                    {formatCurrency(selectedAbono.monto)}
                  </span>
                </div>
                <div className="col-6 mt-3">
                  <span className="text-sm text-color-secondary block">
                    Registrado por
                  </span>
                  <span className="font-medium">
                    {selectedAbono.createdBy.nombre}
                  </span>
                </div>
                <div className="col-12 mt-3">
                  <span className="text-sm text-color-secondary block">
                    Referencia/Descripción
                  </span>
                  <p className="font-medium mt-1">{selectedAbono.referencia}</p>
                </div>
                <div className="col-12 mt-3">
                  <span className="text-sm text-color-secondary block">
                    Cliente/Proveedor
                  </span>
                  <p className="font-medium mt-1">
                    {selectedAbono.idContrato.idContacto.nombre}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="surface-card p-4 border-round flex align-items-center justify-content-center">
              <span className="text-color-secondary">
                Seleccione un abono para ver el detalle
              </span>
            </div>
          )}

          {/* Gráfico de abonos del mes */}
          <div className="surface-card p-4 border-round flex-grow-1">
            <h6>Resumen Mensual</h6>
            <div className="flex justify-content-between mb-4">
              <div className="text-center p-3 border-round surface-100 flex-1 mr-3">
                <span className="block text-xl text-green-500 font-bold">
                  {formatCurrency(
                    abonosMes.ingresos.reduce((a, b) => a + b, 0)
                  )}
                </span>
                <span className="text-color-secondary">Total Ingresos</span>
              </div>
              <div className="text-center p-3 border-round surface-100 flex-1">
                <span className="block text-xl text-red-500 font-bold">
                  {formatCurrency(abonosMes.egresos.reduce((a, b) => a + b, 0))}
                </span>
                <span className="text-color-secondary">Total Egresos</span>
              </div>
            </div>
            <div style={{ height: "250px" }}>
              <Chart
                type="bar"
                data={chartData}
                options={chartOptions}
                height="100%"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pestañas */}
      <div className="flex align-items-center mt-4 border-round">
        <div
          className={classNames(
            "flex flex-column align-items-center flex-1 py-3 cursor-pointer border-top-1 hover:surface-hover",
            {
              "border-primary-500": activeTab === 0,
              "surface-border": activeTab !== 0,
            }
          )}
          onClick={() => setActiveTab(0)}
        >
          <i className="pi pi-list text-2xl mb-2"></i>
          <span className="font-bold">Todos</span>
        </div>
        <div
          className={classNames(
            "flex flex-column align-items-center flex-1 py-3 cursor-pointer border-top-1 hover:surface-hover",
            {
              "border-primary-500": activeTab === 1,
              "surface-border": activeTab !== 1,
            }
          )}
          onClick={() => setActiveTab(1)}
        >
          <i className="pi pi-arrow-down text-2xl mb-2 text-green-500"></i>
          <span className="font-bold">Cuentas por Cobrar</span>
        </div>
        <div
          className={classNames(
            "flex flex-column align-items-center flex-1 py-3 cursor-pointer border-top-1 hover:surface-hover",
            {
              "border-primary-500": activeTab === 2,
              "surface-border": activeTab !== 2,
            }
          )}
          onClick={() => setActiveTab(2)}
        >
          <i className="pi pi-arrow-up text-2xl mb-2 text-red-500"></i>
          <span className="font-bold">Cuentas por Pagar</span>
        </div>
        <div
          className={classNames(
            "flex flex-column align-items-center flex-1 py-3 cursor-pointer border-top-1 hover:surface-hover",
            {
              "border-primary-500": activeTab === 3,
              "surface-border": activeTab !== 3,
            }
          )}
          onClick={() => setActiveTab(3)}
        >
          <i className="pi pi-filter text-2xl mb-2"></i>
          <span className="font-bold">Filtros</span>
        </div>
      </div>
    </div>
  );
};

export default AbonosOverview;

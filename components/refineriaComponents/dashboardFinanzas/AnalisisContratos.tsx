// /components/dashboard/AnalisisContratos.tsx

import React, { useState, useMemo } from "react";
import { Dropdown } from "primereact/dropdown";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Balance, Contrato } from "@/libs/interfaces"; // Asegúrate que la ruta sea correcta

interface AnalisisContratosProps {
  balances: Balance[];
  loading: boolean;
}

export const AnalisisContratos: React.FC<AnalisisContratosProps> = ({
  balances,
  loading,
}) => {
  const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);

  // --- Funciones de formato y utilidad ---
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("es-VE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  const formatNumber = (value: number) =>
    new Intl.NumberFormat("es-VE").format(value);

  const getSeverityForEstado = (estado: string) => {
    // ... (sin cambios)
    switch (estado.toLowerCase()) {
      case "activo":
        return "success";
      case "pendiente":
        return "warning";
      case "finalizado":
        return "info";
      case "cancelado":
        return "danger";
      default:
        return undefined;
    }
  };

  // --- Opciones para el Dropdown ---
  const balanceOptions = useMemo(() => {
    if (!balances) return [];
    return balances.map((balance) => ({
      label: `Balance #${balance.numeroBalance} (${formatDate(
        balance.fechaInicio
      )} - ${formatDate(balance.fechaFin)})`,
      value: balance,
    }));
  }, [balances]);

  // --- Cálculos para el análisis ---
  const analisisData = useMemo(() => {
    if (!selectedBalance) return null;

    // 1. Cálculos de costo por barril
    const costoPorBarrilCompra =
      selectedBalance.totalBarrilesCompra > 0
        ? selectedBalance.totalCompras / selectedBalance.totalBarrilesCompra
        : 0;
    const precioPorBarrilVenta =
      selectedBalance.totalBarrilesVenta > 0
        ? selectedBalance.totalVentas / selectedBalance.totalBarrilesVenta
        : 0;
    const porcentajeVenta =
      selectedBalance.totalBarrilesCompra > 0
        ? (selectedBalance.totalBarrilesVenta /
            selectedBalance.totalBarrilesCompra) *
          100
        : 0;

    // 2. Resumen de barriles vendidos por producto
    const resumenVentas: { [key: string]: number } = {};
    selectedBalance.contratosVentas.forEach((contrato) => {
      contrato.idItems.forEach((item) => {
        const nombreProducto = item.producto.nombre;
        resumenVentas[nombreProducto] =
          (resumenVentas[nombreProducto] || 0) + item.cantidad;
      });
    });

    const barrilesVendidosPorProducto = Object.keys(resumenVentas).map(
      (producto) => ({
        producto,
        totalVendido: resumenVentas[producto],
      })
    );

    return {
      costoPorBarrilCompra,
      precioPorBarrilVenta,
      porcentajeVenta,
      barrilesVendidosPorProducto,
    };
  }, [selectedBalance]);

  // --- Templates para componentes PrimeReact ---
  const accordionHeaderTemplate = (contrato: Contrato) => (
    <div className="flex align-items-center justify-content-between w-full">
      <div className="flex align-items-center">
        <span className="font-bold mr-4">{`Contrato: ${contrato.numeroContrato}`}</span>
        <span className="hidden md:block">{contrato.descripcion}</span>
      </div>
      <div className="flex align-items-center">
        <span className="font-bold text-lg mr-4">
          {formatCurrency(contrato.montoTotal ?? 0)}
        </span>
        <Tag
          value={contrato.estadoContrato}
          severity={getSeverityForEstado(contrato.estadoContrato)}
        />
      </div>
    </div>
  );

  return (
    <Card title="Análisis de Contratos: Compra vs. Venta">
      <div className="p-fluid">
        {/* Selector de Balance */}
        <div className="field">
          <label htmlFor="balance-selector">
            Seleccione un Período de Balance
          </label>
          <Dropdown
            id="balance-selector"
            value={selectedBalance}
            options={balanceOptions}
            onChange={(e) => setSelectedBalance(e.value)}
            placeholder="Elige un balance para analizar"
            className="w-full md:w-20rem"
            loading={loading}
          />
        </div>

        {/* --- Renderizado condicional del análisis --- */}
        {selectedBalance && analisisData && !loading && (
          <div className="mt-4">
            {/* 1. Resumen Financiero */}
            <div className="grid text-center">
              <div className="col-12 md:col-4">
                <Card title="Total Compras">
                  <h2 className="m-0 text-blue-500">
                    {formatCurrency(selectedBalance.totalCompras)}
                  </h2>
                </Card>
              </div>
              <div className="col-12 md:col-4">
                <Card title="Total Ventas">
                  <h2 className="m-0 text-teal-500">
                    {formatCurrency(selectedBalance.totalVentas)}
                  </h2>
                </Card>
              </div>
              <div className="col-12 md:col-4">
                <Card title="Resultado del Período">
                  {selectedBalance.ganancia > 0 ? (
                    <h2 className="m-0 text-green-500">
                      Ganancia: {formatCurrency(selectedBalance.ganancia)}
                    </h2>
                  ) : (
                    <h2 className="m-0 text-red-500">
                      Pérdida: {formatCurrency(selectedBalance.perdida)}
                    </h2>
                  )}
                </Card>
              </div>
            </div>

            {/* 2. Análisis Volumétrico y de Costos 📊 */}
            <Card
              title="Análisis Volumétrico y de Costos por Barril"
              className="mt-4"
            >
              <div className="grid text-center">
                <div className="col-6 md:col-3">
                  <p className="text-xl font-semibold m-0">
                    {formatNumber(selectedBalance.totalBarrilesCompra)}
                  </p>
                  <p className="text-sm text-600 m-0">Bbls Comprados</p>
                </div>
                <div className="col-6 md:col-3">
                  <p className="text-xl font-semibold m-0">
                    {formatNumber(selectedBalance.totalBarrilesVenta)}
                  </p>
                  <p className="text-sm text-600 m-0">Bbls Vendidos</p>
                </div>
                <div className="col-6 md:col-3">
                  <p className="text-xl font-semibold m-0 text-blue-500">
                    {formatCurrency(analisisData.costoPorBarrilCompra)}
                  </p>
                  <p className="text-sm text-600 m-0">Costo Prom./Bbl</p>
                </div>
                <div className="col-6 md:col-3">
                  <p className="text-xl font-semibold m-0 text-teal-500">
                    {formatCurrency(analisisData.precioPorBarrilVenta)}
                  </p>
                  <p className="text-sm text-600 m-0">Precio Prom./Bbl</p>
                </div>
              </div>
            </Card>

            {/* 3. Resumen de Barriles Vendidos por Producto ⛽ */}
            <Card
              title="Resumen de Barriles Vendidos por Producto"
              className="mt-4"
            >
              <DataTable
                value={analisisData.barrilesVendidosPorProducto}
                responsiveLayout="scroll"
                size="small"
              >
                <Column
                  field="producto"
                  header="Producto"
                  style={{ width: "70%" }}
                ></Column>
                <Column
                  field="totalVendido"
                  header="Total Barriles Vendidos"
                  body={(rowData) => formatNumber(rowData.totalVendido)}
                  style={{ width: "30%" }}
                ></Column>
              </DataTable>
            </Card>

            {/* 4. Contratos de Compra en Acordeón */}
            <Card title="Detalle de Contratos de Compra" className="mt-4">
              <Accordion>
                {selectedBalance.contratosCompras.map((contrato) => (
                  <AccordionTab
                    key={contrato._id}
                    headerTemplate={() => accordionHeaderTemplate(contrato)}
                  >
                    <DataTable
                      value={contrato.idItems}
                      responsiveLayout="scroll"
                      size="small"
                    >
                      <Column
                        field="producto.nombre"
                        header="Producto"
                      ></Column>
                      <Column
                        field="cantidad"
                        header="Cantidad (Bbls)"
                        body={(rowData) => formatNumber(rowData.cantidad)}
                      ></Column>
                    </DataTable>
                  </AccordionTab>
                ))}
              </Accordion>
            </Card>

            {/* 5. Contratos de Venta en Acordeón */}
            <Card title="Detalle de Contratos de Venta" className="mt-4">
              <Accordion>
                {selectedBalance.contratosVentas.map((contrato) => (
                  <AccordionTab
                    key={contrato._id}
                    headerTemplate={() => accordionHeaderTemplate(contrato)}
                  >
                    <DataTable
                      value={contrato.idItems}
                      responsiveLayout="scroll"
                      size="small"
                    >
                      <Column
                        field="producto.nombre"
                        header="Producto"
                      ></Column>
                      <Column
                        field="cantidad"
                        header="Cantidad (Bbls)"
                        body={(rowData) => formatNumber(rowData.cantidad)}
                      ></Column>
                    </DataTable>
                  </AccordionTab>
                ))}
              </Accordion>
            </Card>
          </div>
        )}

        {loading && <p className="text-center mt-4">Cargando datos...</p>}
      </div>
    </Card>
  );
};

"use client";
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import AbonosPorMesTemplate from "@/components/pdf/templates/AbonosPorMesTemplate";
import CuentasPendientesTemplate from "@/components/pdf/templates/CuentasPendientesTemplate";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { getAbonos } from "@/app/api/abonoService";
import { getCuentas } from "@/app/api/cuentaService";
import { useRefineriaStore } from "@/store/refineriaStore";

const fetchProveedores = async () => {
  const abonosDB = await getAbonos();
  const abonos = abonosDB.abonos || [];
  const proveedoresMap = new Map<string, { label: string; value: string }>();
  abonos.forEach((abono: any) => {
    if (
      abono.idRefineria?.id === useRefineriaStore.getState().activeRefineria?.id &&
      abono.idContrato?.idContacto?.id &&
      abono.idContrato?.idContacto?.nombre
    ) {
      proveedoresMap.set(abono.idContrato.idContacto.id, {
        label: abono.idContrato.idContacto.nombre,
        value: abono.idContrato.idContacto.id,
      });
    }
  });
  return Array.from(proveedoresMap.values());
};

const fetchCuentasPendientes = async () => {
  return await getCuentas();
};

interface ReportesFinacierosListProps {
  tipoReporte: string;
}

const REPORTES = [
  {
    key: "abonosPorFecha",
    label: "Reporte de Abonos por Fecha",
  },
  {
    key: "abonosPorTipoOperacion",
    label: "Abonos por Tipo de Operación",
  },
  {
    key: "abonosPorProveedor",
    label: "Abonos por Proveedor",
  },
  {
    key: "cuentasPendientes",
    label: "Cuentas por Pagar / Cobrar Pendientes",
  },
];

const TIPO_ABONO_OPTIONS = [
  { label: "Abonos de Ingresos", value: "Cuentas por Cobrar" },
  { label: "Abonos de Egresos", value: "Cuentas por Pagar" },
];

const TIPO_OPERACION_OPTIONS = [
  { label: "Efectivo", value: "Efectivo" },
  { label: "Cheque", value: "Cheque" },
  { label: "Deposito", value: "Deposito" },
];

const TIPO_CUENTA_OPTIONS = [
  { label: "Cuentas por Pagar", value: "Cuentas por Pagar" },
  { label: "Cuentas por Cobrar", value: "Cuentas por Cobrar" },
];

const ElegantFormSection: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: "#f8fafc",
      borderRadius: "16px",
      boxShadow: "0 2px 16px 0 #e0e7ef",
      padding: "2rem 2.5rem",
      margin: "0 auto 2rem auto",
      maxWidth: 900,
      border: "1px solid #e0e7ef",
    }}
  >
    {children}
  </div>
);

const ElegantField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div style={{ minWidth: 180, marginBottom: 18 }}>
    <label style={{ fontWeight: 600, color: "#1e293b", marginBottom: 6, display: "block" }}>{label}</label>
    {children}
  </div>
);

const ReportesFinacierosList: React.FC<ReportesFinacierosListProps> = ({ tipoReporte }) => {
  const { activeRefineria } = useRefineriaStore();
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string | null>(null);

  // Estados comunes
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [tipoAbono, setTipoAbono] = useState<string>("Cuentas por Pagar");
  const [tipoOperacion, setTipoOperacion] = useState<string>("Efectivo");
  const [proveedor, setProveedor] = useState<string | null>(null);
  const [proveedores, setProveedores] = useState<{ label: string; value: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [reporteData, setReporteData] = useState<any>(null);

  // Para cuentas pendientes
  const [cuentasPendientes, setCuentasPendientes] = useState<any[]>([]);
  const [tipoCuentaPendiente, setTipoCuentaPendiente] = useState<string>("Cuentas por Pagar");
  const [totalPendiente, setTotalPendiente] = useState<number>(0);

  useEffect(() => {
    const cargarProveedores = async () => {
      const lista = await fetchProveedores();
      setProveedores(lista);
    };
    cargarProveedores();
  }, []);

  const handleGenerarReporte = async () => {
    setLoading(true);
    try {
      const abonosDB = await getAbonos();
      let abonos = abonosDB.abonos || [];
      abonos = abonos.filter(
        (abono: any) =>
          abono.idRefineria?.id === activeRefineria?.id &&
          abono.tipoAbono === tipoAbono &&
          (!fechaInicio || new Date(abono.fecha) >= fechaInicio) &&
          (!fechaFin || new Date(abono.fecha) <= fechaFin)
      );
      setReporteData({
        tipoAbono,
        totalMonto: abonos.reduce((acc: number, ab: any) => acc + (ab.monto ?? 0), 0),
        cantidad: abonos.length,
        abonos,
      });
    } catch (e) {
      setReporteData(null);
    }
    setLoading(false);
  };

  const handleGenerarReportePorTipoOperacion = async () => {
    setLoading(true);
    try {
      const abonosDB = await getAbonos();
      let abonos = abonosDB.abonos || [];
      abonos = abonos.filter(
        (abono: any) =>
          abono.idRefineria?.id === activeRefineria?.id &&
          abono.tipoAbono === tipoAbono &&
          abono.tipoOperacion === tipoOperacion &&
          (!fechaInicio || new Date(abono.fecha) >= fechaInicio) &&
          (!fechaFin || new Date(abono.fecha) <= fechaFin)
      );
      setReporteData({
        tipoAbono,
        tipoOperacion,
        totalMonto: abonos.reduce((acc: number, ab: any) => acc + (ab.monto ?? 0), 0),
        cantidad: abonos.length,
        abonos,
      });
    } catch (e) {
      setReporteData(null);
    }
    setLoading(false);
  };

  const handleGenerarReportePorProveedor = async () => {
    setLoading(true);
    try {
      const abonosDB = await getAbonos();
      let abonos = abonosDB.abonos || [];
      abonos = abonos.filter(
        (abono: any) =>
          abono.idRefineria?.id === activeRefineria?.id &&
          abono.tipoAbono === tipoAbono &&
          (!fechaInicio || new Date(abono.fecha) >= fechaInicio) &&
          (!fechaFin || new Date(abono.fecha) <= fechaFin) &&
          (!proveedor || abono.idContrato?.idContacto?.id === proveedor)
      );
      setReporteData({
        tipoAbono,
        proveedor,
        totalMonto: abonos.reduce((acc: number, ab: any) => acc + (ab.monto ?? 0), 0),
        cantidad: abonos.length,
        abonos,
      });
    } catch (e) {
      setReporteData(null);
    }
    setLoading(false);
  };

  // Nuevo: Cuentas por pagar/cobrar pendientes
  const handleGenerarCuentasPendientes = async () => {
    setLoading(true);
    try {
      // Trae todas las cuentas desde la base de datos
      const cuentasDB = await getCuentas();
      let cuentas = cuentasDB.cuentas || [];

      // Filtra por refinería activa, tipo de cuenta y saldo pendiente
      cuentas = cuentas.filter(
        (cuenta: any) =>
          cuenta.idRefineria?.id === activeRefineria?.id &&
          cuenta.tipoCuenta === tipoCuentaPendiente &&
          Number(cuenta.balancePendiente) > 0
      );

      setCuentasPendientes(cuentas);
      setTotalPendiente(
        cuentas.reduce((acc: number, c: any) => acc + Number(c.balancePendiente ?? 0), 0)
      );
    } catch (e) {
      setCuentasPendientes([]);
      setTotalPendiente(0);
    }
    setLoading(false);
  };

  return (
    <div className="card" style={{ background: "#f1f5f9" }}>
      <h2 className="mb-4 text-2xl font-bold text-center text-primary" style={{ letterSpacing: 1 }}>
        {tipoReporte}
      </h2>

      {/* Selección de reporte */}
      {!reporteSeleccionado && (
        <ElegantFormSection>
          <h3 className="mb-4 text-lg font-semibold text-center" style={{ color: "#2563eb" }}>
            Selecciona un reporte
          </h3>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", flexWrap: "wrap" }}>
            {REPORTES.map((rep) => (
              <Button
                key={rep.key}
                label={rep.label}
                className="p-button-rounded p-button-primary"
                style={{
                  minWidth: 220,
                  fontWeight: 600,
                  fontSize: 16,
                  marginBottom: 8,
                  boxShadow: "0 2px 8px #e0e7ef",
                }}
                onClick={() => {
                  setReporteSeleccionado(rep.key);
                  setReporteData(null);
                  setFechaInicio(null);
                  setFechaFin(null);
                  setProveedor(null);
                  setCuentasPendientes([]);
                }}
              />
            ))}
          </div>
        </ElegantFormSection>
      )}

      {/* Formulario para el reporte de abonos por fecha */}
      {reporteSeleccionado === "abonosPorFecha" && (
        <ElegantFormSection>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <ElegantField label="Tipo de Abono">
              <Dropdown
                value={tipoAbono}
                options={TIPO_ABONO_OPTIONS}
                onChange={(e) => setTipoAbono(e.value)}
                placeholder="Seleccione tipo de abono"
                className="w-full"
              />
            </ElegantField>
            <ElegantField label="Fecha Inicio">
              <Calendar
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.value as Date)}
                dateFormat="yy-mm-dd"
                showIcon
                style={{ width: "100%" }}
              />
            </ElegantField>
            <ElegantField label="Fecha Fin">
              <Calendar
                value={fechaFin}
                onChange={(e) => setFechaFin(e.value as Date)}
                dateFormat="yy-mm-dd"
                showIcon
                style={{ width: "100%" }}
              />
            </ElegantField>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
            <Button
              label="Generar Reporte"
              icon="pi pi-file-pdf"
              onClick={handleGenerarReporte}
              loading={loading}
              disabled={!fechaInicio || !fechaFin}
              className="p-button-rounded p-button-success"
              style={{ minWidth: 180, fontWeight: 600 }}
            />
            <Button
              label="Volver"
              className="p-button-text"
              style={{ minWidth: 120 }}
              onClick={() => {
                setReporteSeleccionado(null);
                setReporteData(null);
                setFechaInicio(null);
                setFechaFin(null);
                setProveedor(null);
              }}
            />
          </div>
          {reporteData && (
            <>
              <div style={{ overflowX: "auto", marginTop: 24 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 1px 8px #e0e7ef",
                  }}
                >
                  <thead style={{ background: "#e3f2fd" }}>
                    <tr>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Fecha</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Contrato</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Proveedor/Cliente</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Tipo Operación</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteData.abonos.map((ab: any) => (
                      <tr key={ab._id}>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {new Date(ab.fecha).toLocaleDateString()}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.idContrato?.numeroContrato}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.idContrato?.idContacto?.nombre}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.tipoOperacion}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd", textAlign: "right" }}>
                          {ab.monto?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: "#e3f2fd" }}>
                      <td colSpan={4} style={{ textAlign: "right", fontWeight: 700, padding: 10 }}>
                        Total:
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#1976d2", padding: 10 }}>
                        {reporteData.totalMonto?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-column align-items-center mt-4">
                <PDFDownloadLink
                  document={
                    <AbonosPorMesTemplate
                      data={reporteData}
                      logoUrl={activeRefineria?.img || "/layout/images/avatarHombre.png"}
                      fechaInicio={fechaInicio ?? undefined}
                      fechaFin={fechaFin ?? undefined}
                      tipoAbono={tipoAbono}
                    />
                  }
                  fileName={`ReporteAbonos_${fechaInicio?.toLocaleDateString()}_${fechaFin?.toLocaleDateString()}.pdf`}
                  className="p-button p-component p-button-success"
                >
                  {({ loading }) =>
                    loading ? <span>Generando PDF...</span> : <span>Descargar Reporte PDF</span>
                  }
                </PDFDownloadLink>
              </div>
            </>
          )}
        </ElegantFormSection>
      )}

      {/* Formulario para el reporte de abonos por tipo de operación */}
      {reporteSeleccionado === "abonosPorTipoOperacion" && (
        <ElegantFormSection>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <ElegantField label="Tipo de Abono">
              <Dropdown
                value={tipoAbono}
                options={TIPO_ABONO_OPTIONS}
                onChange={(e) => setTipoAbono(e.value)}
                placeholder="Seleccione tipo de abono"
                className="w-full"
              />
            </ElegantField>
            <ElegantField label="Tipo de Operación">
              <Dropdown
                value={tipoOperacion}
                options={TIPO_OPERACION_OPTIONS}
                onChange={(e) => setTipoOperacion(e.value)}
                placeholder="Seleccione tipo de operación"
                className="w-full"
              />
            </ElegantField>
            <ElegantField label="Fecha Inicio">
              <Calendar
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.value as Date)}
                dateFormat="yy-mm-dd"
                showIcon
                style={{ width: "100%" }}
              />
            </ElegantField>
            <ElegantField label="Fecha Fin">
              <Calendar
                value={fechaFin}
                onChange={(e) => setFechaFin(e.value as Date)}
                dateFormat="yy-mm-dd"
                showIcon
                style={{ width: "100%" }}
              />
            </ElegantField>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
            <Button
              label="Generar Reporte"
              icon="pi pi-file-pdf"
              onClick={handleGenerarReportePorTipoOperacion}
              loading={loading}
              disabled={!fechaInicio || !fechaFin}
              className="p-button-rounded p-button-success"
              style={{ minWidth: 180, fontWeight: 600 }}
            />
            <Button
              label="Volver"
              className="p-button-text"
              style={{ minWidth: 120 }}
              onClick={() => {
                setReporteSeleccionado(null);
                setReporteData(null);
                setFechaInicio(null);
                setFechaFin(null);
                setProveedor(null);
              }}
            />
          </div>
          {reporteData && (
            <>
              <div style={{ overflowX: "auto", marginTop: 24 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 1px 8px #e0e7ef",
                  }}
                >
                  <thead style={{ background: "#e3f2fd" }}>
                    <tr>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Fecha</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Contrato</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Proveedor/Cliente</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Tipo Operación</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteData.abonos.map((ab: any) => (
                      <tr key={ab._id}>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {new Date(ab.fecha).toLocaleDateString()}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.idContrato?.numeroContrato}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.idContrato?.idContacto?.nombre}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.tipoOperacion}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd", textAlign: "right" }}>
                          {ab.monto?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: "#e3f2fd" }}>
                      <td colSpan={4} style={{ textAlign: "right", fontWeight: 700, padding: 10 }}>
                        Total:
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#1976d2", padding: 10 }}>
                        {reporteData.totalMonto?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-column align-items-center mt-4">
                <PDFDownloadLink
                  document={
                    <AbonosPorMesTemplate
                      data={reporteData}
                      logoUrl={activeRefineria?.img || "/layout/images/avatarHombre.png"}
                      fechaInicio={fechaInicio ?? undefined}
                      fechaFin={fechaFin ?? undefined}
                      tipoAbono={tipoAbono}
                    />
                  }
                  fileName={`ReporteAbonosPorOperacion_${tipoOperacion}_${fechaInicio?.toLocaleDateString()}_${fechaFin?.toLocaleDateString()}.pdf`}
                  className="p-button p-component p-button-success"
                >
                  {({ loading }) =>
                    loading ? <span>Generando PDF...</span> : <span>Descargar Reporte PDF</span>
                  }
                </PDFDownloadLink>
              </div>
            </>
          )}
        </ElegantFormSection>
      )}

      {/* Formulario para el reporte de abonos por proveedor */}
      {reporteSeleccionado === "abonosPorProveedor" && (
        <ElegantFormSection>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", justifyContent: "center" }}>
            <ElegantField label="Proveedor">
              <Dropdown
                value={proveedor}
                options={proveedores}
                onChange={(e) => setProveedor(e.value)}
                placeholder="Seleccione un proveedor"
                className="w-full"
                filter
              />
            </ElegantField>
            <ElegantField label="Tipo de Abono">
              <Dropdown
                value={tipoAbono}
                options={TIPO_ABONO_OPTIONS}
                onChange={(e) => setTipoAbono(e.value)}
                placeholder="Seleccione tipo de abono"
                className="w-full"
              />
            </ElegantField>
            <ElegantField label="Fecha Inicio">
              <Calendar
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.value as Date)}
                dateFormat="yy-mm-dd"
                showIcon
                style={{ width: "100%" }}
              />
            </ElegantField>
            <ElegantField label="Fecha Fin">
              <Calendar
                value={fechaFin}
                onChange={(e) => setFechaFin(e.value as Date)}
                dateFormat="yy-mm-dd"
                showIcon
                style={{ width: "100%" }}
              />
            </ElegantField>
          </div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 24 }}>
            <Button
              label="Generar Reporte"
              icon="pi pi-file-pdf"
              onClick={handleGenerarReportePorProveedor}
              loading={loading}
              disabled={!fechaInicio || !fechaFin || !proveedor}
              className="p-button-rounded p-button-success"
              style={{ minWidth: 180, fontWeight: 600 }}
            />
            <Button
              label="Volver"
              className="p-button-text"
              style={{ minWidth: 120 }}
              onClick={() => {
                setReporteSeleccionado(null);
                setReporteData(null);
                setFechaInicio(null);
                setFechaFin(null);
                setProveedor(null);
              }}
            />
          </div>
          {reporteData && (
            <>
              <div style={{ overflowX: "auto", marginTop: 24 }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 1px 8px #e0e7ef",
                  }}
                >
                  <thead style={{ background: "#e3f2fd" }}>
                    <tr>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Fecha</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Contrato</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Proveedor/Cliente</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Tipo Operación</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Monto</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reporteData.abonos.map((ab: any) => (
                      <tr key={ab._id}>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {new Date(ab.fecha).toLocaleDateString()}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.idContrato?.numeroContrato}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.idContrato?.idContacto?.nombre}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {ab.tipoOperacion}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd", textAlign: "right" }}>
                          {ab.monto?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: "#e3f2fd" }}>
                      <td colSpan={4} style={{ textAlign: "right", fontWeight: 700, padding: 10 }}>
                        Total:
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#1976d2", padding: 10 }}>
                        {reporteData.totalMonto?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-column align-items-center mt-4">
                <PDFDownloadLink
                  document={
                    <AbonosPorMesTemplate
                      data={reporteData}
                      logoUrl={activeRefineria?.img || "/layout/images/avatarHombre.png"}
                      fechaInicio={fechaInicio ?? undefined}
                      fechaFin={fechaFin ?? undefined}
                      tipoAbono={tipoAbono}
                    />
                  }
                  fileName={`ReporteAbonosPorProveedor_${proveedor}_${fechaInicio?.toLocaleDateString()}_${fechaFin?.toLocaleDateString()}.pdf`}
                  className="p-button p-component p-button-success"
                >
                  {({ loading }) =>
                    loading ? <span>Generando PDF...</span> : <span>Descargar Reporte PDF</span>
                  }
                </PDFDownloadLink>
              </div>
            </>
          )}
        </ElegantFormSection>
      )}

      {/* Formulario para el reporte de cuentas pendientes */}
      {reporteSeleccionado === "cuentasPendientes" && (
        <ElegantFormSection>
          <h3 className="mb-4 text-lg font-semibold text-center" style={{ color: "#2563eb" }}>
            Reporte de {tipoCuentaPendiente} Pendientes
          </h3>
          <div style={{ display: "flex", gap: 32, justifyContent: "center", marginBottom: 24 }}>
            <ElegantField label="Tipo de Cuenta">
              <Dropdown
                value={tipoCuentaPendiente}
                options={TIPO_CUENTA_OPTIONS}
                onChange={(e) => setTipoCuentaPendiente(e.value)}
                placeholder="Seleccione tipo de cuenta"
                className="w-full"
              />
            </ElegantField>
            <Button
              label="Generar Reporte"
              icon="pi pi-search"
              onClick={handleGenerarCuentasPendientes}
              loading={loading}
              className="p-button-rounded p-button-success"
              style={{ minWidth: 180, fontWeight: 600, marginTop: 24 }}
            />
          </div>
          {cuentasPendientes.length > 0 && (
            <>
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    background: "#fff",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 1px 8px #e0e7ef",
                  }}
                >
                  <thead style={{ background: "#e3f2fd" }}>
                    <tr>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Contrato</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Descripción</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Cliente/Proveedor</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Monto Total</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Total Abonado</th>
                      <th style={{ padding: 10, borderBottom: "1px solid #bbdefb" }}>Pendiente</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cuentasPendientes.map((c: any) => (
                      <tr key={c._id}>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {c.idContrato?.numeroContrato}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {c.idContrato?.descripcion}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd" }}>
                          {c.idContacto?.nombre}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd", textAlign: "right" }}>
                          {c.montoTotalContrato?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd", textAlign: "right" }}>
                          {c.totalAbonado?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ padding: 8, borderBottom: "1px solid #e3f2fd", textAlign: "right", color: "#d32f2f", fontWeight: 600 }}>
                          {c.balancePendiente?.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                    <tr style={{ background: "#e3f2fd" }}>
                      <td colSpan={5} style={{ textAlign: "right", fontWeight: 700, padding: 10 }}>
                        Total Pendiente:
                      </td>
                      <td style={{ textAlign: "right", fontWeight: 700, color: "#1976d2", padding: 10 }}>
                        {totalPendiente.toLocaleString("es-ES", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="flex flex-column align-items-center mt-4">
                <PDFDownloadLink
                  document={
                    <CuentasPendientesTemplate
                      data={{
                        tipoCuenta: tipoCuentaPendiente,
                        cuentas: cuentasPendientes,
                        totalPendiente: totalPendiente,
                      }}
                      logoUrl={activeRefineria?.img || "/layout/images/avatarHombre.png"}
                    />
                  }
                  fileName={`ReporteCuentasPendientes_${tipoCuentaPendiente}_${new Date().toLocaleDateString()}.pdf`}
                  className="p-button p-component p-button-success"
                >
                  {({ loading }) =>
                    loading ? <span>Generando PDF...</span> : <span>Descargar Reporte PDF</span>
                  }
                </PDFDownloadLink>
              </div>
            </>
          )}
        </ElegantFormSection>
      )}
    </div>
  );
};

export default ReportesFinacierosList;
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

const REPORTES = [
  { key: "abonosPorFecha", label: "Reporte de Abonos por Fecha" },
  { key: "abonosPorTipoOperacion", label: "Abonos por Tipo de Operación" },
  { key: "abonosPorProveedor", label: "Abonos por Proveedor" },
  { key: "cuentasPendientes", label: "Cuentas por Pagar / Cobrar Pendientes" },
  { key: "cuentasPendientesPorProveedor", label: "Cuentas Pendientes por Proveedor/Cliente" }, // Nuevo reporte
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

interface ReportesFinacierosListProps {
  tipoReporte: string;
}

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

  // Para cuentas pendientes por proveedor/cliente
  const [pendienteProveedor, setPendienteProveedor] = useState<string | null>(null);
  const [pendienteProveedores, setPendienteProveedores] = useState<{ label: string; value: string }[]>([]);

  // Visualización previa
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const cargarProveedores = async () => {
      const lista = await fetchProveedores();
      setProveedores(lista);
    };
    cargarProveedores();
  }, []);

  // Cargar proveedores/clientes para cuentas pendientes según tipo de cuenta
  useEffect(() => {
    const cargarPendienteProveedores = async () => {
      const cuentasDB = await getCuentas();
      const cuentas = cuentasDB.cuentas || [];
      const map = new Map<string, { label: string; value: string }>();
      cuentas.forEach((cuenta: any) => {
        if (
          cuenta.idRefineria?.id === activeRefineria?.id &&
          cuenta.tipoCuenta === tipoCuentaPendiente &&
          cuenta.idContacto?.id &&
          cuenta.idContacto?.nombre
        ) {
          map.set(cuenta.idContacto.id, {
            label: cuenta.idContacto.nombre,
            value: cuenta.idContacto.id,
          });
        }
      });
      setPendienteProveedores(Array.from(map.values()));
    };
    if (reporteSeleccionado === "cuentasPendientesPorProveedor" && tipoCuentaPendiente) {
      cargarPendienteProveedores();
      setPendienteProveedor(null);
    }
    // eslint-disable-next-line
  }, [reporteSeleccionado, tipoCuentaPendiente, activeRefineria]);

  // --- TITULO DINÁMICO ---
  const tituloReporte =
    reporteSeleccionado
      ? REPORTES.find(r => r.key === reporteSeleccionado)?.label || tipoReporte
      : tipoReporte;

  // --- HANDLERS ---
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
      setShowPreview(true);
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
      setShowPreview(true);
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
      setShowPreview(true);
    } catch (e) {
      setReporteData(null);
    }
    setLoading(false);
  };

  const handleGenerarCuentasPendientes = async () => {
    setLoading(true);
    try {
      const cuentasDB = await getCuentas();
      let cuentas = cuentasDB.cuentas || [];
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
      setShowPreview(true);
    } catch (e) {
      setCuentasPendientes([]);
      setTotalPendiente(0);
    }
    setLoading(false);
  };

  // Nuevo handler para cuentas pendientes por proveedor/cliente
  const handleGenerarCuentasPendientesPorProveedor = async () => {
    setLoading(true);
    try {
      const cuentasDB = await getCuentas();
      let cuentas = cuentasDB.cuentas || [];
      cuentas = cuentas.filter(
        (cuenta: any) =>
          cuenta.idRefineria?.id === activeRefineria?.id &&
          cuenta.tipoCuenta === tipoCuentaPendiente &&
          Number(cuenta.balancePendiente) > 0 &&
          (!pendienteProveedor || cuenta.idContacto?.id === pendienteProveedor)
      );
      setCuentasPendientes(cuentas);
      setTotalPendiente(
        cuentas.reduce((acc: number, c: any) => acc + Number(c.balancePendiente ?? 0), 0)
      );
      setShowPreview(true);
    } catch (e) {
      setCuentasPendientes([]);
      setTotalPendiente(0);
    }
    setLoading(false);
  };

  // --- RESET ---
  const handleVolver = () => {
    setReporteSeleccionado(null);
    setReporteData(null);
    setFechaInicio(null);
    setFechaFin(null);
    setProveedor(null);
    setCuentasPendientes([]);
    setShowPreview(false);
    setPendienteProveedor(null);
  };

  // --- TABLAS DE VISTA PREVIA ---
  const renderAbonosTable = (data: any) => (
    <div className="overflow-x-auto mt-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <table className="min-w-[900px] w-full text-sm border border-200">
        <thead>
          <tr className="bg-blue-50 text-blue-900">
            <th className="p-2 border-b">Fecha</th>
            <th className="p-2 border-b">Contrato</th>
            <th className="p-2 border-b">Proveedor/Cliente</th>
            <th className="p-2 border-b">Tipo Operación</th>
            <th className="p-2 border-b">Monto</th>
          </tr>
        </thead>
        <tbody>
          {data.abonos.map((ab: any, idx: number) => (
            <tr key={idx} className="hover:bg-blue-50">
              <td className="p-2 border-b">{ab.fecha ? new Date(ab.fecha).toLocaleDateString() : ""}</td>
              <td className="p-2 border-b">{ab.idContrato?.numeroContrato || ""}</td>
              <td className="p-2 border-b">{ab.idContrato?.idContacto?.nombre || ""}</td>
              <td className="p-2 border-b">{ab.tipoOperacion}</td>
              <td className="p-2 border-b">${ab.monto?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-blue-100">
            <td className="p-2 border-t" colSpan={4}>Total</td>
            <td className="p-2 border-t">${data.totalMonto?.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  const renderCuentasPendientesTable = (cuentas: any[], total: number) => (
    <div className="overflow-x-auto mt-4" style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <table className="min-w-[900px] w-full text-sm border border-200">
        <thead>
          <tr className="bg-blue-50 text-blue-900">
            <th className="p-2 border-b">Fecha</th>
            <th className="p-2 border-b">Contrato</th>
            <th className="p-2 border-b">Proveedor/Cliente</th>
            <th className="p-2 border-b">Descripción</th>
            <th className="p-2 border-b">Monto Pendiente</th>
          </tr>
        </thead>
        <tbody>
          {cuentas.map((cuenta: any, idx: number) => (
            <tr key={idx} className="hover:bg-blue-50">
              <td className="p-2 border-b">{cuenta.fecha ? new Date(cuenta.fecha).toLocaleDateString() : ""}</td>
              <td className="p-2 border-b">{cuenta.numeroContrato || cuenta.idContrato?.numeroContrato || ""}</td>
              <td className="p-2 border-b">{cuenta.idContacto?.nombre || ""}</td>
              <td className="p-2 border-b">{cuenta.descripcion || ""}</td>
              <td className="p-2 border-b">${Number(cuenta.balancePendiente).toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-bold bg-blue-100">
            <td className="p-2 border-t" colSpan={4}>Total</td>
            <td className="p-2 border-t">${total.toLocaleString("en-US", { minimumFractionDigits: 2 })}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  // --- RENDER ---
  return (
    <div className="card surface-50 p-4 border-round shadow-2xl" style={{ maxWidth: 1300, margin: "0 auto" }}>
      <h2 className="mb-4 text-2xl font-bold text-center text-primary" style={{ letterSpacing: 1 }}>
        {tituloReporte}
      </h2>

      {/* Selección de reporte */}
      {!reporteSeleccionado && (
        <div className="mb-4">
          <h3 className="mb-4 text-lg font-semibold text-center text-primary">
            Selecciona un reporte
          </h3>
          <div className="flex flex-wrap gap-3 justify-center">
            {REPORTES.map((rep) => (
              <Button
                key={rep.key}
                label={rep.label}
                className="p-button-raised p-button-primary"
                style={{ minWidth: 220, fontWeight: 600, fontSize: 16 }}
                onClick={() => {
                  setReporteSeleccionado(rep.key);
                  setReporteData(null);
                  setFechaInicio(null);
                  setFechaFin(null);
                  setProveedor(null);
                  setCuentasPendientes([]);
                  setShowPreview(false);
                  setPendienteProveedor(null);
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Formulario para el reporte de abonos por fecha */}
      {reporteSeleccionado === "abonosPorFecha" && (
        <div className="mb-4 p-3 bg-white border-round shadow-1">
          {!showPreview ? (
            <>
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Tipo de Abono</label>
                  <Dropdown
                    value={tipoAbono}
                    options={TIPO_ABONO_OPTIONS}
                    onChange={(e) => setTipoAbono(e.value)}
                    placeholder="Seleccione tipo de abono"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Fecha Inicio</label>
                  <Calendar
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.value as Date)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Fecha Fin</label>
                  <Calendar
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.value as Date)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 justify-center mb-4">
                <div className="flex gap-3 justify-center">
                  <Button
                    label="Visualizar Reporte"
                    icon="pi pi-eye"
                    className="p-button-raised p-button-primary"
                    style={{ minWidth: 220, fontWeight: 600, fontSize: 16 }}
                    onClick={handleGenerarReporte}
                    loading={loading}
                    disabled={!fechaInicio || !fechaFin}
                  />
                  <Button
                    label="Volver"
                    icon="pi pi-times"
                    className="p-button-raised"
                    style={{
                      minWidth: 120,
                      background: "#22c55e",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={handleVolver}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {reporteData && renderAbonosTable(reporteData)}
              <div className="flex justify-center mt-4">
                <div className="flex gap-3">
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
                    {({ loading }) => (
                      <span>{loading ? "Generando PDF..." : "Descargar Reporte PDF"}</span>
                    )}
                  </PDFDownloadLink>
                  <Button
                    label="Volver"
                    icon="pi pi-times"
                    className="p-button-raised"
                    style={{
                      minWidth: 120,
                      background: "#ef4444",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={() => setShowPreview(false)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Formulario para el reporte de abonos por tipo de operación */}
      {reporteSeleccionado === "abonosPorTipoOperacion" && (
        <div className="mb-4 p-3 bg-white border-round shadow-1">
          {!showPreview ? (
            <>
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Tipo de Abono</label>
                  <Dropdown
                    value={tipoAbono}
                    options={TIPO_ABONO_OPTIONS}
                    onChange={(e) => setTipoAbono(e.value)}
                    placeholder="Seleccione tipo de abono"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Tipo de Operación</label>
                  <Dropdown
                    value={tipoOperacion}
                    options={TIPO_OPERACION_OPTIONS}
                    onChange={(e) => setTipoOperacion(e.value)}
                    placeholder="Seleccione tipo de operación"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Fecha Inicio</label>
                  <Calendar
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.value as Date)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Fecha Fin</label>
                  <Calendar
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.value as Date)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 justify-center mb-4">
                <div className="flex gap-3 justify-center">
                  <Button
                    label="Visualizar Reporte"
                    icon="pi pi-eye"
                    className="p-button-raised p-button-primary"
                    style={{ minWidth: 220, fontWeight: 600, fontSize: 16 }}
                    onClick={handleGenerarReportePorTipoOperacion}
                    loading={loading}
                    disabled={!fechaInicio || !fechaFin}
                  />
                  <Button
                    label="Volver"
                    icon="pi pi-times"
                    className="p-button-raised"
                    style={{
                      minWidth: 120,
                      background: "#22c55e",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={handleVolver}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {reporteData && renderAbonosTable(reporteData)}
              <div className="flex justify-center mt-4">
                <div className="flex gap-3">
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
                  <Button
                    label="Volver"
                    icon="pi pi-times"
                    className="p-button-raised"
                    style={{
                      minWidth: 120,
                      background: "#ef4444",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={() => setShowPreview(false)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Formulario para el reporte de abonos por proveedor */}
      {reporteSeleccionado === "abonosPorProveedor" && (
        <div className="mb-4 p-3 bg-white border-round shadow-1">
          {!showPreview ? (
            <>
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Proveedor</label>
                  <Dropdown
                    value={proveedor}
                    options={proveedores}
                    onChange={(e) => setProveedor(e.value)}
                    placeholder="Seleccione un proveedor"
                    className="w-full"
                    filter
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Tipo de Abono</label>
                  <Dropdown
                    value={tipoAbono}
                    options={TIPO_ABONO_OPTIONS}
                    onChange={(e) => setTipoAbono(e.value)}
                    placeholder="Seleccione tipo de abono"
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Fecha Inicio</label>
                  <Calendar
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.value as Date)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    className="w-full"
                  />
                </div>
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Fecha Fin</label>
                  <Calendar
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.value as Date)}
                    dateFormat="yy-mm-dd"
                    showIcon
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex flex-col items-center gap-3 justify-center mb-4">
                <div className="flex gap-3 justify-center">
                  <Button
                    label="Visualizar Reporte"
                    icon="pi pi-eye"
                    className="p-button-raised p-button-primary"
                    style={{ minWidth: 220, fontWeight: 600, fontSize: 16 }}
                    onClick={handleGenerarReportePorProveedor}
                    loading={loading}
                    disabled={!fechaInicio || !fechaFin || !proveedor}
                  />
                  <Button
                    label="Volver"
                    icon="pi pi-times"
                    className="p-button-raised"
                    style={{
                      minWidth: 120,
                      background:"#22c55e",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={handleVolver}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {reporteData && renderAbonosTable(reporteData)}
              <div className="flex justify-center mt-4">
                <div className="flex gap-3">
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
                  <Button
                    label="Volver"
                    icon="pi pi-times"
                    className="p-button-raised"
                    style={{
                      minWidth: 120,
                      background: "#ef4444",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={() => setShowPreview(false)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Formulario para el reporte de cuentas pendientes */}
      {reporteSeleccionado === "cuentasPendientes" && (
        <div className="mb-4 p-3 bg-white border-round shadow-1">
          {!showPreview ? (
            <>
              <h3 className="mb-4 text-lg font-semibold text-center text-primary">
                Reporte de {tipoCuentaPendiente} Pendientes
              </h3>
              <div className="flex flex-wrap gap-4 justify-center mb-4">
                <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
                  <label className="font-medium text-900">Tipo de Cuenta</label>
                  <Dropdown
                    value={tipoCuentaPendiente}
                    options={TIPO_CUENTA_OPTIONS}
                    onChange={(e) => setTipoCuentaPendiente(e.value)}
                    placeholder="Seleccione tipo de cuenta"
                    className="w-full"
                  />
                </div>
                <Button
                  label="Visualizar Reporte"
                  icon="pi pi-eye"
                  className="p-button-raised p-button-primary"
                  style={{ minWidth: 220, fontWeight: 600, fontSize: 16, alignSelf: "end" }}
                  onClick={handleGenerarCuentasPendientes}
                  loading={loading}
                />
                <Button
                  label="Volver"
                  icon="pi pi-times"
                  className="p-button-raised"
                  style={{
                    minWidth: 120,
                    background: "#22c55e",
                    border: "none",
                    color: "#fff",
                    alignSelf: "end",
                  }}
                  onClick={handleVolver}
                />
              </div>
            </>
          ) : (
            <>
              {cuentasPendientes.length > 0 && renderCuentasPendientesTable(cuentasPendientes, totalPendiente)}
              <div className="flex justify-center mt-4">
                <div className="flex gap-3">
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
                  <Button
                    label="Volver"
                    icon="pi pi-times"
                    className="p-button-raised"
                    style={{
                      minWidth: 120,
                      background: "#ef4444",
                      border: "none",
                      color: "#fff",
                    }}
                    onClick={() => setShowPreview(false)}
                  />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Nuevo: Formulario para el reporte de cuentas pendientes por proveedor/cliente */}
      {reporteSeleccionado === "cuentasPendientesPorProveedor" && (
  <div className="mb-4 p-3 bg-white border-round shadow-1">
    {!showPreview ? (
      <>
        <h3 className="mb-4 text-lg font-semibold text-center text-primary">
          Reporte de {tipoCuentaPendiente} Pendientes por {tipoCuentaPendiente === "Cuentas por Pagar" ? "Proveedor" : "Cliente"}
        </h3>
        <div className="flex flex-wrap gap-4 justify-center mb-4">
          <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
            <label className="font-medium text-900">Tipo de Cuenta</label>
            <Dropdown
              value={tipoCuentaPendiente}
              options={TIPO_CUENTA_OPTIONS}
              onChange={(e) => setTipoCuentaPendiente(e.value)}
              placeholder="Seleccione tipo de cuenta"
              className="w-full"
            />
          </div>
          {tipoCuentaPendiente && (
            <div className="flex flex-column gap-2" style={{ minWidth: 180 }}>
              <label className="font-medium text-900">
                {tipoCuentaPendiente === "Cuentas por Pagar" ? "Proveedor" : "Cliente"}
              </label>
              <Dropdown
                value={pendienteProveedor}
                options={pendienteProveedores}
                onChange={(e) => setPendienteProveedor(e.value)}
                placeholder={`Seleccione un ${tipoCuentaPendiente === "Cuentas por Pagar" ? "proveedor" : "cliente"}`}
                className="w-full"
                filter
                disabled={pendienteProveedores.length === 0}
              />
            </div>
          )}
          <Button
            label="Visualizar Reporte"
            icon="pi pi-eye"
            className="p-button-raised p-button-primary"
            style={{ minWidth: 220, fontWeight: 600, fontSize: 16, alignSelf: "end" }}
            onClick={handleGenerarCuentasPendientesPorProveedor}
            loading={loading}
            disabled={!tipoCuentaPendiente}
          />
          <Button
            label="Volver"
            icon="pi pi-times"
            className="p-button-raised"
            style={{
              minWidth: 120,
              background: "#22c55e",
              border: "none",
              color: "#fff",
              alignSelf: "end",
            }}
            onClick={handleVolver}
          />
        </div>
      </>
    ) : (
      <>
        {/* Resumen financiero del proveedor/cliente */}
        {pendienteProveedor && cuentasPendientes.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border-round shadow-1 flex flex-wrap gap-4 justify-center">
            <div>
              <strong>{tipoCuentaPendiente === "Cuentas por Pagar" ? "Proveedor" : "Cliente"}:</strong>{" "}
              {cuentasPendientes[0]?.idContacto?.nombre}
            </div>
            <div>
              <strong>Total Cuentas:</strong> {cuentasPendientes.length}
            </div>
            <div>
              <strong>Total Pendiente:</strong> ${totalPendiente.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
          </div>
        )}
        {/* Mostrar la tabla SIEMPRE que existan cuentas */}
        {cuentasPendientes.length > 0 ? (
          renderCuentasPendientesTable(cuentasPendientes, totalPendiente)
        ) : (
          <div className="text-center text-900 font-medium my-4">
            No existen cuentas pendientes para el filtro seleccionado.
          </div>
        )}
        <div className="flex justify-center mt-4">
          <div className="flex gap-3">
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
              fileName={`ReporteCuentasPendientesPorProveedor_${tipoCuentaPendiente}_${pendienteProveedor || "Todos"}_${new Date().toLocaleDateString()}.pdf`}
              className="p-button p-component p-button-success"
            >
              {({ loading }) =>
                loading ? <span>Generando PDF...</span> : <span>Descargar Reporte PDF</span>
              }
            </PDFDownloadLink>
            <Button
              label="Volver"
              icon="pi pi-times"
              className="p-button-raised"
              style={{
                minWidth: 120,
                background: "#ef4444",
                border: "none",
                color: "#fff",
              }}
              onClick={() => setShowPreview(false)}
            />
          </div>
        </div>
      </>
    )}
  </div>
)}
    </div>
  );
};

export default ReportesFinacierosList;
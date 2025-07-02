import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Contrato } from "@/libs/interfaces";

interface ContratoTemplateProps {
  data: Contrato;
  logoUrl: string;
}

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#3498db",
    paddingBottom: 6,
  },
  logo: {
    width: 48,
    height: 48,
    marginRight: 10,
  },
  refineryName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 2,
    textAlign: "left",
  },
  operationNumber: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 2,
    textAlign: "left",
  },
  reportDate: {
    fontSize: 9,
    color: "#888",
    marginBottom: 2,
    textAlign: "left",
  },
  statusBadge: {
    padding: 3,
    borderRadius: 4,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 9,
    minWidth: 60,
    marginTop: 2,
    marginBottom: 2,
    alignSelf: "flex-start",
  },
  statusActive: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #2e7d32",
  },
  statusPending: {
    backgroundColor: "#fff8e1",
    color: "#ff8f00",
    border: "1px solid #ff8f00",
  },
  statusClosed: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    border: "1px solid #c62828",
  },
  section: {
    marginTop: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    borderRadius: 4,
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 11,
    color: "#222",
    textAlign: "left",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  label: {
    width: "38%",
    fontWeight: "bold",
    color: "#555",
    fontSize: 9,
    textAlign: "left",
    paddingRight: 6,
  },
  value: {
    width: "62%",
    fontSize: 9,
    textAlign: "left",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#e3f2fd",
    borderTopWidth: 1,
    borderTopColor: "#bbb",
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
    fontWeight: "bold",
  },
  tableCell: {
    padding: 4,
    fontSize: 9,
    borderRightWidth: 1,
    borderRightColor: "#bbb",
    textAlign: "center",
    overflow: "hidden",
  },
  tableCellLast: {
    padding: 4,
    fontSize: 9,
    textAlign: "center",
    overflow: "hidden",
  },
  signatureContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
    fontSize: 9,
  },
  signatureLabel: {
    marginBottom: 10,
    fontWeight: "bold",
  },
  signatureLine: {
    marginVertical: 10,
    fontSize: 12,
  },
  footer: {
    position: "absolute",
    bottom: 16,
    left: 24,
    right: 24,
    textAlign: "center",
    fontSize: 8,
    color: "#888",
  },
});

const getStatusStyle = (estado: string) => {
  switch (estado?.toLowerCase()) {
    case "activo":
      return styles.statusActive;
    case "pendiente":
      return styles.statusPending;
    case "cerrado":
    case "finalizado":
      return styles.statusClosed;
    default:
      return styles.statusActive;
  }
};

const formatDecimal = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") return "0,00";
  return Number(value).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const ContratoTemplate: React.FC<ContratoTemplateProps> = ({
  data,
  logoUrl,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  // Selecciona el logo de la refinería si existe, si no usa el prop logoUrl, si no, usa el default
  const refineryLogo =
    data.idRefineria?.img &&
    (data.idRefineria.img.startsWith("http") || data.idRefineria.img.startsWith("data:image"))
      ? data.idRefineria.img
      : logoUrl ||
        "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRySSMU9Jhl6Uul6j_Y4raxmNj7y129zSrTBZgVoMDQSk1lsmVvL4GhALZ6p-fpFAMIRvKvgLO6g66LhjfLFEeHS29uIGSHBe0n2k-z5LM";

  return (
    <Document>
      {/* PRIMERA PÁGINA: DATOS DEL CONTACTO Y CONDICIONES DEL CONTRATO */}
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <Image
            src={refineryLogo}
            style={styles.logo}
          />
          <View>
            <Text style={styles.refineryName}>{data.idRefineria?.nombre || "Refinería"}</Text>
            <Text style={styles.operationNumber}>
              Contrato N° {data.numeroContrato}
            </Text>
            <Text style={styles.reportDate}>
              Estado: {data.estadoContrato}
            </Text>
            <View style={[styles.statusBadge, getStatusStyle(data.estadoContrato)]}>
              <Text>{data.estadoContrato?.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        {/* Datos del contacto */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos del Contacto</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Nombre:</Text>
            <Text style={styles.value}>{data.idContacto?.nombre || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Identificación Fiscal:</Text>
            <Text style={styles.value}>{data.idContacto?.identificacionFiscal || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Representante Legal:</Text>
            <Text style={styles.value}>{data.idContacto?.representanteLegal || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Teléfono:</Text>
            <Text style={styles.value}>{data.idContacto?.telefono || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{data.idContacto?.correo || "N/A"}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Dirección:</Text>
            <Text style={styles.value}>{data.idContacto?.direccion || "N/A"}</Text>
          </View>
        </View>

        {/* Condiciones del contrato */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Condiciones del Contrato</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo de Contrato:</Text>
            <Text style={styles.value}>{data.tipoContrato}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Descripción:</Text>
            <Text style={styles.value}>{data.descripcion}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Estado de Entrega:</Text>
            <Text style={styles.value}>{data.estadoEntrega}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Condición de Pago:</Text>
            <Text style={styles.value}>
              {data.condicionesPago?.tipo}{" "}
              {data.condicionesPago && typeof data.condicionesPago.plazo === "number" && data.condicionesPago.plazo > 0
                ? `- ${data.condicionesPago.plazo} días`
                : ""}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Inicio:</Text>
            <Text style={styles.value}>{formatDate(data.fechaInicio)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de Fin:</Text>
            <Text style={styles.value}>{formatDate(data.fechaFin)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Precio Brent Acordado:</Text>
            <Text style={styles.value}>{formatDecimal(data.brent)}</Text>
          </View>
        </View>

        {/* Totales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Totales</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Monto Total:</Text>
            <Text style={styles.value}>{formatDecimal(data.montoTotal)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monto Pagado:</Text>
            <Text style={styles.value}>{formatDecimal(data.montoPagado)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Monto Pendiente:</Text>
            <Text style={styles.value}>{formatDecimal(data.montoPendiente)}</Text>
          </View>
        </View>

        {/* Información de usuario y fechas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Usuario</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Creado por:</Text>
            <Text style={styles.value}>{data.createdBy?.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{data.createdBy?.correo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Creación:</Text>
            <Text style={styles.value}>{formatDate(data.createdAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Actualización:</Text>
            <Text style={styles.value}>{formatDate(data.updatedAt)}</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generado el {formatDate(new Date().toString())} | Página 1 de 2
        </Text>
      </Page>

      {/* SEGUNDA PÁGINA: PRODUCTOS Y MONTOS */}
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2c3e50" }}>
            Productos del Contrato
          </Text>
        </View>

        {/* Tabla de productos - Características */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Características de los Productos</Text>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableCell, flex: 1.1 }}>Producto</Text>
            <Text style={{ ...styles.tableCell, flex: 1 }}>Tipo</Text>
            <Text style={{ ...styles.tableCell, flex: 1 }}>Clasificación</Text>
            <Text style={{ ...styles.tableCell, flex: 0.8 }}>Cantidad</Text>
            <Text style={{ ...styles.tableCell, flex: 0.8 }}>Gravedad API</Text>
            <Text style={{ ...styles.tableCell, flex: 0.8 }}>Azufre (%)</Text>
            <Text style={{ ...styles.tableCell, flex: 0.8 }}>Agua (%)</Text>
            <Text style={{ ...styles.tableCellLast, flex: 1 }}>P. Inflamación (°C)</Text>
          </View>
          {data.idItems?.map((item: any, idx: number) => (
            <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee" }} key={item._id || idx}>
              <Text style={{ ...styles.tableCell, flex: 1.1 }}>
                {item.producto?.nombre}
              </Text>
              <Text style={{ ...styles.tableCell, flex: 1 }}>{item.idTipoProducto?.nombre}</Text>
              <Text style={{ ...styles.tableCell, flex: 1 }}>{item.clasificacion}</Text>
              <Text style={{ ...styles.tableCell, flex: 0.8 }}>{item.cantidad}</Text>
              <Text style={{ ...styles.tableCell, flex: 0.8 }}>{item.gravedadAPI}</Text>
              <Text style={{ ...styles.tableCell, flex: 0.8 }}>{item.azufre}</Text>
              <Text style={{ ...styles.tableCell, flex: 0.8 }}>{item.contenidoAgua}</Text>
              <Text style={{ ...styles.tableCellLast, flex: 1 }}>{item.puntoDeInflamacion}</Text>
            </View>
          ))}
        </View>

        {/* Tabla de productos - Valores Monetarios */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valores Monetarios de los Productos</Text>
          <View style={styles.tableHeader}>
            <Text style={{ ...styles.tableCell, flex: 1.1 }}>Producto</Text>
            <Text style={{ ...styles.tableCell, flex: 0.8 }}>Cantidad (Bbl)</Text>
            <Text style={{ ...styles.tableCell, flex: 1 }}>Precio Unitario</Text>
            <Text style={{ ...styles.tableCell, flex: 1 }}>Convenio</Text>
            <Text style={{ ...styles.tableCell, flex: 1 }}>Transporte</Text>
            <Text style={{ ...styles.tableCellLast, flex: 1 }}>Subtotal</Text>
          </View>
          {data.idItems?.map((item: any, idx: number) => {
            const cantidad = Number(item.cantidad) || 0;
            const precioUnitario = Number(item.precioUnitario) || 0;
            const convenio = Number(item.convenio) || 0;
            const transporte = Number(item.montoTransporte) || 0;
            const subtotal = precioUnitario * cantidad;
            return (
              <View style={{ flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#eee" }} key={item._id || idx}>
                <Text style={{ ...styles.tableCell, flex: 1.1 }}>
                  {item.producto?.nombre}
                </Text>
                <Text style={{ ...styles.tableCell, flex: 0.8 }}>
                  {cantidad.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                <Text style={{ ...styles.tableCell, flex: 1 }}>{formatDecimal(precioUnitario)}</Text>
                <Text style={{ ...styles.tableCell, flex: 1 }}>{formatDecimal(convenio)}</Text>
                <Text style={{ ...styles.tableCell, flex: 1 }}>{formatDecimal(transporte)}</Text>
                <Text style={{ ...styles.tableCellLast, flex: 1 }}>{formatDecimal(subtotal)}</Text>
              </View>
            );
          })}

          {/* Suma de los valores monetarios */}
          {(() => {
            let totalCantidad = 0;
            let totalPrecioUnitario = 0;
            let totalSubtotal = 0;
            data.idItems?.forEach((item: any) => {
              const cantidad = Number(item.cantidad) || 0;
              const precioUnitario = Number(item.precioUnitario) || 0;
              const subtotal = precioUnitario * cantidad;
              totalCantidad += cantidad;
              totalPrecioUnitario += precioUnitario;
              totalSubtotal += subtotal;
            });
            return (
              <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb", backgroundColor: "#f5f5f5" }}>
                <Text style={{ ...styles.tableCell, flex: 1.1, fontWeight: "bold" }}>Totales</Text>
                <Text style={{ ...styles.tableCell, flex: 0.8, fontWeight: "bold" }}>{formatDecimal(totalCantidad)}</Text>
                <Text style={{ ...styles.tableCell, flex: 1, fontWeight: "bold" }}>{formatDecimal(totalPrecioUnitario)}</Text>
                <Text style={{ ...styles.tableCell, flex: 1 }}></Text>
                <Text style={{ ...styles.tableCell, flex: 1 }}></Text>
                <Text style={{ ...styles.tableCellLast, flex: 1, fontWeight: "bold" }}>{formatDecimal(totalSubtotal)}</Text>
              </View>
            );
          })()}
        </View>

        {/* Firmas al final de la segunda página */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Representante Legal</Text>
            <Text style={styles.signatureLine}>___________________________</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Contraparte</Text>
            <Text style={styles.signatureLine}>___________________________</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generado el {formatDate(new Date().toString())} | Página 2 de 2
        </Text>
      </Page>
    </Document>
  );
};

export default ContratoTemplate;
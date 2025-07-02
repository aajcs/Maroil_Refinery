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

interface RecepcionTemplateProps {
  data: any;
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
  statusApproved: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #2e7d32",
  },
  statusRejected: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    border: "1px solid #c62828",
  },
  calidadBox: {
    backgroundColor: "#e3f2fd",
    border: "1px solid #bbdefb",
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    minWidth: 110,
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
    marginBottom: 10,
  },
  calidadLabel: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 6,
    textAlign: "center",
  },
  calidadValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },
  calidadUnidad: {
    fontSize: 10,
    color: "#555",
    marginTop: 4,
    textAlign: "center",
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

const formatDecimal = (value: number | string | undefined) => {
  if (value === undefined || value === null || value === "") return "0,00";
  return Number(value).toLocaleString("es-ES", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
};

const getEstadoColor = (estado: string) => {
  switch ((estado || "").toUpperCase()) {
    case "COMPLETADO":
      return "#2e7d32"; // Verde
    case "EN REFINERIA":
      return "#e6b800"; // Amarillo
    case "CANCELADO":
      return "#c62828"; // Rojo
    default:
      return "#222"; // Negro
  }
};

const RecepcionTemplate: React.FC<RecepcionTemplateProps> = ({
  data,
  logoUrl,
}) => {
  const contrato = data.idContrato || {};
  const producto = contrato.idItems?.[0] || data.idContratoItems || {};

  // Chequeo de calidad/cantidad y estado
  const chequeoCalidad = producto || {};
  const chequeoCantidad = {
    cantidadEsperada: data.cantidadEnviada,
    cantidadRecibida: data.cantidadRecibida,
    aprobado: data.estadoRecepcion?.toLowerCase() === "aprobado",
  };

  return (
    <Document>
      <Page size="A4" orientation="portrait" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <Image
            src={
              logoUrl ||
              "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRySSMU9Jhl6Uul6j_Y4raxmNj7y129zSrTBZgVoMDQSk1lsmVvL4GhALZ6p-fpFAMIRvKvgLO6g66LhjfLFEeHS29uIGSHBe0n2k-z5LM"
            }
            style={styles.logo}
          />
          <View>
            <Text style={styles.refineryName}>{data.idRefineria?.nombre || "Refinería"}</Text>
            <Text style={styles.operationNumber}>
              Recepción N° {data.numeroRecepcion}
            </Text>
            <Text
              style={{
                ...styles.reportDate,
                color: getEstadoColor(data.estadoRecepcion),
                fontWeight: "bold",
              }}
            >
              Estado: {data.estadoRecepcion}
            </Text>
          </View>
        </View>

        {/* Información de la Recepción */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Datos de la Recepción</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#bbb",
              borderRadius: 4,
              marginBottom: 10,
              marginTop: 6,
            }}
          >
            {/* Encabezados */}
            <View style={{ flexDirection: "row", backgroundColor: "#e3f2fd" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbdefb", padding: 4 }}>
                <Text style={{ fontWeight: "bold", fontSize: 9, color: "#222" }}>DATO</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 9, color: "#222" }}>VALOR</Text>
              </View>
            </View>
            {/* Fila Número de Contrato */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Número de Contrato</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{contrato.numeroContrato || "N/A"}</Text>
              </View>
            </View>
            {/* Fila Producto que recibe */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Producto que recibe</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{producto.producto?.nombre || producto.producto || "N/A"}</Text>
              </View>
            </View>
            {/* Fila Cantidad Esperada */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Cantidad Esperada</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{formatDecimal(data.cantidadEnviada)} Bbl</Text>
              </View>
            </View>
            {/* Fila Cantidad Recibida */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Cantidad Recibida</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{formatDecimal(data.cantidadRecibida)} Bbl</Text>
              </View>
            </View>
            {/* Fila ID Guía */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>ID Guía</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{data.idGuia || "N/A"}</Text>
              </View>
            </View>
            {/* Fila Placa */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Placa</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{data.placa || "N/A"}</Text>
              </View>
            </View>
            {/* Fila Nombre del Chofer */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Nombre del Chofer</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{data.nombreChofer || "N/A"}</Text>
              </View>
            </View>
            {/* Fila Fecha de Inicio de Recepción */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Fecha de Inicio de Recepción</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{formatDate(data.fechaInicioRecepcion)}</Text>
              </View>
            </View>
            {/* Fila Fecha Fin de Recepción */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Fecha Fin de Recepción</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{formatDate(data.fechaFinRecepcion)}</Text>
              </View>
            </View>
            {/* Fila Línea de Descarga */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Línea de Descarga</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{data.idLinea?.nombre || "N/A"}</Text>
              </View>
            </View>
            {/* Fila Tanque Destino */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Tanque Destino</Text>
              </View>
              <View style={{ flex: 2, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{data.idTanque?.nombre || "N/A"}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Resultados de Calidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resultados de Calidad</Text>
          <View
            style={{
              borderWidth: 1,
              borderColor: "#bbb",
              borderRadius: 4,
              marginBottom: 10,
              marginTop: 6,
            }}
          >
            {/* Encabezados */}
            <View style={{ flexDirection: "row", backgroundColor: "#e3f2fd" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbdefb", padding: 4 }}>
                <Text style={{ fontWeight: "bold", fontSize: 9, color: "#222" }}>PARÁMETRO</Text>
              </View>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: "#bbdefb", padding: 4, textAlign: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 9, color: "#222" }}>VALOR</Text>
              </View>
              <View style={{ flex: 1, padding: 4, textAlign: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 9, color: "#222" }}>UNIDAD</Text>
              </View>
            </View>
            {/* Fila Gravedad API */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Gravedad API</Text>
              </View>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{chequeoCalidad.gravedadAPI !== undefined ? chequeoCalidad.gravedadAPI : "N/A"}</Text>
              </View>
              <View style={{ flex: 1, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>°API</Text>
              </View>
            </View>
            {/* Fila Azufre */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>% de Azufre</Text>
              </View>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{chequeoCalidad.azufre !== undefined ? chequeoCalidad.azufre : "N/A"}</Text>
              </View>
              <View style={{ flex: 1, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>%</Text>
              </View>
            </View>
            {/* Fila Agua */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Contenido de Agua</Text>
              </View>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{chequeoCalidad.contenidoAgua !== undefined ? chequeoCalidad.contenidoAgua : "N/A"}</Text>
              </View>
              <View style={{ flex: 1, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>%</Text>
              </View>
            </View>
            {/* Fila Punto de Inflamación */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Punto de Inflamación</Text>
              </View>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{chequeoCalidad.puntoDeInflamacion !== undefined ? chequeoCalidad.puntoDeInflamacion : "N/A"}</Text>
              </View>
              <View style={{ flex: 1, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>°C</Text>
              </View>
            </View>
            {/* Fila Índice de Cetano */}
            <View style={{ flexDirection: "row", borderTopWidth: 1, borderTopColor: "#bbb" }}>
              <View style={{ flex: 2, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4 }}>
                <Text style={{ fontSize: 9 }}>Índice de Cetano</Text>
              </View>
              <View style={{ flex: 1, borderRightWidth: 1, borderRightColor: "#bbb", padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}>{chequeoCalidad.cetano !== undefined ? chequeoCalidad.cetano : "N/A"}</Text>
              </View>
              <View style={{ flex: 1, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}></Text>
              </View>
            </View>
          </View>
          {/* Estado de aprobación de calidad */}
          <View style={styles.row}>
            <Text style={styles.label}>¿Aprobado?</Text>
            <View style={[
              styles.statusBadge,
              chequeoCalidad.aprobado ? styles.statusApproved : styles.statusRejected,
            ]}>
              <Text>
                {chequeoCalidad.aprobado ? "APROBADO" : "RECHAZADO"}
              </Text>
            </View>
          </View>
        </View>

        {/* Chequeo de Cantidad */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chequeo de Cantidad</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad Esperada (Bbl):</Text>
            <Text style={styles.value}>{formatDecimal(chequeoCantidad.cantidadEsperada)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Cantidad Recibida (Bbl):</Text>
            <Text style={styles.value}>{formatDecimal(chequeoCantidad.cantidadRecibida)}</Text>
          </View>
        </View>

        {/* Firmas */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Responsable Recepción</Text>
            <Text style={styles.signatureLine}>___________________________</Text>
          </View>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Supervisor</Text>
            <Text style={styles.signatureLine}>___________________________</Text>
          </View>
        </View>

        <Text style={styles.footer}>
          Generado el {formatDate(new Date().toString())} | Página 1 de 1
        </Text>
      </Page>
    </Document>
  );
};

export default RecepcionTemplate;
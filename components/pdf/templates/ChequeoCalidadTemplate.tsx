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
import { ChequeoCalidad } from "@/libs/interfaces";

// Puedes importar estilos globales si los tienes
// import { styles as globalStyles } from "@/utils/pdfStyles";
interface ChequeoCalidadTemplateProps {
  data: ChequeoCalidad;
  logoUrl: string;
}

const styles = StyleSheet.create({
  // ...globalStyles,
  page: {
    padding: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#3498db",
    paddingBottom: 6,
  },
  logoSection: {
    width: "45%",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 4,
    marginLeft: 2,
  },
  refineryName: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 2,
    marginBottom: 1,
  },
  reportInfo: {
    width: "55%",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  operationNumber: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 4,
  },
  reportDate: {
    fontSize: 8,
    color: "#888",
    marginBottom: 4,
  },
  statusBadge: {
    padding: 3,
    borderRadius: 4,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 8,
    minWidth: 60,
  },
  statusApproved: {
    backgroundColor: "#e8f5e9",
    color: "#2e7d32",
    border: "1px solid #2e7d32",
  },
  statusPending: {
    backgroundColor: "#fff8e1",
    color: "#ff8f00",
    border: "1px solid #ff8f00",
  },
  statusRejected: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    border: "1px solid #c62828",
  },
  section: {
    marginTop: 10,
    marginBottom: 6,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  sectionTitle: {
    backgroundColor: "#f5f5f5",
    padding: 5,
    borderRadius: 4,
    marginBottom: 6,
    fontWeight: "bold",
    fontSize: 11,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    color: "#555",
    fontSize: 9,
  },
  value: {
    width: "60%",
    fontSize: 9,
  },
  calidadBox: {
    backgroundColor: "#e3f2fd",
    border: "1px solid #bbdefb",
    borderRadius: 6,
    paddingVertical: 10, // Más pequeño
    paddingHorizontal: 16, // Más pequeño
    minWidth: 110, // Más pequeño
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto",
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
    marginTop: 20,
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

const ChequeoCalidadTemplate: React.FC<ChequeoCalidadTemplateProps> = ({
  data,
  logoUrl,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };
  const getStatusStyle = () => {
    switch (data.estado?.toLowerCase()) {
      case "aprobado":
        return styles.statusApproved;
      case "pendiente":
        return styles.statusPending;
      case "rechazado":
        return styles.statusRejected;
      default:
        return styles.statusApproved;
    }
  };

  const renderTipoEspecifico = () => {
    switch (data.aplicar.tipo.toLowerCase()) {
      case "tanque":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>Tanque:</Text>
              <Text style={styles.value}>
                {data.aplicar.idReferencia.nombre}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>ID Tanque:</Text>
              <Text style={styles.value}>{data.aplicar.idReferencia.id}</Text>
            </View>
          </>
        );
      case "recepcion":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>ID Guía:</Text>
              <Text style={styles.value}>
                {data.aplicar.idReferencia.idGuia}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Recepción:</Text>
              <Text style={styles.value}>{data.aplicar.idReferencia.numeroRecepcion}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Chofer:</Text>
              <Text style={styles.value}>{data.aplicar.idReferencia.nombreChofer}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Placa:</Text>
              <Text style={styles.value}>{data.aplicar.idReferencia.placa}</Text>
            </View>
          </>
        );
      case "despacho":
        return (
          <>
            <View style={styles.row}>
              <Text style={styles.label}>ID Guía:</Text>
              <Text style={styles.value}>
                {data.aplicar.idReferencia.idGuia}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Número de Despacho:</Text>
              <Text style={styles.value}>{data.aplicar.idReferencia.numeroDespacho}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Chofer:</Text>
              <Text style={styles.value}>{data.aplicar.idReferencia.nombreChofer}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Placa:</Text>
              <Text style={styles.value}>{data.aplicar.idReferencia.placa}</Text>
            </View>
          </>
        );
      default:
        return (
          <View style={styles.row}>
            <Text style={styles.label}>Referencia:</Text>
            <Text style={styles.value}>
              {JSON.stringify(data.aplicar.idReferencia)}
            </Text>
          </View>
        );
    }
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Image
              src={
                data.idRefineria.img &&
                (data.idRefineria.img.startsWith("http") ||
                  data.idRefineria.img.startsWith("data:image"))
                  ? data.idRefineria.img
                  : "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRySSMU9Jhl6Uul6j_Y4raxmNj7y129zSrTBZgVoMDQSk1lsmVvL4GhALZ6p-fpFAMIRvKvgLO6g66LhjfLFEeHS29uIGSHBe0n2k-z5LM"
              }
              style={styles.logo}
            />
            <Text style={styles.refineryName}>{data.idRefineria.nombre}</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={{ ...styles.operationNumber, fontSize: 10 }}>
              Operación N° {data.numeroChequeoCalidad}
            </Text>
            <Text style={styles.reportDate}>
              Fecha: {formatDate(data.fechaChequeo)}
            </Text>
            <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text>{data.estado.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2c3e50" }}>
            Chequeo de Calidad
          </Text>
        </View>

        {/* Información principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detalles del Chequeo</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Tipo:</Text>
            <Text style={{ ...styles.value, textTransform: "capitalize" }}>
              {data.aplicar.tipo}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Producto chequeado:</Text>
            <Text style={styles.value}>{data.idProducto?.nombre || "N/A"}</Text>
          </View>
          {renderTipoEspecifico()}
        </View>

        <View style={styles.sectionDivider} />

        {/* Información de calidades */}
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
                <Text style={{ fontSize: 9 }}>{data.gravedadAPI !== undefined ? data.gravedadAPI : "N/A"}</Text>
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
                <Text style={{ fontSize: 9 }}>{data.azufre !== undefined ? data.azufre : "N/A"}</Text>
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
                <Text style={{ fontSize: 9 }}>{data.contenidoAgua !== undefined ? data.contenidoAgua : "N/A"}</Text>
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
                <Text style={{ fontSize: 9 }}>{data.puntoDeInflamacion !== undefined ? data.puntoDeInflamacion : "N/A"}</Text>
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
                <Text style={{ fontSize: 9 }}>{data.cetano !== undefined ? data.cetano : "N/A"}</Text>
              </View>
              <View style={{ flex: 1, padding: 4, textAlign: "center" }}>
                <Text style={{ fontSize: 9 }}></Text>
              </View>
            </View>
          </View>
        </View>


        <View style={styles.sectionDivider} />

        {/* Información de usuario y fechas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información del Usuario</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Realizado por:</Text>
            <Text style={styles.value}>{data.createdBy.nombre}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Correo:</Text>
            <Text style={styles.value}>{data.createdBy.correo}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Fecha de creación:</Text>
            <Text style={styles.value}>{formatDate(data.createdAt)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Última actualización:</Text>
            <Text style={styles.value}>{formatDate(data.updatedAt)}</Text>
          </View>
        </View>

        {/* Firmas */}
        <View style={styles.signatureContainer}>
          <View style={styles.signatureBox}>
            <Text style={styles.signatureLabel}>Responsable de Verificación</Text>
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

export default ChequeoCalidadTemplate;
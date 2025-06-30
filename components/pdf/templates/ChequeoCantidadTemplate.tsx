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
import { styles as globalStyles } from "@/utils/pdfStyles";
import { ChequeoCantidad } from "@/libs/interfaces";

interface ChequeoCantidadTemplateProps {
  data: ChequeoCantidad;
  logoUrl: string;
}

const styles = StyleSheet.create({
  ...globalStyles,
  page: {
    padding: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
    paddingBottom: 12,
  },
  logoSection: {
    width: "45%",
    flexDirection: "column",
    alignItems: "flex-start",
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 6,
    marginLeft: 2,
  },
  refineryName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2c3e50",
    marginLeft: 2,
    marginBottom: 2,
  },
  productName: {
    fontSize: 11,
    color: "#555",
    marginLeft: 2,
    marginBottom: 2,
  },
  reportInfo: {
    width: "55%",
    alignItems: "flex-end",
    flexDirection: "column",
  },
  operationNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3498db",
    marginBottom: 6,
  },
  reportDate: {
    fontSize: 10,
    color: "#888",
    marginBottom: 6,
  },
  statusBadge: {
    padding: 5,
    borderRadius: 4,
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 10,
    minWidth: 80,
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
    marginTop: 18,
    marginBottom: 10,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 15,
  },
  sectionTitle: {
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 4,
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 13,
    color: "#222",
  },
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    color: "#555",
    fontSize: 11,
  },
  value: {
    width: "60%",
    fontSize: 11,
  },
  quantityInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  quantityBox: {
    width: "48%",
    textAlign: "center",
    padding: 10,
    borderRadius: 4,
  },
  expected: {
    backgroundColor: "#e3f2fd",
    border: "1px solid #bbdefb",
  },
  actual: {
    backgroundColor: "#e8f5e9",
    border: "1px solid #c8e6c9",
  },
  differenceText: {
    fontWeight: "bold",
    fontSize: 13,
    textAlign: "center",
    marginTop: 10,
  },
  differenceNote: {
    fontSize: 10,
    color: "#666",
    textAlign: "center",
    marginTop: 2,
  },
  signatureContainer: {
    marginTop: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    width: "100%",
  },
  signatureBox: {
    width: "45%",
    textAlign: "center",
    fontSize: 11,
  },
  signatureLabel: {
    marginBottom: 18,
    fontWeight: "bold",
  },
  signatureLine: {
    marginVertical: 18,
    fontSize: 14,
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 32,
    right: 32,
    textAlign: "center",
    fontSize: 9,
    color: "#888",
  },
});

const ChequeoCantidadTemplate: React.FC<ChequeoCantidadTemplateProps> = ({
  data,
  logoUrl,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  const getStatusStyle = () => {
    switch (data.estado.toLowerCase()) {
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
          <Text style={styles.label}>ID Recepción:</Text>
          <Text style={styles.value}>{data.aplicar.idReferencia.id}</Text>
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
          <Text style={styles.label}>N° Despacho:</Text>
          <Text style={styles.value}>
            {data.aplicar.idReferencia.idGuia}
          </Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>ID Despacho:</Text>
          <Text style={styles.value}>{data.aplicar.idReferencia.id}</Text>
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

  const diferencia = data.numeroChequeoCantidad - data.cantidad;
  const porcentajeDiferencia = (
    (Math.abs(diferencia) / data.numeroChequeoCantidad) *
    100
  ).toFixed(2);
  const diferenciaTexto = `${Math.abs(diferencia)} (${porcentajeDiferencia}%)`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado mejorado */}
        <View style={styles.headerContainer}>
          <View style={styles.logoSection}>
            <Image src={logoUrl} style={styles.logo} />
            <Text style={styles.refineryName}>{data.idRefineria.nombre}</Text>
          </View>
          <View style={styles.reportInfo}>
            <Text style={{ ...styles.operationNumber, fontSize: 10 }}>
              Operación N° {data.id}
            </Text>
            <Text style={styles.reportDate}>
              Chequeo: {formatDate(data.fechaChequeo)}
            </Text>
            <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text>{data.estado.toUpperCase()}</Text>
            </View>
          </View>
        </View>

        <View style={{ alignItems: "center", marginBottom: 18 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", color: "#2c3e50" }}>
            Chequeo de Cantidad
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
          {renderTipoEspecifico()}
          <View style={styles.row}>
            <Text style={styles.label}>Estado:</Text>
            <Text style={{ ...styles.value, textTransform: "capitalize" }}>
              {data.estado}
            </Text>
          </View>
          <View style={styles.row}>
            {/* <Text style={styles.label}>Registro eliminado:</Text>
            <Text style={styles.value}>{data.eliminado ? "Sí" : "No"}</Text> */}
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Información de cantidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verificacion de Cantidades  (Bbl)</Text>
          <View style={styles.quantityInfo}>
            <View style={[styles.quantityBox, styles.expected]}>
              <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>
                Cantidad Esperada
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {data.numeroChequeoCantidad}
              </Text>
            </View>
            <View style={[styles.quantityBox, styles.actual]}>
              <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>
                Cantidad Verificada
              </Text>
              <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                {data.cantidad}
              </Text>
            </View>
          </View>
          <Text style={{ ...styles.differenceText, fontSize: 11, marginTop: 6 }}>
            Diferencia: {diferencia >= 0 ? "+" : "-"}
            {diferenciaTexto} Barriles
          </Text>
          <Text style={{ ...styles.differenceNote, fontSize: 9 }}>
            {data.numeroChequeoCantidad > data.cantidad
              ? "(Faltante)"
              : data.numeroChequeoCantidad < data.cantidad
              ? "(Sobrante)"
              : "(Exacto)"}
          </Text>
        </View>

        <View style={styles.sectionDivider} />

        {/* Información de usuario y fechas (compacta) */}
        <View style={[styles.section, { marginBottom: 0, marginTop: 0, paddingVertical: 0 }]}>
          <Text style={[styles.sectionTitle, { fontSize: 11, marginBottom: 6, padding: 4 }]}>Datos Usuario</Text>
          <View style={[styles.row, { marginBottom: 2 }]}>
            <Text style={[styles.label, { width: "30%", fontSize: 9 }]}>Creado Por:</Text>
            <Text style={[styles.value, { width: "70%", fontSize: 9 }]}>{data.createdBy.nombre}</Text>
          </View>
          <View style={[styles.row, { marginBottom: 2 }]}>
            <Text style={[styles.label, { width: "30%", fontSize: 9 }]}>Correo:</Text>
            <Text style={[styles.value, { width: "70%", fontSize: 9 }]}>{data.createdBy.correo}</Text>
          </View>
          {/* Se removió la información de creado/actualizado para compactar la sección de usuario */}
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

export default ChequeoCantidadTemplate;
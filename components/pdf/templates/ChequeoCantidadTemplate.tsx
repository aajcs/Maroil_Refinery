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

// Crear estilos
const styles = StyleSheet.create({
  ...globalStyles,
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#3498db",
    paddingBottom: 15,
  },
  companyInfo: {
    width: "60%",
  },
  reportInfo: {
    width: "40%",
    alignItems: "flex-end",
  },
  statusBadge: {
    padding: 5,
    borderRadius: 4,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 5,
    fontSize: 10,
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
  row: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    width: "40%",
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    width: "60%",
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
  signatureContainer: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  signatureBox: {
    width: "45%",
    borderTopWidth: 1,
    borderTopColor: "#bfbfbf",
    paddingTop: 10,
    textAlign: "center",
    fontSize: 10,
  },
});

const ChequeoCantidadTemplate: React.FC<{ data: ChequeoCantidad }> = ({
  data,
}) => {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: es });
  };

  // Determinar el estado del badge
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

  // Renderizar información específica según el tipo
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

  // Calcular diferencia
  const diferencia = data.numeroChequeoCantidad - data.cantidad;
  const porcentajeDiferencia = (
    (Math.abs(diferencia) / data.numeroChequeoCantidad) *
    100
  ).toFixed(2);
  const diferenciaTexto = `${Math.abs(diferencia)} (${porcentajeDiferencia}%)`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
          <View style={styles.companyInfo}>
            <Text style={styles.header}>Reporte de Chequeo de Cantidad</Text>
            <Text style={styles.text}>
              Refinería: {data.idRefineria.nombre}
            </Text>
            <Text style={styles.text}>Producto: {data.idProducto.nombre}</Text>
          </View>

          <View style={styles.reportInfo}>
            <Text style={{ ...styles.header, fontSize: 14 }}>N° {data.id}</Text>
            <Text style={{ ...styles.text, fontSize: 10 }}>
              Chequeo: {formatDate(data.fechaChequeo)}
            </Text>
            <View style={[styles.statusBadge, getStatusStyle()]}>
              <Text>{data.estado.toUpperCase()}</Text>
            </View>
          </View>
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
            <Text style={styles.label}>Registro eliminado:</Text>
            <Text style={styles.value}>{data.eliminado ? "Sí" : "No"}</Text>
          </View>
        </View>

        <View style={styles.sectionDivider} />

        {/* Información de cantidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Información de Cantidades</Text>

          <View style={styles.quantityInfo}>
            <View style={[styles.quantityBox, styles.expected]}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                CANTIDAD ESPERADA
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {data.numeroChequeoCantidad}
              </Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>unidades</Text>
            </View>

            <View style={[styles.quantityBox, styles.actual]}>
              <Text style={{ fontWeight: "bold", marginBottom: 5 }}>
                CANTIDAD VERIFICADA
              </Text>
              <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                {data.cantidad}
              </Text>
              <Text style={{ fontSize: 10, marginTop: 5 }}>unidades</Text>
            </View>
          </View>

          <View style={{ marginTop: 15, textAlign: "center" }}>
            <Text style={{ fontWeight: "bold" }}>
              DIFERENCIA: {diferencia >= 0 ? "+" : "-"}
              {diferenciaTexto} unidades
            </Text>
            <Text style={{ fontSize: 10, color: "#666", marginTop: 5 }}>
              {diferencia > 0
                ? "(Sobrante)"
                : diferencia < 0
                ? "(Faltante)"
                : "(Exacto)"}
            </Text>
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
            <Text>Responsable de Verificación</Text>
            <Text>_________________________</Text>
            <Text style={{ marginTop: 5 }}>Nombre y Firma</Text>
          </View>

          <View style={styles.signatureBox}>
            <Text>Supervisor</Text>
            <Text>_________________________</Text>
            <Text style={{ marginTop: 5 }}>Nombre y Firma</Text>
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

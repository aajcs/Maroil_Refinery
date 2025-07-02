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
  productName: {
    fontSize: 9,
    color: "#555",
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
  quantityInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    padding: 6,
    backgroundColor: "#f9f9f9",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  quantityBox: {
    width: "48%",
    textAlign: "center",
    padding: 6,
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
    fontSize: 10,
    textAlign: "center",
    marginTop: 6,
  },
  differenceNote: {
    fontSize: 8,
    color: "#666",
    textAlign: "center",
    marginTop: 1,
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
console.log("Logo:", data.idRefineria.img);
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Encabezado */}
        <View style={styles.headerContainer}>
              <View style={styles.logoSection}>
                {/* Si tu imagen está en base64, asegúrate de que el string incluya el prefijo correcto */}
                <Image
                  src={
                    data.idRefineria.img && (data.idRefineria.img.startsWith("http") || data.idRefineria.img.startsWith("data:image"))
                      ? data.idRefineria.img
                      : "https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRySSMU9Jhl6Uul6j_Y4raxmNj7y129zSrTBZgVoMDQSk1lsmVvL4GhALZ6p-fpFAMIRvKvgLO6g66LhjfLFEeHS29uIGSHBe0n2k-z5LM"
                  }
                  style={styles.logo}
                />
                <Text style={styles.refineryName}>{data.idRefineria.nombre}</Text>
              </View>
          <View style={styles.reportInfo}>
            <Text style={{ ...styles.operationNumber, fontSize: 10 }}>
              Operación N° {data.numeroChequeoCantidad}
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
          <View style={styles.row}>
            <Text style={styles.label}>Producto chequeado:</Text>
            <Text style={styles.value}>{data.idProducto?.nombre || "N/A"}</Text>
          </View>
          {renderTipoEspecifico()}
        </View>

        <View style={styles.sectionDivider} />

         {/* Información de cantidades */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Verificación de Cantidades (Bbl)</Text>
          {data.aplicar.tipo.toLowerCase() === "tanque" ? (
            <View style={{ alignItems: "center", justifyContent: "center", marginVertical: 16 }}>
              <View style={{ 
                backgroundColor: "#e3f2fd", 
                border: "1px solid #bbdefb", 
                borderRadius: 6, 
                paddingVertical: 14, 
                paddingHorizontal: 32, 
                minWidth: 180,
                alignItems: "center",
                justifyContent: "center"
              }}>
                <Text style={{ fontWeight: "bold", fontSize: 13, marginBottom: 6, textAlign: "center" }}>
                  Cantidad
                </Text>
                <Text style={{ fontSize: 22, fontWeight: "bold", color: "#222", textAlign: "center" }}>
                  {data.cantidad?.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) ?? "N/A"}
                </Text>
                <Text style={{ fontSize: 10, color: "#555", marginTop: 4, textAlign: "center" }}>
                  Bbl
                </Text>
              </View>
            </View>
          ) : (
            <>
              <View style={styles.quantityInfo}>
                <View style={[styles.quantityBox, styles.expected]}>
                  <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>
                    Cantidad Esperada
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    {data.aplicar.idReferencia.cantidadEnviada !== undefined
                      ? data.aplicar.idReferencia.cantidadEnviada.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "N/A"}
                  </Text>
                </View>
                <View style={[styles.quantityBox, styles.actual]}>
                  <Text style={{ fontWeight: "bold", fontSize: 11, marginBottom: 2 }}>
                    Cantidad Recibida
                  </Text>
                  <Text style={{ fontSize: 14, fontWeight: "bold" }}>
                    {data.aplicar.idReferencia.cantidadRecibida !== undefined
                      ? data.aplicar.idReferencia.cantidadRecibida.toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : "N/A"}
                  </Text>
                </View>
              </View>
              <Text style={{ ...styles.differenceText, fontSize: 11, marginTop: 6 }}>
                Diferencia: 
                {data.aplicar.idReferencia.cantidadEnviada !== undefined && data.aplicar.idReferencia.cantidadRecibida !== undefined
                  ? `${data.aplicar.idReferencia.cantidadRecibida - data.aplicar.idReferencia.cantidadEnviada >= 0 ? "+" : "-"}${Math.abs(data.aplicar.idReferencia.cantidadRecibida - data.aplicar.idReferencia.cantidadEnviada).toLocaleString("es-VE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${((Math.abs(data.aplicar.idReferencia.cantidadRecibida - data.aplicar.idReferencia.cantidadEnviada) / (data.aplicar.idReferencia.cantidadEnviada || 1)) * 100).toFixed(2).replace('.', ',')}%) Bbl`
                  : "N/A"}
              </Text>
              <Text style={{ ...styles.differenceNote, fontSize: 9 }}>
                {data.aplicar.idReferencia.cantidadEnviada !== undefined && data.aplicar.idReferencia.cantidadRecibida !== undefined ? (
                  data.aplicar.idReferencia.cantidadEnviada > data.aplicar.idReferencia.cantidadRecibida ? (
                    <Text style={{ color: "#c62828", fontWeight: "bold" }}>Faltante</Text>
                  ) : data.aplicar.idReferencia.cantidadEnviada < data.aplicar.idReferencia.cantidadRecibida ? (
                    <Text style={{ color: "#2e7d32", fontWeight: "bold" }}>Sobrante</Text>
                  ) : (
                    <Text style={{ color: "#666" }}>(Exacto)</Text>
                  )
                ) : null}
              </Text>
            </>
          )}
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
        </View>

        <View style={{ height: 26 }} />

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
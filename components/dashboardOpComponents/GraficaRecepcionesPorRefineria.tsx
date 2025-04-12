// import React, { useEffect, useState } from "react";
// import { Chart } from "primereact/chart";
// import { Card } from "primereact/card";
// import { Dropdown } from "primereact/dropdown";
// import {
//   format,
//   parseISO,
//   startOfMonth,
//   endOfMonth,
//   eachMonthOfInterval,
//   getYear,
//   subMonths,
// } from "date-fns";

// const GraficaRecepcionesPorRefineria = ({ recepcions }: any) => {
//   const [chartData, setChartData] = useState({});
//   const [chartOptions, setChartOptions] = useState({});
//   const [annualChartData, setAnnualChartData] = useState({});
//   const [selectedMonth, setSelectedMonth] = useState(null);
//   const [availableMonths, setAvailableMonths] = useState([]);
//   const [monthTotals, setMonthTotals] = useState({
//     enviados: 0,
//     recibidos: 0,
//     recepciones: 0,
//   });
//   const [historico, setHistorico] = useState({});
//   const [refineriasData, setRefineriasData] = useState([]);

//   // Estilos para tarjetas
//   const cardStyle = {
//     borderLeft: "4px solid",
//     margin: "0.5rem",
//     padding: "1rem",
//   };

//   // Procesar datos históricos
//   const procesarHistorico = () => {
//     const datosHistoricos = recepcions.reduce((acc, recepcion) => {
//       const fecha = parseISO(recepcion.fechaInicioRecepcion);
//       const mes = startOfMonth(fecha);
//       const refineria = recepcion.idRefineria.nombre;

//       if (!acc[refineria]) acc[refineria] = {};

//       acc[refineria][mes] = {
//         enviado:
//           (acc[refineria][mes]?.enviado || 0) + recepcion.cantidadEnviada,
//         recibido:
//           (acc[refineria][mes]?.recibido || 0) + recepcion.cantidadRecibida,
//         recepciones: (acc[refineria][mes]?.recepciones || 0) + 1,
//       };

//       return acc;
//     }, {});

//     setHistorico(datosHistoricos);
//   };

//   // Calcular diferencias porcentuales
//   const calcularDiferencia = (actual, anterior) => {
//     if (anterior === 0) return actual > 0 ? 100 : 0;
//     return ((actual - anterior) / anterior) * 100;
//   };

//   // Color para indicadores
//   const getColor = (valor) => (valor >= 0 ? "#22C55E" : "#EF4444");

//   useEffect(() => {
//     procesarHistorico();
//   }, [recepcions]);

//   // Procesar meses disponibles
//   useEffect(() => {
//     if (!recepcions?.length) return;

//     const procesarMesesDisponibles = () => {
//       const fechas = recepcions.map((r) => parseISO(r.fechaInicioRecepcion));
//       const meses = eachMonthOfInterval({
//         start: fechas.reduce((a, b) => (a < b ? a : b)),
//         end: fechas.reduce((a, b) => (a > b ? a : b)),
//       });

//       const opcionesMeses = meses.map((mes) => ({
//         label: format(mes, "MMMM yyyy"),
//         value: mes,
//       }));

//       setAvailableMonths(opcionesMeses);
//       setSelectedMonth(opcionesMeses[0]?.value || null);
//     };

//     procesarMesesDisponibles();
//     setAnnualChartData(procesarDatosAnuales());
//   }, [recepcions]);

//   // Actualizar datos mensuales
//   useEffect(() => {
//     if (!selectedMonth || !recepcions?.length) return;

//     const mesInicio = startOfMonth(selectedMonth);
//     const mesFin = endOfMonth(selectedMonth);

//     const datosFiltrados = recepcions.filter((r) => {
//       const fecha = parseISO(r.fechaInicioRecepcion);
//       return fecha >= mesInicio && fecha <= mesFin;
//     });

//     // Calcular totales del mes
//     const totals = datosFiltrados.reduce(
//       (acc, recepcion) => ({
//         enviados: acc.enviados + recepcion.cantidadEnviada,
//         recibidos: acc.recibidos + recepcion.cantidadRecibida,
//         recepciones: acc.recepciones + 1,
//       }),
//       { enviados: 0, recibidos: 0, recepciones: 0 }
//     );

//     setMonthTotals(totals);
//   }, [selectedMonth, recepcions]);

//   // Actualizar datos por refinería
//   useEffect(() => {
//     if (!selectedMonth || !historico) return;

//     const mesActual = startOfMonth(selectedMonth);
//     const mesAnterior = subMonths(mesActual, 1);

//     const nuevasRefineriasData = Object.keys(historico).map((refineria) => {
//       const datosActual = historico[refineria][mesActual] || {
//         enviado: 0,
//         recibido: 0,
//         recepciones: 0,
//       };
//       const datosAnterior = historico[refineria][mesAnterior] || {
//         enviado: 0,
//         recibido: 0,
//         recepciones: 0,
//       };

//       return {
//         nombre: refineria,
//         ...datosActual,
//         diferenciaPorcentaje: {
//           enviado: calcularDiferencia(
//             datosActual.enviado,
//             datosAnterior.enviado
//           ),
//           recibido: calcularDiferencia(
//             datosActual.recibido,
//             datosAnterior.recibido
//           ),
//           recepciones: calcularDiferencia(
//             datosActual.recepciones,
//             datosAnterior.recepciones
//           ),
//         },
//       };
//     });

//     setRefineriasData(nuevasRefineriasData);
//   }, [selectedMonth, historico]);

//   // Procesar datos para gráfico anual
//   // Nuevos colores para las refinerías
//   const colorPalette = [
//     "#42A5F5",
//     "#66BB6A",
//     "#FFA726",
//     "#EC407A",
//     "#AB47BC",
//     "#26A69A",
//   ];

//   const procesarDatosAnuales = () => {
//     const mesesDelAño = Array.from({ length: 12 }, (_, i) =>
//       format(new Date().setMonth(i), "MMM")
//     );

//     const refinerias = [
//       ...new Set(recepcions.map((r) => r.idRefineria.nombre)),
//     ];

//     // Estructura base para los datos
//     const datos = mesesDelAño.reduce((acc, mes) => {
//       acc[mes] = refinerias.reduce(
//         (refAcc, refineria) => ({
//           ...refAcc,
//           [refineria]: { enviados: 0, recibidos: 0 },
//         }),
//         {}
//       );
//       return acc;
//     }, {});

//     // Llenar datos reales
//     recepcions.forEach((recepcion) => {
//       const mes = format(parseISO(recepcion.fechaInicioRecepcion), "MMM");
//       const refineria = recepcion.idRefineria.nombre;

//       if (datos[mes] && datos[mes][refineria]) {
//         datos[mes][refineria].enviados += recepcion.cantidadEnviada;
//         datos[mes][refineria].recibidos += recepcion.cantidadRecibida;
//       }
//     });

//     // Crear datasets
//     const datasets = refinerias.flatMap((refineria, index) => [
//       {
//         label: `${refineria} - Enviados`,
//         data: mesesDelAño.map((mes) => datos[mes][refineria].enviados),
//         borderColor: colorPalette[index],
//         tension: 0.4,
//         borderWidth: 2,
//         fill: false,
//       },
//       {
//         label: `${refineria} - Recibidos`,
//         data: mesesDelAño.map((mes) => datos[mes][refineria].recibidos),
//         borderColor: colorPalette[index],
//         borderDash: [5, 5],
//         tension: 0.4,
//         borderWidth: 2,
//         fill: false,
//       },
//     ]);

//     return {
//       labels: mesesDelAño,
//       datasets: datasets,
//     };
//   };

//   // Opciones actualizadas
//   const annualChartOptions = {
//     responsive: true,
//     maintainAspectRatio: false,
//     plugins: {
//       legend: {
//         position: "top",
//         labels: {
//           boxWidth: 12,
//           padding: 16,
//         },
//       },
//       tooltip: {
//         callbacks: {
//           title: (context) => `Mes: ${context[0].label}`,
//           label: (context) => {
//             const labelParts = context.dataset.label.split(" - ");
//             return `${labelParts[0]} (${
//               labelParts[1]
//             }): ${context.parsed.y.toLocaleString()} Barriles`;
//           },
//         },
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//         title: {
//           display: true,
//           text: "Barriles",
//         },
//       },
//     },
//   };
//   return (
//     <div className="fluid">
//       <div className="grid m-4">
//         {/* Selector de Mes */}
//         <div className="col-12 md:col-3 lg:col-2">
//           <Card title="Selección de Mes" className="mb-4">
//             <Dropdown
//               value={selectedMonth}
//               options={availableMonths}
//               onChange={(e) => setSelectedMonth(e.value)}
//               optionLabel="label"
//               placeholder="Seleccione un mes"
//               style={{ width: "100%" }}
//             />
//           </Card>
//         </div>

//         {/* Tarjetas de Refinerías */}
//         <div className="col-12 md:col-9 lg:col-10">
//           <div className="grid">
//             {refineriasData.map((refineria, index) => (
//               <div className="col-12 md:col-6 lg:col-4" key={index}>
//                 <div className="p-2">
//                   <div
//                     className="card p-3"
//                     style={{
//                       borderLeft: `4px solid ${
//                         index % 2 ? "#42A5F5" : "#66BB6A"
//                       }`,
//                       borderRadius: "8px",
//                       boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
//                     }}
//                   >
//                     <div className="flex justify-content-between align-items-center mb-3">
//                       <h5 style={{ margin: 0 }}>{refineria.nombre}</h5>
//                     </div>

//                     <div className="grid">
//                       <div className="col-12">
//                         <div className="flex justify-content-between mb-2">
//                           <span>Enviado:</span>
//                           <div>
//                             <strong>
//                               {refineria.enviado.toLocaleString()}
//                             </strong>
//                             <span
//                               style={{
//                                 color: getColor(
//                                   refineria.diferenciaPorcentaje.enviado
//                                 ),
//                                 marginLeft: "0.5rem",
//                                 fontSize: "0.9em",
//                               }}
//                             >
//                               (
//                               {refineria.diferenciaPorcentaje.enviado.toFixed(
//                                 1
//                               )}
//                               %)
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex justify-content-between mb-2">
//                           <span>Recibido:</span>
//                           <div>
//                             <strong>
//                               {refineria.recibido.toLocaleString()}
//                             </strong>
//                             <span
//                               style={{
//                                 color: getColor(
//                                   refineria.diferenciaPorcentaje.recibido
//                                 ),
//                                 marginLeft: "0.5rem",
//                                 fontSize: "0.9em",
//                               }}
//                             >
//                               (
//                               {refineria.diferenciaPorcentaje.recibido.toFixed(
//                                 1
//                               )}
//                               %)
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex justify-content-between">
//                           <span>Recepciones:</span>
//                           <div>
//                             <strong>{refineria.recepciones}</strong>
//                             <span
//                               style={{
//                                 color: getColor(
//                                   refineria.diferenciaPorcentaje.recepciones
//                                 ),
//                                 marginLeft: "0.5rem",
//                                 fontSize: "0.9em",
//                               }}
//                             >
//                               (
//                               {refineria.diferenciaPorcentaje.recepciones.toFixed(
//                                 1
//                               )}
//                               %)
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Gráfico Anual */}
//       <div className="grid m-4">
//         <div className="col-12">
//           <Card
//             title={`Comportamiento Anual de recepcion de materia prima ${getYear(
//               new Date()
//             )}`}
//           >
//             <div>
//               <Chart
//                 type="line"
//                 data={annualChartData}
//                 options={annualChartOptions}
//                 style={{ minHeight: "300px" }}
//               />
//             </div>
//             <div className="text-center mt-3">
//               <small className="text-secondary">
//                 Línea continua: Enviados | Línea punteada: Recibidos
//               </small>
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GraficaRecepcionesPorRefineria;

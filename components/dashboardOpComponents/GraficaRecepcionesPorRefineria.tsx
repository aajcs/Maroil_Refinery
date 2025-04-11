"use client";
import React, { useEffect, useState } from "react";
import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import { classNames } from "primereact/utils";

interface Recepcion {
  idRefineria: {
    nombre: string;
  };
  cantidadEnviada: number;
  cantidadRecibida: number;
}

interface GraficaRecepcionesPorRefineriaProps {
  recepcions: Recepcion[];
}

const GraficaRecepcionesPorRefineria: React.FC<
  GraficaRecepcionesPorRefineriaProps
> = ({ recepcions }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const procesarDatos = () => {
      const datosPorRefineria = recepcions.reduce(
        (
          acc: {
            [key: string]: {
              cantidadEnviada: number;
              cantidadRecibida: number;
              recepciones: number;
            };
          },
          recepcion
        ) => {
          const nombreRefineria = recepcion.idRefineria.nombre;

          if (!acc[nombreRefineria]) {
            acc[nombreRefineria] = {
              cantidadEnviada: 0,
              cantidadRecibida: 0,
              recepciones: 0,
            };
          }

          acc[nombreRefineria].cantidadEnviada += recepcion.cantidadEnviada;
          acc[nombreRefineria].cantidadRecibida += recepcion.cantidadRecibida;
          acc[nombreRefineria].recepciones++;

          return acc;
        },
        {}
      );

      const labels = Object.keys(datosPorRefineria);
      const datosEnviados = labels.map(
        (label) => datosPorRefineria[label].cantidadEnviada
      );
      const datosRecibidos = labels.map(
        (label) => datosPorRefineria[label].cantidadRecibida
      );

      const data = {
        labels: labels,
        datasets: [
          {
            label: "Cantidad Enviada",
            data: datosEnviados,
            backgroundColor: "#42A5F5",
          },
          {
            label: "Cantidad Recibida",
            data: datosRecibidos,
            backgroundColor: "#66BB6A",
          },
        ],
      };

      const options = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: false,
          },
          y: {
            stacked: false,
            beginAtZero: true,
          },
        },
      };

      setChartData(data);
      setChartOptions(options);
    };

    procesarDatos();
  }, [recepcions]);

  return (
    <div className="p-d-flex p-jc-center">
      <div className="p-col-12 p-lg-10">
        <Card title="Recepciones por Refinería" className="p-m-4">
          <div
            className={classNames("p-d-flex p-jc-center")}
            style={{ height: "400px" }}
          >
            <Chart
              type="bar"
              data={chartData}
              options={chartOptions}
              style={{ width: "100%" }}
            />
          </div>

          <div className="p-mt-4 p-text-center">
            <span className="p-mr-4">
              <i className="pi pi-circle-fill" style={{ color: "#42A5F5" }}></i>{" "}
              Cantidad Enviada
            </span>
            <span>
              <i className="pi pi-circle-fill" style={{ color: "#66BB6A" }}></i>{" "}
              Cantidad Recibida
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default GraficaRecepcionesPorRefineria;

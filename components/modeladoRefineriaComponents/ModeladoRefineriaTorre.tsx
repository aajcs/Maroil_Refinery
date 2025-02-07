import React, { useEffect, useState, SVGProps } from "react";
import ModeladoRefineriaTorreSVG from "./ModeladoRefineriaTorreSVG";
import ModeladoRefineriaTuberiaMaterial from "./ModeladoRefineriaTuberiaMaterial";
interface TorreProps {
  torre: {
    id: string;
    nombre: string;
    estado: boolean;
    eliminado: boolean;
    ubicacion: string;
    material: {
      estadoMaterial: string;
      posicion: string;
      nombre: string;
    }[];
    createdAt: string;
    updatedAt: string;
    id_refineria: {
      _id: string | undefined;
      nombre: string;
    };
  };
}
function ModeladoRefineriaTorre(
  { torre }: TorreProps,
  props: SVGProps<SVGSVGElement>
) {
  console.log(torre);
  const [apiData, setApiData] = useState({
    sections: torre.material.map((material) => ({
      name: material.nombre,
      operational: material.estadoMaterial === "True" ? true : false,
      bblPerHour: 0,
    })),
  });

  //   useEffect(() => {
  //     const fetchData = () => {
  //       setTimeout(() => {
  //         setApiData({
  //           sections: apiData.sections.map((section) => ({
  //             ...section,
  //             operational: Math.random() > 0.5,
  //             bblPerHour: Math.floor(Math.random() * 500 + 100),
  //           })),
  //         });
  //       }, 2000);
  //     };

  //     fetchData();
  //     const interval = setInterval(fetchData, 5000);
  //     return () => clearInterval(interval);
  //   }, [torre]);

  const towerHeight = 380;
  const towerWidth = 100;
  const towerX = 150;
  const towerY = 80;
  const sectionHeight = towerHeight / apiData.sections.length;
  const radius = towerWidth / 2;
  function getFillColor(material: string): string {
    switch (material.toLowerCase()) {
      case "nafta":
        return "#add8e6"; // Azul claro / Celeste
      case "fuel oil 4 (mog)":
        return "#556b2f"; // Verde oscuro / Verde oliva
      case "fuel oil 6 (fondo)":
        return "#654321"; // Marrón oscuro / Negro
      case "queroseno":
        return "#ffd700"; // Amarillo / Dorado
      case "petroleo crudo":
        return "#000000"; // Negro / Marrón muy oscuro
      default:
        return "#aaaaaa"; // Color por defecto
    }
  }

  return (
    <svg
      width="200"
      height="300"
      viewBox="100 100 300 300"
      // className="card m-0 p-0"
      id="e73Ach9EHV41"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      project-id="1041a76c2f17444290a8b82eb9ff7078"
      export-id="953efd2ad32d4eb5816f3fcb3b964593"
      // cached="false"
      {...props}
    >
      <defs>
        {/* Gradiente para la torre */}
        <radialGradient id="cylinderGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0e0e0" /> {/* Gris claro */}
          <stop offset="100%" stopColor="#a0a0a0" /> {/* Gris oscuro */}
        </radialGradient>

        {/* Gradientes para las secciones (de rojo a naranja) */}
        {apiData.sections.map((_, index) => {
          const color = getFillColor(torre.material[index].nombre); // Obtén el color basado en el material
          return (
            <linearGradient
              key={`sectionGradient${index}`}
              id={`sectionGradient${index}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} /> {/* Color principal */}
              <stop offset="100%" stopColor={`${color}80`} />{" "}
              {/* Color con transparencia */}
            </linearGradient>
          );
        })}
      </defs>
      {/* Torre */}
      <ModeladoRefineriaTorreSVG />
      {/* Secciones */}
      {apiData.sections.map((section, index) => {
        const sectionY = towerY + index * sectionHeight;
        return (
          <g key={section.name}>
            <rect
              x={towerX + 15}
              y={sectionY + 5}
              width={towerWidth - 30}
              height={sectionHeight - 10}
              fill={
                section.operational ? `url(#sectionGradient${index})` : "#ddd"
              }
              opacity={section.operational ? "1" : "0.4"}
              stroke="black"
              strokeWidth="1"
              rx="10"
            />

            {/* Tubería */}

            {/* Conector */}
            {/* <g transform="0 0"> */}
            {/* <g
              transform={`translate(${towerX - 78}, ${
                sectionY + 0.5 * sectionHeight + 12
              }) scale(1.2)`}
            >
              <g transform="matrix(5.209884 0 0-5.20991-1472.67914 1768.349123)">
                <path
                  d="M312.485,311.823h-18.679v-.992h18.679v.992Z"
                  fill="#707070"
                />
                <path
                  d="M312.884,311.305h-19.476c-.187,0-.338-.151-.338-.338s.151-.338.338-.338h19.476c.186,0,.338.151.338.338s-.152.338-.338.338Z"
                  fill="#a0a09d"
                />
              </g>
            </g> */}
            <path
              d={`M ${towerX + towerWidth - 110} ${
                sectionY + sectionHeight
              } L ${towerX + towerWidth + 10} ${sectionY + sectionHeight}`}
              stroke="#707070"
              strokeWidth="3"
            />
            <path
              d={`M ${towerX + towerWidth - 110} ${
                sectionY + sectionHeight - 3
              } L ${towerX + towerWidth + 10} ${sectionY + sectionHeight - 3}`}
              stroke="#a0a09d"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* </g> */}
            <ModeladoRefineriaTuberiaMaterial
              x={towerX + towerWidth + 35}
              y={sectionY + sectionHeight / 2 + 10}
            />
            <text
              x={towerX + towerWidth + 35}
              y={sectionY + sectionHeight / 2 - 5}
              fill="black"
              fontSize="18"
              fontWeight="bold"
            >
              {section.name}
            </text>

            <text
              x={towerX + towerWidth + 35}
              y={sectionY + sectionHeight / 2 + 10}
              fill="black"
              fontSize="18"
            >
              {section.operational ? "Operativa" : "Inactiva"}
            </text>

            <text
              x={towerX + towerWidth + 35}
              y={sectionY + sectionHeight / 2 + 25}
              fill="black"
              fontSize="18"
            >
              {section.bblPerHour} bbl/h
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default ModeladoRefineriaTorre;

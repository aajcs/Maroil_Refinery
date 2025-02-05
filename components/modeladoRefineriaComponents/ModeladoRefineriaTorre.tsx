import React, { useEffect, useState } from "react";

interface TorreProps {
  torre: {
    id: string;
    nombre: string;
    estado: boolean;
    eliminado: boolean;
    ubicacion: string;
    material: string[];
    createdAt: string;
    updatedAt: string;
    id_refineria: {
      _id: string | undefined;
      nombre: string;
    };
  };
}
function ModeladoRefineriaTorre({ torre }: TorreProps) {
  console.log(torre);
  const [apiData, setApiData] = useState({
    sections: torre.material.map((material) => ({
      name: material,
      operational: torre.estado,
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

  const towerHeight = 400;
  const towerWidth = 100;
  const towerX = 150;
  const towerY = 50;
  const sectionHeight = towerHeight / apiData.sections.length;
  const radius = towerWidth / 2;

  return (
    <svg
      width="200"
      height="300"
      viewBox="100 100 300 300"
      style={{ border: "1px solid #ccc" }}
    >
      <defs>
        {/* Gradiente para la torre */}
        <radialGradient id="cylinderGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0e0e0" /> {/* Gris claro */}
          <stop offset="100%" stopColor="#a0a0a0" /> {/* Gris oscuro */}
        </radialGradient>

        {/* Gradientes para las secciones (de rojo a naranja) */}
        {apiData.sections.map((_, index) => {
          const redIntensity = 150 + index * 20; // Rojo más intenso en la parte superior
          const orangeIntensity = 255 - index * 30; // Naranja más claro en la parte inferior
          return (
            <linearGradient
              key={`sectionGradient${index}`}
              id={`sectionGradient${index}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={`rgb(255, ${orangeIntensity}, 0)`} />{" "}
              {/* Rojo oscuro */}
              <stop offset="100%" stopColor={`rgb(${redIntensity}, 0, 0)`} />
              {/* Naranja claro */}
            </linearGradient>
          );
        })}
      </defs>

      {/* Parte superior redondeada */}
      <ellipse
        cx={towerX + radius}
        cy={towerY + 5}
        rx={radius}
        ry={25}
        fill="#a0a0a0"
        stroke="black"
        strokeWidth="2"
      />

      {/* Torre cilíndrica */}
      <rect
        x={towerX}
        y={towerY}
        width={towerWidth}
        height={towerHeight}
        fill="url(#cylinderGradient)"
        stroke="black"
        strokeWidth="2"
      />

      {/* Base de la torre */}
      <ellipse
        cx={towerX + radius}
        cy={towerY + towerHeight}
        rx={radius + 20}
        ry={10}
        fill="#808080"
        stroke="black"
        strokeWidth="2"
      />

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
            {/* Fondo gris */}
            <line
              x1={towerX + towerWidth}
              y1={sectionY + sectionHeight / 2}
              x2={towerX + towerWidth + 30}
              y2={sectionY + sectionHeight / 2}
              stroke="#000000"
              strokeWidth="8"
            />

            {/* Línea negra */}
            <line
              x1={towerX + towerWidth}
              y1={sectionY + sectionHeight / 2}
              x2={towerX + towerWidth + 30}
              y2={sectionY + sectionHeight / 2}
              stroke="#cccccc"
              strokeWidth="4"
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

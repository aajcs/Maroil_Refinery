"use client";
import { useEffect, useState } from "react";

interface TanqueProps {
  tanque: {
    id: string;
    almacenamiento: number;
    capacidad: number;
    nombre: string;
    material: string[]; // Ahora es un array de strings
  };
}

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
      return "#cccccc"; // Color por defecto
  }
}

function ModeladoRefineriaTanque({ tanque }: TanqueProps) {
  const [apiData, setApiData] = useState({ tankLevel: 0 }); // Nivel inicial

  // Simulación de la API (puedes reemplazar con tu llamada real)
  useEffect(() => {
    if (tanque && tanque.capacidad > 0) {
      const tanqueLevel = (
        (tanque.almacenamiento / tanque.capacidad) *
        100
      ).toFixed(2);
      setApiData({ tankLevel: parseFloat(tanqueLevel) });
    }
  }, [tanque]);

  // Definiciones de posiciones:
  const bottomY = 250; // parte inferior del tanque
  const tankHeight = 150; // altura conceptual (de y = 100 a y = 250)
  // Calcular la altura del relleno según el nivel (en px)
  const fillHeight = (apiData.tankLevel / 100) * tankHeight;
  // La coordenada Y del nivel de líquido
  const waterLevelY = bottomY - fillHeight;

  // Obtener el color de relleno basado en el primer material del array
  const fillColor =
    tanque.material.length > 0 ? getFillColor(tanque.material[0]) : "#cccccc";

  // Definir el path del área de relleno:
  const fillPath = `M 50,250 
  Q 150,500 250,250 
  L 250,${waterLevelY} 
  Q 150,${waterLevelY + 50} 50,${waterLevelY} 
  Z`;
  const gradientId = `tankGradient-${tanque.id}`;
  return (
    <>
      <svg
        width="200"
        height="200"
        viewBox="0 50 300 300"
        // className="card m-0 p-0"
      >
        {/* ----------- GRADIENTE Y CLIP-PATH PARA EL TANQUE ----------- */}
        <defs>
          {/* Gradiente para el líquido */}
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillColor} />
            <stop offset="100%" stopColor={fillColor} />
          </linearGradient>

          {/* ClipPath con la forma del tanque */}
          <clipPath id="tankClip">
            <path
              d="M 50,100 
                 A 100,40 0 0 1 250,100
                 L 250,250
                 A 100,40 0 0 1 50,250
                 Z"
            />
          </clipPath>
        </defs>

        {/* ----------- RELLENO DINÁMICO CON CURVA INFERIOR ----------- */}
        <path
          d={fillPath}
          fill={`url(#${gradientId})`}
          clipPath="url(#tankClip)"
          className="fill-animate"
        />

        {/* ----------- CUERPO DEL TANQUE ----------- */}
        {/* Elipse superior */}
        <ellipse
          cx="150"
          cy="100"
          rx="100"
          ry="40"
          fill="#ccc"
          stroke="#888"
          strokeWidth="2"
        />
        {/* Elipse inferior */}
        <ellipse
          cx="150"
          cy="250"
          rx="100"
          ry="40"
          fill="rgba(204, 204, 204, 0.5)"
          stroke="#888"
          strokeWidth="2"
        />
        {/* Contorno lateral */}
        <path
          d="M 50,100 
             L 50,250
             M 250,100
             L 250,250"
          stroke="#999"
          strokeWidth="2"
        />
        {/* Líneas horizontales simulando costillas */}
        {Array.from({ length: 8 }).map((_, i) => {
          const yPos = 110 + i * ((240 - 110) / 7);
          return (
            <path
              key={i}
              d={`
                M 50,${yPos} 
                A 100,40 0 0 0 250,${yPos}
              `}
              fill="none"
              stroke="#bbb"
              strokeWidth="1"
            />
          );
        })}
        {/* ----------- PLATAFORMA / PASARELA ----------- */}
        <rect
          x="230"
          y="85"
          width="40"
          height="10"
          fill="#ccc"
          stroke="#666"
          strokeWidth="1"
        />
        <line
          x1="230"
          y1="85"
          x2="270"
          y2="85"
          stroke="#f2a13e"
          strokeWidth="2"
        />
        <line
          x1="230"
          y1="85"
          x2="230"
          y2="95"
          stroke="#f2a13e"
          strokeWidth="2"
        />
        <line
          x1="270"
          y1="85"
          x2="270"
          y2="95"
          stroke="#f2a13e"
          strokeWidth="2"
        />
        {/* ----------- ESCALERA LATERAL ----------- */}
        <path
          d="M 270,95 L 270,250
             M 260,95 L 260,250
            "
          stroke="#f2a13e"
          strokeWidth="3"
        />
        {Array.from({ length: 10 }).map((_, i) => {
          const stepY = 100 + i * ((250 - 100) / 9);
          return (
            <line
              key={i}
              x1="260"
              y1={stepY}
              x2="270"
              y2={stepY}
              stroke="#f2a13e"
              strokeWidth="2"
            />
          );
        })}
        {/* ----------- TEXTO DEL NIVEL ----------- */}
        <text x="120" y="320" fill="black" fontSize="18" fontWeight="bold">
          Nivel: {apiData.tankLevel}%
        </text>
        <text x="80" y="100" fill="black" fontSize="18" fontWeight="bold">
          {tanque.nombre}
        </text>
        <text x="80" y="120" fill="black" fontSize="18" fontWeight="bold">
          {tanque.material.join(", ")} {/* Mostrar todos los materiales */}
        </text>
      </svg>

      {/* Animación simple al cambiar el "d" del path */}
      <style jsx>{`
        .fill-animate {
          transition: d 2s ease-in-out;
        }
      `}</style>
    </>
  );
}

export default ModeladoRefineriaTanque;

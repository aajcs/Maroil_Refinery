"use client";
import { useEffect, useState } from "react";

function ModeladoRefineriaDashboard() {
  const [apiData, setApiData] = useState({ tankLevel: 50 }); // Nivel inicial

  // Simulación de la API (puedes reemplazar con tu llamada real)
  useEffect(() => {
    const fetchData = () => {
      setTimeout(() => {
        setApiData({ tankLevel: Math.floor(Math.random() * 100) });
      }, 2000);
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  // Definiciones de posiciones:
  const bottomY = 250; // parte inferior del tanque
  const tankHeight = 150; // altura conceptual (de y = 100 a y = 250)
  // Calcular la altura del relleno según el nivel (en px)
  const fillHeight = (apiData.tankLevel / 100) * tankHeight;
  // La coordenada Y del nivel de líquido
  const waterLevelY = bottomY - fillHeight;

  // Definir el path del área de relleno:
  // Se inicia en (50,250), sigue el arco elíptico inferior hasta (250,250)
  // y luego sube hasta el nivel de líquido (waterLevelY) para cerrar la figura.
  const fillPath = `M 50,250 
  Q 150,500 250,250 
  L 250,${waterLevelY} 
  Q 150,${waterLevelY + 50} 50,${waterLevelY} 
  Z`;

  return (
    <>
      <svg
        width="400"
        height="400"
        viewBox="0 0 400 400"
        style={{ border: "1px solid #ccc" }}
      >
        {/* ----------- GRADIENTE Y CLIP-PATH PARA EL TANQUE ----------- */}
        <defs>
          {/* Gradiente para el líquido */}
          <linearGradient id="tankGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F8CF3" />
            <stop offset="100%" stopColor="#1D53A0" />
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
          fill="url(#tankGradient)"
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
          nombre tanque
        </text>
        <text x="80" y="120" fill="black" fontSize="18" fontWeight="bold">
          Crudo
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

export default ModeladoRefineriaDashboard;

"use client";
import { Recepcion, Tanque } from "@/libs/interfaces";
import { useEffect, useState, useMemo } from "react";
import { PocisionAbierta, PocisionCerrada } from "./ElementosLineaCarga";
import { getFillColor } from "@/utils/getFillCollor";

interface ModeladoRefineriaTanqueProps {
  tanque: Tanque;
  recepcions?: Recepcion[];
}

const ModeladoRefineriaTanque = ({
  tanque,
  recepcions,
}: ModeladoRefineriaTanqueProps) => {
  const [apiData, setApiData] = useState({ tankLevel: 0 });

  const totalRecepcion = useMemo(() => {
    if (!tanque || !recepcions || tanque.capacidad <= 0) return 0;
    return recepcions
      .filter((recepcion) => recepcion.idTanque.id === tanque.id)
      .reduce((sum, recepcion) => sum + recepcion.cantidadRecibida, 0);
  }, [tanque, recepcions]);

  const tanqueLevel = useMemo(() => {
    if (tanque?.capacidad > 0) {
      return ((totalRecepcion / tanque.capacidad) * 100).toFixed(2);
    }
    return "0.00";
  }, [totalRecepcion, tanque]);

  const isLoading = useMemo(() => {
    if (!recepcions || !tanque) return false;
    return recepcions.some(
      (recepcion) =>
        recepcion.idTanque.id === tanque.id && recepcion.estado === "true"
    );
  }, [recepcions, tanque]);

  useEffect(() => {
    setApiData({ tankLevel: parseFloat(tanqueLevel) });
  }, [tanqueLevel]);

  const bottomY = 250;
  const tankHeight = 150;
  const fillHeight = (apiData.tankLevel / 100) * tankHeight;
  const waterLevelY = bottomY - fillHeight;
  const fillColor =
    tanque.material.length > 0 ? getFillColor(tanque.material[0]) : "#cccccc";
  const fillPath = `M 50,250 Q 150,500 250,250 L 250,${waterLevelY} Q 150,${
    waterLevelY + 50
  } 50,${waterLevelY} Z`;
  const gradientId = `tankGradient-${tanque.id}`;
  return (
    <>
      <svg
        width="200"
        height="230"
        viewBox="0 50 300 300"
        // className="card m-0 p-0"
      >
        {/* ----------- GRADIENTE Y CLIP-PATH PARA EL TANQUE ----------- */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={fillColor} />
            <stop offset="100%" stopColor={fillColor} />
          </linearGradient>
          <clipPath id="tankClip">
            <path d="M 50,100 A 100,40 0 0 1 250,100 L 250,250 A 100,40 0 0 1 50,250 Z" />
          </clipPath>
        </defs>

        {/* ----------- RELLENO DINÁMICO CON CURVA INFERIOR ----------- */}
        <path
          d={fillPath}
          fill={`url(#${gradientId})`}
          clipPath="url(#tankClip)"
          className="fill-animate"
        />
        {/* ----------- BARRA DE CARGA ----------- */}
        {/* {isLoading && (
          <rect
            x="50"
            y="150"
            width="20"
            height="150"
            fill={fillColor}
            clipPath="url(#tankClip)"
          >
            <animate
              attributeName="y"
              from="250"
              to="100"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </rect>
        )}
        {isLoading && (
          <rect
            x="230"
            y="150"
            width="20"
            height="150"
            fill={fillColor}
            clipPath="url(#tankClip)"
          >
            <animate
              attributeName="y"
              from="100"
              to="250"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </rect>
        )} */}
        {/* <g transform="matrix(.066237 0 0 0.066236 44.872293 39.087458)"> */}

        {/* </g> */}
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
        <text
          x="100"
          y="340"
          fill={isLoading ? "green" : "red"}
          fontSize="18"
          fontWeight="bold"
        >
          {isLoading ? " (Descargando)" : "(Estable)"}
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="3s"
            repeatCount="indefinite"
          />
        </text>
        {/* {isLoading && (
          <rect x="50" y="150" width="10" height="150" fill="rgb(255, 0, 0)">
            <animate
              attributeName="y"
              from="150"
              to="50"
              dur="3.5s"
              repeatCount="indefinite"
            />
          </rect>
        )} */}
        {isLoading ? (
          <>
            <g transform="matrix(.25 0 0 0.306621 55 27.2831)">
              <g transform="matrix(.122101 0 0 0.122101-122.210883-91.867315)">
                <path
                  d="M1819.894,1641.836c0,150.278-127.748,272.544-284.778,272.544-148.699,0-271.146-109.637-283.706-248.882-.712-7.799-1.072-15.692-1.072-23.662c0-201.695,207.023-420.909,270.468-483.29c3.792-3.724,8.871-5.782,14.311-5.782s10.518,2.059,14.311,5.782c15.512,15.254,39.603,39.877,67.16,71.33c85.141,97.197,203.306,259.58,203.306,411.96Z"
                  fill={fillColor}
                />
                <ellipse
                  rx={204.106}
                  ry={16.73}
                  transform="translate(1535.12 1973.27)"
                  fill="#cecece"
                />
                <path d="M1819.894,1641.836c0,150.278-127.748,272.544-284.778,272.544-148.699,0-271.146-109.637-283.706-248.882c34.79,104.781,137.417,180.907,258.285,180.907c149.411,0,270.965-116.32,270.965-259.306c0-128.092-87.759-263.613-164.074-357.224c85.143,97.198,203.308,259.581,203.308,411.961Z" />
                <path
                  d="M1406.884,1496.68c3.588-13.747,7.915-27.175,12.748-40.075c5.894-15.733-1.436-33.192-17.04-40.753v0c-16.712-8.099-37.164-2.119-46.208,13.555-7.492,12.985-14.55,26.251-21.229,39.82l71.729,27.453Z"
                  fill="#fff"
                />
                <path
                  d="M1322.707,1495.822c-7.537,16.938-14.568,34.338-21.191,52.234-19.547,52.819-20.812,113.705,6.792,163.136c11.476,20.551,28.778,39.419,51.887,46.866s52.32.297,63.889-20.207c7.15-12.672,6.725-28.149,2.911-42.075-3.815-13.926-10.728-26.866-16.226-40.269-17.252-42.057-17.854-88.993-9.463-133.946l-78.599-25.739Z"
                  fill="#fff"
                />
              </g>
              <animate
                attributeName="opacity"
                values="1;0;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </g>
            <g transform="matrix(.075615 0 0 .075615 -80 -98)">
              <PocisionAbierta />
            </g>
          </>
        ) : (
          <g transform="matrix(.075615 0 0 .075615 -80 -98)">
            <PocisionCerrada />
          </g>
        )}
        {!isLoading ? (
          <>
            <g transform="matrix(.25 0 0 0.306621 270 280)">
              <g transform="matrix(.122101 0 0 0.122101-122.210883-91.867315)">
                <path
                  d="M1819.894,1641.836c0,150.278-127.748,272.544-284.778,272.544-148.699,0-271.146-109.637-283.706-248.882-.712-7.799-1.072-15.692-1.072-23.662c0-201.695,207.023-420.909,270.468-483.29c3.792-3.724,8.871-5.782,14.311-5.782s10.518,2.059,14.311,5.782c15.512,15.254,39.603,39.877,67.16,71.33c85.141,97.197,203.306,259.58,203.306,411.96Z"
                  fill={fillColor}
                />
                <ellipse
                  rx={204.106}
                  ry={16.73}
                  transform="translate(1535.12 1973.27)"
                  fill="#cecece"
                />
                <path d="M1819.894,1641.836c0,150.278-127.748,272.544-284.778,272.544-148.699,0-271.146-109.637-283.706-248.882c34.79,104.781,137.417,180.907,258.285,180.907c149.411,0,270.965-116.32,270.965-259.306c0-128.092-87.759-263.613-164.074-357.224c85.143,97.198,203.308,259.581,203.308,411.961Z" />
                <path
                  d="M1406.884,1496.68c3.588-13.747,7.915-27.175,12.748-40.075c5.894-15.733-1.436-33.192-17.04-40.753v0c-16.712-8.099-37.164-2.119-46.208,13.555-7.492,12.985-14.55,26.251-21.229,39.82l71.729,27.453Z"
                  fill="#fff"
                />
                <path
                  d="M1322.707,1495.822c-7.537,16.938-14.568,34.338-21.191,52.234-19.547,52.819-20.812,113.705,6.792,163.136c11.476,20.551,28.778,39.419,51.887,46.866s52.32.297,63.889-20.207c7.15-12.672,6.725-28.149,2.911-42.075-3.815-13.926-10.728-26.866-16.226-40.269-17.252-42.057-17.854-88.993-9.463-133.946l-78.599-25.739Z"
                  fill="#fff"
                />
              </g>
              <animate
                attributeName="opacity"
                values="1;0;1"
                dur="1.5s"
                repeatCount="indefinite"
              />
            </g>
            <g transform="matrix(.075615 0 0 .075615 140 150)">
              <PocisionAbierta />
            </g>
          </>
        ) : (
          <g transform="matrix(.075615 0 0 .075615 140 150)">
            <PocisionCerrada />
          </g>
        )}
      </svg>

      {/* Animación simple al cambiar el "d" del path */}
      <style jsx>{`
        .fill-animate {
          transition: d 2s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default ModeladoRefineriaTanque;

import React, {
  useEffect,
  useState,
  SVGProps,
  useMemo,
  useCallback,
} from "react";
import ModeladoRefineriaTorreSVG from "./ModeladoRefineriaTorreSVG";
import ModeladoRefineriaTuberiaMaterial from "./ModeladoRefineriaTuberiaMaterial";
import { Refinacion, TorreDestilacion } from "@/libs/interfaces";

interface TorreSection {
  name: string | undefined;
  idProducto: string | undefined;
  operational: boolean;
  bblPerHour: number;
  porcentaje: number;
  cantidad: string;
}

interface ModeladoRefineriaTorreProps extends SVGProps<SVGSVGElement> {
  torre: TorreDestilacion;
  refinacions?: Refinacion[];
}

const TOWER_HEIGHT = 380;
const TOWER_WIDTH = 100;
const TOWER_X = 150;
const TOWER_Y = 80;

const ModeladoRefineriaTorre: React.FC<ModeladoRefineriaTorreProps> = ({
  torre,
  refinacions,
  ...props
}) => {
  const [apiData, setApiData] = useState<{ sections: TorreSection[] }>({
    sections: [],
  });
  const [refinacion, setRefinacion] = useState<Refinacion | null>(null);

  // Calcular datos de las secciones
  interface DerivadoSection {
    name: string;
    idProducto: string;
    operational: boolean;
    bblPerHour: string;
    porcentaje: number;
    cantidad: string;
  }

  interface TorreData {
    sections: DerivadoSection[];
  }

  useEffect(() => {
    if (!torre?.material) return;

    const calculateDerivados = () => {
      const now = new Date();

      return torre.material.map((material) => {
        // 1. Filtrar refinaciones para esta torre
        const refinacionesTorre =
          refinacions?.filter(
            (refinacion) => refinacion.idTorre.id === torre.id
          ) || [];

        // 2. Encontrar el derivado correspondiente
        const derivado = refinacionesTorre
          .flatMap((refinacion) => refinacion.derivado || [])
          .find((d) => d.idProducto.id === material.idProducto?.id);

        const porcentaje = derivado?.porcentaje || 0;

        // 3. Calcular cantidad refinada hasta ahora
        const cantidadTotalRefinada = refinacionesTorre.reduce(
          (acc, refinacion) => {
            const { fechaInicio, fechaFin, cantidadTotal } = refinacion;
            if (!fechaInicio || !fechaFin || !cantidadTotal) return acc;

            const start = new Date(fechaInicio);
            const end = new Date(fechaFin);

            if (now < start) return acc;
            if (now >= end) return acc + cantidadTotal;

            const fraction =
              (now.getTime() - start.getTime()) /
              (end.getTime() - start.getTime());
            return acc + cantidadTotal * fraction;
          },
          0
        );

        // 4. Calcular cantidad total esperada (sin considerar tiempo)
        const cantidadTotalEsperada = refinacionesTorre.reduce(
          (acc, refinacion) => acc + (refinacion.cantidadTotal || 0),
          0
        );

        return {
          name: material.idProducto?.nombre || "Desconocido",
          idProducto: material.idProducto?.id || "",
          operational: material.estadoMaterial === "True",
          bblPerHour: parseFloat(
            ((cantidadTotalRefinada * porcentaje) / 100).toFixed(2)
          ),
          porcentaje,
          cantidad: ((cantidadTotalEsperada * porcentaje) / 100).toFixed(2),
        };
      });
    };

    const sections = calculateDerivados();
    setApiData({ sections });

    // Actualizar refinación principal
    const mainRefinacion = refinacions?.find(
      (refinacion) => refinacion.idTorre.id === torre.id
    );
    setRefinacion(mainRefinacion || null);
  }, [torre, refinacions]);

  // Calcular el total de refinación con animación
  const totalRefinacion = useMemo(() => {
    if (!torre || !refinacions) return 0;

    const now = new Date();

    return refinacions
      .filter((refinacion) => refinacion.idTorre.id === torre.id)
      .reduce((acc, refinacion) => {
        const { fechaInicio, fechaFin, cantidadTotal } = refinacion;
        if (!fechaInicio || !fechaFin) return acc;

        const start = new Date(fechaInicio);
        const end = new Date(fechaFin);

        if (now < start) return acc;
        if (now >= end) return acc + cantidadTotal;

        const totalTime = end.getTime() - start.getTime();
        const elapsed = now.getTime() - start.getTime();
        const fraction = Math.min(elapsed / totalTime, 1);

        return acc + cantidadTotal * fraction;
      }, 0);
  }, [torre, refinacions]);

  const [displayedRefinacion, setDisplayedRefinacion] =
    useState(totalRefinacion);

  // Animación suave del valor de refinación
  useEffect(() => {
    const animationFrame = requestAnimationFrame(() => {
      setDisplayedRefinacion((prev) => {
        const diff = totalRefinacion - prev;
        return prev + diff * 0.1;
      });
    });

    return () => cancelAnimationFrame(animationFrame);
  }, [totalRefinacion]);

  const sectionHeight = TOWER_HEIGHT / Math.max(apiData.sections.length, 1);

  // Memoizar el renderizado de las secciones
  const renderSections = useCallback(() => {
    return apiData.sections.map((section, index) => {
      const sectionY = TOWER_Y + index * sectionHeight;
      const color = `#${torre.material[index]?.idProducto?.color || "ccc"}`;
      const isOperational = section.operational;

      return (
        <g key={`${section.idProducto || index}-${section.operational}`}>
          <rect
            x={TOWER_X + 15}
            y={sectionY + 5}
            width={TOWER_WIDTH - 30}
            height={sectionHeight - 10}
            fill={isOperational ? `url(#sectionGradient${color})` : "#ddd"}
            opacity={isOperational ? "1" : "0.4"}
            stroke="black"
            strokeWidth="1"
            rx="10"
          />

          <g strokeLinecap="round">
            <path
              d={`M ${TOWER_X + TOWER_WIDTH - 110} ${sectionY + sectionHeight} 
                L ${TOWER_X + TOWER_WIDTH + 10} ${sectionY + sectionHeight}`}
              stroke="#707070"
              strokeWidth="3"
            />
            <path
              d={`M ${TOWER_X + TOWER_WIDTH - 110} ${
                sectionY + sectionHeight - 3
              } 
                L ${TOWER_X + TOWER_WIDTH + 10} ${
                sectionY + sectionHeight - 3
              }`}
              stroke="#a0a09d"
              strokeWidth="3"
            />
          </g>

          <ModeladoRefineriaTuberiaMaterial
            x={TOWER_X + TOWER_WIDTH + 35}
            y={sectionY + sectionHeight / 2 + 10}
          />

          <text
            x={TOWER_X + TOWER_WIDTH + 35}
            y={sectionY + sectionHeight / 2 - 5}
            fill="black"
            fontSize="14"
            fontWeight="bold"
          >
            {section.name || "Sin nombre"}
          </text>

          <text
            x={TOWER_X + TOWER_WIDTH + 35}
            y={sectionY + sectionHeight / 2 + 10}
            fill={isOperational ? "green" : "red"}
            fontSize="12"
          >
            {isOperational ? "Operativa" : "Inactiva"}
          </text>

          <text
            x={TOWER_X + TOWER_WIDTH + 35}
            y={sectionY + sectionHeight / 2 + 25}
            fill="black"
            fontSize="12"
          >
            {section.cantidad} bbl/h
          </text>
          <text
            x={TOWER_X + TOWER_WIDTH + 35}
            y={sectionY + sectionHeight / 2 + 40}
            fill="black"
            fontSize="12"
          >
            {section.bblPerHour} bbl/h
          </text>
        </g>
      );
    });
  }, [apiData.sections, sectionHeight, torre.material]);

  return (
    <svg
      width="200"
      height="400"
      viewBox="100 100 300 300"
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      {...props}
    >
      <defs>
        <radialGradient id="cylinderGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#a0a0a0" />
        </radialGradient>

        {torre.material.map((material, index) => {
          const color = `#${material.idProducto?.color || "ccc"}`;
          return (
            <linearGradient
              key={`sectionGradient-${color}-${index}`}
              id={`sectionGradient${color}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} />
              <stop offset="100%" stopColor={`${color}80`} />
            </linearGradient>
          );
        })}
      </defs>

      <ModeladoRefineriaTorreSVG />

      <g fontSize="14" fill="black">
        <text x={135} y={495}>
          {refinacion?.cantidadTotal.toFixed(2) || "0.00"} bbl/h
        </text>
        <text x={135} y={515}>
          {displayedRefinacion.toFixed(2)} bbl/h
        </text>
      </g>

      {renderSections()}
    </svg>
  );
};

export default React.memo(ModeladoRefineriaTorre);

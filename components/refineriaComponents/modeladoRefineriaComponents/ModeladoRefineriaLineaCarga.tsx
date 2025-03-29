import { useEffect, useState } from "react";
import {
  Defs,
  GabarraCarga,
  GandolaCarga,
  PocisionAbierta,
  PocisionCerrada,
  Tuberia,
} from "./ElementosLineaCarga";
import { LineaRecepcion, Recepcion } from "@/libs/interfaces";
interface ModeladoRefineriaLineaCargaProps {
  lineaRecepcion: LineaRecepcion; // Ajusta el tipo según sea necesario
  recepcions: Recepcion[]; // Ajusta el tipo según sea necesario
}
const ModeladoRefineriaLineaCarga = ({
  lineaRecepcion,
  recepcions,
}: ModeladoRefineriaLineaCargaProps) => {
  const [animationKey, setAnimationKey] = useState(0);

  const hasAssociatedRecepcion = recepcions.some(
    (recepcion) =>
      recepcion.idLinea?.id === lineaRecepcion.id && recepcion.estado === "true"
  );
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [hasAssociatedRecepcion]);

  const tanqueRecetor = recepcions.find(
    (recepcion) =>
      recepcion.idLinea?.id === lineaRecepcion.id && recepcion.estado === "true"
  );
  console.log("tanqueRecetor", tanqueRecetor?.idTanque?.nombre);
  return (
    <svg
      id="eYfEaAlRzTb1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="200"
      height="200"
      viewBox="0 0 200 200"
      shapeRendering="geometricPrecision"
      textRendering="geometricPrecision"
      project-id="be6fbb0f9bd74a698581b7dd144c3cc0"
      export-id="7883f6bc6f9a4492a90e99a6643eceea"
      // cached="false"
      // {...props}
    >
      <Defs />
      <g transform="matrix(-1 0 0-1 390.484357 167.237367)">
        <Tuberia />
      </g>
      {hasAssociatedRecepcion ? (
        <g transform="matrix(-.045615 0 0-.045615 236.787253 212.815595)">
          <PocisionAbierta />
        </g>
      ) : (
        <g transform="matrix(-.045615 0 0-.045615 236.755662 212.77328)">
          <PocisionCerrada />
        </g>
      )}
      {hasAssociatedRecepcion && (
        <g>
          {recepcions
            .filter(
              (recepcion: Recepcion) =>
                recepcion.idLinea?.id === lineaRecepcion.id
            )
            .map((recepcion: any, index: number) => (
              <g key={`${animationKey}-${index}`}>
                <g
                  id="eYfEaAlRzTb66"
                  transform="matrix(-1 0 0 1 195.70719 21.492352)"
                >
                  <GandolaCarga />
                </g>

                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from="-170.493 163.57889"
                  to="0 0"
                  dur="2s"
                  fill="freeze"
                />
              </g>
            ))}
        </g>
      )}

      <text x="0" y="10" fill="black" fontSize="12" fontWeight="bold">
        {lineaRecepcion.nombre}
      </text>
      <text x="160" y="150" fill="black" fontSize="12" fontWeight="bold">
        {tanqueRecetor?.idTanque?.nombre}
      </text>
      {/* Botón verde titilando */}
      {hasAssociatedRecepcion ? (
        <circle cx="180" cy="20" r="10" fill="green">
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      ) : (
        <circle cx="180" cy="20" r="10" fill="red">
          <animate
            attributeName="opacity"
            values="1;0;1"
            dur="1s"
            repeatCount="indefinite"
          />
        </circle>
      )}
      {/* <script /> */}
    </svg>
  );
};

export default ModeladoRefineriaLineaCarga;

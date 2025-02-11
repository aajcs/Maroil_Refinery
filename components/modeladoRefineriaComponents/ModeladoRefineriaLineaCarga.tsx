import * as React from "react";
import {
  BotonOnOff,
  Defs,
  GandolaCarga,
  PocisionAbierta,
  PocisionCerrada,
  Tuberia,
} from "./ElementosLineaCarga";
const ModeladoRefineriaLineaCarga = (props: any) => {
  const { lineaRecepcion } = props;
  const [isActive, setIsActive] = React.useState(false);

  const toggleButton = () => {
    setIsActive(!isActive);
  };
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
      cached="false"
      {...props}
    >
      <Defs />
      <g transform="matrix(-1 0 0-1 390.484357 167.237367)">
        <Tuberia />
      </g>
      {lineaRecepcion.estado === "true" ? (
        <g transform="matrix(-.045615 0 0-.045615 236.787253 212.815595)">
          <PocisionAbierta />
        </g>
      ) : (
        <g transform="matrix(-.045615 0 0-.045615 236.755662 212.77328)">
          <PocisionCerrada />
        </g>
      )}

      <g>
        <g id="eYfEaAlRzTb66" transform="matrix(-1 0 0 1 195.70719 21.492352)">
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

      <text x="0" y="10" fill="black" fontSize="12" fontWeight="bold">
        {lineaRecepcion.nombre}
      </text>
      {/* Botón verde titilando */}
      <circle cx="180" cy="20" r="10" fill="green">
        <animate
          attributeName="opacity"
          values="1;0;1"
          dur="1s"
          repeatCount="indefinite"
        />
      </circle>
      {/* <script /> */}
    </svg>
  );
};

export default ModeladoRefineriaLineaCarga;

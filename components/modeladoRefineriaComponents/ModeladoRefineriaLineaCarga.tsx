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
      <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm0 56C17.64 58 6 46.36 6 32S17.64 6 32 6s26 11.64 26 26-11.64 26-26 26z" />
      <path d="M46 34h-6v-6a2 2 0 0 0-4 0v6h-6a2 2 0 0 0 0 4h6v6a2 2 0 0 0 4 0v-6h6a2 2 0 0 0 0-4z" />
      {/* <script /> */}

      <foreignObject x="10" y="150" width="180" height="40">
        <foreignObject x="10" y="150" width="180" height="40">
          <button
            onClick={toggleButton}
            style={{
              backgroundColor: isActive ? "green" : "red",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background-color 0.3s ease",
              width: "100%",
              height: "100%",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              width="24"
              height="24"
              fill="currentColor"
              style={{ marginRight: "10px" }}
            >
              <path d="M32 2C15.432 2 2 15.432 2 32s13.432 30 30 30 30-13.432 30-30S48.568 2 32 2zm0 56C17.64 58 6 46.36 6 32S17.64 6 32 6s26 11.64 26 26-11.64 26-26 26z" />
              <path d="M46 34h-6v-6a2 2 0 0 0-4 0v6h-6a2 2 0 0 0 0 4h6v6a2 2 0 0 0 4 0v-6h6a2 2 0 0 0 0-4z" />
            </svg>
            {isActive ? "ON" : "OFF"}
          </button>
        </foreignObject>
      </foreignObject>
      <BotonOnOff />
    </svg>
  );
};

export default ModeladoRefineriaLineaCarga;

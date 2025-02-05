"use client";
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";
import React from "react";

function NotFound() {
  const router = useRouter();

  const navigateToDashboard = () => {
    router.push("/");
  };
  const navigateToHelp = () => {
    router.push("/pages/help");
  };

  return (
    <React.Fragment>
      <div className="surface-ground h-screen w-screen flex align-items-center justify-content-center">
        <div
          className="surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem"
          style={{ borderRadius: "14px" }}
        >
          <h1 className="font-bold text-2xl mt-0 mb-2">NO ENCONTRADO</h1>
          <p className="text-color-secondary mb-4">
            Parece que estás perdido. Puedes intentar estas opciones o volver al{" "}
            <a
              onClick={navigateToDashboard}
              className="font-bold text-primary hover:underline"
              style={{ cursor: "pointer" }}
            >
              dashboard
            </a>
            .
          </p>

          <ul className="list-none p-0 m-0">
            <li>
              <a
                onClick={navigateToHelp}
                className="flex align-items-center py-2 px-3 hover:surface-hover transition-colors transition-duration-150"
                style={{ cursor: "pointer" }}
              >
                <span className="inline-flex align-items-center justify-content-center flex-shrink-0 border-round bg-yellow-500 text-white w-3rem h-3rem">
                  <i className="pi pi-compass text-2xl"></i>
                </span>
                <span className="ml-3">
                  <span className="mb-2 font-bold text-color">
                    Centro de Ayuda
                  </span>
                  <p className="m-0 text-color-secondary">
                    Accede a la base de conocimientos
                  </p>
                </span>
                <i className="ml-auto pi pi-chevron-right text-color"></i>
              </a>
            </li>
            <li>
              <a
                onClick={navigateToHelp}
                className="flex align-items-center py-2 px-3 hover:surface-hover transition-colors transition-duration-150"
                style={{ cursor: "pointer" }}
              >
                <span className="inline-flex align-items-center justify-content-center flex-shrink-0 border-round bg-teal-500 text-white w-3rem h-3rem">
                  <i className="pi pi-user text-2xl"></i>
                </span>
                <span className="ml-3">
                  <span className="mb-2 font-bold text-color">
                    Servicio al Cliente
                  </span>
                  <p className="m-0 text-color-secondary">
                    Obtén respuestas instantáneas
                  </p>
                </span>
                <i className="ml-auto pi pi-chevron-right text-color"></i>
              </a>
            </li>
          </ul>

          <Button
            onClick={navigateToDashboard}
            label="Ir al Dashboard"
            className="mt-4"
          ></Button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default NotFound;

"use client";
import React, { useEffect, useState } from "react";
import { getRefinerias } from "@/app/api/refineriaService";
import { useRouter } from "next/navigation";
import { useRefineriaStore } from "@/store/refineriaStore";

const DashboardRefinerias = () => {
  const [refinerias, setRefinerias] = useState<any[]>([]);
  // const setActiveRefineriaId = useRefineriaStore(
  //   (state) => state.setActiveRefineriaId
  // );
  const { activeRefineria, setActiveRefineria } = useRefineriaStore();
  const router = useRouter();

  useEffect(() => {
    const fetchRefinerias = async () => {
      try {
        const data = await getRefinerias();
        const { refinerias: dataRefinerias } = data;
        if (Array.isArray(dataRefinerias)) {
          setRefinerias(dataRefinerias);
        } else {
          console.error("La respuesta no es un array:", dataRefinerias);
        }
      } catch (error) {
        console.error("Error al obtener las refinerías:", error);
      }
    };

    fetchRefinerias();
  }, []);
  const handleDivClick = (refineria: any) => {
    setActiveRefineria(refineria);
    router.push("/refineria");
  };
  return (
    <div className="grid">
      {Array.isArray(refinerias) && refinerias.length > 0 ? (
        refinerias.map((refineria) => (
          <div
            className="col-12 md:col-6 lg:col-4 xl:col-3 p-2 clickable"
            key={refineria.id}
            onClick={() => handleDivClick(refineria)}
          >
            <div className="card h-full flex flex-column surface-card hover:surface-hover transition-colors transition-duration-300">
              <div className="flex flex-column md:flex-row align-items-center p-3">
                <img
                  src={refineria.img}
                  alt={refineria.nombre}
                  className="w-10rem h-10rem object-cover mb-3 md:mb-0 md:mr-3 shadow-4"
                />
                <div className="text-center md:text-left">
                  <span className="block text-sm text-500 font-semibold">
                    {refineria.ubicacion}
                  </span>
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-900">
                    {refineria.nombre}
                  </h2>
                  <span className="block text-sm text-600">
                    NIT: {refineria.nit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center p-4">
          <p className="text-500 italic">No hay refinerías disponibles</p>
        </div>
      )}
    </div>
  );
};

export default DashboardRefinerias;

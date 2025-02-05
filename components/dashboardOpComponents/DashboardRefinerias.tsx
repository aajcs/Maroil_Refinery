"use client";
import React, { useEffect, useState } from "react";
import { getRefinerias } from "@/app/api/refineriaService";
import { useRouter } from "next/navigation";
import { useRefineriaStore } from "@/store/refineriaStore";

function DashboardRefinerias() {
  const [refinerias, setRefinerias] = useState<any[]>([]);
  // const setActiveRefineriaId = useRefineriaStore(
  //   (state) => state.setActiveRefineriaId
  // );
  const { activeRefineria, setActiveRefineria } = useRefineriaStore();
  const router = useRouter();
  console.log(refinerias);

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
            className="col-12 lg:col-6 xl:col-3 clickable"
            key={refineria.id}
            onClick={() => handleDivClick(refineria)}
          >
            <div className="card p-0 overflow-hidden flex flex-column">
              <div className="flex align-items-center p-3">
                <img
                  src={refineria.img}
                  alt={refineria.nombre}
                  width={100}
                  height={100}
                  // className="w-40 h-40 object-cover rounded-lg"
                />
                {/* <i className="pi pi-users text-6xl text-blue-500"></i> */}
                <div className="ml-3">
                  <span className="text-blue-500 block white-space-nowrap">
                    {refineria.ubicacion}
                  </span>
                  <span className="text-blue-500 block text-4xl font-bold">
                    {refineria.nombre}
                  </span>
                  <span className="text-blue-500 block white-space-nowrap">
                    {refineria.nit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No hay refinerías disponibles</p>
      )}
    </div>
  );
}

export default DashboardRefinerias;

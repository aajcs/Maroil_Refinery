"use client";
import React, { useEffect, useState } from "react";
import { getRefinerias } from "@/app/api/refineriaService";
import { useRouter } from "next/navigation";
import { useRefineriaStore } from "@/store/refineriaStore";
import { getRecepcions } from "@/app/api/recepcionService";
// import GraficaRecepcionesPorRefineria from "./GraficaRecepcionesPorRefineria";
// import RecepcionDashboard from "./RecepcionDashboard";
import { Bunkering, Recepcion } from "@/libs/interfaces";
import { getBunkerings } from "@/app/api/bunkering/bunkeringService";
import { useSession } from "next-auth/react";

const DashboardRefinerias = () => {
  const { data: session } = useSession();
  console.log("Session data:", session);
  const user = session?.user;
  console.log("Usuario:", user?.usuario?.acceso);

  const [refinerias, setRefinerias] = useState<any[]>([]);
  const [recepcions, setRecepcions] = useState<Recepcion[]>([]);
  const [bunkerings, setBunkerings] = useState<Bunkering[]>([]);
  // const setActiveRefineriaId = useRefineriaStore(
  //   (state) => state.setActiveRefineriaId
  // );
  const { activeRefineria, setActiveRefineria } = useRefineriaStore();
  const router = useRouter();
  // Filtrado de refinerías según el acceso del usuario
  useEffect(() => {
    const fetchRefinerias = async () => {
      try {
        const data = await getRefinerias();
        let { refinerias: dataRefinerias } = data;
        if (!Array.isArray(dataRefinerias)) {
          console.error("La respuesta no es un array:", dataRefinerias);
          dataRefinerias = [];
        }

        if (user?.usuario?.acceso === "completo") {
          setRefinerias(dataRefinerias);
        } else if (
          user?.usuario?.acceso === "limitado" &&
          Array.isArray(user?.usuario?.idRefineria)
        ) {
          const refineriasFiltradas = dataRefinerias.filter((refineria: any) =>
            user?.usuario?.idRefineria?.some(
              (refineriaObj: any) => refineriaObj.id === refineria.id
            )
          );
          setRefinerias(refineriasFiltradas);
        } else {
          setRefinerias([]);
        }
      } catch (error) {
        console.error("Error al obtener las refinerías:", error);
      }
    };

    if (user?.usuario?.acceso) {
      fetchRefinerias();
    }
  }, [user]);
  // useEffect(() => {
  //   const fetchRefinerias = async () => {
  //     try {
  //       const data = await getRefinerias();
  //       const { refinerias: dataRefinerias } = data;
  //       if (Array.isArray(dataRefinerias)) {
  //         setRefinerias(dataRefinerias);
  //       } else {
  //         console.error("La respuesta no es un array:", dataRefinerias);
  //       }
  //     } catch (error) {
  //       console.error("Error al obtener las refinerías:", error);
  //     }
  //   };

  //   fetchRefinerias();
  // }, []);
  useEffect(() => {
    const fetchBunkerings = async () => {
      try {
        const data = await getBunkerings();
        const { bunkerings: dataBunkerings } = data;
        if (Array.isArray(dataBunkerings)) {
          setBunkerings(dataBunkerings);
        } else {
          console.error("La respuesta no es un array:", dataBunkerings);
        }
      } catch (error) {
        console.error("Error al obtener las refinerías:", error);
      }
    };

    fetchBunkerings();
  }, []);
  useEffect(() => {
    const fetchRecepcions = async () => {
      try {
        const data = await getRecepcions();
        const { recepcions: dataRepecions } = data;
        if (Array.isArray(dataRepecions)) {
          setRecepcions(dataRepecions);
        } else {
          console.error("La respuesta no es un array:", dataRepecions);
        }
      } catch (error) {
        console.error("Error al obtener las recepciones:", error);
      }
    };

    fetchRecepcions();
  }, []);
  const handleDivClick = (refineria: any) => {
    setActiveRefineria(refineria);
    router.push("/refineria");
  };
  const handleDivClickBunkering = (refineria: any) => {
    setActiveRefineria(refineria);
    router.push("/bunkering");
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
                  width={100}
                  height={100}
                  // className="w-40 h-40 object-cover rounded-lg"
                  // className="w-10rem h-10rem object-cover mb-3 md:mb-0 md:mr-3 shadow-4"
                />
                <div className="ml-3">
                  <span className="text-primary block white-space-nowrap">
                    {refineria.ubicacion}
                  </span>
                  <span className="text-primary block text-4xl font-bold">
                    {refineria.nombre}
                  </span>
                  <span className="text-primary block white-space-nowrap">
                    {refineria.nit}
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
      {Array.isArray(bunkerings) && bunkerings.length > 0 ? (
        bunkerings.map((bunkering) => (
          <div
            className="col-12 md:col-6 lg:col-4 xl:col-3 p-2 clickable"
            key={bunkering.id}
            onClick={() => handleDivClickBunkering(bunkering)}
          >
            <div className="card h-full flex flex-column surface-card hover:surface-hover transition-colors transition-duration-300">
              <div className="flex flex-column md:flex-row align-items-center p-3">
                <img
                  src={bunkering.img}
                  alt={bunkering.nombre}
                  width={100}
                  height={100}
                  // className="w-40 h-40 object-cover rounded-lg"
                  // className="w-10rem h-10rem object-cover mb-3 md:mb-0 md:mr-3 shadow-4"
                />
                <div className="ml-3">
                  <span className="text-primary block white-space-nowrap">
                    {bunkering.ubicacion}
                  </span>
                  <span className="text-primary block text-4xl font-bold">
                    {bunkering.nombre}
                  </span>
                  <span className="text-primary block white-space-nowrap">
                    {bunkering.nit}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center p-4">
          <p className="text-500 italic">No hay bunkerings disponibles</p>
        </div>
      )}
      <div className="col-12">
        {/* <RecepcionDashboard recepcions={recepcions} /> */}
        {/* {GraficaRecepcionesPorRefineria ? (
          <GraficaRecepcionesPorRefineria recepcions={recepcions} />
        ) : (
          <p>Error loading chart component</p>
        )}{" "} */}
      </div>
    </div>
  );
};

export default DashboardRefinerias;

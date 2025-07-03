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
import { ProgressSpinner } from "primereact/progressspinner";
import { Button } from "primereact/button";
// import NoDataIllustration from "@/assets/images/no-data.svg";

const DashboardRefinerias = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const [refinerias, setRefinerias] = useState<any[]>([]);
  const [recepcions, setRecepcions] = useState<Recepcion[]>([]);
  const [bunkerings, setBunkerings] = useState<Bunkering[]>([]);
  const [loading, setLoading] = useState(true);
  const { activeRefineria, setActiveRefineria } = useRefineriaStore();
  const router = useRouter();

  // fetch refinerías, can be called on mount and on reload
  const fetchRefinerias = async () => {
    setLoading(true);
    try {
      const data = await getRefinerias();
      let { refinerias: dataRefinerias } = data;
      if (!Array.isArray(dataRefinerias)) dataRefinerias = [];
      if (user?.usuario?.acceso === "completo") setRefinerias(dataRefinerias);
      else if (
        user?.usuario?.acceso === "limitado" &&
        Array.isArray(user?.usuario?.idRefineria)
      ) {
        setRefinerias(
          dataRefinerias.filter((r: { id: string | undefined }) =>
            user?.usuario?.idRefineria?.some((idObj) => idObj.id === r.id)
          )
        );
      } else setRefinerias([]);
    } catch (error) {
      console.error("Error al obtener las refinerías:", error);
      setRefinerias([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user?.usuario?.acceso) fetchRefinerias();
  }, [user]);

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

  // show spinner while loading
  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <ProgressSpinner />
      </div>
    );
  }

  // empty state if no refinerías
  if (!loading && refinerias.length === 0) {
    return (
      <div
        className="flex flex-column align-items-center justify-content-center"
        style={{ height: "300px" }}
      >
        <img
          src="/layout/images/pages/auth/access-denied.svg"
          alt="Sin datos"
          width={120}
        />
        <h3 className="mt-3">No tienes refinerías</h3>
        <p className="text-500">
          Contacta al administrador para solicitar acceso.
        </p>
        <Button
          label="Recargar"
          icon="pi pi-refresh"
          onClick={fetchRefinerias}
          className="mt-2"
        />
      </div>
    );
  }
  return (
    <div className="grid">
      {Array.isArray(refinerias) &&
        refinerias.length > 0 &&
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
        ))}
      {Array.isArray(bunkerings) &&
        bunkerings.length > 0 &&
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
        ))}
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

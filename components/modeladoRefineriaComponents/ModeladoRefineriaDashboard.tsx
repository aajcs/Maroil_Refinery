"use client";

import { useRefineriaStore } from "@/store/refineriaStore";
import ModeladoRefineriaTanque from "./ModeladoRefineriaTanque";
import ModeladoRefineriaTorre from "./ModeladoRefineriaTorre";
import { useEffect, useState } from "react";
import { getTanques } from "@/app/api/tanqueService";
import { getTorresDestilacion } from "@/app/api/torreDestilacionService";
import ModeladoRefineriaLinaCarga from "./ModeladoRefineriaLinaCarga";
import ModeladoRefineriaLineaDescarga from "./ModeladoRefineriaLineaDescarga";

interface Tanque {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string[];
  almacenamiento: number;
  capacidad: number;
  createdAt: string;
  updatedAt: string;
  id_refineria: {
    _id: string | undefined;
    id: string;
  };
}

interface TorreDestilacion {
  id: string;
  nombre: string;
  estado: boolean;
  eliminado: boolean;
  ubicacion: string;
  material: string[];
  createdAt: string;
  updatedAt: string;
  id_refineria: {
    _id: string | undefined;
    nombre: string;
  };
}

function ModeladoRefineriaDashboard() {
  const { activeRefineria } = useRefineriaStore();
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [torresDestilacion, setTorresDestilacion] = useState<
    TorreDestilacion[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Obtener tanques y torres de destilación
  useEffect(() => {
    const fetchData = async () => {
      if (activeRefineria?.id) {
        await fetchTanques();
        await fetchTorresDestilacion();
        setLoading(false);
      }
    };

    fetchData();
  }, [activeRefineria]);

  // Obtener tanques de la refinería activa
  const fetchTanques = async () => {
    try {
      const tanquesDB = await getTanques();
      if (tanquesDB && Array.isArray(tanquesDB.tanques)) {
        const filteredTanques = tanquesDB.tanques.filter(
          (tanque: Tanque) => tanque.id_refineria._id === activeRefineria?.id
        );
        setTanques(filteredTanques);
      } else {
        console.error("La estructura de tanquesDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener los tanques:", error);
    }
  };

  // Obtener torres de destilación de la refinería activa
  const fetchTorresDestilacion = async () => {
    try {
      const torresDestilacionDB = await getTorresDestilacion();
      if (torresDestilacionDB && Array.isArray(torresDestilacionDB.torres)) {
        const filteredTorresDestilacion = torresDestilacionDB.torres.filter(
          (torre: TorreDestilacion) =>
            torre.id_refineria._id === activeRefineria?.id
        );
        setTorresDestilacion(filteredTorresDestilacion);
      } else {
        console.error("La estructura de torresDestilacionDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener las torres de destilación:", error);
    }
  };

  return (
    <>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div className="grid card">
          <div className="">
            {tanques
              .filter((tanque) => tanque.material.includes("Petroleo Crudo"))
              .map((tanque) => (
                <div className="mx-2" key={tanque.id}>
                  <ModeladoRefineriaTanque tanque={tanque} />
                </div>
              ))}
          </div>
          <div className="lg:flex">
            {torresDestilacion.map((torre) => (
              <div className="mx-2" key={torre.id}>
                <ModeladoRefineriaTorre torre={torre} />
              </div>
            ))}
          </div>
          <div className="">
            {tanques
              .filter((tanque) => !tanque.material.includes("Petroleo Crudo"))
              .map((tanque) => (
                <div className="mx-2" key={tanque.id}>
                  <ModeladoRefineriaTanque tanque={tanque} />
                </div>
              ))}
          </div>
          <div className="">
            {tanques
              .filter((tanque) => !tanque.material.includes("Petroleo Crudo"))
              .map((tanque) => (
                <div className="mx-2" key={tanque.id}>
                  <ModeladoRefineriaLineaDescarga />
                </div>
              ))}
          </div>
        </div>
      )}
      <div>
        <ModeladoRefineriaLinaCarga />
      </div>
    </>
  );
}

export default ModeladoRefineriaDashboard;

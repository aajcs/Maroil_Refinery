"use client";

import { useRefineriaStore } from "@/store/refineriaStore";
import ModeladoRefineriaTanque from "./ModeladoRefineriaTanque";
import ModeladoRefineriaTorre from "./ModeladoRefineriaTorre";
import { useEffect, useState } from "react";
import { getTanques } from "@/app/api/tanqueService";
import { getTorresDestilacion } from "@/app/api/torreDestilacionService";
import ModeladoRefineriaLinaCarga from "./ModeladoRefineriaLinaCarga";
import ModeladoRefineriaLineaDescarga from "./ModeladoRefineriaLineaDescarga";
import ModeladoRefineriaTorreSVG from "./ModeladoRefineriaTorreSVG";
import { ProgressSpinner } from "primereact/progressspinner";

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
  material: { estadoMaterial: string; posicion: string; nombre: string }[];
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
      console.log(torresDestilacionDB);
      if (
        torresDestilacionDB?.torres &&
        Array.isArray(torresDestilacionDB.torres)
      ) {
        const filteredTorresDestilacion = torresDestilacionDB.torres
          .filter(
            (torre: TorreDestilacion) =>
              torre.id_refineria?._id === activeRefineria?.id
          )
          .map((torre: TorreDestilacion) => {
            // Ordenar el array de materiales por la posición
            torre.material.sort(
              (a, b) => parseInt(a.posicion, 10) - parseInt(b.posicion, 10)
            );
            return torre;
          });

        setTorresDestilacion(filteredTorresDestilacion);
      } else {
        console.error("La estructura de torresDestilacionDB no es la esperada");
      }
    } catch (error) {
      console.error("Error al obtener las torres de destilación:", error);
    }
  };
  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-content-center align-items-center h-screen">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="grid">
          {/* Línea de recepción */}
          <div className="col-12 md:col-6 lg:col-2">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">Línea de Recepción</h1>

              {tanques
                .filter((tanque) => !tanque.material.includes("Petroleo Crudo"))
                .map((tanque, index) => (
                  <div key={index} className="col-12 md:col-6">
                    <ModeladoRefineriaLineaDescarga />
                  </div>
                ))}
            </div>
          </div>
          {/* Almacenamiento Crudo */}
          <div className="col-12 md:col-6 lg:col-2">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">Almacenamiento Crudo</h1>
              {tanques
                .filter((tanque) => tanque.material.includes("Petroleo Crudo"))
                .map((tanque) => (
                  <div key={tanque.id} className="mb-2">
                    <ModeladoRefineriaTanque tanque={tanque} />
                  </div>
                ))}
            </div>
          </div>

          {/* Torres de Procesamiento */}
          <div className="col-12 md:col-6 lg:col-3">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">
                Torres de Procesamiento
              </h1>
              <div className="grid">
                {torresDestilacion.map((torre) => (
                  <div key={torre.id} className="col-12 md:col-6">
                    <ModeladoRefineriaTorre torre={torre} />
                    <ModeladoRefineriaTorreSVG />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Almacenamiento de Productos */}
          <div className="col-12 md:col-6 lg:col-3">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">
                Almacenamiento de Productos
              </h1>
              <div className="grid">
                {tanques
                  .filter(
                    (tanque) => !tanque.material.includes("Petroleo Crudo")
                  )
                  .map((tanque) => (
                    <div key={tanque.id} className="mb-2">
                      <ModeladoRefineriaTanque tanque={tanque} />
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Línea de Despacho */}
          <div className="col-12 md:col-6 lg:col-2">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">Línea de Despacho</h1>

              {tanques
                .filter((tanque) => !tanque.material.includes("Petroleo Crudo"))
                .map((tanque, index) => (
                  <div key={index} className="col-12 md:col-6">
                    <ModeladoRefineriaLineaDescarga />
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* Línea de Carga */}
      <div className="mt-4">
        <ModeladoRefineriaLinaCarga />
      </div>
    </div>
  );
}

export default ModeladoRefineriaDashboard;

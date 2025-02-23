"use client";

import { useRefineriaStore } from "@/store/refineriaStore";
import ModeladoRefineriaTanque from "./ModeladoRefineriaTanque";
import ModeladoRefineriaTorre from "./ModeladoRefineriaTorre";
import { useCallback, useEffect, useState } from "react";
import { getTanques } from "@/app/api/tanqueService";
import { getTorresDestilacion } from "@/app/api/torreDestilacionService";
import ModeladoRefineriaLineaDescarga from "./ModeladoRefineriaLineaDescarga";
import ModeladoRefineriaTorreSVG from "./ModeladoRefineriaTorreSVG";
import { ProgressSpinner } from "primereact/progressspinner";
import ModeladoRefineriaLineaCarga from "./ModeladoRefineriaLineaCarga";
import { getLineaRecepcions } from "@/app/api/lineaRecepcionService";
import {
  LineaRecepcion,
  Recepcion,
  Tanque,
  TorreDestilacion,
} from "@/libs/interfaces";
import { getRecepcions } from "@/app/api/recepcionService";
import { formatDateFH } from "@/utils/dateUtils";
import { useSocket } from "@/hooks/useSocket";
function ModeladoRefineriaDashboard() {
  const { activeRefineria } = useRefineriaStore();
  const { recepcionModificado, refineriaModificado } = useSocket();
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [torresDestilacion, setTorresDestilacion] = useState<
    TorreDestilacion[]
  >([]);
  const [lineaRecepcions, setLineaRecepcions] = useState<LineaRecepcion[]>([]);
  const [recepcions, setRecepcions] = useState<Recepcion[]>([]);
  console.log(recepcions);
  const [loading, setLoading] = useState(true);

  // Obtener tanques y torres de destilación
  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (activeRefineria?.id) {
  //       await fetchTanques();
  //       await fetchTorresDestilacion();
  //       await fetchLineaRecepcions();

  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [activeRefineria]);

  // // Obtener tanques de la refinería activa
  // const fetchTanques = async () => {
  //   try {
  //     const tanquesDB = await getTanques();
  //     console.log(tanquesDB);
  //     if (tanquesDB && Array.isArray(tanquesDB.tanques)) {
  //       const filteredTanques = tanquesDB.tanques.filter(
  //         (tanque: Tanque) => tanque.idRefineria.id === activeRefineria?.id
  //       );
  //       setTanques(filteredTanques);
  //     } else {
  //       console.error("La estructura de tanquesDB no es la esperada");
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener los tanques:", error);
  //   }
  // };

  // // Obtener torres de destilación de la refinería activa
  // const fetchTorresDestilacion = async () => {
  //   try {
  //     const torresDestilacionDB = await getTorresDestilacion();
  //     if (
  //       torresDestilacionDB?.torres &&
  //       Array.isArray(torresDestilacionDB.torres)
  //     ) {
  //       const filteredTorresDestilacion = torresDestilacionDB.torres
  //         .filter(
  //           (torre: TorreDestilacion) =>
  //             torre.idRefineria?.id === activeRefineria?.id
  //         )
  //         .map((torre: TorreDestilacion) => {
  //           // Ordenar el array de materiales por la posición
  //           torre.material.sort(
  //             (a, b) => parseInt(a.posicion, 10) - parseInt(b.posicion, 10)
  //           );
  //           return torre;
  //         });

  //       setTorresDestilacion(filteredTorresDestilacion);
  //     } else {
  //       console.error("La estructura de torresDestilacionDB no es la esperada");
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener las torres de destilación:", error);
  //   }
  // };
  // const fetchLineaRecepcions = async () => {
  //   try {
  //     const lineaRecepcionsDB = await getLineaRecepcions();
  //     if (lineaRecepcionsDB && Array.isArray(lineaRecepcionsDB.lineaCargas)) {
  //       const filteredLineaRecepcions = lineaRecepcionsDB.lineaCargas.filter(
  //         (lineaRecepcion: LineaRecepcion) =>
  //           lineaRecepcion.idRefineria.id === activeRefineria?.id
  //       );
  //       setLineaRecepcions(filteredLineaRecepcions);
  //     } else {
  //       console.error("La estructura de lineaRecepcionsDB no es la esperada");
  //     }
  //   } catch (error) {
  //     console.error("Error al obtener los lineaRecepcions:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const fetchData = useCallback(async (activeRefineriaId: string) => {
    setLoading(true);
    try {
      const [tanquesDB, torresDestilacionDB, lineaRecepcionsDB, recepcionsDB] =
        await Promise.all([
          getTanques(),
          getTorresDestilacion(),
          getLineaRecepcions(),
          getRecepcions(),
        ]);

      // Filtrar y procesar tanques
      const filteredTanques =
        tanquesDB?.tanques?.filter(
          (tanque: Tanque) => tanque.idRefineria?.id === activeRefineriaId
        ) || [];
      setTanques(filteredTanques);

      // Filtrar y procesar torres de destilación
      const filteredTorresDestilacion =
        torresDestilacionDB?.torres
          ?.filter(
            (torre: TorreDestilacion) =>
              torre.idRefineria?.id === activeRefineriaId
          )
          .map((torre: TorreDestilacion) => ({
            ...torre,
            material: torre.material.sort(
              (a, b) => parseInt(a.posicion, 10) - parseInt(b.posicion, 10)
            ),
          })) || [];
      setTorresDestilacion(filteredTorresDestilacion);

      // Filtrar línea de recepciones
      const filteredLineaRecepcions =
        lineaRecepcionsDB?.lineaCargas?.filter(
          (lineaRecepcion: LineaRecepcion) =>
            lineaRecepcion.idRefineria?.id === activeRefineriaId
        ) || [];
      setLineaRecepcions(filteredLineaRecepcions);

      // Filtrar recepciones
      const filteredRecepcions =
        recepcionsDB?.recepcions?.filter(
          (recepcion: Recepcion) =>
            recepcion.idRefineria?.id === activeRefineriaId
        ) || [];
      setRecepcions(filteredRecepcions);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeRefineria?.id) {
      fetchData(activeRefineria.id);
    }
  }, [activeRefineria?.id, fetchData]);
  useEffect(() => {
    if (recepcionModificado) {
      console.log(JSON.stringify(recepcionModificado, null, 2));
      setRecepcions((prevRecepcions) => {
        const index = prevRecepcions.findIndex(
          (recepcion) => recepcion.id === recepcionModificado.id
        );
        if (index !== -1) {
          const updatedRecepcions = [...prevRecepcions];
          updatedRecepcions[index] = recepcionModificado;
          return updatedRecepcions;
        }
        return prevRecepcions;
      });
    }
  }, [recepcionModificado]);

  return (
    <div className="p-4">
      {loading ? (
        <div className="flex justify-content-center align-items-center h-screen">
          <ProgressSpinner />
        </div>
      ) : (
        <div className="grid">
          <div className="col-12 md:col-6 lg:col-12">
            <div className="  flex flex-row">
              {/* <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
                {JSON.stringify(recepcions, null, 2)}
              </pre> */}

              {recepcions.map((recepcion) => (
                <div key={recepcion.id} className="m-2 flex flex-column card">
                  <div>
                    <strong>Cantidad Recibida:</strong>{" "}
                    {recepcion.cantidadRecibida}
                  </div>
                  <div>
                    <strong>Tanque:</strong>{" "}
                    {recepcion.idTanque
                      ? recepcion.idTanque.nombre
                      : "No tiene tanque asignado"}
                  </div>
                  <div>
                    <strong>Línea:</strong>{" "}
                    {recepcion.idLinea
                      ? recepcion.idLinea.nombre
                      : "No tiene línea asignada"}
                  </div>
                  <div>
                    <strong>Producto:</strong>{" "}
                    {recepcion.idContratoItems.producto}
                  </div>
                  <div>
                    <strong>Fecha de Inicio:</strong>{" "}
                    {formatDateFH(recepcion.fechaInicio)}
                  </div>
                  <div>
                    <strong>Fecha de Fin:</strong>{" "}
                    {formatDateFH(recepcion.fechaFin)}
                  </div>
                  <div>
                    <strong>Placa:</strong> {recepcion.placa}
                  </div>
                  <div>
                    <strong>Chofer:</strong> {recepcion.nombreChofer}{" "}
                    {recepcion.apellidoChofer}
                  </div>

                  <div>
                    <strong>Estado de Carga:</strong> {recepcion.estadoCarga}
                  </div>
                  <div>
                    <strong>ID de Guía:</strong> {recepcion.idGuia}
                  </div>
                  <div>
                    <strong>Número de Contrato:</strong>{" "}
                    {recepcion.idContrato.numeroContrato}
                  </div>
                  <div>
                    <strong>Última Actualización:</strong>{" "}
                    {formatDateFH(recepcion.updatedAt)}
                  </div>
                  <div>
                    <strong>Estado</strong> {recepcion.estado}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Línea de recepción */}
          <div className="col-12 md:col-6 lg:col-2">
            <div className="card p-3">
              <h1 className="text-2xl font-bold mb-3">Línea de Recepción</h1>

              {lineaRecepcions.map((lineaRecepcion) => (
                <div key={lineaRecepcion.id} className="mb-2">
                  <ModeladoRefineriaLineaCarga
                    lineaRecepcion={lineaRecepcion}
                    recepcions={recepcions}
                  />
                </div>
              ))}

              {/* {tanques
                .filter((tanque) => !tanque.material.includes("Petroleo Crudo"))
                .map((tanque, index) => (
                  <div key={index} className="col-12 md:col-6">
                    <ModeladoRefineriaLineaCarga />
                  </div>
                ))} */}
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

      {/* Línea de Carga
      <div className="mt-4">
        <ModeladoRefineriaLinaCarga />
      </div> */}
    </div>
  );
}

export default ModeladoRefineriaDashboard;

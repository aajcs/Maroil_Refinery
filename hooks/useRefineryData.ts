import { useCallback, useEffect, useState } from "react";
import {
  Tanque,
  TorreDestilacion,
  LineaRecepcion,
  Recepcion,
  Contrato,
} from "@/libs/interfaces";
import { getTanques } from "@/app/api/tanqueService";
import { getTorresDestilacion } from "@/app/api/torreDestilacionService";
import { getLineaRecepcions } from "@/app/api/lineaRecepcionService";
import { getRecepcions } from "@/app/api/recepcionService";
import { getContratos } from "@/app/api/contratoService";

export const useRefineryData = (
  activeRefineriaId: string,
  recepcionModificado?: Recepcion
) => {
  const [tanques, setTanques] = useState<Tanque[]>([]);
  const [torresDestilacion, setTorresDestilacion] = useState<
    TorreDestilacion[]
  >([]);
  const [lineaRecepcions, setLineaRecepcions] = useState<LineaRecepcion[]>([]);
  const [recepcions, setRecepcions] = useState<Recepcion[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        tanquesDB,
        torresDestilacionDB,
        lineaRecepcionsDB,
        recepcionsDB,
        contratosDB,
      ] = await Promise.all([
        getTanques(),
        getTorresDestilacion(),
        getLineaRecepcions(),
        getRecepcions(),
        getContratos(),
      ]);

      const filteredTanques =
        tanquesDB?.tanques?.filter(
          (tanque: Tanque) => tanque.idRefineria?.id === activeRefineriaId
        ) || [];
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
      const filteredLineaRecepcions =
        lineaRecepcionsDB?.lineaCargas?.filter(
          (lineaRecepcion: LineaRecepcion) =>
            lineaRecepcion.idRefineria?.id === activeRefineriaId
        ) || [];
      const filteredRecepcions =
        recepcionsDB?.recepcions?.filter(
          (recepcion: Recepcion) =>
            recepcion.idRefineria?.id === activeRefineriaId
        ) || [];

      const filteredContratos =
        contratosDB?.contratos?.filter(
          (contrato: Contrato) => contrato.idRefineria?.id === activeRefineriaId
        ) || [];

      setTanques(filteredTanques);
      setTorresDestilacion(filteredTorresDestilacion);
      setLineaRecepcions(filteredLineaRecepcions);
      setRecepcions(filteredRecepcions);
      setContratos(filteredContratos);
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  }, [activeRefineriaId]);

  useEffect(() => {
    if (activeRefineriaId) {
      fetchData();
    }
  }, [activeRefineriaId, fetchData]);

  // Efecto para manejar recepcionModificado
  useEffect(() => {
    if (recepcionModificado) {
      setRecepcions((prevRecepcions) => {
        const index = prevRecepcions.findIndex(
          (recepcion) => recepcion.id === recepcionModificado.id
        );
        if (index !== -1) {
          // Si la recepción ya existe, actualízala
          const updatedRecepcions = [...prevRecepcions];
          updatedRecepcions[index] = recepcionModificado;
          return updatedRecepcions;
        } else {
          // Si es una nueva recepción, agrégalo al estado
          return [...prevRecepcions, recepcionModificado];
        }
      });
    }
  }, [recepcionModificado]);

  return {
    tanques,
    torresDestilacion,
    lineaRecepcions,
    recepcions,
    contratos,
    loading,
  };
};

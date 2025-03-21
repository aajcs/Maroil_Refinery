import { useCallback, useEffect, useState } from "react";
import {
  Tanque,
  TorreDestilacion,
  LineaRecepcion,
  Recepcion,
  Contrato,
  Refinacion,
  Producto,
  TipoProducto,
  Contacto,
} from "@/libs/interfaces";
import { getTanques } from "@/app/api/tanqueService";
import { getTorresDestilacion } from "@/app/api/torreDestilacionService";
import { getLineaRecepcions } from "@/app/api/lineaRecepcionService";
import { getRecepcions } from "@/app/api/recepcionService";
import { getContratos } from "@/app/api/contratoService";
import { getRefinacions } from "@/app/api/refinacionService";
import { getProductos } from "@/app/api/productoService";
import { getTipoProductos } from "@/app/api/tipoProductoService";
import { getContactos } from "@/app/api/contactoService";

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
  const [refinacions, setRefinacions] = useState<Refinacion[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipoProductos, setTipoProductos] = useState<TipoProducto[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        tanquesDB,
        torresDestilacionDB,
        lineaRecepcionsDB,
        recepcionsDB,
        contratosDB,
        refinacionDB,
        productosDB,
        tipoProductosDB,
        contactosDB,
      ] = await Promise.all([
        getTanques(),
        getTorresDestilacion(),
        getLineaRecepcions(),
        getRecepcions(),
        getContratos(),
        getRefinacions(),
        getProductos(),
        getTipoProductos(),
        getContactos(),
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
              (a, b) =>
                parseInt(a.idProducto?.posicion?.toString() || "0", 10) -
                parseInt(b.idProducto?.posicion?.toString() || "0", 10)
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

      const filteredRefinacion =
        refinacionDB?.refinacions?.filter(
          (refinacion: Refinacion) =>
            refinacion.idRefineria?.id === activeRefineriaId
        ) || [];

      const filteredPorducto =
        productosDB?.productos?.filter(
          (producto: Producto) => producto.idRefineria?.id === activeRefineriaId
        ) || [];

      const filterdTipoProductos =
        tipoProductosDB?.tipoProductos?.filter(
          (tipoProducto: TipoProducto) =>
            tipoProducto.idRefineria?.id === activeRefineriaId
        ) || [];
      const filteredContactos =
        contactosDB?.contactos?.filter(
          (contacto: Contacto) => contacto.idRefineria?.id === activeRefineriaId
        ) || [];
      setTanques(filteredTanques);
      setTorresDestilacion(filteredTorresDestilacion);
      setLineaRecepcions(filteredLineaRecepcions);
      setRecepcions(filteredRecepcions);
      setContratos(filteredContratos);
      setRefinacions(filteredRefinacion);
      setProductos(filteredPorducto);
      setTipoProductos(filterdTipoProductos);
      setContactos(filteredContactos);
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
    refinacions,
    productos,
    tipoProductos,
    contactos,
    loading,
  };
};

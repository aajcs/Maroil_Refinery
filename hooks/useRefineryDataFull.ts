import {
  getChequeoCantidads,
  obtenerChequeosCantidadPorRefineria,
} from "@/app/api/chequeoCantidadService";
import {
  getChequeoCalidads,
  obtenerChequeosCalidadPorRefineria,
} from "@/app/api/chequeoCalidadService";
import {
  getContactos,
  obtenerContactosPorRefineria,
} from "@/app/api/contactoService";
import {
  getContratos,
  obtenerContratosPorRefineria,
} from "@/app/api/contratoService";
import {
  getCorteRefinacions,
  obtenerCortesRefinacionPorRefineria,
} from "@/app/api/corteRefinacionService";
import {
  getDespachos,
  obtenerDespachosPorRefineria,
} from "@/app/api/despachoService";
import {
  getLineaDespachos,
  obtenerLineasDespachoPorRefineria,
} from "@/app/api/lineaDespachoService";
import {
  getLineaRecepcions,
  obtenerLineasRecepcionPorRefineria,
} from "@/app/api/lineaRecepcionService";
import { getOperadors } from "@/app/api/operadorService";
import {
  getProductos,
  obtenerProductosPorRefineria,
} from "@/app/api/productoService";
import {
  getRecepcions,
  obtenerRecepcionesPorRefineria,
} from "@/app/api/recepcionService";
import {
  getTanques,
  obtenerTanquesPorRefineria,
} from "@/app/api/tanqueService";
import {
  getTipoProductos,
  obtenerTiposProductoPorRefineria,
} from "@/app/api/tipoProductoService";
import {
  getTorresDestilacion,
  obtenerTorresPorRefineria,
} from "@/app/api/torreDestilacionService";
import {
  getPartidas,
  obtenerPartidasPorRefineria,
} from "@/app/api/partidaService";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Tanque,
  TorreDestilacion,
  LineaRecepcion,
  Recepcion,
  Contrato,
  Producto,
  TipoProducto,
  Contacto,
  LineaDespacho,
  Despacho,
  CorteRefinacion,
  ChequeoCantidad,
  ChequeoCalidad,
  Partida,
} from "@/libs/interfaces";

// Tipo para el estado consolidado
interface RefineryData {
  tanques: Tanque[];
  torresDestilacions: TorreDestilacion[];
  lineaRecepcions: LineaRecepcion[];
  lineaDespachos: LineaDespacho[];
  recepcions: Recepcion[];
  despachos: Despacho[];
  contratos: Contrato[];
  productos: Producto[];
  tipoProductos: TipoProducto[];
  contactos: Contacto[];
  corteRefinacions: CorteRefinacion[];
  chequeoCantidads: ChequeoCantidad[];
  chequeoCalidads: ChequeoCalidad[];
  partidas: Partida[];
}

export const useByRefineryDataFull = (
  activeRefineriaId: string,
  recepcionModificado?: Recepcion
) => {
  const [data, setData] = useState<RefineryData>({
    tanques: [],
    torresDestilacions: [],
    lineaRecepcions: [],
    lineaDespachos: [],
    recepcions: [],
    despachos: [],
    contratos: [],
    productos: [],
    tipoProductos: [],
    contactos: [],
    corteRefinacions: [],
    chequeoCantidads: [],
    chequeoCalidads: [],
    partidas: [],
  });

  const [brent, setBrent] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener datos con filtro de refinería
  const fetchRefineryData = useCallback(async (refineriaId: string) => {
    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        getTanques(),
        getTorresDestilacion(),
        getLineaRecepcions(),
        getLineaDespachos(),
        getRecepcions(),
        getDespachos(),
        getContratos(),
        getProductos(),
        getTipoProductos(),
        getContactos(),
        getCorteRefinacions(),
        getChequeoCantidads(),
        getChequeoCalidads(),
        getPartidas(),
      ]);
      const [
        tanquesDB,
        torresDestilacionsDB,
        lineaRecepcionsDB,
        lineaDespachosDB,
        recepcionsDB,
        despachosDB,
        contratosDB,
        productosDB,
        tipoProductosDB,
        contactosDB,
        corteRefinacionsDB,
        chequeoCantidadsDB,
        chequeoCalidadsDB,
        partidasDB,
      ] = results.map((r) => (r.status === "fulfilled" ? r.value : null));

      setData({
        tanques: tanquesDB?.tanques || [],
        torresDestilacions: (torresDestilacionsDB?.torres || []).map(
          (torre: TorreDestilacion) => ({
            ...torre,
            material:
              torre.material?.sort(
                (a, b) =>
                  parseInt(a.idProducto?.posicion?.toString() || "0", 10) -
                  parseInt(b.idProducto?.posicion?.toString() || "0", 10)
              ) || [],
          })
        ),
        lineaRecepcions: lineaRecepcionsDB?.lineaCargas || [],
        lineaDespachos: lineaDespachosDB?.lineaDespachos || [],
        recepcions: recepcionsDB?.recepcions || [],
        despachos: despachosDB?.despachos || [],
        contratos: contratosDB?.contratos || [],
        productos: productosDB?.productos || [],
        tipoProductos: tipoProductosDB?.tipoProductos || [],
        contactos: contactosDB?.contactos || [],
        corteRefinacions: corteRefinacionsDB?.corteRefinacions || [],
        chequeoCantidads: chequeoCantidadsDB?.chequeoCantidads || [],
        chequeoCalidads: chequeoCalidadsDB?.chequeoCalidads || [],
        partidas: partidasDB?.partidas || [],
      });

      // Datos que no dependen de la refinería
      // const brentData = await getBrent();
      // setBrent(brentData);
    } catch (err) {
      console.error("Error al obtener los datos:", err);
      setError("Error al cargar los datos de la refinería");
    } finally {
      setLoading(false);
    }
  }, []);

  // Actualizar recepciones de forma eficiente
  const updateRecepciones = useCallback((newRecepcion: Recepcion) => {
    setData((prev) => {
      const index = prev.recepcions.findIndex((r) => r.id === newRecepcion.id);

      if (index !== -1) {
        const updatedRecepcions = [...prev.recepcions];
        updatedRecepcions[index] = newRecepcion;
        return { ...prev, recepcions: updatedRecepcions };
      }

      return { ...prev, recepcions: [...prev.recepcions, newRecepcion] };
    });
  }, []);

  // Efecto principal para cargar datos
  useEffect(() => {
    if (activeRefineriaId) {
      fetchRefineryData(activeRefineriaId);
    } else {
      setData({
        tanques: [],
        torresDestilacions: [],
        lineaRecepcions: [],
        lineaDespachos: [],
        recepcions: [],
        despachos: [],
        contratos: [],
        productos: [],
        tipoProductos: [],
        contactos: [],
        corteRefinacions: [],
        chequeoCantidads: [],
        chequeoCalidads: [],
        partidas: [],
      });
      setLoading(false);
    }
  }, [activeRefineriaId, fetchRefineryData]);

  // Efecto para actualizar recepciones
  useEffect(() => {
    if (recepcionModificado) {
      updateRecepciones(recepcionModificado);
    }
  }, [recepcionModificado, updateRecepciones]);

  // Memorizar datos para evitar recálculos innecesarios
  const memoizedData = useMemo(() => data, [data]);

  return {
    ...memoizedData,
    brent,
    loading,
    error,
    updateRecepciones, // Expón la función para actualizaciones externas
  };
};

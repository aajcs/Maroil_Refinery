import { useCallback, useEffect, useState } from "react";
import {
  LineaRecepcion,
  Recepcion,
  Contrato,
  Producto,
  TipoProducto,
  Contacto,
  LineaDespacho,
  Despacho,
  ChequeoCantidad,
  Muelle,
} from "@/libs/interfaces";

import { getLineaRecepcionsBK } from "@/app/api/bunkering/lineaRecepcionBKService";
import { getLineaDespachosBK } from "@/app/api/bunkering/lineaDespachoBKService";
import { getRecepcionsBK } from "@/app/api/bunkering/recepcionBKService";
import { getDespachosBK } from "@/app/api/bunkering/despachoBKService";
import { getContratosBK } from "@/app/api/bunkering/contratoBKService";
import { getProductosBK } from "@/app/api/bunkering/productoBKService";
import { getTipoProductosBK } from "@/app/api/bunkering/tipoProductoBKService";
import { getContactosBK } from "@/app/api/bunkering/contactoBKService";
import { getChequeoCantidadsBK } from "@/app/api/bunkering/chequeoCantidadBKService";
import { getChequeoCalidadsBK } from "@/app/api/bunkering/chequeoCalidadBKService";
import { getMuellesBK } from "@/app/api/bunkering/muelleBKService";

export const useBunkeringData = (
  activeRefineriaId: string,
  recepcionModificado?: Recepcion
) => {
  const [lineaRecepcions, setLineaRecepcions] = useState<LineaRecepcion[]>([]);
  const [lineaDespachos, setLineaDespachos] = useState<LineaDespacho[]>([]);
  const [recepcions, setRecepcions] = useState<Recepcion[]>([]);
  const [despachos, setDespachos] = useState<Despacho[]>([]);
  const [contratos, setContratos] = useState<Contrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [tipoProductos, setTipoProductos] = useState<TipoProducto[]>([]);
  const [contactos, setContactos] = useState<Contacto[]>([]);
  const [muelles, setMuelles] = useState<Muelle[]>([]); // Cambia el tipo según tu modelo de datos

  const [chequeoCantidads, setChequeoCantidads] = useState<ChequeoCantidad[]>(
    []
  );
  const [chequeoCalidads, setChequeoCalidads] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [
        lineaRecepcionDB,
        lineaDespachoDB,
        recepcionsDB,
        despachosDB,
        contratosDB,
        productosDB,
        tipoProductosDB,
        contactosDB,
        chequeoCantidadDB,
        chequeoCalidadDB,
        muelleDB,
        // brent,
      ] = await Promise.all([
        getLineaRecepcionsBK(),
        getLineaDespachosBK(),
        getRecepcionsBK(),
        getDespachosBK(),
        getContratosBK(),
        getProductosBK(),
        getTipoProductosBK(),
        getContactosBK(),
        getChequeoCantidadsBK(),
        getChequeoCalidadsBK(),
        getMuellesBK(),
      ]);

      const filteredLineaRecepcions =
        lineaRecepcionDB?.lineaCargas?.filter(
          (lineaRecepcion: LineaRecepcion) =>
            lineaRecepcion.idRefineria?.id === activeRefineriaId
        ) || [];
      const filteredLineaDespachos =
        lineaDespachoDB?.lineaDespachos?.filter(
          (lineaDespacho: LineaDespacho) =>
            lineaDespacho.idRefineria?.id === activeRefineriaId
        ) || [];
      const filteredRecepcions =
        recepcionsDB?.recepcions?.filter(
          (recepcion: Recepcion) =>
            recepcion.idRefineria?.id === activeRefineriaId
        ) || [];
      const filteredDespachos =
        despachosDB?.despachos?.filter(
          (despacho: Despacho) => despacho.idRefineria?.id === activeRefineriaId
        ) || [];

      const filteredContratos =
        contratosDB?.contratos?.filter(
          (contrato: Contrato) => contrato.idRefineria?.id === activeRefineriaId
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

      const filteredChequeoCantidads =
        chequeoCantidadDB?.chequeoCantidads?.filter(
          (chequeoCantidad: ChequeoCantidad) =>
            chequeoCantidad.idRefineria?.id === activeRefineriaId
        ) || [];
      const filteredChequeoCalidads =
        chequeoCalidadDB?.chequeoCalidads?.filter(
          (chequeoCalidad: any) =>
            chequeoCalidad.idRefineria?.id === activeRefineriaId
        ) || [];
      const filteredMuelles =
        muelleDB?.muelles?.filter(
          (muelle: Muelle) => muelle.idBunkering?.id === activeRefineriaId
        ) || [];
      // const filteredBrent =
      setLineaRecepcions(filteredLineaRecepcions);
      setLineaDespachos(filteredLineaDespachos);
      setRecepcions(filteredRecepcions);
      setDespachos(filteredDespachos);
      setContratos(filteredContratos);
      setProductos(filteredPorducto);
      setTipoProductos(filterdTipoProductos);
      setContactos(filteredContactos);
      setChequeoCantidads(filteredChequeoCantidads);
      setChequeoCalidads(filteredChequeoCalidads);
      setMuelles(filteredMuelles);
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
    lineaRecepcions,
    lineaDespachos,
    recepcions,
    despachos,
    contratos,
    productos,
    tipoProductos,
    contactos,
    loading,
    chequeoCantidads,
    chequeoCalidads,
    muelles,
  };
};

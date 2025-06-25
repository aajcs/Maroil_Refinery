import { useRefineriaStore } from "@/store/refineriaStore";
import AppSubMenu from "./AppSubMenu";
import type { MenuModel } from "@/types";

const AppMenuRefineria = () => {
  const { activeRefineria } = useRefineriaStore();
  const model: MenuModel[] = [
    {
      label: activeRefineria?.nombre || "Seleciona una refinería",
      icon: "pi pi-home",
      items: [
        {
          label: "Operaciones",
          icon: "pi pi-fw pi-home",
          to: "/refineria",
        },
        {
          label: "Finanzas",
          icon: "pi pi-fw pi-image",
          to: "/refineria/dashboard-sales",
        },
      ],
    },

    {
      label: "Gestión de " + activeRefineria?.nombre,
      // Cambiado a un icono más representativo de empresa

      items: [
        {
          label: "Congifuración",
          icon: "pi pi-fw pi-cog",
          items: [
            {
              label: "Linea de Recepción",
              icon: "pi pi-fw pi-list",
              to: "/refineria/configuracion/linea-recepcion",
            },
            {
              label: "Tanques",
              icon: "pi pi-fw pi-database",
              to: "/refineria/configuracion/tanques",
            },
            {
              label: "Torres de Destilación",
              icon: "pi pi-fw pi-building",
              to: "/refineria/configuracion/torre-destilacion",
            },
            {
              label: "Linea de Despacho",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/configuracion/linea-despacho",
            },
            {
              label: "Producto",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/configuracion/producto",
            },
            {
              label: "Tipo de Producto",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/configuracion/tipo-producto",
            },
          ],
        },
        {
          label: "Finanzas",
          icon: "pi pi-fw pi-dollar",
          items: [
            {
              label: "Contactos",
              icon: "pi pi-fw pi-id-card",
              to: "/refineria/finanzas/contacto",
            },
            {
              label: "Contrato Compra",
              icon: "pi pi-fw pi-briefcase",
              to: "/refineria/finanzas/contrato-compra",
            },

             {
              label: "Abono Egreso",
              icon: "pi pi-fw pi-receipt",
              to: "/refineria/finanzas/abono-egreso",
            },

            {
              label: "Contrato Venta",
              icon: "pi pi-fw pi-briefcase",
              to: "/refineria/finanzas/contrato-venta",
            },
            {
              label: "Abono Ingreso",
              icon: "pi pi-fw pi-receipt",
              to: "/refineria/finanzas/abono-ingreso",
            },

            {
              label: "Cuenta por Pagar",
              icon: "pi pi-fw pi-money-bill",
              to: "/refineria/finanzas/cuenta-pagar",
            },
             {
              label: "Cuenta por Cobrar",
              icon: "pi pi-fw pi-money-bill",
              to: "/refineria/finanzas/cuenta-cobrar",
            },
          ],
        },
        {
          label: "Logística",
          icon: "pi pi-fw pi-briefcase",
          items: [
            {
              label: "Recepción",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/recepcion",
            },
            {
              label: "Despacho",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/despacho",
            },
          ],
        },

        {
          label: "Operaciones",
          icon: "pi pi-fw pi-briefcase",
          items: [
            {
              label: "Chequeo Cantidad",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/chequeo-cantidad",
            },
            {
              label: "Corte de Refinación",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/corte-refinacion",
            },
          ],
        },
        {
          label: "Laboratorio",
          icon: "pi pi-fw pi-briefcase",
          items: [
            {
              label: "Chequeo Calidad",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/chequeo-calidad",
            },
          ],
        },

        // {
        //   label: "Refinación",
        //   icon: "pi pi-fw pi-plus",
        //   to: "/refineria/refinacion",
        // },
        // {
        //   label: "Refinación Salida",
        //   icon: "pi pi-fw pi-plus",
        //   to: "/refineria/refinacion-salida",
        // },
      ],
    },
    // {
    //   label: "Gestión de Refinerias",
    //   icon: "pi pi-fw pi-user",
    //   items: [
    //     {
    //       label: "Lista",
    //       icon: "pi pi-fw pi-list",
    //       to: "/refineria/list",
    //     },
    //     {
    //       label: "Crear",
    //       icon: "pi pi-fw pi-plus",
    //       to: "/refineria/create",
    //     },
    //   ],
    // },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenuRefineria;

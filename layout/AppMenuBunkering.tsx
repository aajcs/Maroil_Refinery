import { useRefineriaStore } from "@/store/refineriaStore";
import AppSubMenu from "./AppSubMenu";
import type { MenuModel } from "@/types";

const AppMenuBunkering = () => {
  const { activeRefineria } = useRefineriaStore();
  const model: MenuModel[] = [
    {
      label: activeRefineria?.nombre || "Seleciona un bunkering",
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
      icon: "pi pi-fw pi-building", // Cambiado a un icono más representativo de empresa
      items: [
        {
          label: "Configuración",
          icon: "pi pi-fw pi-cog",
          items: [
            {
              label: "Muelle",
              icon: "pi pi-fw pi-compass", // icono alternativo para muelle
              to: "/bunkering/muelle",
            },
            {
              label: "Linea de Recepción",
              icon: "pi pi-fw pi-list",
              to: "/refineria/linea-recepcion",
            },
            {
              label: "Tanques",
              icon: "pi pi-fw pi-database",
              to: "/refineria/tanques",
            },

            {
              label: "Linea de Despacho",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/linea-despacho",
            },
            {
              label: "Producto",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/producto",
            },
            {
              label: "Tipo de Producto",
              icon: "pi pi-fw pi-plus",
              to: "/refineria/tipo-producto",
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
              to: "/refineria/contacto",
            },
            {
              label: "Contrato Compra",
              icon: "pi pi-fw pi-briefcase",
              to: "/refineria/contrato-compra",
            },
            {
              label: "Contrato Venta",
              icon: "pi pi-fw pi-briefcase",
              to: "/refineria/contrato-venta",
            },
          ],
        },
        {
          label: "Logistica",
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

export default AppMenuBunkering;

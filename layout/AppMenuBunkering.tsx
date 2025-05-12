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
      icon: "pi pi-fw pi-user",
      items: [
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
          label: "Torres de Destilación",
          icon: "pi pi-fw pi-building",
          to: "/refineria/torre-destilacion",
        },
        {
          label: "Linea de Despacho",
          icon: "pi pi-fw pi-plus",
          to: "/refineria/linea-despacho",
        },
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
        {
          label: "Chequeo Calidad",
          icon: "pi pi-fw pi-plus",
          to: "/refineria/chequeo-calidad",
        },
        {
          label: "Chequeo Cantidad",
          icon: "pi pi-fw pi-plus",
          to: "/refineria/chequeo-cantidad",
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
        {
          label: "Corte de Refinación",
          icon: "pi pi-fw pi-plus",
          to: "/refineria/corte-refinacion",
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

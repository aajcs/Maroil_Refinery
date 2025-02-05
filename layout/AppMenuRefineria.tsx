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
          to: "/dashboard-sales",
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
          icon: "pi pi-fw pi-list",
          to: "/refineria/tanques",
        },
        {
          label: "Torres de Destilación",
          icon: "pi pi-fw pi-list",
          to: "/refineria/torre-destilacion",
        },
        {
          label: "Linea de Despacho",
          icon: "pi pi-fw pi-plus",
          to: "/refineria/linea-despacho",
        },
        {
          label: "Contactos",
          icon: "pi pi-fw pi-plus",
          to: "/refineria/contacto",
        },
      ],
    },
    {
      label: "Gestión de Refinerias",
      icon: "pi pi-fw pi-user",
      items: [
        {
          label: "Lista",
          icon: "pi pi-fw pi-list",
          to: "/refineria/list",
        },
        {
          label: "Crear",
          icon: "pi pi-fw pi-plus",
          to: "/refineria/create",
        },
      ],
    },
  ];

  return <AppSubMenu model={model} />;
};

export default AppMenuRefineria;

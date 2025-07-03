import {
  forwardRef,
  useContext,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { LayoutContext } from "./context/layoutcontext";
import type { AppTopbarRef } from "@/types";
import { Ripple } from "primereact/ripple";
import Link from "next/link";
import { StyleClass } from "primereact/styleclass";
import { usePathname, useRouter } from "next/navigation";
import { classNames } from "primereact/utils";
import { signOut, useSession } from "next-auth/react";
import { User } from "next-auth";
import { useSocket } from "@/hooks/useSocket";
import { useRefineriaStore } from "@/store/refineriaStore";
import AppNotificationDropdown from "./AppNotificationDropdown";
interface ExtendedUser extends User {
  usuario: {
    nombre: string;
    rol: string;
  };
  token: string;
}

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
  const { data: session } = useSession();
  console.log("Session data:", session);
  const { activeRefineria } = useRefineriaStore();

  const { online, desconectarSocket } = useSocket();

  const handleSignOut = async () => {
    await signOut();
    desconectarSocket();
  };

  const { onMenuToggle, layoutConfig, tabs, closeTab } =
    useContext(LayoutContext);

  const [searchActive, setSearchActive] = useState<boolean | null>(null);

  const pathname = usePathname();
  const router = useRouter();
  const menubuttonRef = useRef(null);

  const searchRef = useRef(null);

  const onMenuButtonClick = () => {
    onMenuToggle();
  };

  const activateSearch = () => {
    setSearchActive(true);
    setTimeout(() => {
      const element = document.querySelector(".searchInput");
      (element as HTMLElement)?.focus();
    }, 100);
  };

  useImperativeHandle(ref, () => ({
    menubutton: menubuttonRef.current,
  }));
  const logo = () => {
    const path = "/layout/images/";
    let logo;
    if (
      layoutConfig.layoutTheme === "primaryColor" &&
      layoutConfig.theme !== "yellow"
    ) {
      logo = "maroilIcono.ico";
    } else {
      logo =
        layoutConfig.colorScheme === "light"
          ? "maroilIcono.ico"
          : "maroilIcono.ico";
    }
    return path + logo;
  };
  useEffect(() => {
    logo();
  }, []);

  const onCloseTab = (index: number) => {
    if (tabs.length > 1) {
      if (index === tabs?.length - 1) router.push(tabs?.[tabs.length - 2].to);
      else router.push(tabs?.[index + 1].to);
    } else {
      router.push("/");
    }
    closeTab(index);
  };

  return (
    <div className="layout-topbar">
      <Link href={"/"} className="app-logo">
        <img alt="app logo" src={logo()} />
        <span className="app-name">Maroil</span>
      </Link>

      <button
        ref={menubuttonRef}
        className="topbar-menubutton p-link"
        type="button"
        onClick={onMenuButtonClick}
      >
        <span></span>
      </button>
      <ul className="topbar-menu">
        {tabs.map((item, i) => {
          return (
            <li key={i}>
              <Link
                href={item.to}
                className={classNames({ "active-route": item.to === pathname })}
              >
                <span>{item.label}</span>
              </Link>
              <i className="pi pi-times" onClick={() => onCloseTab(i)}></i>
            </li>
          );
        })}
        {!tabs ||
          (tabs.length === 0 &&
            (pathname.startsWith("/refineria") ||
              pathname.startsWith("/bunkering")) &&
            activeRefineria && (
              // <li className="topbar-menu-empty ">

              <Link href={"/refineria"} className="app-logo">
                <img alt="app logo" src={activeRefineria.img} />
                <span className="app-name">{activeRefineria.nombre}</span>
              </Link>
              // </li>
            ))}
      </ul>
      <div className="topbar-search">
        <AppNotificationDropdown session={session} />
      </div>
      <div className="topbar-profile">
        <StyleClass
          nodeRef={searchRef}
          selector="@next"
          enterClassName="hidden"
          enterActiveClassName="scalein"
          leaveToClassName="hidden"
          leaveActiveClassName="fadeout"
          hideOnOutsideClick
        >
          <button
            ref={searchRef}
            className="topbar-profile-button p-link"
            type="button"
          >
            <img
              alt="avatar"
              src={
                session?.user?.usuario?.img
                  ? session.user.usuario.img
                  : "/layout/images/avatarHombre.png"
              }
              className="p-avatar p-avatar-image p-avatar-circle topbar-profile-avatar"
              style={{ width: "3rem", height: "3rem", marginRight: "0.5rem" }}
            />

            <span className="profile-details">
              <span className="profile-name">
                {session?.user?.usuario?.nombre}
              </span>
              <span className="profile-job">
                {session?.user?.usuario?.rol.toLowerCase()}
              </span>
              <span className="profile-job">
                {online ? "Conectado" : "Desconectado"}
              </span>
            </span>
            <i className="pi pi-angle-down"></i>
          </button>
        </StyleClass>
        <ul className="list-none p-3 m-0 border-round shadow-2 hidden absolute surface-overlay origin-top w-full sm:w-12rem mt-2 right-0 top-auto">
          <li>
            <Link
              href="/profile/myProfile"
              className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer"
            >
              <i className="pi pi-user mr-3"></i>
              <span>Perfil</span>
              <Ripple />
            </Link>

            <a className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer">
              <i className="pi pi-cog mr-3"></i>
              <span>Configuración</span>
              <Ripple />
            </a>
            <a
              className="p-ripple flex p-2 border-round align-items-center hover:surface-hover transition-colors transition-duration-150 cursor-pointer"
              onClick={handleSignOut}
            >
              <i className="pi pi-power-off mr-3"></i>
              <span>Cerrar sesión</span>
              <Ripple />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
});

AppTopbar.displayName = "AppTopbar";

export default AppTopbar;

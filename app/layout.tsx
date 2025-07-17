"use client";
import { LayoutProvider } from "../layout/context/layoutcontext";
import { addLocale, PrimeReactProvider } from "primereact/api";
import "../styles/layout/layout.scss";
import "primeflex/primeflex.css";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.css";
import "../styles/demo/Demos.scss";
import { SessionProvider } from "next-auth/react";
import { Nullable } from "primereact/ts-helpers";
import "../styles/globals.css";
import AppInitializer from "@/components/common/AppInitializer";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

addLocale("es", {
  firstDayOfWeek: 1,
  // showMonthAfterYear: true,
  dayNames: [
    "domingo",
    "lunes",
    "martes",
    "miércoles",
    "jueves",
    "viernes",
    "sábado",
  ],
  dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
  dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
  monthNames: [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ],
  monthNamesShort: [
    "ene",
    "feb",
    "mar",
    "abr",
    "may",
    "jun",
    "jul",
    "ago",
    "sep",
    "oct",
    "nov",
    "dic",
  ],
  today: "Hoy",
  clear: "Limpiar",
});
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3 },
  };
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link
          id="theme-link"
          href={`/theme/theme-light/blue/theme.css`}
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <SessionProvider refetchOnWindowFocus={false}>
          <PrimeReactProvider>
            <LayoutProvider>
              <AppInitializer /> {/* <-- Aquí va */}
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={pathname}
                  variants={variants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3 }}
                  style={{ width: "100%" }}
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </LayoutProvider>
          </PrimeReactProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

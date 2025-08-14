"use client";
import { useContext } from "react";
import { PrimeReactProvider } from "primereact/api";
import { LayoutContext } from "@/layout/context/layoutcontext";

export default function PrimeReactRippleProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { layoutConfig } = useContext(LayoutContext);
  return (
    <PrimeReactProvider value={{ ripple: layoutConfig.ripple }}>
      {children}
    </PrimeReactProvider>
  );
}

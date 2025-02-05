"use client";

import ModeladoRefineriaDashboard from "@/components/modeladoRefineriaComponents/ModeladoRefineriaDashboard";
import RefineriasDashboard from "@/components/refineriaComponents/RefineriasDashboard";

function Dashboard() {
  return (
    <>
      <RefineriasDashboard />
      <ModeladoRefineriaDashboard />
    </>
  );
}

export default Dashboard;

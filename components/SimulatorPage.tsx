import { useState } from "react";
import SimulatorForm from "../components/SimulatorForm";
import ResultsTable from "../components/ResultsTable";
import {
  calculateDerivatives,
  calculateRequiredCrude,
} from "../utils/refineryCalculations";
import {
  CrudeToProductsResults,
  ProductsToCrudeResults,
  SimulationResults,
  Product,
} from "@/types/simulador";

export default function Home() {
  const [results, setResults] = useState<SimulationResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCalculate = async (data: {
    crudeType: string;
    crudeAmount?: number;
    desiredProducts?: Record<Product, number>;
    productPrices?: Record<Product, number>;
    crudeCosts?: {
      purchasePrice: number;
      transportCost: number;
      operationalCost: number;
    };
  }) => {
    setIsLoading(true);

    try {
      // Pequeño retraso para permitir que la UI muestre el estado de carga
      await new Promise((resolve) => setTimeout(resolve, 100));

      if ("crudeAmount" in data) {
        // Modo Crudo → Derivados
        const calculation = calculateDerivatives(
          data.crudeType,
          data.crudeAmount!,
          data.productPrices,
          data.crudeCosts
        );
        setResults(calculation as CrudeToProductsResults);
      } else {
        // Modo Derivados → Crudo
        const calculation = calculateRequiredCrude(
          data.crudeType,
          data.desiredProducts!,
          data.productPrices,
          data.crudeCosts
        );
        setResults((calculation as SimulationResults) || null);
      }
    } catch (error) {
      console.error("Error en el cálculo:", error);
      setResults(null); // Clear results on error
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Simulador de Refinería - Análisis de Rentabilidad
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-1">
            <SimulatorForm
              onCalculate={handleCalculate}
              isLoading={isLoading}
            />
          </div>

          {/* Resultados */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Procesando simulación...</p>
              </div>
            ) : results ? (
              <ResultsTable results={results} />
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <p className="text-gray-600">
                  Ingresa los parámetros y haz clic en "Calcular" para ver los
                  resultados
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Puedes simular desde crudo a derivados o desde derivados a
                  crudo
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

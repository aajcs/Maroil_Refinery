import { useState, useEffect, useMemo } from "react";
import { CrudeOption, Product } from "@/types/simulador";
import { getCrudeOptions } from "@/demo/service/simuladorService";
import { useRefineryPrecios } from "@/hooks/useRefineryPrecios";

type SimulationMode = "crudeToProducts" | "productsToCrude";
interface SimulationData {
  crudeType: string;
  crudeAmount?: number;
  desiredProducts?: Record<Product, number>;
  productPrices?: Record<Product, number>;
  crudeCosts?: {
    purchasePrice: number;
    transportCost: number;
    operationalCost: number;
  };
}

interface SimulatorFormProps {
  onCalculate: (data: SimulationData) => void;
  isLoading: boolean;
}

export default function SimulatorForm({
  onCalculate,
  isLoading,
}: SimulatorFormProps) {
  const [mode, setMode] = useState<SimulationMode>("crudeToProducts");
  const { loading, brent, oilDerivate } = useRefineryPrecios();
  console.log("oilDerivate", oilDerivate);

  // Estados del formulario
  const [crudeType, setCrudeType] = useState<string>("crude1");
  const [crudeAmount, setCrudeAmount] = useState<number>(1000);
  const [desiredProducts, setDesiredProducts] = useState<
    Record<Product, number>
  >({
    gas: 0,
    naphtha: 0,
    kerosene: 0,
    mgo4: 0,
    mgo6: 0,
  });

  const [editableProductPrices, setEditableProductPrices] = useState<
    Record<Product, number>
  >(oilDerivate || {});

  const [editableCrudeCosts, setEditableCrudeCosts] = useState({
    purchasePrice: 0,
    transportCost: 0,
    operationalCost: 0,
  });

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const crudeOptions = useMemo(() => getCrudeOptions(), []);
  const selectedCrude = crudeOptions.find(
    (option) => option.value === crudeType
  );

  // Efectos secundarios
  useEffect(() => {
    if (!selectedCrude) return;

    setEditableCrudeCosts((prev) => ({
      purchasePrice: selectedCrude.purchasePrice,
      transportCost: selectedCrude.transportCost,
      operationalCost: selectedCrude.operationalCost,
    }));
  }, [crudeType, selectedCrude]);

  useEffect(() => {
    if (oilDerivate) {
      setEditableProductPrices(oilDerivate);
    }
  }, [oilDerivate]);

  // Manejadores de eventos
  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<any>>,
    field: string,
    value: string
  ) => {
    setter((prev: any) => ({ ...prev, [field]: parseFloat(value) || 0 }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data: SimulationData = {
      crudeType,
      productPrices: editableProductPrices,
      crudeCosts: editableCrudeCosts,
      ...(mode === "crudeToProducts" ? { crudeAmount } : { desiredProducts }),
    };
    onCalculate(data);
  };

  // Componentes reutilizables
  const renderModeSwitch = () => (
    <div className="mb-6">
      <label className="block mb-3 text-sm font-medium">
        Modo de simulación:
      </label>
      <div className="flex gap-4">
        {[
          { value: "crudeToProducts", label: "Crudo → Derivados" },
          { value: "productsToCrude", label: "Derivados → Crudo" },
        ].map(({ value, label }) => (
          <label key={value} className="flex items-center gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === value}
              onChange={() => setMode(value as SimulationMode)}
              className="radio radio-sm"
              disabled={isLoading}
            />
            <span className="text-sm">{label}</span>
          </label>
        ))}
      </div>
    </div>
  );

  const renderCrudeInfo = () => (
    <div className="mb-6 p-4 bg-base-200 rounded-lg">
      <h4 className="text-lg font-semibold mb-3">Información del crudo</h4>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            label: "Precio brent+(acuerdo)$",
            field: "purchasePrice",
            value: brent + editableCrudeCosts.purchasePrice,
          },
          {
            label: "Costo transporte ($/bbl)",
            field: "transportCost",
            value: editableCrudeCosts.transportCost,
          },
          {
            label: "Costo operacional ($/bbl)",
            field: "operationalCost",
            value: editableCrudeCosts.operationalCost,
          },
        ].map(({ label, field, value }) => (
          <div key={field}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) =>
                handleInputChange(setEditableCrudeCosts, field, e.target.value)
              }
              className="input input-bordered w-full input-sm"
              step="0.01"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderProductInputs = () => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-3">
        {mode === "crudeToProducts"
          ? "Cantidad de crudo"
          : "Derivados deseados"}
      </h3>

      {mode === "crudeToProducts" ? (
        <input
          type="number"
          value={crudeAmount}
          onChange={(e) => setCrudeAmount(Number(e.target.value))}
          className="input input-bordered w-full"
          min="0"
          step="1"
          disabled={isLoading}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Object.entries(desiredProducts).map(([product, value]) => (
            <div key={product}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {product}
              </label>
              <input
                type="number"
                value={value}
                onChange={(e) =>
                  handleInputChange(setDesiredProducts, product, e.target.value)
                }
                className="input input-bordered w-full"
                min="0"
                step="1"
                disabled={isLoading}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAdvancedSettings = () => (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
        className="btn btn-ghost btn-sm text-primary"
      >
        {showAdvancedSettings ? "▲" : "▼"} Configuración avanzada
      </button>

      {showAdvancedSettings && (
        <div className="mt-4 p-4 bg-base-200 rounded-lg">
          <h4 className="text-lg font-semibold mb-3">
            Precios de productos ($/bbl)
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(editableProductPrices).map(([product, price]) => (
              <div key={product}>
                <label className="block text-sm font-medium mb-1 capitalize">
                  {product}
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) =>
                    handleInputChange(
                      setEditableProductPrices,
                      product,
                      e.target.value
                    )
                  }
                  className="input input-bordered w-full input-sm"
                  min="0"
                  step="0.01"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="card bg-base-100 shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-6">Simulador de Refinería</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Precio Actual del Brent
        </label>
        <input
          type="number"
          value={brent}
          className="input input-bordered w-full"
          disabled
        />
      </div>

      <form onSubmit={handleSubmit}>
        {renderModeSwitch()}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">
            Tipo de crudo
          </label>
          <select
            value={crudeType}
            onChange={(e) => setCrudeType(e.target.value)}
            className="select select-bordered w-full"
            disabled={isLoading}
          >
            {crudeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} (API: {option.api}, Azufre: {option.sulfur}%)
              </option>
            ))}
          </select>
        </div>

        {selectedCrude && renderCrudeInfo()}
        {renderProductInputs()}
        {renderAdvancedSettings()}

        <button
          type="submit"
          className={`btn btn-primary w-full ${isLoading ? "loading" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Calculando..." : "Calcular"}
        </button>
      </form>
    </div>
  );
}

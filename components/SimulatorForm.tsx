import { useState } from "react";
import { CrudeOption } from "@/types/simulador";
import { getCrudeOptions } from "@/demo/service/simuladorService";

interface DesiredProducts {
  gas: number;
  naphtha: number;
  kerosene: number;
  mgo4: number;
  mgo6: number;
}

interface SimulatorFormProps {
  onCalculate: (data: {
    crudeType: string;
    crudeAmount?: number;
    desiredProducts?: DesiredProducts;
  }) => void;
  isLoading: boolean;
}

export default function SimulatorForm({
  onCalculate,
  isLoading,
}: SimulatorFormProps) {
  const [mode, setMode] = useState<"crudeToProducts" | "productsToCrude">(
    "crudeToProducts"
  );
  const [crudeType, setCrudeType] = useState<string>("crude1");
  const [crudeAmount, setCrudeAmount] = useState<number>(1000);
  const [desiredProducts, setDesiredProducts] = useState<DesiredProducts>({
    gas: 0,
    naphtha: 0,
    kerosene: 0,
    mgo4: 0,
    mgo6: 0,
  });

  const crudeOptions: CrudeOption[] = getCrudeOptions();

  const handleProductChange = (
    product: keyof DesiredProducts,
    value: string
  ) => {
    setDesiredProducts((prev) => ({
      ...prev,
      [product]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (mode === "crudeToProducts") {
      onCalculate({ crudeType, crudeAmount });
    } else {
      onCalculate({ crudeType, desiredProducts });
    }
  };

  const selectedCrude = crudeOptions.find(
    (option) => option.value === crudeType
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Simulador de Refinería</h2>

      <div className="mb-4">
        <label className="block mb-2">Modo de simulación:</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="mode"
              checked={mode === "crudeToProducts"}
              onChange={() => setMode("crudeToProducts")}
              className="mr-2"
              disabled={isLoading}
            />
            Crudo → Derivados
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="mode"
              checked={mode === "productsToCrude"}
              onChange={() => setMode("productsToCrude")}
              className="mr-2"
              disabled={isLoading}
            />
            Derivados → Crudo
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Tipo de crudo:</label>
          <select
            value={crudeType}
            onChange={(e) => setCrudeType(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={isLoading}
          >
            {crudeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} (API: {option.api}, Azufre: {option.sulfur}%)
              </option>
            ))}
          </select>
        </div>

        {selectedCrude && (
          <div className="mb-4 p-3 bg-gray-50 rounded">
            <h4 className="font-semibold mb-1">
              Información del crudo seleccionado:
            </h4>
            <p>
              <span className="font-medium">Precio compra:</span> $
              {selectedCrude.api}/bbl
            </p>
            <p>
              <span className="font-medium">Costo transporte:</span> $
              {selectedCrude.sulfur}/bbl
            </p>
          </div>
        )}

        {mode === "crudeToProducts" ? (
          <div className="mb-4">
            <label className="block mb-2">Cantidad de crudo (barriles):</label>
            <input
              type="number"
              value={crudeAmount}
              onChange={(e) => setCrudeAmount(parseFloat(e.target.value) || 0)}
              className="w-full p-2 border rounded"
              min="0"
              step="1"
              disabled={isLoading}
            />
          </div>
        ) : (
          <div className="mb-4">
            <h3 className="font-bold mb-2">Derivados deseados (barriles):</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(desiredProducts).map((product) => (
                <div key={product}>
                  <label className="block mb-1 capitalize">{product}:</label>
                  <input
                    type="number"
                    value={desiredProducts[product as keyof DesiredProducts]}
                    onChange={(e) =>
                      handleProductChange(
                        product as keyof DesiredProducts,
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded"
                    min="0"
                    step="1"
                    disabled={isLoading}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className={`w-full py-2 px-4 rounded ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "Calculando..." : "Calcular"}
        </button>
      </form>
    </div>
  );
}

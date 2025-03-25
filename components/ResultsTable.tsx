import {
  CrudeToProductsResults,
  ProductsToCrudeResults,
  SimulationResults,
} from "@/types/simulador";

interface ResultsTableProps {
  results: SimulationResults | null;
}

export default function ResultsTable({ results }: ResultsTableProps) {
  if (!results) return null;

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const formatNumber = (value: number, decimals = 2): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    }).format(value);
  };

  // Manejar caso de error
  if (results.error) {
    return (
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md text-center text-red-500">
        <h2 className="text-xl font-bold mb-2">Error en el cálculo</h2>
        <p>{results.error}</p>
      </div>
    );
  }

  return (
    <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Resultados de la simulación</h2>

      {/* Información del crudo */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-bold mb-2">Información del crudo procesado:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p>
              <span className="font-semibold">Tipo:</span> {results.crudeType}
            </p>
            <p>
              <span className="font-semibold">API:</span>{" "}
              {results.crudeDetails.api}
            </p>
            <p>
              <span className="font-semibold">Azufre:</span>{" "}
              {results.crudeDetails.sulfur}%
            </p>
          </div>
          <div>
            <p>
              <span className="font-semibold">Precio compra:</span>{" "}
              {formatCurrency(results.crudeDetails.purchasePrice)}/bbl
            </p>
            <p>
              <span className="font-semibold">Transporte:</span>{" "}
              {formatCurrency(results.crudeDetails.transportCost)}/bbl
            </p>
            <p>
              <span className="font-semibold">Operacional:</span>{" "}
              {formatCurrency(results.crudeDetails.operationalCost)}/bbl
            </p>
          </div>
        </div>

        {"crudeAmount" in results && (
          <p className="mt-2">
            <span className="font-semibold">Cantidad procesada:</span>{" "}
            {formatNumber((results as CrudeToProductsResults).crudeAmount)}{" "}
            barriles
          </p>
        )}
        {"requiredCrude" in results && (
          <p className="mt-2">
            <span className="font-semibold">Crudo requerido:</span>{" "}
            {formatNumber((results as ProductsToCrudeResults).requiredCrude, 2)}{" "}
            barriles
          </p>
        )}
      </div>

      {/* Resultados de producción */}
      <div className="mb-6">
        <h3 className="font-bold mb-2">Resultados de producción:</h3>

        {"production" in results &&
        typeof results.production === "object" &&
        results.production &&
        !("exact" in results.production) ? (
          /* Modo Crudo → Derivados */
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border text-left">Producto</th>
                <th className="p-2 border text-left">Cantidad (bbl)</th>
                <th className="p-2 border text-left">Precio unitario</th>
                <th className="p-2 border text-left">Ingresos</th>
                <th className="p-2 border text-left">Rendimiento</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(
                (results as CrudeToProductsResults).production
              ).map(
                ([product, amount]) =>
                  amount > 0 && (
                    <tr key={product} className="border">
                      <td className="p-2 border capitalize">{product}</td>
                      <td className="p-2 border">{formatNumber(amount, 2)}</td>
                      <td className="p-2 border">
                        {formatCurrency(
                          results.financials.productRevenues[
                            product as keyof typeof results.financials.productRevenues
                          ] || 0
                        )}
                      </td>
                      <td className="p-2 border">
                        {formatCurrency(
                          results.financials.productRevenues[
                            product as keyof typeof results.financials.productRevenues
                          ]
                        )}
                      </td>
                      <td className="p-2 border">
                        {(
                          (amount /
                            (results as CrudeToProductsResults).crudeAmount) *
                          100
                        ).toFixed(1)}
                        %
                      </td>
                    </tr>
                  )
              )}
            </tbody>
          </table>
        ) : (
          /* Modo Derivados → Crudo */
          <div>
            {results.impossibleProducts &&
              results.impossibleProducts.length > 0 && (
                <div className="mb-4 p-4 bg-red-50 rounded-lg">
                  <h3 className="font-bold text-red-600 mb-2">
                    Productos no producibles:
                  </h3>
                  <ul className="list-disc pl-5">
                    {results.impossibleProducts.map((product) => (
                      <li key={product} className="capitalize">
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            <h4 className="font-bold mb-2">Producción exacta solicitada:</h4>
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border text-left">Producto</th>
                  <th className="p-2 border text-left">Cantidad (bbl)</th>
                  <th className="p-2 border text-left">Ingresos</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(
                  (results as ProductsToCrudeResults).production.exact
                ).map(
                  ([product, amount]) =>
                    amount > 0 && (
                      <tr key={product} className="border">
                        <td className="p-2 border capitalize">{product}</td>
                        <td className="p-2 border">
                          {formatNumber(amount, 2)}
                        </td>
                        <td className="p-2 border">
                          {formatCurrency(
                            results.financials.productRevenues[
                              product as keyof typeof results.financials.productRevenues
                            ]
                          )}
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>

            {Object.keys(
              (results as ProductsToCrudeResults).production.byProducts
            ).length > 0 && (
              <>
                <h4 className="font-bold mb-2">Subproductos generados:</h4>
                <table className="w-full border-collapse mb-6">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border text-left">Producto</th>
                      <th className="p-2 border text-left">Cantidad (bbl)</th>
                      <th className="p-2 border text-left">Ingresos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(
                      (results as ProductsToCrudeResults).production.byProducts
                    ).map(
                      ([product, amount]) =>
                        amount > 0 && (
                          <tr key={product} className="border">
                            <td className="p-2 border capitalize">{product}</td>
                            <td className="p-2 border">
                              {formatNumber(amount, 2)}
                            </td>
                            <td className="p-2 border">
                              {formatCurrency(
                                results.financials.productRevenues[
                                  product as keyof typeof results.financials.productRevenues
                                ]
                              )}
                            </td>
                          </tr>
                        )
                    )}
                  </tbody>
                </table>
              </>
            )}
          </div>
        )}
      </div>

      {/* Análisis financiero */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-bold mb-2 text-blue-800">Análisis Financiero</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="p-3 bg-white rounded shadow">
            <h4 className="font-semibold mb-1">Ingresos Totales:</h4>
            <p className="text-2xl text-green-600">
              {formatCurrency(results.financials.totalRevenue)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(
                results.financials.totalRevenue /
                  ((results as CrudeToProductsResults).crudeAmount ||
                    (results as ProductsToCrudeResults).requiredCrude)
              )}{" "}
              por barril de crudo
            </p>
          </div>

          <div className="p-3 bg-white rounded shadow">
            <h4 className="font-semibold mb-1">Costos Totales:</h4>
            <p className="text-2xl text-red-600">
              {formatCurrency(results.financials.costs.total)}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {formatCurrency(results.financials.costPerBarrel)} por barril de
              crudo
            </p>
            <details className="mt-1 text-sm">
              <summary className="cursor-pointer">Detalle de costos</summary>
              <ul className="pl-5 mt-1 space-y-1">
                <li>
                  Compra crudo:{" "}
                  {formatCurrency(results.financials.costs.purchase)}
                </li>
                <li>
                  Transporte:{" "}
                  {formatCurrency(results.financials.costs.transport)}
                </li>
                <li>
                  Operacional:{" "}
                  {formatCurrency(results.financials.costs.operational)}
                </li>
              </ul>
            </details>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-blue-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold">Utilidad Bruta:</h4>
            <p
              className={`text-2xl ${
                results.financials.grossProfit >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {formatCurrency(results.financials.grossProfit)}
            </p>
          </div>

          <div className="flex justify-between items-center">
            <h4 className="font-semibold">Margen de Ganancia:</h4>
            <p
              className={`text-xl ${
                results.financials.profitMargin >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {results.financials.profitMargin.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

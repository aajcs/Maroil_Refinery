import { Contrato } from "@/libs/interfaces";
import { formatDateSinAnoFH } from "@/utils/dateUtils";
import { MathJax } from "better-react-mathjax";

interface Producto {
  producto: { id: string; nombre: string; color: string };
  cantidad: number;
  formula: string;
  precioUnitario: number;
  total: number;
  precioTransporte: number;
  totalTransporte: number;
  brent: number;
  convenio: number;
}

interface ModeladoRefineriaContratosSalesListProps {
  contrato: Contrato & { productos: Producto[] };
  tipo: string;
}

const ModeladoRefineriaContratosSalesCard = ({
  contrato,
  tipo,
}: ModeladoRefineriaContratosSalesListProps) => {
  const totalCantidad = contrato.productos.reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0
  );

  const montoPorBarril =
    totalCantidad > 0
      ? ((contrato.montoTransporte || 0) + (contrato.montoTotal || 0)) /
        totalCantidad
      : 0;
  const montoPorBarrilTransporte =
    totalCantidad > 0 ? (contrato.montoTransporte || 0) / totalCantidad : 0;
  const montoPorBarrilTotal =
    totalCantidad > 0 ? (contrato.montoTotal || 0) / totalCantidad : 0;
  const montoTotal = contrato.productos.reduce(
    (acc, item) => acc + (item.total || 0),
    0
  );
  const montoTransporte = contrato.productos.reduce(
    (acc, item) => acc + (item.totalTransporte || 0),
    0
  );
  const brentTotal =
    contrato.productos.reduce((acc, item) => acc + (item.brent || 0), 0) /
    contrato.productos.length;
  const convenioTotal =
    contrato.productos.reduce((acc, item) => acc + (item.convenio || 0), 0) /
    contrato.productos.length;

  return (
    <div>
      <div className="p-3 surface-card border-round shadow-2">
        <div className="flex justify-content-between align-items-start">
          <div className="flex flex-column">
            <span className="text-lg font-bold white-space-normal">
              {contrato.descripcion.toLocaleUpperCase()}
            </span>
            <span className="text-sm text-500 mt-1">
              {`(${contrato.idContacto.nombre})`}
            </span>
          </div>
          <div className="flex flex-column text-right">
            <span className="text-sm font-semibold">
              Nº: {contrato.numeroContrato}
            </span>
            <span className="text-xs text-green-500">
              Act-{formatDateSinAnoFH(contrato.updatedAt)}
            </span>
          </div>
        </div>
        <hr className="my-2" />
        <div className="text-sm">
          <span className="font-medium">Inicio:</span>{" "}
          {formatDateSinAnoFH(contrato.fechaInicio)}
          {" - "}
          <span className="font-medium">Fin:</span>{" "}
          {formatDateSinAnoFH(contrato.fechaFin)}
        </div>
        <hr className="my-2" />
        <div className="flex flex-column gap-2">
          {contrato.productos.map((item) => (
            <div
              key={item.producto.id}
              className="flex align-items-center gap-2"
            >
              <span
                className="font-bold min-w-8rem"
                style={{ minWidth: "8rem" }}
              >
                {item.producto.nombre}
              </span>
              <div className="flex-grow-1">
                <div className="flex justify-content-between text-xs mt-1">
                  <span>
                    <MathJax>
                      {`\\(\\left(\\frac{Cantidad}{${item.cantidad.toLocaleString(
                        "de-DE"
                      )} \\text{ Bbl}}\\right)*\\)`}
                    </MathJax>
                  </span>
                  <span className="text-green-800">
                    {/* <MathJax>{`\\(${item.formula}\\)`}</MathJax> */}
                    <MathJax>
                      {`\\(\\left(\\frac{Brent + Convenio + Transporte}{${item.brent?.toLocaleString(
                        "de-DE",
                        {
                          style: "currency",
                          currency: "USD",
                        }
                      )} + (${item.convenio?.toLocaleString("de-DE", {
                        style: "currency",
                        currency: "USD",
                      })}) + ${item.precioTransporte?.toLocaleString("de-DE", {
                        style: "currency",
                        currency: "USD",
                      })}} = \\frac{Precio Unitario}{${(
                        item.precioUnitario + item.precioTransporte
                      )?.toLocaleString("de-DE", {
                        style: "currency",
                        currency: "USD",
                      })}}\\right)=\\)`}
                    </MathJax>
                  </span>
                  <span className="text-red-800">
                    <MathJax>
                      {`\\(\\left(\\frac{Total}{${(
                        (item.precioUnitario + item.precioTransporte) *
                        item.cantidad
                      ).toLocaleString("de-DE", {
                        style: "currency",
                        currency: "USD",
                      })}}\\right)\\)`}
                    </MathJax>
                  </span>
                  {/* <span className="text-red-800">
                    {item.totalTransporte.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </span> */}
                </div>
              </div>
            </div>
          ))}
        </div>
        <hr className="my-2" />
        <div className="flex flex-column gap-2">
          {/* <div className="flex align-items-center gap-2">
              <span className="font-bold min-w-8rem">
                Cantidad de Barril{" "}
                {(() => {
                  const totalCantidad = contrato.productos.reduce(
                    (acc, item) => acc + (item.cantidad || 0),
                    0
                  );

                  return `${totalCantidad.toLocaleString("de-DE")} Bbl`;
                })()}
              </span>
            </div> */}
          {/* <div className="flex align-items-center gap-2">
              <span className="font-bold min-w-8rem ">
                Formula
                <div className="flex justify-content-between text-xs mt-1">
                  <MathJax>
                    {`\\(Brent(${brentTotal.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "USD",
                    })}) + Conv(${convenioTotal.toLocaleString("de-DE", {
                      style: "currency",
                      currency: "USD",
                    })}) + Trans(${montoPorBarrilTransporte.toLocaleString(
                      "de-DE",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}) = ${(
                      brentTotal +
                      convenioTotal +
                      montoPorBarrilTransporte
                    ).toLocaleString("de-DE", {
                      style: "currency",
                      currency: "USD",
                    })}\\)`}
                  </MathJax>
                </div>
              </span>
            </div> */}
          {/* <div className="flex align-items-center gap-2">
              <span className="font-bold min-w-8rem">
                Monto Total{" "}
                {(montoTotal + montoTransporte).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div> */}
          {/* <div className="flex align-items-center gap-2">
              <span className="font-bold min-w-8rem">
                Monto Transporte{" "}
                {montoTransporte.toLocaleString("de-DE", {
                  style: "currency",
                  currency: "USD",
                })}
              </span>
            </div> */}

          <div className="flex align-items-center gap-2">
            <span className="font-bold min-w-8rem">
              {/* Monto Por Barril{" "}
                {(
                  (montoTotal + montoTransporte) /
                  totalCantidad
                ).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "USD",
                })} */}
              <MathJax>
                {`\\(MontoPorBarril = \\frac{Monto Total }{Total Cantidad} = \\frac{${(
                  montoTotal + montoTransporte
                ).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "USD",
                })}}{${totalCantidad.toLocaleString("de-DE")}\\text{ Bbl}} = ${(
                  (montoTotal + montoTransporte) /
                  totalCantidad
                ).toLocaleString("de-DE", {
                  style: "currency",
                  currency: "USD",
                })}\\)`}
              </MathJax>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModeladoRefineriaContratosSalesCard;

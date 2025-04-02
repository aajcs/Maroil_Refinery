import { useState, useEffect, useMemo, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { ToggleButton } from "primereact/togglebutton";
import { CrudeOption, Product } from "@/types/simulador";
import { getCrudeOptions } from "@/demo/service/simuladorService";
import { useRefineryPrecios } from "@/hooks/useRefineryPrecios";
import { ProgressSpinner } from "primereact/progressspinner";
import { Panel } from "primereact/panel";
import { Tag } from "primereact/tag";
import { classNames } from "primereact/utils";
import { getRefinerias } from "@/app/api/refineriaService";

type SimulationMode = "crudeToProducts" | "productsToCrude";
const products: Product[] = ["gas", "naphtha", "kerosene", "mgo4", "mgo6"];

const formSchema = z
  .object({
    mode: z.enum(["crudeToProducts", "productsToCrude"]),
    crudeType: z.string(),
    crudeAmount: z.number().min(1).optional(),
    desiredProducts: z.record(
      z.enum(["gas", "naphtha", "kerosene", "mgo4", "mgo6"]),
      z.number().min(0)
    ),
    productPrices: z.record(
      z.enum(["gas", "naphtha", "kerosene", "mgo4", "mgo6"]),
      z.number().min(0)
    ),
    crudeCosts: z.object({
      purchasePrice: z.number().min(0),
      transportCost: z.number().min(0),
      operationalCost: z.number().min(0),
    }),
  })
  .refine(
    (data) =>
      data.mode === "crudeToProducts"
        ? data.crudeAmount !== undefined
        : Object.values(data.desiredProducts).some((v) => v > 0),
    {
      message: "Debe ingresar cantidad de crudo o al menos un producto deseado",
      path: ["crudeAmount"],
    }
  );

type FormValues = z.infer<typeof formSchema>;

interface SimulatorFormProps {
  onCalculate: (data: FormValues) => void;
  isLoading: boolean;
}

export default function SimulatorForm({
  onCalculate,
  isLoading,
}: SimulatorFormProps) {
  const { loading, brent, oilDerivate } = useRefineryPrecios();
  const [refinerias, setRefinerias] = useState<any[]>([]);
  const crudeOptions = useMemo(() => getCrudeOptions(), []);
  console.log("oilDerivate", oilDerivate);
  useEffect(() => {
    const fetchRefinerias = async () => {
      try {
        const data = await getRefinerias();
        const { refinerias: dataRefinerias } = data;
        if (Array.isArray(dataRefinerias)) {
          setRefinerias(dataRefinerias);
        } else {
          console.error("La respuesta no es un array:", dataRefinerias);
        }
      } catch (error) {
        console.error("Error al obtener las refinerías:", error);
      }
    };

    fetchRefinerias();
  }, []);
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "crudeToProducts",
      crudeType: "crude1",
      crudeAmount: 1000,
      desiredProducts: products.reduce(
        (acc, product) => ({ ...acc, [product]: 0 }),
        {} as Record<Product, number>
      ),
      productPrices:
        oilDerivate ||
        products.reduce(
          (acc, product) => ({ ...acc, [product]: 0 }),
          {} as Record<Product, number>
        ),
      crudeCosts: {
        purchasePrice: crudeOptions[0]?.purchasePrice || 0,
        transportCost: crudeOptions[0]?.transportCost || 0,
        operationalCost: crudeOptions[0]?.operationalCost || 0,
      },
    },
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const mode = watch("mode");
  const crudeType = watch("crudeType");
  const selectedCrude = crudeOptions.find(
    (option) => option.value === crudeType
  );

  useEffect(() => {
    if (selectedCrude) {
      setValue("crudeCosts", {
        purchasePrice: selectedCrude.purchasePrice,
        transportCost: selectedCrude.transportCost,
        operationalCost: selectedCrude.operationalCost,
      });
    }
  }, [selectedCrude, setValue]);

  useEffect(() => {
    if (oilDerivate) {
      setValue("productPrices", oilDerivate);
    }
  }, [oilDerivate, setValue]);

  const onSubmit = (data: FormValues) => {
    onCalculate({
      ...data,
      crudeCosts: {
        purchasePrice: data.crudeCosts.purchasePrice + brent,
        transportCost: data.crudeCosts.transportCost,
        operationalCost: data.crudeCosts.operationalCost,
      },
    });
  };

  if (loading) {
    return (
      <div
        className="flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <ProgressSpinner />
        {/* <p className="ml-3">Cargando datos...</p> */}
      </div>
    );
  }

  return (
    <div className="card p-fluid">
      <h2 className="text-2xl font-bold mb-4">Simulador de Refinería</h2>

      <div className="field mb-4">
        <label className="font-bold block mb-2">Precio Actual del Brent</label>
        <InputNumber
          value={brent}
          mode="currency"
          currency="USD"
          locale="en-US"
          disabled
        />
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="">
          <label className="block font-medium text-900 mb-3 flex align-items-center">
            <i className="pi pi-database mr-2 text-primary"></i>
            Selecione la refinería
          </label>

          <Dropdown
            // value={field.value}
            // onChange={(e) => field.onChange(e.value)}
            options={refinerias.map((refineria) => ({
              label: `${refineria.nombre} - ${
                refineria.idProducto?.nombre || "Sin producto"
              } (${refineria.almacenamiento || 0} Bbl)`,
              value: {
                id: refineria.id,
                nombre: refineria.nombre,
                _id: refineria.id,
              },
            }))}
            placeholder="Seleccionar refinería"
            showClear
          />
        </div>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="field">
          <label className="font-bold block mb-2">Modo de simulación</label>
          <Controller
            name="mode"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2">
                <ToggleButton
                  checked={field.value === "crudeToProducts"}
                  onChange={(e) =>
                    field.onChange(
                      e.value ? "crudeToProducts" : "productsToCrude"
                    )
                  }
                  onLabel="Crudo → Derivados"
                  offLabel="Derivados → Crudo"
                  className="w-1/2"
                />
              </div>
            )}
          />
        </div>

        <div className="field">
          <label className="font-bold block mb-2">Tipo de crudo</label>
          <Controller
            name="crudeType"
            control={control}
            render={({ field }) => (
              <Dropdown
                {...field}
                options={crudeOptions}
                optionLabel="label"
                optionValue="value"
                placeholder="Seleccione un crudo"
                className="w-full"
                itemTemplate={(option: CrudeOption) => (
                  <div>
                    {option.label}{" "}
                    <span className="text-sm">
                      (API: {option.api}, Azufre: {option.sulfur}%)
                    </span>
                  </div>
                )}
              />
            )}
          />
        </div>

        <div className="p-4 surface-100 rounded-lg">
          <h3 className="font-bold text-lg mb-3">Costos del crudo</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Controller
              name="crudeCosts.purchasePrice"
              control={control}
              render={({ field }) => (
                <div className="field">
                  <label>Precio de compra ($/bbl)</label>
                  <InputNumber
                    {...field}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                  />
                </div>
              )}
            />
            <Controller
              name="crudeCosts.transportCost"
              control={control}
              render={({ field }) => (
                <div className="field">
                  <label>Costo transporte ($/bbl)</label>
                  <InputNumber
                    {...field}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                  />
                </div>
              )}
            />
            <Controller
              name="crudeCosts.operationalCost"
              control={control}
              render={({ field }) => (
                <div className="field">
                  <label>Costo operacional ($/bbl)</label>
                  <InputNumber
                    {...field}
                    mode="currency"
                    currency="USD"
                    locale="en-US"
                  />
                </div>
              )}
            />
          </div>
        </div>

        {mode === "crudeToProducts" ? (
          <div className="field">
            <label className="font-bold block mb-2">
              Cantidad de crudo (bbl)
            </label>
            <Controller
              name="crudeAmount"
              control={control}
              render={({ field }) => (
                <InputNumber
                  {...field}
                  value={field.value}
                  onValueChange={(e) => field.onChange(e.value)}
                  min={0}
                  className="w-full"
                />
              )}
            />
            {errors.crudeAmount && (
              <small className="text-red-500">
                {errors.crudeAmount.message}
              </small>
            )}
          </div>
        ) : (
          <div className="field">
            <label className="font-bold block mb-2">
              Derivados deseados (bbl)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {products.map((product) => (
                <Controller
                  key={product}
                  name={`desiredProducts.${product}`}
                  control={control}
                  render={({ field }) => (
                    <div className="field">
                      <label className="capitalize">{product}</label>
                      <InputNumber
                        {...field}
                        value={field.value}
                        onValueChange={(e) => field.onChange(e.value)}
                        min={0}
                        className="w-full"
                      />
                    </div>
                  )}
                />
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <Button
            type="button"
            label="Configuración avanzada"
            icon={`pi pi-chevron-${showAdvanced ? "up" : "down"}`}
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-button-text"
          />

          {showAdvanced && (
            <div className="surface-100 p-4 rounded-lg mt-2">
              <h3 className="font-bold text-lg mb-3">
                Precios de productos ($/bbl)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Controller
                    key={product}
                    name={`productPrices.${product}`}
                    control={control}
                    render={({ field }) => (
                      <div className="field">
                        <label className="capitalize">{product}</label>
                        <InputNumber
                          {...field}
                          value={field.value}
                          onValueChange={(e) => field.onChange(e.value)}
                          mode="currency"
                          currency="USD"
                          locale="en-US"
                        />
                      </div>
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        <Button
          type="submit"
          label="Calcular"
          className="w-full"
          loading={isLoading}
        />
      </form>
    </div>
  );
}

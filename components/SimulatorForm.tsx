import { useState, useEffect, useMemo, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { classNames } from "primereact/utils";
import { CrudeOption, Product } from "@/types/simulador";
import { getCrudeOptions } from "@/demo/service/simuladorService";
import { getRefinerias } from "@/app/api/refineriaService";
import { useRefineryPrecios } from "@/hooks/useRefineryPrecios";
import { useRefineryData } from "@/hooks/useRefineryData";
import { TipoProducto } from "@/libs/interfaces";
import { Dropdown } from "primereact/dropdown";
import { Accordion, AccordionTab } from "primereact/accordion";
import { ToggleButton } from "primereact/togglebutton";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { InputNumber } from "primereact/inputnumber";

// Definiciones de tipos y esquemas
type SimulationMode = "crudeToProducts" | "productsToCrude";
const products: Product[] = ["gas", "naphtha", "kerosene", "mgo4", "mgo6"];

const formSchema = z
  .object({
    mode: z.enum(["crudeToProducts", "productsToCrude"]),
    crudeType: z.object({
      id: z.string(),
      nombre: z.string(),
      gravedadAPI: z.number().optional(),
      azufre: z.number().optional(),
      rendimiento: z.number().optional(),
      color: z.string().optional(),
    }),

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
    idRefineria: z.object({
      id: z.string(),
      nombre: z.string(),
      _id: z.string(),
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
  // Hooks y estados
  const { loading, brent, oilDerivate } = useRefineryPrecios();
  const [refineria, setRefineria] = useState<any | null>(null);
  const {
    productos,
    tipoProductos,
    loading: loadingData,
  } = useRefineryData(refineria?.id || "");
  const [refinerias, setRefinerias] = useState<any[]>([]);
  const [tipoProducto, setTipoProducto] = useState<TipoProducto>();
  const [showAdvanced, setShowAdvanced] = useState(false);

  const crudeOptions = useMemo(() => getCrudeOptions(), []);

  // Form configuration
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: getDefaultValues(),
  });
  console.log("errors", errors);
  // Watchers
  const mode = watch("mode");
  const crudeType = watch("crudeType");
  const selectedCrude = crudeOptions.find(
    (option) => option.value === crudeType
  );

  // Efectos
  // useEffect(() => {
  //   fetchRefinerias();
  // }, []);

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

  // useEffect(() => {
  //   updateCrudeCosts();
  // }, [selectedCrude]);

  // useEffect(() => {
  //   updateProductPrices();
  // }, [oilDerivate]);

  // Handlers
  const onSubmit = (data: FormValues) => {
    console.log("data", data);
    // onCalculate(processFormData(data));
  };

  // Render helpers
  const renderRefinerySelector = () => (
    <div className="col-12 md:col-6 lg:col-6">
      <label className="block font-medium text-900 mb-3 flex align-items-center">
        <i className="pi pi-database mr-2 text-primary"></i>
        Seleccione la refinería
      </label>
      <Controller
        name="idRefineria"
        control={control}
        render={({ field, fieldState }) => (
          <Dropdown
            value={field.value}
            onChange={(e) => {
              field.onChange(e.value);
              setRefineria(e.value);
            }}
            options={refinerias.map((refineria) => ({
              label: `${refineria.nombre} - (${
                refineria.procesamientoDia || 0
              } Bbl x día)`,
              value: {
                id: refineria.id,
                nombre: refineria.nombre,
                _id: refineria.id,
              },
            }))}
            placeholder="Seleccionar refinería"
            className={classNames("w-full", { "p-invalid": fieldState.error })}
            showClear
            filter
          />
        )}
      />
    </div>
  );

  const renderCrudeTypeSelector = () => (
    <div className="col-12 md:col-6 lg:col-6">
      <label className="block font-medium text-900 mb-3 flex align-items-center">
        <i className="pi pi-database mr-2 text-primary"></i>
        Tipo de crudo
      </label>
      <Controller
        name="crudeType"
        control={control}
        render={({ field }) => (
          <Dropdown
            {...field}
            onChange={(e) => {
              field.onChange(e.value);
              setTipoProducto(e.value);
            }}
            options={tipoProductos.map((tipoProducto) => ({
              label: `${tipoProducto.nombre} - (API: ${
                tipoProducto.gravedadAPI || 0
              }, Azufre: ${tipoProducto.azufre || 0}%)`,
              value: { ...tipoProducto },
            }))}
            placeholder="Seleccione un crudo"
            className="w-full"
            filter
          />
        )}
      />
    </div>
  );

  const renderCrudeDetails = () => (
    <div className="col-12 md:col-12 lg:col-12 my-4">
      <Accordion>
        {tipoProducto && (
          <AccordionTab header={`Costos del crudo (${tipoProducto.nombre})`}>
            <CrudeCostsPanel tipoProducto={tipoProducto} />
          </AccordionTab>
        )}
        {tipoProducto && (
          <AccordionTab
            header={`Rendimientos (${tipoProducto.rendimientos?.length || 0})`}
          >
            <YieldDetails rendimientos={tipoProducto.rendimientos} />
          </AccordionTab>
        )}
      </Accordion>
    </div>
  );

  const renderSimulationModeToggle = () => (
    <div className="field">
      <label className="font-bold block mb-2">Modo de simulación</label>
      <Controller
        name="mode"
        control={control}
        render={({ field }) => (
          <Button
            label={
              field.value === "crudeToProducts"
                ? "Crudo → Derivados"
                : "Derivados → Crudo"
            }
            icon={
              field.value === "crudeToProducts"
                ? "pi pi-arrow-up"
                : "pi pi-arrow-down"
            }
            onClick={() =>
              field.onChange(
                field.value === "crudeToProducts"
                  ? "productsToCrude"
                  : "crudeToProducts"
              )
            }
            className="w-full p-button-outlined"
          />
        )}
      />
    </div>
  );

  const renderInputSection = () =>
    mode === "crudeToProducts" ? renderCrudeInput() : renderProductsInput();

  const renderCrudeInput = () => (
    <div className="field">
      <label className="font-bold block mb-2">Cantidad de crudo (bbl)</label>
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
        <small className="text-red-500">{errors.crudeAmount.message}</small>
      )}
    </div>
  );

  const renderProductsInput = () => (
    <div className="field">
      <label className="font-bold block mb-2">Derivados deseados (bbl)</label>
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
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="card p-fluid">
      <h2 className="text-2xl font-bold mb-4">Simulador de Refinería</h2>

      <div className="grid">
        {/* {renderBrentPrice()} */}
        {renderRefinerySelector()}
        {renderCrudeTypeSelector()}
        {renderCrudeDetails()}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {renderSimulationModeToggle()}
        {renderInputSection()}

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

// Componentes auxiliares
const LoadingSpinner = () => (
  <div
    className="flex justify-content-center align-items-center"
    style={{ height: "300px" }}
  >
    <ProgressSpinner />
  </div>
);

const CrudeCostsPanel = ({ tipoProducto }) => (
  <div
    className="p-3 mb-2 border-round shadow-1 text-sm text-gray-800 flex align-items-center gap-4"
    style={{ backgroundColor: `#${tipoProducto.idProducto?.color}20` }}
  >
    <span className="font-bold text-primary">
      {tipoProducto.idProducto?.nombre || "Producto Desconocido"}
    </span>
    <div className="flex gap-4">
      {/* Transporte */}
      <div className="flex align-items-center gap-2">
        <i className="pi pi-dollar text-green-500"></i>
        <span>
          <strong>costo Operacional:</strong>{" "}
          <InputNumber
            value={tipoProducto.costoOperacional || 0}
            onValueChange={(e) =>
              handleRendimientoChange(index, "costoOperacional", e.value)
            }
            mode="currency"
            currency="USD"
            locale="en-US"
            className="w-20"
          />
        </span>
      </div>

      {/* Bunker */}
      <div className="flex align-items-center gap-2">
        <i className="pi pi-dollar text-green-500"></i>
        <span>
          <strong>Transporte:</strong>{" "}
          <InputNumber
            value={tipoProducto.transporte || 0}
            onValueChange={(e) =>
              handleRendimientoChange(index, "transporte", e.value)
            }
            mode="currency"
            currency="USD"
            locale="en-US"
            className="w-20"
          />
        </span>
      </div>

      {/* Costo Venta */}
      <div className="flex align-items-center gap-2">
        <i className="pi pi-dollar text-green-500"></i>
        <span>
          <strong>Convenio Venta:</strong>{" "}
          <InputNumber
            value={tipoProducto.convenio || 0}
            onValueChange={(e) =>
              handleRendimientoChange(index, "convenio", e.value)
            }
            mode="currency"
            currency="USD"
            locale="en-US"
            className="w-20"
          />
        </span>
      </div>
    </div>
  </div>
);

const YieldDetails = ({ rendimientos }) => (
  <>
    {rendimientos?.map((rendimiento, index) => (
      <div
        key={index}
        className="p-3 mb-2 border-round shadow-1 text-sm text-gray-800 flex align-items-center gap-4"
        style={{ backgroundColor: `#${rendimiento.idProducto?.color}20` }}
      >
        <span className="font-bold text-primary">
          {rendimiento.idProducto?.nombre || "Producto Desconocido"}
        </span>
        <div className="flex gap-4">
          {/* Transporte */}
          <div className="flex align-items-center gap-2">
            <i className="pi pi-dollar text-green-500"></i>
            <span>
              <strong>Transporte:</strong>{" "}
              <InputNumber
                value={rendimiento.transporte || 0}
                onValueChange={(e) =>
                  handleRendimientoChange(index, "transporte", e.value)
                }
                mode="currency"
                currency="USD"
                locale="en-US"
                className="w-20"
              />
            </span>
          </div>

          {/* Bunker */}
          <div className="flex align-items-center gap-2">
            <i className="pi pi-dollar text-green-500"></i>
            <span>
              <strong>Bunker:</strong>{" "}
              <InputNumber
                value={rendimiento.bunker || 0}
                onValueChange={(e) =>
                  handleRendimientoChange(index, "bunker", e.value)
                }
                mode="currency"
                currency="USD"
                locale="en-US"
                className="w-20"
              />
            </span>
          </div>

          {/* Costo Venta */}
          <div className="flex align-items-center gap-2">
            <i className="pi pi-dollar text-green-500"></i>
            <span>
              <strong>Costo Venta:</strong>{" "}
              <InputNumber
                value={rendimiento.costoVenta || 0}
                onValueChange={(e) =>
                  handleRendimientoChange(index, "costoVenta", e.value)
                }
                mode="currency"
                currency="USD"
                locale="en-US"
                className="w-20"
              />
            </span>
          </div>

          {/* Porcentaje */}
          <div className="flex align-items-center gap-2">
            <i className="pi pi-percentage text-purple-500"></i>
            <span>
              <strong>Porcentaje:</strong>{" "}
              <InputNumber
                value={rendimiento.porcentaje || 0}
                onValueChange={(e) =>
                  handleRendimientoChange(index, "porcentaje", e.value)
                }
                suffix="%"
                className="w-20"
              />
            </span>
          </div>
        </div>
      </div>
    ))}
  </>
);

// Funciones de apoyo
const getDefaultValues = () => ({
  mode: "crudeToProducts",
  crudeType: "crude1",
  crudeAmount: 1000,
  desiredProducts: products.reduce(
    (acc, product) => ({ ...acc, [product]: 0 }),
    {} as Record<Product, number>
  ),
  productPrices: products.reduce(
    (acc, product) => ({ ...acc, [product]: 0 }),
    {} as Record<Product, number>
  ),
  crudeCosts: {
    purchasePrice: 0,
    transportCost: 0,
    operationalCost: 0,
  },
});

const processFormData = (data: FormValues) => ({
  ...data,
  crudeCosts: {
    purchasePrice: data.crudeCosts.purchasePrice + brent,
    transportCost: data.crudeCosts.transportCost,
    operationalCost: data.crudeCosts.operationalCost,
  },
});

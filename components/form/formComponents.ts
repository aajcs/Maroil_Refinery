//// filepath: /Users/alfredocastillo/Documents/GitHub/Maroil_Refinery/components/form/formComponents.ts
import { Controller, useFormContext } from "react-hook-form";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { classNames } from "primereact/utils";

export const FormCalendar = ({
  name,
  label,
  disabled,
}: {
  name: string;
  label: string;
  disabled?: boolean;
}) => {
  const { control } = useFormContext();

  return (
    <div className="field mb-4">
      <label htmlFor={name} className="font-medium text-900">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Calendar
            id={name}
            value={field.value ? new Date(field.value) : null}
            onChange={(e) => field.onChange(e.value)}
            showTime
            hourFormat="24"
            locale="es"
            disabled={disabled}
            className={classNames("w-full", { "p-invalid": fieldState.error })}
          />
        )}
      />
    </div>
  );
};

export const FormDropdown = ({
  name,
  label,
  options,
  disabled,
}: {
  name: string;
  label: string;
  options: { label: string; value: any }[];
  disabled?: boolean;
}) => {
  const { control } = useFormContext();

  return (
    <div className="field mb-4">
      <label htmlFor={name} className="font-medium text-900">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <Dropdown
            id={name}
            value={field.value}
            onChange={(e) => field.onChange(e.value)}
            options={options}
            optionLabel="label"
            filter
            showClear
            disabled={disabled}
            className={classNames("w-full", { "p-invalid": fieldState.error })}
          />
        )}
      />
    </div>
  );
};

export const FormInputNumber = ({
  name,
  label,
  disabled,
}: {
  name: string;
  label: string;
  disabled?: boolean;
}) => {
  const { control } = useFormContext();

  return (
    <div className="field mb-4">
      <label htmlFor={name} className="font-medium text-900">
        {label}
      </label>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState }) => (
          <InputNumber
            id={name}
            value={field.value}
            onValueChange={(e) => field.onChange(e.value)}
            min={0}
            locale="es"
            disabled={disabled}
            className={classNames("w-full", { "p-invalid": fieldState.error })}
          />
        )}
      />
    </div>
  );
};

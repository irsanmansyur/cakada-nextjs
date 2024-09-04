"use client";
import { useState, FC, useMemo } from "react";
import { Icon } from "@iconify/react";
import { InputErrorMessage } from "./input-error";
import { twMerge } from "tailwind-merge";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import { Input, Label, TextField } from "react-aria-components";

// Types for FormGroup Props
type FormGroupProps = {
  error?: string;
  label: string;
  type?: string;
  value?: string | number;
  classNameParent?: string;
  customInput?: boolean;
  name?: string;
  autoComplete?: string;
  onValueChange?: (value?: string) => void;
  allowNegative?: boolean;
  id?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

// FormGroup Component
const FormGroup: FC<FormGroupProps> = ({
  error,
  label,
  type: typeDefault = "text",
  value = "",
  classNameParent = "",
  customInput,
  name,
  autoComplete,
  onValueChange,
  allowNegative,
  id,
  className,
  ...inputProps
}) => {
  const [type, setType] = useState(typeDefault);
  const generatedId = useMemo(
    () => id || `id-${Math.random().toString(36).substr(2, 9)}`,
    [id]
  );

  return (
    <TextField className={twMerge("space-y-1", classNameParent)}>
      <Label
        htmlFor={generatedId}
        className="block text-sm font-medium leading-6 text-slate-900"
      >
        {label}
      </Label>
      <div className="mt-2 relative">
        {customInput ? (
          <CustomInput
            value={String(value)}
            className={twMerge(
              `block w-full rounded-md border-0 py-1.5 px-2 text-slate-800 shadow-sm ring-1 ring-inset ${
                !error ? "ring-slate-800/50" : "ring-red-500"
              } placeholder:text-slate-800/70 focus:ring-1 focus:ring-sky-500 sm:text-sm sm:leading-6 outline-none focus:text-sky-500`,
              className
            )}
            allowNegative={allowNegative}
            {...(inputProps as NumericFormatProps)}
          />
        ) : (
          <Input
            {...inputProps}
            type={type}
            value={value}
            id={generatedId}
            {...(name
              ? { name, autoComplete: autoComplete || name }
              : { autoComplete: "off" })}
            className={twMerge(
              `block w-full rounded-md border py-1.5 px-2 text-slate-700 shadow-sm ring-1 ring-inset ${
                !error ? "ring-slate-50/50" : "ring-red-500"
              } placeholder:text-slate-100/70  focus:ring-1 focus:ring-slate-800 sm:text-sm sm:leading-6 outline-none focus:text-slate-800 bg-slate-50`,
              className
            )}
          />
        )}
        {typeDefault === "password" && (
          <Icon
            icon={type === "password" ? "ri:eye-fill" : "formkit:hidden"}
            className="w-6 h-6 absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-sky-500"
            onClick={() => {
              setType(type === "text" ? "password" : "text");
            }}
          />
        )}
      </div>
      <InputErrorMessage error={error} />
    </TextField>
  );
};

// CustomInput Component
const CustomInput: FC<NumericFormatProps> = (props) => {
  return <NumericFormat {...props} />;
};

// Types for SelectFormGroup Props
type SelectFormGroupProps = {
  error?: string;
  label: string;
  options: { value: string | number; label: string }[];
  classNameParent?: string;
  id?: string;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

// SelectFormGroup Component
export const SelectFormGroup: FC<SelectFormGroupProps> = ({
  error,
  label,
  options,
  classNameParent = "",
  id,
  className,
  ...selectProps
}) => {
  const generatedId =
    id || `auto-generated-id-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <TextField className={twMerge("space-y-1", classNameParent)}>
      <Label
        htmlFor={generatedId}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </Label>
      <div className="mt-2 relative">
        <select
          {...selectProps}
          id={generatedId}
          className={twMerge(
            `block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset outline-none ${
              !error ? "ring-gray-300" : "ring-red-400"
            } placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-sky-500 sm:text-sm sm:leading-6`,
            className
          )}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <InputErrorMessage error={error} />
    </TextField>
  );
};

export default FormGroup;

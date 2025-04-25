import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { FormControl, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password" | "file";
  disVal?: boolean;
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disVal = false,
  type = "text",
}: FormFieldProps<T>) => (
  <Controller
    control={control}
    name={name}
    disabled={disVal}
    render={({ field, fieldState }) => (
      <FormItem>
        <FormLabel className="label">{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} {...field} type={type} />
        </FormControl>
        {fieldState.error && (
          <FormMessage>{fieldState.error.message}</FormMessage>
        )}
      </FormItem>
    )}
  />
);

export default FormField;

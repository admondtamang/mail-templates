import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldErrors, UseFormRegister } from "react-hook-form";

interface TextInputProps {
  name: string;
  label: string;
  required: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export function TextInput({
  name,
  label,
  required,
  register,
  errors,
}: TextInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>{" "}
      {required && <span className="text-red-500">*</span>}
      <Input type="text" {...register(name, { required })} />
      {errors[name] && (
        <p className="text-red-500 text-sm">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
}

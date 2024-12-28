import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FieldErrors, UseFormRegister } from 'react-hook-form';

interface EmailListInputProps {
  name: string;
  label: string;
  required: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export function EmailListInput({ name, label, required, register, errors }: EmailListInputProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        type="text"
        placeholder="Enter email addresses separated by commas"
        {...register(name, {
          required,
          pattern: {
            value: /^([a-zA-Z0-9_\-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,},?\s*)*$/,
            message: 'Invalid email format',
          },
        })}
      />
      {errors[name] && <p className="text-red-500 text-sm">{errors[name]?.message as string}</p>}
    </div>
  );
}

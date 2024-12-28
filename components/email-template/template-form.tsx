"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { HTMLEditor } from '@/components/email-template/html-editor';
import { cn } from '@/lib/utils';

type Field = {
  name: string;
  label: string;
  type: 'text' | 'email-list' | 'editor';
  required: boolean;
};

type Step = {
  title: string;
  fields: Field[];
};


const steps: Step[] = [
  {
    title: 'Template Details',
    fields: [
      { name: 'name', label: 'Template Name', type: 'text', required: true },
      { name: 'subject', label: 'Subject', type: 'text', required: true },
      { name: 'sendTo', label: 'Send To', type: 'email-list', required: true },
      { name: 'cc', label: 'CC', type: 'email-list', required: false },
      { name: 'bcc', label: 'BCC', type: 'email-list', required: false },
    ],
  },
  {
    title: 'Email Content',
    fields: [{ name: 'content', label: 'Content', type: 'editor', required: true }],
  },
];
interface TemplateFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
}

export function TemplateForm({ onSubmit, initialData = {} }: TemplateFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: initialData,
  });

  const content = watch('content');

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderField = (field:Field) => {
    if (field.type === 'email-list') {
      return (
        <div className="space-y-2" key={field.name}>
          <Label>{field.label}</Label>
          <Input
            type="text"
            placeholder="Enter email addresses separated by commas"
            {...register(field.name, {
              required: field.required,
              pattern: {
                value: /^([a-zA-Z0-9_\-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,},?\s*)*$/,
                message: 'Invalid email format',
              },
            })}
          />
          {errors[field.name] && (
              <p className="text-red-500 text-sm">{errors[field.name]?.message as string}</p>
          )}
        </div>
      );
    }

    if (field.type === 'editor') {
      return (
        <div className="grid grid-cols-2 gap-4 h-[calc(100vh-300px)]" key={field.name}>
          <div className="space-y-2 min-h-[40dvh] ">
            <Label>{field.label}</Label>
            <HTMLEditor
              value={content || ''}
              onChange={(value) => setValue('content', value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Preview</Label>
            <Card className="h-full overflow-auto p-4">
              <div dangerouslySetInnerHTML={{ __html: content || '' }} />
            </Card>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-2" key={field.name}>
        <Label>{field.label}</Label>
        <Input
          type={field.type}
          {...register(field.name, { required: field.required })}
        />
        {errors[field.name] && (
          <p className="text-red-500 text-sm">This field is required</p>
        )}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <div className={cn(
        "space-y-4",
        currentStep === 1 && "h-[calc(100vh-300px)]"
      )}>
        {steps[currentStep].fields.map(renderField)}
      </div>

      <div className="flex justify-between mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button type="submit">
            Save Template
          </Button>
        ) : (
          <Button type="button" onClick={nextStep}>
            Next
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </form>
  );
}
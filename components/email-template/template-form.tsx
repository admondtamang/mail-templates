"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EmailListInput } from './email-list-input';
import {TextInput}  from './text-input';
import { HTMLEditorField } from './html-editor-field';
import { templateSchema, TemplateSchemaType } from './schema';

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

interface TemplateFormProps {
  onSubmit: (data: any) => void;
  initialData?:any| Partial<TemplateSchemaType>;
}

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

export function TemplateForm({ onSubmit, initialData = {} }: TemplateFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: initialData,
    resolver: zodResolver(templateSchema),
  });

  const content = watch('content');

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const renderField = (field: Field) => {
    switch (field.type) {
      case 'text':
        return (
          <TextInput
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            register={register}
            errors={errors}
          />
        );
      case 'email-list':
        return (
          <EmailListInput
            key={field.name}
            name={field.name}
            label={field.label}
            required={field.required}
            register={register}
            errors={errors}
          />
        );
      case 'editor':
        return (
          <HTMLEditorField
            key={field.name}
            name={field.name}
            label={field.label}
            value={content || ''}
            setValue={setValue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{steps[currentStep].title}</h2>
        <div className="text-sm text-gray-500">
          Step {currentStep + 1} of {steps.length}
        </div>
      </div>

      <div className={cn('space-y-4', currentStep === 1 && 'h-[calc(100vh-300px)]')}>
        {steps[currentStep].fields.map(renderField)}
      </div>

      <div className="flex justify-between mt-6">
        <Button type="button" variant="outline" onClick={prevStep} disabled={currentStep === 0}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>

        {currentStep === steps.length - 1 ? (
          <Button type="submit">{Object.keys(initialData).length > 0 ? 'Update Template': 'Save Template'}</Button>
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

"use client";

import { useRouter } from 'next/navigation';
import {TemplateForm} from '@/components/email-template/template-form';

export default function NewTemplatePage() {
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    const response = await fetch('/api/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...data,
        sendTo: data.sendTo.split(',').map((email) => email.trim()),
        cc: data.cc ? data.cc.split(',').map((email) => email.trim()) : [],
        bcc: data.bcc ? data.bcc.split(',').map((email) => email.trim()) : [],
      }),
    });

    if (response.ok) {
      router.push('/templates');
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Template</h1>
      <div className="max-w-3xl mx-auto">
        <TemplateForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
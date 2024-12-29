import {TemplateList} from '@/components/email-template/template-list';

export default function TemplatesPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Email Templates</h1>
      <TemplateList />
    </div>
  );
}
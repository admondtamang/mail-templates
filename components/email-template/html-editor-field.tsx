import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { HTMLEditor } from '@/components/email-template/html-editor';

interface HTMLEditorFieldProps {
  name: string;
  label: string;
  value: string;
  setValue: (name: string, value: any) => void;
}

export function HTMLEditorField({ name, label, value, setValue }: HTMLEditorFieldProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 h-[55dvh]">
        <Label>{label}</Label>
        <HTMLEditor value={value || ''} onChange={(value) => setValue(name, value)} />
      </div>
      <div className="space-y-2">
        <Label>Preview</Label>
        <Card className="h-full overflow-auto p-4">
          <div dangerouslySetInnerHTML={{ __html: value || '' }} />
        </Card>
      </div>
    </div>
  );
}

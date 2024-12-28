"use client";

import { Editor } from '@monaco-editor/react';

interface HTMLEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function HTMLEditor({ value, onChange }: HTMLEditorProps) {
  return (
    <div className="border rounded-md h-full">
      <Editor
        height="100%"
        defaultLanguage="html"
        value={value}
        onChange={(value) => onChange(value || '')}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
      />
    </div>
  );
}
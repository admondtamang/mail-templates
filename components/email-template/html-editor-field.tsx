import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { HTMLEditor } from "@/components/email-template/html-editor";
import { Button } from "../ui/button";
import React from "react";
import { Fullscreen } from "lucide-react";

interface HTMLEditorFieldProps {
  name: string;
  label: string;
  value: string;
  setValue: (name: string, value: any) => void;
}

export function HTMLEditorField({
  name,
  label,
  value,
  setValue,
}: HTMLEditorFieldProps) {
  const [isFullScreen, setIsFullScreen] = React.useState(false);

  const toggleFullScreen = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2 h-[55dvh]">
        {/* <div className="flex justify-start gap-2 items-center"> */}
        <Label>{label}</Label>

        {/* <Button variant="outline" size="icon" onClick={toggleFullScreen}>
            <Fullscreen className="h-4 w-4" />
          </Button> */}
        {/* </div> */}

        <HTMLEditor
          value={value || ""}
          onChange={(value) => setValue(name, value)}
        />
      </div>
      <div className="space-y-2 h-[55dvh]">
        <Label>Preview</Label>
        <Card className="h-full overflow-auto p-4">
          <div dangerouslySetInnerHTML={{ __html: value || "" }} />
        </Card>
      </div>
    </div>
  );
}

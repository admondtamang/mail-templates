"use client";

import { useParams, useRouter } from "next/navigation";
import { TemplateForm } from "@/components/email-template/template-form";
import axios, { AxiosResponse } from "axios";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export default function NewTemplatePage() {
  const router = useRouter();
  const params = useParams();
  const toast = useToast();
  const id = params.id as string;

  const { data: template, isLoading } = useQuery({
    queryKey: ["templates", id],
    queryFn: async () => {
      const { data }: AxiosResponse<any> = await axios(`/api/templates/${id}`);

      return data;
    },
  });

  const handleSubmit = async (data: any) => {
    const response = await fetch("/api/templates/" + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        sendTo: data.sendTo.split(",").map((email) => email.trim()),
        cc: data.cc ? data.cc.split(",").map((email) => email.trim()) : [],
        bcc: data.bcc ? data.bcc.split(",").map((email) => email.trim()) : [],
      }),
    });

    if (data.sendTo) {
      const response = await fetch(
        `/api/templates/${id}/send?to=${data.sendTo}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (response.ok) {
      router.push("/templates");
    }
  };

  const convertArrayToString = (array: string[]) => {
    return array.join(",");
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Create New Template</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="mx-auto pr-4">
          <TemplateForm
            onSubmit={handleSubmit}
            initialData={{
              name: template?.name,
              content: template?.content,
              subject: template?.subject,
              sendTo: convertArrayToString(template?.sendTo),
              cc: convertArrayToString(template?.cc),
              bcc: convertArrayToString(template?.bcc),
            }}
          />
        </div>
      )}
    </div>
  );
}

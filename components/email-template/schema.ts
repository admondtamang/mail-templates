import { z } from "zod";

const templateSchema = z.object({
    name: z.string().min(1, 'Template Name is required'),
    subject: z.string().min(1, 'Subject is required'),
    sendTo: z
      .string()
      .min(1, 'Send To is required')
      .regex(/^([a-zA-Z0-9_\-.]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,},?\s*)*$/, 'Invalid email format').optional(),
    cc: z.string().optional(),
    bcc: z.string().optional(),
    content: z.string().min(1, 'Content is required'),
  });
  
type TemplateSchemaType = z.infer<typeof templateSchema>;

export { templateSchema}
export type { TemplateSchemaType}
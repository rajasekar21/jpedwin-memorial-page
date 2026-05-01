import { z } from 'zod';

const cleanText = (value: string) =>
  value
    .replace(/<[^>]*>?/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

export const memorySubmissionSchema = z.object({
  name: z.string().min(2).max(80).transform(cleanText),
  relationship: z.string().min(2).max(80).transform(cleanText),
  message: z.string().min(20).max(2000).transform(cleanText)
});

export type MemorySubmission = z.infer<typeof memorySubmissionSchema>;

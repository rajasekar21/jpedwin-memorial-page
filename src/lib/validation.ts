import { z } from 'zod';

const cleanText = (value: string) =>
  value
    .replace(/<[^>]*>?/gm, '')
    // Strip Unicode bidi overrides and zero-width characters to prevent admin UI spoofing
    .replace(/[​-‍‪-‮⁦-⁩﻿]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Zod schema that validates and sanitises a visitor memory submission. */
export const memorySubmissionSchema = z.object({
  name: z.string().min(2).max(80).transform(cleanText),
  relationship: z.string().min(2).max(80).transform(cleanText),
  message: z.string().min(20).max(2000).transform(cleanText)
});

export type MemorySubmission = z.infer<typeof memorySubmissionSchema>;

export const memoryPhotoSchema = z
  .custom<File>((file) => typeof File !== 'undefined' && file instanceof File)
  .optional()
  .refine((file) => !file || file.size <= 5 * 1024 * 1024, 'Photo must be 5 MB or smaller.')
  .refine((file) => !file || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type), 'Photo must be a JPG, PNG, or WebP image.');

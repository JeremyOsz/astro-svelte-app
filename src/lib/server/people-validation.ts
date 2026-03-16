import { z } from 'zod';

const birthDataSchema = z.object({
  date: z.string().min(1),
  time: z.string().min(1),
  place: z.string().min(1),
  latitude: z.number().finite(),
  longitude: z.number().finite()
});

export const createPersonSchema = z.object({
  name: z.string().trim().min(1).max(120),
  birthData: birthDataSchema,
  chartData: z.string().min(1)
});

export const updatePersonSchema = z.object({
  name: z.string().trim().min(1).max(120).optional(),
  birthData: birthDataSchema.optional(),
  chartData: z.string().min(1).optional()
}).refine((value) => Object.keys(value).length > 0, {
  message: 'At least one field is required'
});

export const importPeopleSchema = z.object({
  people: z.array(createPersonSchema).max(500)
});

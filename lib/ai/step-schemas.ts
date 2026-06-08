import { z } from 'zod';

/**
 * Schema for a single diagnostic step returned by the model. The model either
 * asks the next highest-value question or concludes with a diagnosis. We keep
 * the two shapes in one discriminated union so the route can validate whichever
 * the model decided to return.
 */

const answerStyle = z.enum(['', 'yes', 'warn', 'no']).catch('');

const questionStepSchema = z.object({
  kind: z.literal('question'),
  question: z.string().min(1),
  context: z.string().default(''),
  tip: z.string().nullable().default(null),
  phase: z.string().default(''),
  answers: z
    .array(
      z.object({
        label: z.string().min(1),
        sub: z.string().nullable().default(null),
        style: answerStyle,
      }),
    )
    .min(2)
    .max(6),
});

const outcomeStepSchema = z.object({
  kind: z.literal('outcome'),
  title: z.string().min(1),
  icon: z.string().nullable().default(null),
  finding: z.string().min(1),
  steps: z.array(z.string()).default([]),
  tools: z.array(z.string()).default([]),
  safety: z.string().nullable().default(null),
  confidence: z.enum(['high', 'medium', 'low']).catch('medium'),
  rationale: z.string().default(''),
  watchouts: z.array(z.string()).default([]),
  phase: z.string().default(''),
});

export const diagnosticStepSchema = z.discriminatedUnion('kind', [
  questionStepSchema,
  outcomeStepSchema,
]);

export type DiagnosticStepParsed = z.infer<typeof diagnosticStepSchema>;

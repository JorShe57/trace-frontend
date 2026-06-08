import { z } from 'zod';

export const enrichedDiagnosisSchema = z.object({
  summary: z.string().describe('2-3 sentence plain-language diagnosis for the technician'),
  finding: z.string().describe('Expanded finding grounded in the path taken'),
  steps: z.array(z.string()).describe('Prioritized next steps specific to this path'),
  tools: z.array(z.string()).describe('Tools needed for this path'),
  safety: z
    .string()
    .nullable()
    .describe('Safety warning or null if none beyond the tree baseline'),
  confidence: z.enum(['high', 'medium', 'low']),
  rationale: z.string().describe('Why this outcome fits the answers given'),
  watchouts: z.array(z.string()).describe('Easy-to-miss checks on this specific path'),
});

export type EnrichedDiagnosisParsed = z.infer<typeof enrichedDiagnosisSchema>;

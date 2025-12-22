import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.5-flash',
});

const JobSchema = z.object({
    id: z.string(),
    title: z.string(),
    category: z.string(),
    description: z.string(),
    price: z.number(),
    location: z.string(),
});

const JobMatchInputSchema = z.object({
    userSkills: z.array(z.string()).describe('User skills and experience'),
    userPreferences: z.object({
        maxDistance: z.number().optional(),
        preferredCategories: z.array(z.string()).optional(),
        minPrice: z.number().optional(),
    }).optional(),
    availableJobs: z.array(JobSchema),
});

const JobMatchOutputSchema = z.object({
    recommendations: z.array(z.object({
        jobId: z.string(),
        matchScore: z.number().min(0).max(100),
        reason: z.string().describe('Why this job matches in Polish'),
    })),
    summary: z.string().describe('Summary of recommendations in Polish'),
});

export const jobMatcherFlow = ai.defineFlow(
    {
        name: 'jobMatcherFlow',
        inputSchema: JobMatchInputSchema,
        outputSchema: JobMatchOutputSchema,
    },
    async (input) => {
        const prompt = `Jesteś ekspertem dopasowującym oferty pracy dorywczej dla seniorów 60+.

Umiejętności użytkownika: ${input.userSkills.join(', ')}
Preferencje: ${JSON.stringify(input.userPreferences || {})}

Dostępne oferty pracy:
${input.availableJobs.map(job => `
- ID: ${job.id}
  Tytuł: ${job.title}
  Kategoria: ${job.category}
  Opis: ${job.description}
  Cena: ${job.price} PLN
  Lokalizacja: ${job.location}
`).join('\n')}

Oceń każdą ofertę pod kątem dopasowania do umiejętności i preferencji użytkownika.
Zwróć listę rekomendacji posortowaną od najlepszego dopasowania.
Podaj krótkie uzasadnienie po polsku dla każdej rekomendacji.`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: JobMatchOutputSchema },
        });

        if (!output) {
            return {
                recommendations: [],
                summary: 'Nie udało się przeanalizować ofert. Spróbuj ponownie później.',
            };
        }

        return output;
    }
);

import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

const ai = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.5-flash',
});

const TripSchema = z.object({
    id: z.string(),
    title: z.string(),
    destination: z.string(),
    date: z.string(),
    price: z.number(),
    accessibilityTags: z.array(z.string()),
});

const TravelInputSchema = z.object({
    userPreferences: z.object({
        mobilityNeeds: z.array(z.string()).optional().describe('e.g., winda, płaski teren'),
        dietaryNeeds: z.array(z.string()).optional(),
        budgetMax: z.number().optional(),
        interests: z.array(z.string()).optional(),
    }),
    availableTrips: z.array(TripSchema),
});

const TravelOutputSchema = z.object({
    recommendations: z.array(z.object({
        tripId: z.string(),
        matchScore: z.number().min(0).max(100),
        highlights: z.array(z.string()).describe('Key benefits for this user in Polish'),
        warning: z.string().optional().describe('Any concerns for the user'),
    })),
    personalizedMessage: z.string().describe('Friendly recommendation message in Polish'),
});

export const travelRecommenderFlow = ai.defineFlow(
    {
        name: 'travelRecommenderFlow',
        inputSchema: TravelInputSchema,
        outputSchema: TravelOutputSchema,
    },
    async (input) => {
        const prompt = `Jesteś ekspertem od wycieczek dla seniorów 60+. 
Twoim zadaniem jest rekomendować wycieczki dopasowane do potrzeb i ograniczeń użytkownika.

Potrzeby użytkownika:
- Mobilność: ${input.userPreferences.mobilityNeeds?.join(', ') || 'brak szczególnych wymagań'}
- Dieta: ${input.userPreferences.dietaryNeeds?.join(', ') || 'brak ograniczeń'}
- Maksymalny budżet: ${input.userPreferences.budgetMax ? input.userPreferences.budgetMax + ' PLN' : 'bez limitu'}
- Zainteresowania: ${input.userPreferences.interests?.join(', ') || 'różne'}

Dostępne wycieczki:
${input.availableTrips.map(trip => `
- ID: ${trip.id}
  Tytuł: ${trip.title}
  Cel: ${trip.destination}
  Data: ${trip.date}
  Cena: ${trip.price} PLN
  Udogodnienia: ${trip.accessibilityTags.join(', ')}
`).join('\n')}

WAŻNE:
- Sprawdź czy wycieczka spełnia wymagania mobilności (np. jeśli użytkownik potrzebuje windy, czy jest dostępna)
- Zwróć uwagę na cenę względem budżetu
- Podaj konkretne korzyści dla tego użytkownika po polsku
- Jeśli coś może być problemem (np. brak windy), ostrzeż w polu "warning"

Odpowiedz ciepłą, przyjazną rekomendacją po polsku.`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: TravelOutputSchema },
        });

        if (!output) {
            return {
                recommendations: [],
                personalizedMessage: 'Przepraszam, nie udało się przygotować rekomendacji. Spróbuj ponownie później.',
            };
        }

        return output;
    }
);

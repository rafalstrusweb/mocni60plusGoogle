import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

// Initialize Genkit with Gemini
const ai = genkit({
    plugins: [googleAI()],
    model: 'googleai/gemini-2.5-flash',
});

// Input schema
const ChatInputSchema = z.object({
    message: z.string().describe('User message in Polish'),
    context: z.string().optional().describe('Current app context (page, action)'),
});

// Output schema
const ChatOutputSchema = z.object({
    response: z.string().describe('Helpful response in Polish'),
    suggestedActions: z.array(z.object({
        label: z.string(),
        action: z.string(),
    })).optional().describe('Suggested actions for the user'),
});

// Chatbot flow for helping seniors navigate the app
export const chatbotFlow = ai.defineFlow(
    {
        name: 'chatbotFlow',
        inputSchema: ChatInputSchema,
        outputSchema: ChatOutputSchema,
    },
    async (input) => {
        const systemPrompt = `Jesteś pomocnym asystentem aplikacji Mocni60+ - platformy dla osób 60+.
Twoje zadanie to pomagać seniorom w nawigacji po aplikacji i odpowiadać na pytania.

Zasady:
- Odpowiadaj ZAWSZE po polsku
- Używaj prostego, zrozumiałego języka
- Bądź cierpliwy i uprzejmy
- Podawaj konkretne instrukcje krok po kroku
- Jeśli nie wiesz odpowiedzi, powiedz to szczerze

Kontekst aplikacji:
- Aplikacja oferuje: pracę dorywczą, wycieczki, społeczność seniorów
- Strona "Praca" - oferty pracy dorywczej w okolicy
- Strona "Podróże" - wycieczki dostosowane do seniorów (winda, płaski teren)
- Strona "Ludzie" - grupy tematyczne i spotkania offline
- Strona "Zdrowie" - w budowie

Aktualny kontekst użytkownika: ${input.context || 'strona główna'}`;

        const prompt = `${systemPrompt}

Wiadomość użytkownika: ${input.message}

Odpowiedz pomocnie i zasugeruj konkretne akcje jeśli to możliwe.`;

        const { output } = await ai.generate({
            prompt,
            output: { schema: ChatOutputSchema },
        });

        if (!output) {
            return {
                response: 'Przepraszam, wystąpił błąd. Proszę spróbować ponownie.',
                suggestedActions: [],
            };
        }

        return output;
    }
);

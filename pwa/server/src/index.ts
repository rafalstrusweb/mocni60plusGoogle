import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { chatbotFlow } from './flows/chatbot.js';
import { jobMatcherFlow } from './flows/jobMatcher.js';
import { travelRecommenderFlow } from './flows/travelRecommender.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests from any localhost port
        if (!origin || origin.startsWith('http://localhost:')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'mocni60plus-ai' });
});

// Chatbot endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context } = req.body;
        const response = await chatbotFlow({ message, context });
        res.json(response);
    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas przetwarzania wiadomości' });
    }
});

// Job matcher endpoint
app.post('/api/match-jobs', async (req, res) => {
    try {
        const { userSkills, userPreferences, availableJobs } = req.body;
        const response = await jobMatcherFlow({ userSkills, userPreferences, availableJobs });
        res.json(response);
    } catch (error) {
        console.error('Job matcher error:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas dopasowywania ofert' });
    }
});

// Travel recommender endpoint
app.post('/api/recommend-travel', async (req, res) => {
    try {
        const { userPreferences, availableTrips } = req.body;
        const response = await travelRecommenderFlow({ userPreferences, availableTrips });
        res.json(response);
    } catch (error) {
        console.error('Travel recommender error:', error);
        res.status(500).json({ error: 'Wystąpił błąd podczas rekomendacji wycieczek' });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Mocni60+ AI Server running on http://localhost:${PORT}`);
    console.log(`📊 Genkit Developer UI: genkit start -- npx tsx --watch src/index.ts`);
});

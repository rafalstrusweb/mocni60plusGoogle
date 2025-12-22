// AI API client for communicating with Genkit server

const AI_SERVER_URL = import.meta.env.VITE_AI_SERVER_URL || 'http://localhost:3001';

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    suggestedActions?: Array<{ label: string; action: string }>;
}

export interface ChatResponse {
    response: string;
    suggestedActions?: Array<{ label: string; action: string }>;
}

export interface JobRecommendation {
    jobId: string;
    matchScore: number;
    reason: string;
}

export interface TravelRecommendation {
    tripId: string;
    matchScore: number;
    highlights: string[];
    warning?: string;
}

// Chatbot API
export async function sendChatMessage(message: string, context?: string): Promise<ChatResponse> {
    const response = await fetch(`${AI_SERVER_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, context }),
    });

    if (!response.ok) {
        throw new Error('Failed to send message');
    }

    return response.json();
}

// Job matching API
export async function getJobRecommendations(
    userSkills: string[],
    userPreferences: { maxDistance?: number; preferredCategories?: string[]; minPrice?: number },
    availableJobs: Array<{ id: string; title: string; category: string; description: string; price: number; location: string }>
): Promise<{ recommendations: JobRecommendation[]; summary: string }> {
    const response = await fetch(`${AI_SERVER_URL}/api/match-jobs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userSkills, userPreferences, availableJobs }),
    });

    if (!response.ok) {
        throw new Error('Failed to get job recommendations');
    }

    return response.json();
}

// Travel recommendations API
export async function getTravelRecommendations(
    userPreferences: { mobilityNeeds?: string[]; dietaryNeeds?: string[]; budgetMax?: number; interests?: string[] },
    availableTrips: Array<{ id: string; title: string; destination: string; date: string; price: number; accessibilityTags: string[] }>
): Promise<{ recommendations: TravelRecommendation[]; personalizedMessage: string }> {
    const response = await fetch(`${AI_SERVER_URL}/api/recommend-travel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userPreferences, availableTrips }),
    });

    if (!response.ok) {
        throw new Error('Failed to get travel recommendations');
    }

    return response.json();
}

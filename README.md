# Mocni60+ 💪

A Progressive Web App (PWA) for seniors 60+ in Poland, helping them find work, travel, and community.

## Features

- 🤖 **AI Chatbot** - Gemini-powered assistant in Polish
- 🔐 **Firebase Auth** - Google & email/password login
- 💼 **Gigs** - Find local side jobs
- ✈️ **Travel** - Senior-friendly trips with accessibility info
- 👥 **Community** - Groups and local events

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **AI:** Google Genkit + Gemini 2.5 Flash
- **Auth:** Firebase Authentication
- **Backend:** Express.js + Node.js

## Getting Started

```bash
# Install dependencies
cd pwa && npm install
cd server && npm install

# Set up environment variables
cp pwa/.env.example pwa/.env.local
cp pwa/server/.env.example pwa/server/.env

# Run the app
cd pwa && npm run dev          # Frontend on :5173
cd pwa/server && npm run dev   # AI Server on :3001
```

## Environment Variables

### PWA (`pwa/.env.local`)
```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_domain
VITE_FIREBASE_PROJECT_ID=your_project
VITE_AI_SERVER_URL=http://localhost:3001
```

### Server (`pwa/server/.env`)
```
GEMINI_API_KEY=your_gemini_key
```

## License

MIT

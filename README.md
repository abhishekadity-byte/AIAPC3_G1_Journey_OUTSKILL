AIAPC3_G1_Journey_OUTSKILL

# Journey - AI Travel Assistant

A beautiful, modern travel planning application with AI-powered assistance and user authentication.

## ✨ Features

- **AI Travel Assistant**: Get personalized travel recommendations and planning help
- **User Authentication**: Secure signup, login, and profile management
- **Beautiful UI**: Modern design with smooth animations and responsive layout
- **Travel Planning**: Interactive features for planning your perfect journey

## 🚀 Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```

3. **Environment Setup**:
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials
   - Add your n8n webhook URL (optional)

## 🔐 Authentication

The app includes a complete authentication system:
- User registration and login
- Secure password hashing with bcrypt
- Profile management
- Session persistence

## 🤖 AI Integration

Connect your n8n workflow for AI-powered travel assistance by setting the `VITE_N8N_WEBHOOK_URL` environment variable.

## 🛠️ Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **Authentication**: Custom implementation with bcrypt
- **Icons**: Lucide React
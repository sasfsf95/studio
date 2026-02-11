# Yuki AI - Virtual AI Companion

## Overview
Yuki AI is a Next.js application featuring a virtual AI companion with chat capabilities. The project uses Google's Genkit AI framework for conversation generation and includes Firebase integration. The application has age verification and premium features.

## Recent Changes
- **2025-09-04**: Imported from GitHub and configured for Replit environment
- **2025-09-04**: Updated dev server to run on port 5000 with host 0.0.0.0
- **2025-09-04**: Configured deployment settings for autoscale deployment
- **2025-09-04**: Set up development workflow for frontend server

## Project Architecture

### Frontend
- **Framework**: Next.js 15.3.3 with Turbopack
- **UI**: React with Radix UI components and Tailwind CSS
- **Key Features**: 
  - Age verification gate
  - Chat interface with AI companion
  - Premium subscription dialog
  - Responsive design with dark mode

### AI Integration
- **Framework**: Google Genkit AI
- **Model**: Gemini 2.0 Flash
- **Features**:
  - Text-to-speech conversion
  - Chat history summarization
  - Icebreaker message generation

### File Structure
```
src/
├── ai/               # AI flows and Genkit configuration
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── elysium/      # App-specific components
│   └── ui/           # Reusable UI components
├── hooks/            # Custom React hooks
└── lib/              # Utilities
```

### Development Setup
- **Port**: 5000 (configured for Replit)
- **Host**: 0.0.0.0 (allows external access)
- **Dev Command**: `npm run dev`
- **Build Command**: `npm run build`

### Deployment
- **Target**: Autoscale (stateless web application)
- **Build**: npm run build
- **Run**: npm start

## Dependencies
Key packages include:
- Next.js, React, TypeScript
- Genkit AI with Google AI plugin
- Radix UI components
- Tailwind CSS
- Firebase
- Stripe (for payments)

## Current State
The application is fully configured and running in the Replit environment. The development server is active on port 5000 and the deployment configuration is set up for production use.
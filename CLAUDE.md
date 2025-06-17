# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js PWA (Progressive Web App) for displaying real-time bus departure times. Users can bookmark personalized departure boards for their nearest bus stops. The app uses bustimes.org API as the data source and deploys on Vercel's free tier.

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build production version  
- `npm run start` - Start production server
- `npm run lint` - Run Next.js linting
- `biome check` - Run Biome linting and formatting (alternative to ESLint/Prettier)
- `biome format --write .` - Format code with Biome

## Architecture

### Routing Structure
- **App Router**: Main entry at `/app/page.tsx` redirects to `/loc/home` 
- **Pages Router**: Core functionality in `/pages/loc/[locationId].tsx` for location-specific views
- **API Routes**: Proxy endpoints in `/pages/api/` for CORS handling with bustimes.org

### Data Flow
1. **Configuration**: Stored in localStorage via `utils/config.ts` functions
2. **Bus Times**: Fetched through `/api/times.ts` proxy from bustimes.org API
3. **State Management**: React hooks with SWR for data fetching
4. **Schemas**: Zod validation in `utils/schemas.ts` for API responses

### Key Components
- `BusStops`: Main display component for departure boards
- `NewLocation`: Location configuration interface  
- `TimeUntil`: Countdown display for departure times

### PWA Features
- Service worker configured via next-pwa
- App icons for all platforms in `/public/icons/`
- Offline functionality with caching

### Storage Pattern
- Bus stop IDs stored as `stops_{locationId}` in localStorage
- Route filters stored as `routes_{locationId}` in localStorage
- Supports multiple named locations (e.g., "home", "work")

### External Dependencies
- bustimes.org API for real-time data
- Vercel KV and Edge Config for enhanced features
- Tailwind CSS for styling
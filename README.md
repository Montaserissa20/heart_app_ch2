# Heart Surgery Guide (MVP) — React Native + Expo

Mobile patient education app organized as **Categories → Subtopics → Topic Content**, with optional **audio narration**, adjustable **reading size**, and basic **feedback** storage.

## Tech Stack
- React Native + Expo
- TypeScript
- Expo Router (navigation)
- `expo-av` (audio playback)
- AsyncStorage (local persistence)

## Features (MVP)
- **3 core screens**
  - Categories list (cards + play button)
  - Subtopics list (search + play button)
  - Topic detail (text + audio player + reading size)
- **Audio narration**
  - Play/pause per category/topic (mock audio allowed)
  - Stops on screen change/unmount
- **Reading size**
  - Small / Medium / Large
  - Persisted locally with AsyncStorage
- **Feedback**
  - Modal form (name optional, message required)
  - Saved locally with AsyncStorage
- **States**
  - Loading placeholder (simulated delay)
  - Empty state (no subtopics)
  - Error state + Retry (if data load fails)

## Project Structure

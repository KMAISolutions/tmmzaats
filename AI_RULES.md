# AI Development Rules for The Middle Man ZA App

This document outlines the technical stack and development guidelines for building and maintaining the "The Middle Man ZA" web application. Adhering to these rules ensures consistency, maintainability, and optimal performance.

## Tech Stack Overview

*   **Frontend Framework:** React.js with TypeScript for building dynamic and interactive user interfaces.
*   **Styling:** Tailwind CSS for utility-first CSS styling, ensuring responsive and modern designs.
*   **AI Integration:** Google Gemini API (`@google/genai`) powers all AI-driven features, including CV analysis, job structuring, and content generation.
*   **Charting:** The `recharts` library is used for data visualization, specifically for displaying analysis scores.
*   **Routing:** React Router is the designated library for managing application navigation and routes.
*   **Component Library:** `shadcn/ui` is the preferred component library for pre-built, accessible, and customizable UI components.
*   **Icons:** `lucide-react` is the designated icon library for all visual icons within the application.
*   **Client-Side Data Persistence:** Local Storage is utilized for saving user-specific data and application state directly in the browser.
*   **Build Tool:** Vite is used for fast development and optimized production builds.
*   **Progressive Web App (PWA):** The application includes a Service Worker for offline capabilities and improved performance.

## Library Usage Rules

*   **React & TypeScript:** All new components and logic should be written using React with TypeScript.
*   **Tailwind CSS:** Always use Tailwind CSS classes for styling. Avoid inline styles or custom CSS files unless absolutely necessary for highly unique components.
*   **Google Gemini API:** All interactions with AI models must go through the `@google/genai` package, typically abstracted within the `src/services` directory.
*   **Recharts:** When creating charts or data visualizations, use components provided by the `recharts` library.
*   **React Router:** For any new navigation paths or complex routing logic, implement it using React Router. Ensure all main application routes are defined in `src/App.tsx`. (Note: The current application uses a custom state-based routing system. Future enhancements should transition to React Router for better scalability and standard practices.)
*   **shadcn/ui:** Prioritize using components from `shadcn/ui`. If a required component is not available in `shadcn/ui` or needs significant customization, create a new, small, and focused component in `src/components/`. Do not modify existing `shadcn/ui` component files directly.
*   **lucide-react:** Use icons from the `lucide-react` library. Avoid adding custom SVG icons to `src/components/icons.tsx` unless a specific icon is not available in `lucide-react`.
*   **Local Storage:** Use `localStorage` for client-side data persistence where appropriate (e.g., user preferences, temporary drafts). Do not use it for sensitive data or large datasets.
*   **File Structure:**
    *   Pages: `src/pages/`
    *   Components: `src/components/`
    *   Services (API calls, external integrations): `src/services/`
    *   Type Definitions: `src/types.ts`
    *   Constants: `src/constants.ts`
*   **Code Quality:** Maintain clean, readable, and well-commented code. Adhere to best practices for React and TypeScript development.
*   **Responsiveness:** All new UI elements and components must be designed to be fully responsive across various screen sizes using Tailwind CSS.
# AGENTS.md

## Project Overview
This is a Vite + React + TypeScript web application for a restaurant ROI tracker. It was refactored from a single large TSX file into a modular structure.

## Development Commands
- Install: `npm install`
- Dev Server: `npm run dev`
- Build: `npm run build`

## Folder Conventions
- `src/components/`: Reusable, generic UI components (e.g., buttons, cards).
- `src/pages/`: Main route-level components.
- `src/layouts/`: Shared layouts like the main sidebar/header structure.
- `src/routes/`: React Router configurations.
- `src/styles/`: Global CSS, including Tailwind base styles.
- `src/utils/`: Constants, config, and helper functions.
- `input/`: Contains the original `App.tsx` file for reference. Do not modify or delete this file.
- `docs/`: Architecture, setup, and decision documentation.
- `skills/`: Reusable agent workflow scripts.

## React/TypeScript Coding Standards
- Use functional components and React hooks.
- Define proper TypeScript interfaces/types for props and state.
- Keep components small and focused.

## Routing Standards
- Use React Router v6.
- Define routes centrally in `src/routes/AppRouter.tsx`.
- Use a `RootLayout` for persistent UI elements like the sidebar.

## Component Extraction Rules
- Extract repeated UI patterns into `src/components/`.
- Do not over-fragment; only extract when it improves readability or reuse.

## Styling Rules
- Use Tailwind CSS utility classes.
- Avoid inline styles.
- Define theme colors and common configuration in `src/utils/constants.ts` or `tailwind.config.js`.

## Documentation Rules
- Keep `docs/` updated when architectural changes occur.
- **CRITICAL**: `ROI-Spec.md` is an evolving document. Whenever business logic changes (e.g. attendance-linked payroll), you MUST update `ROI-Spec.md` to reflect the new truth.
- Do not store standard docs in `skills/`.

## Git Rules
- Ensure the app builds without errors before committing.
- Write clear, descriptive commit messages.

## Validation Checklist
Before concluding tasks:
1. Run `npm run build` to verify no TypeScript or build errors exist.
2. Fix any missing imports or syntax issues.

## Restrictions (Things Agents Must Not Do)
- Do NOT delete `input/App.tsx`.
- Do NOT use Redux, Zustand, or other state management libraries unless absolutely necessary.
- Do NOT add unnecessary npm packages.

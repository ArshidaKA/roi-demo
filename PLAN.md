# PLAN.md — Executable Migration Plan

You are an AI coding agent working inside this repository.

This file is not only documentation. Treat this `PLAN.md` as the execution instruction for the task.

Your job is to convert a single Gemini-generated `.tsx` React file into a proper Vite + React + TypeScript app, refactor it into a maintainable structure, and create the required project documentation and agent instruction files.

---

## 1. Source Input

The original Gemini-generated file is expected at:

```txt
./input/App.tsx
```

If it is not there, search the repository for the single large `.tsx` file and use that as the source.

Do not delete the original source file unless specifically asked.

---

## 2. Final Goal

Create a proper Vite + React + TypeScript project that:

1. Runs with `npm install` and `npm run dev`.
2. Builds successfully with `npm run build`.
3. Uses React Router.
4. Splits the single TSX file into reusable React components.
5. Keeps the UI and behavior as close as possible to the original.
6. Has a clean folder structure.
7. Has proper documentation.
8. Has clear future-agent instructions through `AGENTS.md` and `CLAUDE.md`.
9. Has proper Git setup and `.gitignore`.

---

## 3. Git Instructions

Before editing anything, run:

```bash
git status
```

If this is already a git repository, create a new branch:

```bash
git checkout -b refactor/vite-react-app-from-single-tsx
```

If this is not yet a git repository, initialize it:

```bash
git init
git checkout -b refactor/vite-react-app-from-single-tsx
```

Do not overwrite unrelated existing work.

At the end, commit the work:

```bash
git add .
git commit -m "Refactor single TSX into Vite React app"
```

If commit is not possible, clearly explain why in the final response.

---

## 4. Required Root Files

Create or update these files:

```txt
PLAN.md
AGENTS.md
CLAUDE.md
README.md
.gitignore
package.json
tsconfig.json
vite.config.ts
index.html
```

`PLAN.md` already contains this execution plan. After completing the work, update this same file with a short completion note at the bottom.

---

## 5. Required App Structure

Create or normalize the project into this structure:

```txt
src/
  main.tsx
  App.tsx
  routes/
    AppRouter.tsx
  layouts/
    RootLayout.tsx
  pages/
    HomePage.tsx
    NotFoundPage.tsx
  components/
  data/
  hooks/
  utils/
  types/
  styles/
    globals.css

docs/
  architecture/
  setup/
  decisions/

skills/
  README.md

input/
  App.tsx
```

If some folders are empty, keep them with a `.gitkeep` file.

---

## 6. Vite + React Setup

If the repo is not already a Vite React TypeScript app, create the required Vite structure manually or using Vite.

Use:

```bash
npm install
npm install react react-dom react-router
npm install -D vite typescript @vitejs/plugin-react
```

Also install any dependency used by the original TSX file, such as:

* icon libraries
* chart libraries
* animation libraries
* UI libraries

Do not add unnecessary packages.

---

## 7. React Router Setup

Use React Router with this minimum route structure:

```txt
/   -> HomePage
*   -> NotFoundPage
```

Expected files:

```txt
src/App.tsx
src/routes/AppRouter.tsx
src/layouts/RootLayout.tsx
src/pages/HomePage.tsx
src/pages/NotFoundPage.tsx
```

`src/App.tsx` should stay minimal and only render the router.

Example direction:

```tsx
// src/App.tsx
import { AppRouter } from "./routes/AppRouter";

export default function App() {
  return <AppRouter />;
}
```

Use `BrowserRouter`, `Routes`, and `Route`.

---

## 8. Refactoring Rules

When converting the single TSX file:

1. Preserve the visible UI.
2. Preserve the behavior.
3. Do not redesign unless required to make it work.
4. Do not rename visible text unless necessary.
5. Extract repeated UI into `src/components/`.
6. Move route-level screens into `src/pages/`.
7. Move large static arrays or mock content into `src/data/`.
8. Move shared TypeScript types into `src/types/`.
9. Move pure helper functions into `src/utils/`.
10. Move reusable state logic into `src/hooks/`.
11. Keep one-off state inside the component where it belongs.
12. Avoid Redux, Zustand, or other state libraries unless already required.
13. Remove unused imports.
14. Remove dead code.
15. Keep files reasonably small and understandable.

Do not over-fragment the app. Extract components only where it improves maintainability.

---

## 9. Styling Rules

If the source TSX uses Tailwind classes, configure Tailwind properly.

If the source uses plain CSS, move global styles to:

```txt
src/styles/globals.css
```

If the source uses inline styles, keep them only where reasonable.

Repeated style patterns should become reusable components or CSS classes.

Make sure `globals.css` is imported from:

```tsx
src/main.tsx
```

---

## 10. Documentation Rules

Create these documentation folders:

```txt
docs/architecture/
docs/setup/
docs/decisions/
```

Use them like this:

```txt
docs/architecture/    -> app structure, routing, component architecture
docs/setup/           -> local setup and run instructions
docs/decisions/       -> technical decisions and tradeoffs
```

Create at least:

```txt
docs/architecture/frontend-structure.md
docs/setup/local-development.md
docs/decisions/react-router.md
```

Keep documentation practical and specific to this project.

---

## 11. Skills Folder Rules

Create:

```txt
skills/README.md
```

The `skills/` folder is for reusable agent/developer workflows.

Use it for repeatable procedures such as:

```txt
skills/
  component-refactor/
    SKILL.md
  route-addition/
    SKILL.md
  build-validation/
    SKILL.md
```

Do not store normal project documentation inside `skills/`.

Normal documentation belongs in `docs/`.

---

## 12. AGENTS.md Requirements

Create `AGENTS.md` as the canonical instruction file for all future AI agents.

It must include:

1. Project overview.
2. Development commands.
3. Folder conventions.
4. React/TypeScript coding standards.
5. Routing standards.
6. Component extraction rules.
7. Styling rules.
8. Documentation rules.
9. Git rules.
10. Validation checklist.
11. Things agents must not do.

Important:

* `AGENTS.md` is the main long-term instruction file.
* Future agents must read `AGENTS.md` before editing.
* Keep it specific to this project.
* Avoid generic filler.

---

## 13. CLAUDE.md Requirements

Create `CLAUDE.md`.

It should be short and should refer to `AGENTS.md`.

Use this structure:

```md
# CLAUDE.md

Read `AGENTS.md` first.

`AGENTS.md` is the canonical instruction file for this repository.

## Claude-specific reminders

- Follow `AGENTS.md`.
- Do not rewrite the whole app unless explicitly asked.
- Prefer small, safe changes.
- Preserve the existing UI and behavior.
- Run validation before final response.
- Clearly summarize changed files.
```

Do not duplicate the full contents of `AGENTS.md`.

---

## 14. README.md Requirements

Create or update `README.md`.

It must include:

1. Project name.
2. Short description.
3. Tech stack.
4. Setup instructions.
5. Development command.
6. Build command.
7. Folder structure.
8. Documentation location.
9. Agent instruction location.
10. Notes about the original Gemini TSX source.

Keep it useful for a developer opening the repo for the first time.

---

## 15. .gitignore Requirements

Create a proper `.gitignore` for Vite React TypeScript.

It must include:

```gitignore
node_modules
dist
dist-ssr
.vite
.env
.env.*
!.env.example
.DS_Store
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
coverage
```

Add other standard ignores if needed.

---

## 16. Validation Checklist

After implementation, run:

```bash
npm install
npm run build
```

If possible, also run:

```bash
npm run dev
```

Fix all TypeScript, import, build, and runtime errors.

Also run:

```bash
git status
```

Do not leave the repo with accidental unrelated changes.

---

## 17. Final Response Required

After finishing, respond with:

1. Summary of what was done.
2. Final folder structure.
3. Commands to run.
4. Git branch name.
5. Commit hash if committed.
6. Validation result.
7. Assumptions made.
8. Known limitations, if any.

---

## 18. Completion Note

After completing the task, append a short completion note here inside `PLAN.md` under this heading:

```md
## Completion Note

## Completion Note

- Date: 2026-06-01
- Branch: main
- Commit: first commit
- Validation: npm run build completed successfully
- Notes: Refactored single TSX into multiple components and pages using Vite React App. Fixed TS and build config.

## Completion Note: Aggregators & Split Payments

- Date: 2026-06-06
- Notes: Added new `/aggregators` route for Deliveroo/Talabat pending receivables and settlements with commission routing. Updated `DailyEntryPage.tsx` to support inline split payments (Cash, Bank, CC, Petty Cash) on every expense row instead of adding duplicate rows. Updated `ROI-Spec.md` to reflect these workflows.

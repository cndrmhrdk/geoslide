# GeoSlide Copilot instructions

## Project overview
- This repository is a full-stack disaster-response web app for Indonesia.
- The frontend is a React + Vite app in `frontend/` using React Router and a component-driven UI.
- The backend is an Express + MySQL API in `backend/` and exposes routes under `/api/*`.
- Public-facing flows include disaster reporting, missing-person information, map/statistics pages, education, and admin management.
- The design language is documented in `DESIGN.md` and the CSS tokens in `frontend/src/index.css`.

## Repository map
- `frontend/src/App.jsx`: app routing, public pages, and protected admin routes.
- `frontend/src/pages/`: page-level screens; public and admin screens live in separate folders.
- `frontend/src/components/`: reusable UI building blocks such as `PageHeader`, `Section`, and navigation.
- `frontend/src/layouts/`: `PublicLayout` and `AdminLayout` share page shell behavior.
- `backend/src/modules/`: feature-based API modules such as `data-bencana`, `orang-hilang`, `auth`, and `laporan-bencana`.
- `backend/src/config/`: database configuration and shared backend setup.

## Product and design guidance
- Keep the product language and UI copy in Indonesian unless the task explicitly asks for another language.
- Match the established GeoSlide visual system: warm neutral background, dark forest-green accents, subtle gold highlights, and restrained typography.
- Prefer the existing design tokens in `frontend/src/index.css` over creating custom colors or ad-hoc styles.
- For map/chart pages, keep the surface neutral and readable; avoid hero photography backgrounds on data-heavy pages.
- Reuse existing components and layout patterns before creating new ones.
- Follow the design intent in `DESIGN.md`: minimal, cinematic, calm, and data-readable.

## Frontend conventions
- Use React functional components and keep state local to the feature unless a shared context already exists.
- Preserve route names and navigation patterns defined in `frontend/src/App.jsx`.
- Prefer editing existing page/component files instead of creating parallel patterns.
- When working on forms, keep the established UX patterns: clear field labels, inline validation, error messaging, and step-based progression where relevant.
- For reporting flows such as `frontend/src/pages/LaporkanBencana.jsx`, keep the following constraints intact:
  - province/region/date validation
  - file type and size validation for uploads
  - max 5 uploaded images
  - 5 MB per file limit
  - supported types: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
  - client-side validation before submission
- Keep geolocation/date logic consistent with how the app already handles `latitude`, `longitude`, and incident dates.

## Backend conventions
- Keep feature modules under `backend/src/modules/` and preserve the existing API path structure.
- Respect existing DB access patterns and use the shared database connection rather than creating ad-hoc connections.
- For request validation, return consistent JSON error responses and avoid leaking raw stack traces to the client.
- Preserve authentication/admin patterns and protected route behavior in the frontend.

## Change safety rules
- Do not break public routes or admin routes.
- Do not introduce unrelated refactors or dependency churn.
- Prefer surgical, minimal edits that match the current code style and patterns.
- Keep compatibility with the current stack: Vite + React 19, React Router, Express 5, MySQL, and existing CSS custom properties.
- If a feature touches both frontend and backend, keep their contracts aligned and update both sides together.

## Validation
- Prefer targeted validation for the changed area.
- Frontend check: run `npm run build` in `frontend/` when changing UI or routing.
- Backend check: start the express app with `npm run dev` or validate API behavior when changing modules.
- For doc-only changes, no build is required unless the repo has explicit verification for the touched area.

## Working on this codebase
- Use existing abstractions and design tokens before introducing custom CSS or new libraries.
- Favor clear, readable, maintainable code over clever abstractions.
- Keep the app usable for Indonesian users, including mobile-friendly forms and accessible labels.
- When in doubt, follow the patterns already established in the repository and preserve the current product behavior.

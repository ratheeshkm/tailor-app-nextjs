

# AI Coding Guidelines for Tailer App

## Project Architecture & Data Flow
- **Monorepo structure:** Single Next.js 16 app using the App Router (`app/`), React 19, TypeScript, and Tailwind CSS v4.
- **API routes:** All business logic, validation, and database access is in `app/api/` using file-based routing. Example: `app/api/orders/route.ts` for order CRUD, `app/api/customers/route.ts` for customer CRUD. There is no separate service layer.
- **Database:** PostgreSQL via Prisma ORM (`prisma/schema.prisma`). Models: `Customer` and `Order` (1:N). Prisma client is instantiated with a global singleton pattern in API routes.
- **Context:** Shared React context for stitching flows in `app/contexts/NewStitchingContext.tsx`.
- **UI:** All pages/components in `app/`, styled with Tailwind directly in JSX. Theming via CSS variables in `app/globals.css` (dark mode supported).
- **Data flow:**
  - Frontend fetches data from `/api/customers` and `/api/orders` endpoints.
  - All forms use `react-hook-form` for validation and submission. Validation is enforced both client and server side.
  - Orders and customers are linked by `customerId`.

## Developer Workflows
- **Start dev server:** `npm run dev` (http://localhost:3000)
- **Build:** `npm run build`
- **Production start:** `npm run start`
- **Lint:** `npm run lint` (Next.js ESLint config)
- **Seed DB:** `npm run seed` (runs `scripts/seed.js` to populate 50+ customers)
- **Prisma:**
  - Generate client: `npx prisma generate`
  - Push schema: `npx prisma db push`
- **Testing:** No test suite or test workflow is present in this project.

## Project-Specific Conventions
- **Import alias:** Use `@/*` for all root imports (see `tsconfig.json`).
- **API route patterns:**
  - Use RESTful handlers: `GET`, `POST`, `PUT` in route files.
  - All error handling and validation is implemented in API route files (see `app/api/orders/[id]/route.ts`).
- **Form validation:** All forms use `react-hook-form`. Mobile numbers must be exactly 10 digits (see `add-customer/page.tsx`).
- **Context usage:** Use `NewStitchingProvider` at the root (`app/layout.tsx`) and `useNewStitching()` in components for stitching order state resets.
- **Styling:**
  - All styling is via Tailwind classes in JSX. Only CSS variables for theming/fonts are in `globals.css`.
  - Use `--background`/`--foreground` for theming; font variables for Geist fonts.
- **Component structure:**
  - All UI is in `app/` (no `src/` folder). Pages and components are colocated.
  - Example: `Header` in `app/components/Header.tsx` uses context and navigation.

## Integration Points & External Dependencies
- **Prisma ORM:** All DB access via Prisma client. Models in `prisma/schema.prisma`.
- **PostgreSQL:** Connection string in `.env.local` as `DATABASE_URL`.
- **Vercel:** Default deployment target (see README).
- **No custom server:** All logic in API routes; no Express or custom Node server.

## Key Files & Patterns
- `app/api/orders/route.ts`, `app/api/orders/[id]/route.ts`: Order CRUD, validation, error handling.
- `app/api/customers/route.ts`: Customer CRUD, validation.
- `app/contexts/NewStitchingContext.tsx`: Shared context for stitching flows.
- `app/components/Header.tsx`: Example of context and navigation usage.
- `app/globals.css`: Theming and Tailwind base.
- `scripts/seed.js`: DB seeding logic.
- `prisma/schema.prisma`: DB schema.

## Troubleshooting
- **Prisma errors:** Run `npx prisma generate` or check `DATABASE_URL`.
- **API 500 errors:** Check server logs for details.
- **DB connection:** Ensure `.env.local` is set up as in README.

---
For more, see [README.md](../README.md) and referenced files above. Update this file if you introduce new patterns or workflows.
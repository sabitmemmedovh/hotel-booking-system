Hotel Booking System — Frontend

Project overview
----------------
This is a small frontend application for configuring a multi-day hotel booking. Users select a destination, choose hotels per day, and pick meals according to the chosen board type. The app calculates per-day totals and a grand total.

Setup
-----
- Requirements: Node.js 16+ and npm.
- Install dependencies:
```powershell
npm install
```
- Start development server:
```powershell
npm run dev
```
- Build for production:
```powershell
npm run build
```
- Preview the production build:
```powershell
npm run preview
```

If you later add API keys or service endpoints, include a `.env` file and a `.env.example` with the required variables.

Technology choices and justification
-----------------------------------
- React + Vite: fast developer feedback and simple build pipeline.
- Redux Toolkit: predictable global state and concise reducers.
- Reselect: memoized selectors to avoid unnecessary re-renders.
- react-hook-form + Yup: efficient form handling and validation.
- Tailwind CSS (or utility classes): quick, consistent styling without heavy CSS files.
- jsPDF/html2canvas: client-side PDF export for summaries.

Architecture decisions
----------------------
- `src/components/` — UI components like `BookingForm`, `DailyTable`, `Summary`, and small shared UI pieces in `ui/`.
- `src/features/` — Redux slices (state, reducers, actions, selectors). Keep business logic in slices where appropriate.
- `src/hooks/` — custom hooks (persistence and exports) to keep components focused on rendering.
- `src/utils/` — pure helper functions: date utilities, price calculation, data lookup, validation.

Data flow
---------
1. `BookingForm` collects configuration and dispatches `setConfig`.
2. `bookingSlice` sanitizes and validates config, generates `dailySelections`.
3. `DailyTable` reads `dailySelections` and dispatches `setDay` when a user changes a day.
4. `Summary` builds a price breakdown from the selections and offers export options.

Known limitations and future improvements
---------------------------------------
- Persistence is localStorage-only. Add a backend (API + DB) for production-scale persistence.
- No end-to-end tests included. Add Cypress or Playwright for integration coverage.
- PDF export is basic; complex layouts may require server-side rendering or templating.
- Accessibility should be audited and improved (ARIA labels, focus management).
- Consider adding TypeScript for stronger typing and maintainability.


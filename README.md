## shift-automation-tests

End-to-end tests for the Shift planning demo app, written with **Playwright Test** and **TypeScript**, using a **Page Object Model** for better readability and reuse.

### Prerequisites

- Node.js 18+ installed
- Git installed

### Install dependencies

```bash
npm install
```

Install Playwright browser binaries (only needed once):

```bash
npx playwright install
```

### Run tests

Run the full Playwright test suite:

```bash
npx playwright test
```

Run a single file, for example the employee shift tests:

```bash
npx playwright test tests/addShiftForEmployee.spec.ts
```

Show headed browser (non-headless) for debugging:

```bash
npx playwright test --headed
```

### Project structure

- `tests/`
  - `createShift.spec.ts` – tests for creating template shifts and required-field validation.
  - `addShiftForEmployee.spec.ts` – tests for adding shifts for employees, including events and pauses.
- `page-objects/`
  - `LoginPage.ts` – handles authentication flow.
  - `ShiftFormPage.ts` – encapsulates the template shift form interactions.
  - `ScheduleShiftPage.ts` – encapsulates the schedule grid shift creation and verification.
- `helper/`
  - `generateFakeDataHelper.ts` – central place for generated test data.
  - `navigationHelper.ts` – navigation helpers (e.g. go to Shifts).
  - `date.ts`, `loginData.ts` – date formatting and login credentials.

### Notes

- Some tests intentionally use explicit `page.waitForTimeout(...)` calls as a temporary workaround for known frontend timing issues. These are expected and should not be removed until the underlying bugs are fixed.

"# shift-automation-tests" 

# AI Usage Log (Assignment Evidence)

## Student Details
- Course: SE ZG503 Full Stack Application Development
- Assignment: Web Application Development
- Submission Due Date: 4 May 2026
- Student Name: Arunan Sundaramoorthy
- Student ID: _(add your BITS ID)_
- AI Tools Used: GitHub Copilot (VS Code, powered by Claude Sonnet 4.6)

## Purpose of This Log
This file tracks AI-assisted interactions used during development, debugging, planning, and documentation.

> Academic integrity note: Review and edit each entry yourself. Keep only factual records of what was asked, what AI suggested, and what you actually implemented.

---

## Conversation / Prompt Log

| Entry # | Date | Prompt / Request | AI Output Summary | Action Taken by Student | Files/Areas Affected | Learning / Reflection |
|---|---|---|---|---|---|---|
| 1 | 2026-04-28 | "Create a file tracking our conversation as expected in the assignment and suggest simple app ideas." | Suggested creating a structured AI usage log in markdown and providing app ideas aligned to rubric requirements. | Created this log file structure to document ongoing AI usage in a submission-ready format. | `AI_USAGE_LOG.md` | Learned how to maintain traceable evidence of AI assistance instead of relying on memory later. |
| 2 | 2026-04-28 | Shared complete assignment brief with requirements, rubric, and acceptable/unacceptable AI usage policy. | Parsed deliverables and focused on AI usage log + idea generation aligned with backend/frontend/integration expectations. | Confirmed documentation approach and prepared to choose a problem statement with clear scope. | Planning stage | Better understanding of rubric-driven scoping and what evidence evaluators expect. |
| 3 | 2026-04-28 | "Yes choose lab slot booking app." | Finalized **Lab Slot Booking System** as the assignment project and generated a one-page proposal with scope, architecture, APIs, and data model. | Accepted the idea and used the generated proposal as the base document for implementation. | `LAB_SLOT_BOOKING_PROPOSAL.md`, `AI_USAGE_LOG.md` | Learned how to convert a high-level idea into an evaluable scope mapped to rubric items. |
| 4 | 2026-04-28 | "Scaffold the full project structure." | Generated a monorepo scaffold with React frontend, API gateway, auth service, booking service, and starter documentation/schema files. | Adopted generated skeleton as initial implementation baseline; next step is dependency install and endpoint testing. | `frontend/*`, `backend/*`, `docs/*`, `README.md`, `.env.example` | Learned how to break the system into services early while keeping an MVP-friendly workflow. |
| 5 | 2026-04-28 | "Make it runnable locally." | Installed npm dependencies across all modules and created service-level `.env` files for local MongoDB setup. | Environment became ready for running with `npm run dev` after Mongo startup. | `backend/**/.env`, `frontend/.env`, `README.md` | Learned practical setup sequencing (DB first, then services, then frontend) for microservice projects. |
| 6 | 2026-04-28 | "Add seed users and Postman demo flow." | Added an idempotent user seed script and generated importable Postman collection/environment for complete API demonstration flow. | Included seed command in root scripts and documented execution/import steps for demo video preparation. | `backend/services/auth-service/src/scripts/seedUsers.js`, `docs/postman/*`, `README.md`, `package.json` | Learned how reusable test data + API collections significantly reduce demo and validation time. |
| 7 | 2026-04-28 | "Stop, switch everything back to work with MongoDB." | Reverted database-related changes and restored backend code, dependencies, env configuration, and documentation to Mongoose + MongoDB flow. | Rolled back migration attempt and kept original MongoDB architecture for stable assignment delivery. | `backend/services/*`, `.env.example`, `README.md`, `docs/DB_SCHEMA.md` | Learned the importance of minimizing toolchain risk during deadline-driven development. |
| 8 | 2026-04-28 | "Fix git remote origin already exists error." | Diagnosed duplicate/incorrect `origin` URLs and provided commands to reset a single correct remote. | Updated git remote configuration and successfully prepared repository push workflow. | Git config (`origin` remote) | Learned how to resolve duplicate remote URL issues using `git remote set-url` or remove/re-add safely. |
| 9 | 2026-04-28 | "Remove Docker stuff as it's not used." | Removed unused Docker Compose file and cleaned Docker references from setup and usage documentation. | Adopted local MongoDB-only setup and updated docs to avoid Docker dependency. | `docker-compose.yml`, `README.md`, `AI_USAGE_LOG.md` | Learned how to keep deployment/setup docs aligned with actual runtime architecture. |
| 10 | 2026-04-28 | "Update login UI to choose user/admin and show specific account-type error." | Added role selector in login page, role-match validation, and tailored error messages for invalid account type credentials. | Implemented UX logic for explicit role-based login attempts and clearer authentication feedback. | `frontend/src/pages/LoginPage.jsx`, `frontend/src/styles.css` | Learned how frontend role intent can improve error clarity even when backend returns generic invalid-credential errors. |
| 11 | 2026-04-28 | "Auto-fill credentials by selected role and hide admin option for students after login." | Added automatic demo credential switching based on selected role and role-based nav visibility in header. | Improved usability for testing/demo and tightened student/admin UI separation after authentication. | `frontend/src/pages/LoginPage.jsx`, `frontend/src/App.jsx` | Learned practical frontend RBAC patterns: role-specific navigation and reducing user confusion through guided defaults. |
| 12 | 2026-04-28 | "List pending app functionalities and suggest commit message." | Compared documented MVP scope against current implementation and provided concise staged commit message options. | Used the checklist to identify remaining work and committed/pushed current progress. | `README.md`, docs review, git workflow | Learned how to track MVP completeness by mapping docs/API plan to implemented UI/backend endpoints. |
| 13 | 2026-04-28 | "Update docs with details of all the functionalities." | Rewrote all three docs (`API_OVERVIEW.md`, `ARCHITECTURE.md`, `DB_SCHEMA.md`) with full endpoint reference, request/response examples, validation rules, data flow diagrams, and schema field descriptions. | Replaced placeholder doc stubs with comprehensive, submission-ready documentation. | `docs/API_OVERVIEW.md`, `docs/ARCHITECTURE.md`, `docs/DB_SCHEMA.md` | Learned how incremental documentation alongside code enables coherent final-submission docs instead of a rushed last-minute write-up. |
| 14 | 2026-04-28 | "Add user registration in the UI." | Created `RegistrationPage.jsx` with name/email/role/password fields, client-side validations (email format, min-length password, password match), auto-login on success, and link to login page. | Added registration route in `App.jsx`, linked from `LoginPage.jsx`, committed and pushed. | `frontend/src/pages/RegistrationPage.jsx`, `frontend/src/App.jsx`, `frontend/src/pages/LoginPage.jsx` | Learned how to implement auto-login after registration by reusing the same token-storage utility as the login flow. |
| 15 | 2026-04-28 | "When I refresh the page I get missing or invalid auth token." | Diagnosed thet sessionStorage token was not being re-attached to axios before route renders. Added a request interceptor that attaches fresh token on every request, an immediate restore call at module load, and an `authReady` gate in `App.jsx` to block rendering until token is rehydrated. | Adopted the fix; page refresh now works without re-login within the same browser session. | `frontend/src/api/client.js`, `frontend/src/App.jsx` | Learned how sessionStorage persistence + axios interceptors work together and why rendering must wait for auth state to be restored. |
| 16 | 2026-04-28 | "Add feature in UI to show available slots per lab." | Added backend aggregation returning `approvedCount`, `remainingCapacity`, `isAvailable` per slot; added grouped-by-lab availability panel in Student Dashboard and availability summary badges in Admin Dashboard. | Integrated the backend metadata and rendered grouped lab-slot views on both dashboards. | `backend/services/booking-service/src/routes/bookingRoutes.js`, `frontend/src/pages/StudentDashboard.jsx`, `frontend/src/pages/AdminDashboard.jsx`, `frontend/src/styles.css` | Learned MongoDB lookup/group aggregation patterns and how to surface capacity data without a separate count endpoint. |
| 17 | 2026-04-28 | "It allows creating a slot with more capacity than the lab seats." | Added backend guard in `POST /slots` rejecting `capacity > lab.totalSeats`, and added `max={selectedLabSeats}` on the frontend capacity input with a validation message. | Both backend and frontend now enforce that slot capacity cannot exceed lab seat count. | `backend/services/booking-service/src/routes/bookingRoutes.js`, `frontend/src/pages/AdminDashboard.jsx` | Learned the principle of defence-in-depth: validate business rules at both API and UI layers so neither alone is the only safeguard. |
| 18 | 2026-04-28 | "Add option to delete a registered user (admin)." | Added `GET /auth/users` (admin-only, list all users) and `DELETE /auth/users/:id` (admin or self; blocks deletion of last admin) to auth service; added a User Management panel in Admin Dashboard with list and delete per-user. | Integrated both endpoints, rendered user table, and confirmed last-admin guard works. | `backend/services/auth-service/src/routes/authRoutes.js`, `frontend/src/pages/AdminDashboard.jsx`, `frontend/src/styles.css` | Learned how to write a safe delete guard (last-admin check) to prevent accidental system lockout. |
| 19 | 2026-04-28 | "Let the person who registered remove their own account." | Added self-delete flow in Student Dashboard: two-step confirmation (button → confirm card), calls `/auth/me` to get own ID, then `DELETE /auth/users/:id`, clears session, redirects to login. | Feature worked on first test; adopted as-is and pushed. | `frontend/src/pages/StudentDashboard.jsx` | Learned the UX pattern of two-step destructive confirmation to reduce accidental account deletion. |
| 20 | 2026-04-28 | "Edit and delete slots (admin)." | Added `PATCH /slots/:id` (validate past date, time range, capacity ≥ approved bookings, capacity ≤ lab seats, no time conflict) and `DELETE /slots/:id` (blocked if active bookings exist) on the backend; inline edit form per slot row plus Delete button in Admin Dashboard. | Validated with frontend build (89 modules, no errors) and backend syntax check; committed and pushed. | `backend/services/booking-service/src/routes/bookingRoutes.js`, `frontend/src/pages/AdminDashboard.jsx`, `frontend/src/styles.css` | Learned how to safely expose mutation endpoints by layering multiple pre-conditions (capacity, conflict, active-booking guard) before executing the update or delete. |
| 21 | 2026-04-28 | "Option to delete lab." | Added `DELETE /booking/labs/:id` backend endpoint blocked if active slots exist; added Delete button per lab row in admin Existing Labs panel with `.btn-danger-sm` CSS style. | Adopted as-is; confirmed last-slot guard works correctly. | `backend/services/booking-service/src/routes/bookingRoutes.js`, `frontend/src/pages/AdminDashboard.jsx`, `frontend/src/styles.css` | Learned to guard destructive cascade operations (deleting a lab) by checking dependent records first rather than relying on cascades. |
| 22 | 2026-04-28 | "Edit Lab." | Added `PATCH /booking/labs/:id` backend with guard (cannot reduce totalSeats below existing slot capacities); inline edit form per lab row (name, location, totalSeats) with Save/Cancel. | Adopted without changes; committed and pushed. | `backend/services/booking-service/src/routes/bookingRoutes.js`, `frontend/src/pages/AdminDashboard.jsx` | Learned how to chain referential integrity checks (slot capacities) when reducing a parent resource's constraints. |
| 23 | 2026-04-28 | "Booking history for students and admin view of all bookings." | Split student My Bookings into Active (PENDING/APPROVED) and History (REJECTED/CANCELLED) sections with date display; added `fetchAllBookings()` and All Booking History card in Admin Dashboard showing every booking across all statuses. | Adopted as-is; no backend changes needed (existing endpoint already supported no-filter). | `frontend/src/pages/StudentDashboard.jsx`, `frontend/src/pages/AdminDashboard.jsx` | Learned that well-designed backend endpoints (optional status filter) can support new UI features without any backend changes. |
| 24 | 2026-04-28 | "Update Postman collection with all endpoints." | Rebuilt collection with 5 folders (Health/Auth/Labs/Slots/Bookings/Users), 20 requests, proper v2.1 URL objects, `_postman_id`, token/ID auto-capture test scripts. Fixed import error by removing invalid top-level export metadata fields. | After two rounds of debugging the VS Code Postman extension schema errors, adopted final clean version. | `docs/postman/LabSlotBooking_Demo.postman_collection.json`, `scripts/generate-postman-collection.js` | Learned that the Postman collection v2.1 schema requires URL fields to be objects (not strings) and that extra top-level fields cause silent import failures. |
| 25 | 2026-04-28 | "Create a Swagger API documentation." | Created `docs/openapi.yaml` (OpenAPI 3.0.3) with 15 paths, full request/response schemas, bearer auth security scheme, enum values, and error codes; installed `swagger-ui-express` + `yamljs` in api-gateway; Swagger UI served at `http://localhost:4000/api-docs`. | Adopted as-is; validated YAML parses correctly with 15 paths; committed and pushed. | `docs/openapi.yaml`, `backend/api-gateway/src/server.js`, `backend/api-gateway/package.json` | Learned how to serve an OpenAPI spec through the same gateway that proxies the actual APIs, making documentation co-located with the entry point. |
| 26 | 2026-04-28 | "Update the docs with what was done." | Updated `API_OVERVIEW.md` with new endpoints (PATCH/DELETE labs, PATCH/DELETE slots, GET/DELETE users, availability metadata table); updated `ARCHITECTURE.md` with Swagger UI routing, full feature descriptions for each service, updated validation layer and booking workflow sections. | Adopted documentation updates; committed and pushed. | `docs/API_OVERVIEW.md`, `docs/ARCHITECTURE.md`, `AI_USAGE_LOG.md` | Learned to keep architecture docs current incrementally rather than doing a single large update at the end — parallel service and doc changes reduce final submission doc debt. |
| 27 | 2026-04-28 | "Can you update the README." | Rewrote `README.md` from scratch: removed stale placeholder wording ("scaffold", "future: edit/delete"), replaced bullet-list setup steps with proper bash fenced code blocks, added Prerequisites section, corrected environment setup to reference `.env.example`, listed every root `npm run` script with descriptions, removed reference to non-existent Postman environment file. | Adopted fully; committed and pushed (`docs: update README`). | `README.md` | Learned how README drift accumulates when features are added without updating docs — a quick AI-assisted audit catches mismatches faster than manual review. |
| 28 | 2026-04-28 | Shared full assignment brief PDF; asked what other features could be added and how to maximise rubric marks. | Identified rubric gaps: search/filter, pagination, analytics panel, waitlist, notification layer, stronger validation. Ranked features by effort vs. marks; highlighted Backend (5), Frontend (5), Integration (3), Problem statement (2), AI log + quality (5) as key areas. | Used the priority list to decide on COMPLETED status flow as the next immediate implementation — clear business value, low effort, strong demonstration of end-to-end workflow. | Planning/strategy | Learned how to map feature ideas to rubric criteria and select implementation order based on marks/effort ratio. |
| 29 | 2026-04-28 | "Right now the status flow is only till approved for slots and not till completed." | Designed and implemented full COMPLETED terminal state: new `PATCH /bookings/:id/complete` backend route (admin-only, APPROVED→COMPLETED guard, 409 on wrong state transitions); `completedBookings` state + `fetchCompletedBookings()` in AdminDashboard; "Mark Complete" button on approved rows; dedicated Completed Bookings section; student Booking History filter extended to include COMPLETED. Confirmed `status-completed` CSS class already existed. | Adopted all changes; committed and pushed (`feat: add COMPLETED status flow for bookings`, 3 files, 68 insertions). | `backend/services/booking-service/src/routes/bookingRoutes.js`, `frontend/src/pages/AdminDashboard.jsx`, `frontend/src/pages/StudentDashboard.jsx` | Learned how to extend a state machine safely: define all invalid transitions explicitly (409 errors) before adding the new transition, so no intermediate state can be silently skipped. |

---

## Suggested Format for Future Entries
Use one row per meaningful AI interaction:

- What you asked (prompt)
- What AI returned (summary)
- What you accepted/rejected and why
- What code/doc changed
- What you learned (especially debugging AI output)

---

## Manual vs AI Work Split

### AI-assisted parts
- Initial monorepo scaffold (directory structure, `package.json` files, entry-point `server.js` skeletons)
- Express route boilerplate for all CRUD endpoints across auth and booking services
- Mongoose schema definitions for User, Lab, Slot, and Booking models
- React component scaffolding: `LoginPage`, `RegistrationPage`, `StudentDashboard`, `AdminDashboard` layout and state structure
- JWT middleware (`requireAuth`, `requireAdmin`) template
- Vite + React Router setup and `App.jsx` route configuration
- Postman collection v2.1 JSON generation including auto-capture test scripts
- OpenAPI 3.0 spec (`docs/openapi.yaml`) with 15 paths, schemas, and security definitions
- All three documentation files (`API_OVERVIEW.md`, `ARCHITECTURE.md`, `DB_SCHEMA.md`) — initial drafts and subsequent updates
- CSS layout and status badge styles
- Axios interceptor pattern for token attachment and 401 auto-redirect
- README rewrite and AI usage log structure

### Manually implemented / reviewed / refined parts
- Verified each API route manually by running services with `npm run dev` and testing via Postman
- Debugged and corrected Postman collection v2.1 schema (URL strings vs. objects causing silent import failure) — identified by reading extension error output, not AI
- Confirmed overlap validation logic (student double-booking prevention) covered edge cases like same-lab same-time on different days
- Manually tested auth flow: register → login → refresh → 401 recovery → role mismatch error
- Decided booking status state machine transitions (which states lead to which) and reviewed each guard for correctness
- Verified `status-completed` CSS class was already present before requesting the COMPLETED feature — avoiding a duplicate style being added
- Reviewed and edited all generated documentation to remove inconsistencies with actual implemented routes
- All git commit messages written and curated by student
- This reflection section written in student's own words

---

## Reflection Report

### 1. Which AI tools were used and how?

I used **GitHub Copilot** (integrated in VS Code, powered by Claude Sonnet 4.6) throughout the entire assignment. I interacted with it in a conversational way — asking it to scaffold the project, suggest feature designs, generate backend routes, write React components, produce documentation, and review the rubric to prioritise my work.

I used it in three main modes:
- **Generation** — asking for new code (routes, components, schemas, docs)
- **Review** — asking "what am I missing" against rubric criteria or spec requirements
- **Debugging** — describing an error and asking for the root cause (e.g., refresh losing auth state, Postman import failing)

### 2. Where did AI speed up development?

The biggest time saving was in **boilerplate elimination**. Setting up a monorepo with three Node.js services, a React Vite frontend, an API gateway with Swagger, an auth middleware layer, and Mongoose schemas would have taken a full day manually. With AI assistance, a working scaffold was ready in under an hour.

Documentation was also significantly faster. Writing `API_OVERVIEW.md`, `ARCHITECTURE.md`, and the OpenAPI YAML spec manually for 15 endpoints with full request/response examples would have taken hours. The AI generated complete, consistent drafts I could review and ship quickly.

### 3. Where was AI output incorrect or incomplete?

- **Postman collection schema**: The first generated collection used plain URL strings. The Postman VS Code extension requires URL fields to be objects (`{ raw: "...", host: [...], path: [...] }`). The AI did not anticipate this constraint — I had to diagnose the silent import failure myself, report back, and request a fix.
- **Environment file handling**: Early in the project the README said `.env` files were "already scaffolded" but in reality only `.env.example` existed. The AI had described the desired state rather than the actual state — I had to flag this and get the README corrected.
- **Overconfident route generation**: Some early generated routes did not include all edge-case guards (e.g., capacity vs. lab seats check was missing from the initial slot creation route). I discovered this through manual testing and had to request the guard be added.

### 4. What issues came up integrating AI output and how were they debugged?

**Session persistence on refresh**: The AI's initial frontend scaffold stored the JWT in `sessionStorage` but did not restore it before the axios client was initialised. After login, a browser refresh caused 401 errors on every API call. I identified the issue by checking the `Authorization` header in the browser network tab — it was empty on page load. I described this to the AI and it correctly diagnosed missing interceptor initialisation at module load time.

**Postman collection import failure**: The VS Code Postman extension silently refused to import the collection. The AI's first fix attempt modified the wrong field. I read the extension's error output carefully, identified it expected URL objects, and asked for a targeted fix specifying the exact field format required.

**COMPLETED status extension**: When asking for the COMPLETED status feature, I first checked that `status-completed` CSS was already in `styles.css` before requesting the frontend changes. The AI correctly identified it existed and did not add a duplicate rule — but I would not have caught a duplicate without that manual check first.

### 5. Did AI help or hinder understanding?

Overall, AI **helped** my understanding in areas I was less familiar with — specifically:
- MongoDB aggregation (`$group`, `$match`) for capacity calculations
- OpenAPI 3.0 spec structure and serving it through an Express gateway
- React sessionStorage + interceptor architecture for persistent auth

It **created a blind spot risk** in validation logic. Because the AI generated route handlers quickly, I could have accepted them without reading the guards carefully. I mitigated this by manually testing each feature after it was generated rather than trusting the generated code was correct.

The strongest learning outcome was understanding how to **work with AI as a reviewer and generator** rather than a replacement for thinking. The architecture decisions — microservices, status machine design, referential integrity guards — were mine. The AI translated those decisions into code faster than I could type.

---

## Evidence Checklist
- [x] GitHub repo is public and complete
- [x] API documentation included (Swagger UI at `/api-docs`, Postman collection, `docs/API_OVERVIEW.md`)
- [x] DB schema/model diagram included (`docs/DB_SCHEMA.md`)
- [x] Architecture + component hierarchy documented (`docs/ARCHITECTURE.md`)
- [x] AI usage log updated with real prompts and outcomes (this file)
- [ ] Demo video recorded and uploaded to Google Drive (accessible to BITS emails)
- [ ] Google Drive video link added to LMS submission
- [ ] Reflection report submitted (content above — export to PDF or paste into LMS)

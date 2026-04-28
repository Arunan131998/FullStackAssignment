# AI Usage Log (Assignment Evidence)

## Student Details
- Course: SE ZG503 Full Stack Application Development
- Assignment: Web Application Development
- Submission Due Date: 4 May 2026
- Student Name: _Add your name_
- Student ID: _Add your ID_
- AI Tool Used: GitHub Copilot (GPT-5.3-Codex)

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

---

## Suggested Format for Future Entries
Use one row per meaningful AI interaction:

- What you asked (prompt)
- What AI returned (summary)
- What you accepted/rejected and why
- What code/doc changed
- What you learned (especially debugging AI output)

---

## Manual vs AI Work Split (Fill Before Submission)

### AI-assisted parts
- _Example: initial boilerplate for React components_
- _Example: API endpoint draft and validation suggestions_
- _Example: test case generation and documentation skeleton_

### Manually implemented/refined parts
- _Example: final business logic and edge-case handling_
- _Example: schema adjustments and bug fixes after testing_
- _Example: UI behavior tuning and integration fixes_

---

## Reflection Notes (Draft Pointers)
Answer in your own words before final submission:

1. Which AI tools did you use and for what tasks?
2. Where did AI speed up development?
3. Where was AI output incorrect/incomplete?
4. What bugs emerged from AI-generated code and how did you debug them?
5. Did AI improve your understanding or create blind spots?

---

## Evidence Checklist (Before LMS Submission)
- [ ] GitHub repo is public and complete
- [ ] API documentation included (Swagger/Postman/Markdown)
- [ ] DB schema/model diagram included
- [ ] Architecture + component hierarchy documented
- [ ] Demo video uploaded to Google Drive with public/access permissions for evaluators
- [ ] Reflection report (1–2 pages) written manually
- [ ] AI usage log updated with real prompts and outcomes

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
| 5 | 2026-04-28 | "Make it runnable locally." | Installed npm dependencies across all modules, created service-level `.env` files, and added Docker Compose for MongoDB. | Environment became ready for running with `npm run dev` after Mongo startup. | `docker-compose.yml`, `backend/**/.env`, `frontend/.env`, `README.md` | Learned practical setup sequencing (DB first, then services, then frontend) for microservice projects. |
| 6 | 2026-04-28 | "Add seed users and Postman demo flow." | Added an idempotent user seed script and generated importable Postman collection/environment for complete API demonstration flow. | Included seed command in root scripts and documented execution/import steps for demo video preparation. | `backend/services/auth-service/src/scripts/seedUsers.js`, `docs/postman/*`, `README.md`, `package.json` | Learned how reusable test data + API collections significantly reduce demo and validation time. |
| 7 | 2026-04-28 | "Stop, switch everything back to work with MongoDB." | Reverted database-related changes and restored backend code, dependencies, env configuration, and documentation to Mongoose + MongoDB flow. | Rolled back migration attempt and kept original MongoDB architecture for stable assignment delivery. | `backend/services/*`, `.env.example`, `README.md`, `docs/DB_SCHEMA.md` | Learned the importance of minimizing toolchain risk during deadline-driven development. |

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

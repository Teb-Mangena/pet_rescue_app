## PHASE 1: DATABASE & ARCHITECTURE (COMPLETE)

- [x] ERD Design & Normalization (29 tables)
- [x] Database Schema Creation & Relationships
- [x] Seed Data integration
- [x] Utility scripts (hash passwords, update roles, set onboarding flags)

## PHASE 2: AUTHENTICATION & AUTHORIZATION (COMPLETE)

- [x] Step 1 Registration (Email & Password hashing)
- [x] Step 2 Onboarding (Profile details, subtype insertion, `is_onboarded` flag)
- [x] Login & Role Resolution
- [x] JWT HttpOnly Cookie Generation & verification
- [x] `protectAuth` Middleware for protected routes
- [x] Logout & Session clearing
- [x] `checkAuth` route for frontend state

## PHASE 3: CORE API / BUSINESS LOGIC (IN PROGRESS)

### PET OWNER

- [x] Register own pet
- [x] View all of their own pets
- [x] Report a lost pet (Missing Pet Incident)
- [ ] Update a pet
- [ ] Delete a pet
- [ ] View found pets
- [ ] Update a missing pet status (Mark as found/resolved)
- [ ] Write a reunion story

### COMMUNITY MEMBER

- [x] View all lost pets (Active Missing Incidents)
- [ ] View all found pets
- [ ] Report a found pet
- [ ] View reunion stories for inspiration

### IT ADMIN (ORG LEVEL)

- [ ] IT Admin profile
- [ ] Register a manager for their specific NPO/SPCA
- [ ] View all staff of the org

### MANAGER (ORG LEVEL)

- [ ] Manager profile
- [ ] View all organization tasks/reports (Missing & Found incidents routed to them)
- [ ] Assign/Coordinate pet handovers at the NPO/SPCA
- [ ] Update incident statuses to closed/resolved

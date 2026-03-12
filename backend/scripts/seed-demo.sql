-- Demo POC seed data: employees with varied eligibility states
-- Run after: npm run db:migrate:local --workspace=backend
-- Execute: npx wrangler d1 execute team8 --local --file=./scripts/seed-demo.sql

-- Clear existing seed/demo employees (preserve table structure)
DELETE FROM benefit_requests;
DELETE FROM employees;

-- Employee A: Fully eligible (okr=1, late=0, active, responsibility=2, hireDate 2+ years ago)
INSERT INTO employees (id, email, name, name_eng, role, department, responsibility_level, employment_status, hire_date, okr_submitted, late_arrival_count, created_at, updated_at)
VALUES ('emp-demo-a', 'alice@company.mn', 'Alice', 'Alice', 'engineer', 'Engineering', 2, 'active', '2022-06-15', 1, 0, datetime('now'), datetime('now'));

-- Employee B: OKR gate locked (okr=0) — several benefits locked with "Submit your Q[current] OKR"
INSERT INTO employees (id, email, name, name_eng, role, department, responsibility_level, employment_status, hire_date, okr_submitted, late_arrival_count, created_at, updated_at)
VALUES ('emp-demo-b', 'bob@company.mn', 'Bob', 'Bob', 'engineer', 'Engineering', 2, 'active', '2023-01-10', 0, 0, datetime('now'), datetime('now'));

-- Employee C: Attendance gate locked (late=3) — Gym, Insurance, Remote Work locked
INSERT INTO employees (id, email, name, name_eng, role, department, responsibility_level, employment_status, hire_date, okr_submitted, late_arrival_count, created_at, updated_at)
VALUES ('emp-demo-c', 'carol@company.mn', 'Carol', 'Carol', 'teacher', 'Education', 2, 'active', '2023-03-01', 1, 3, datetime('now'), datetime('now'));

-- Employee D: Probation — probation-restricted benefits locked
INSERT INTO employees (id, email, name, name_eng, role, department, responsibility_level, employment_status, hire_date, okr_submitted, late_arrival_count, created_at, updated_at)
VALUES ('emp-demo-d', 'dave@company.mn', 'Dave', 'Dave', 'engineer', 'Engineering', 1, 'probation', '2025-02-01', 0, 2, datetime('now'), datetime('now'));

-- Employee E: UX engineer — UX Engineer Tools eligible
INSERT INTO employees (id, email, name, name_eng, role, department, responsibility_level, employment_status, hire_date, okr_submitted, late_arrival_count, created_at, updated_at)
VALUES ('emp-demo-e', 'eve@company.mn', 'Eve', 'Eve', 'ux_engineer', 'Design', 2, 'active', '2023-06-01', 1, 1, datetime('now'), datetime('now'));

-- Test ажилчид (seed) — /test хуудсан дээр харагдана
INSERT INTO employees (id, email, name, name_eng, role, department, responsibility_level, employment_status, hire_date, okr_submitted, late_arrival_count, created_at, updated_at)
VALUES
  ('emp-seed-1', 'bataa@company.mn', 'Батбаяр', 'Batbayar', 'engineer', 'Engineering', 2, 'active', '2023-01-15', 1, 0, datetime('now'), datetime('now')),
  ('emp-seed-2', 'saruul@company.mn', 'Саруул', 'Saruul', 'ux_engineer', 'Design', 2, 'active', '2023-06-01', 1, 1, datetime('now'), datetime('now')),
  ('emp-seed-3', 'odgerel@company.mn', 'Одгэрэл', 'Odgerel', 'manager', 'Product', 3, 'active', '2022-03-10', 1, 0, datetime('now'), datetime('now')),
  ('emp-seed-4', 'tuul@company.mn', 'Түүл', 'Tuul', 'engineer', 'Engineering', 1, 'probation', '2025-02-01', 0, 2, datetime('now'), datetime('now'));

# Real Data Import

This flow imports real employee data into Cloudflare D1 and computes eligibility rows from the TDD rule engine.

## Supported source formats

- `.csv`
- `.json`

`.xlsx` is not supported directly. Export it to CSV first.

## Required columns

- `employee_code` or `id`
- `email`
- `name`
- `role`
- `department`
- `responsibility_level`
- `employment_status`
- `hire_date`

## Optional columns

- `name_eng`
- `okr_submitted`
- `late_arrival_count`

## Accepted aliases

- `employee_id`, `employeeId`
- `employeeCode`
- `nameEng`, `english_name`
- `responsibilityLevel`, `level`
- `employmentStatus`, `status`
- `hireDate`, `start_date`
- `okrSubmitted`
- `lateArrivalCount`

## Accepted employment status values

- `active`
- `probation`
- `probationary`
- `leave`
- `on_leave`
- `terminated`

## Example

```csv
employee_code,email,name,name_eng,role,department,responsibility_level,employment_status,hire_date,okr_submitted,late_arrival_count
EMP001,employee.one@company.mn,Employee One,Employee One,engineer,Engineering,2,active,2024-01-15,true,1
EMP002,employee.two@company.mn,Employee Two,Employee Two,ux_engineer,Design,2,active,2023-08-01,true,0
```

## Built-in demo dataset

The repo includes a schema-safe demo dataset with 24 employees:

- [demo-employees.csv](/Users/bumbayarariunbat/Desktop/EBMS/team-8/backend/packages/db/data/demo-employees.csv)

You can import it directly:

```bash
cd /Users/bumbayarariunbat/Desktop/EBMS/team-8
npm run db:migrate:remote
npm run db:seed:remote
IMPORT_FILE=/Users/bumbayarariunbat/Desktop/EBMS/team-8/backend/packages/db/data/demo-employees.csv npm run db:import:employees:remote
```

## Remote import order

1. Apply schema
2. Seed benefits and rules
3. Import employees and computed eligibility

```bash
cd /Users/bumbayarariunbat/Desktop/EBMS/team-8
npm run db:migrate:remote
npm run db:seed:remote
IMPORT_FILE=/absolute/path/to/employees.csv npm run db:import:employees:remote
```

## Local dry run order

```bash
cd /Users/bumbayarariunbat/Desktop/EBMS/team-8
npm run db:migrate:local
npm run db:seed:local
IMPORT_FILE=/absolute/path/to/employees.csv npm run db:import:employees:local
```

## What the import does

- Upserts `employees`
- Computes `benefit_eligibility` using the current TDD rule engine
- Appends `audit_logs` with actor `system-import`
- Automatically strips `BEGIN/COMMIT` wrappers for remote D1 execution

## Demo contract import

The repo also includes 4 demo contract PDFs and a manifest:

- [contract-manifest.json](/Users/bumbayarariunbat/Desktop/EBMS/team-8/backend/packages/db/data/contracts/contract-manifest.json)

Remote order:

```bash
cd /Users/bumbayarariunbat/Desktop/EBMS/team-8/backend/packages/db
npm run r2:upload:contracts
npm run db:import:contracts:remote
```

This will:

- upload the contract files to the configured R2 bucket
- insert/update `contracts`
- update `benefits.active_contract_id`
- append contract import audit rows

## Operational demo data

After employees and contracts are imported, you can populate the remaining request-oriented tables:

```bash
cd /Users/bumbayarariunbat/Desktop/EBMS/team-8/backend/packages/db
npm run db:seed:ops:remote
```

This will insert/update schema-safe demo rows for:

- `benefit_requests`
- `contract_acceptance_logs`
- `notification_events`
- `sync_runs`
- matching `audit_logs`

The demo seed includes:

- pending, approved, rejected, and cancelled requests
- contract-required request acceptance logs
- finance queue and manager queue notification events
- OKR and attendance sync run history

## Important limitations

- Benefit catalog and rules must already be seeded
- Employee import still drives the computed `benefit_eligibility` refresh

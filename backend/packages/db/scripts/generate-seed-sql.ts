import { benefitCatalog } from "../../config/dist/index.js";

function escapeSql(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

function toSqlText(value: unknown): string {
  return escapeSql(JSON.stringify(value));
}

function toSqlBoolean(value: boolean): string {
  return value ? "1" : "0";
}

const catalogBenefitIds = benefitCatalog.map((benefit) => escapeSql(benefit.id)).join(", ");

const statements: string[] = [
  "BEGIN TRANSACTION;",
  `DELETE FROM eligibility_rules WHERE benefit_id IN (${catalogBenefitIds});`,
  `DELETE FROM benefits WHERE id IN (${catalogBenefitIds});`
];

for (const benefit of benefitCatalog) {
  statements.push(
    [
      "INSERT INTO benefits (",
      "  id,",
      "  slug,",
      "  name,",
      "  category,",
      "  subsidy_percent,",
      "  vendor_name,",
      "  requires_contract,",
      "  requires_finance_approval,",
      "  requires_manager_approval,",
      "  is_core_benefit,",
      "  is_active",
      ") VALUES (",
      `  ${escapeSql(benefit.id)},`,
      `  ${escapeSql(benefit.slug)},`,
      `  ${escapeSql(benefit.name)},`,
      `  ${escapeSql(benefit.category)},`,
      `  ${benefit.subsidyPercent},`,
      benefit.vendorName ? `  ${escapeSql(benefit.vendorName)},` : "  NULL,",
      `  ${toSqlBoolean(benefit.requiresContract)},`,
      `  ${toSqlBoolean(benefit.requiresFinanceApproval)},`,
      `  ${toSqlBoolean(benefit.requiresManagerApproval)},`,
      `  ${toSqlBoolean(benefit.isCoreBenefit)},`,
      "  1",
      ");"
    ].join("\n")
  );

  for (const rule of benefit.rules) {
    statements.push(
      [
        "INSERT INTO eligibility_rules (",
        "  id,",
        "  benefit_id,",
        "  rule_type,",
        "  operator,",
        "  value,",
        "  error_message,",
        "  priority,",
        "  is_active",
        ") VALUES (",
        `  ${escapeSql(rule.id)},`,
        `  ${escapeSql(benefit.id)},`,
        `  ${escapeSql(rule.ruleType)},`,
        `  ${escapeSql(rule.operator)},`,
        `  ${toSqlText(rule.value)},`,
        `  ${escapeSql(rule.errorMessage)},`,
        `  ${rule.priority},`,
        "  1",
        ");"
      ].join("\n")
    );
  }
}

statements.push("COMMIT;");

process.stdout.write(`${statements.join("\n\n")}\n`);

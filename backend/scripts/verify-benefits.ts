/**
 * Query the deployed Team8 GraphQL API for benefits and verify all 11 are returned.
 * Usage: bun run scripts/verify-benefits.ts
 *        API_URL=https://team8-api.team8pinequest.workers.dev/ bun run scripts/verify-benefits.ts
 */

const API_URL =
  process.env.API_URL || "https://team8-api.team8pinequest.workers.dev/";

const EXPECTED_BENEFIT_IDS = [
  "gym_pinefit",
  "private_insurance",
  "digital_wellness",
  "macbook",
  "extra_responsibility",
  "ux_engineer_tools",
  "down_payment",
  "shit_happened_days",
  "remote_work",
  "travel",
  "bonus_okr",
];

async function main() {
  const query = `
    query Benefits($category: String) {
      benefits(category: $category) {
        id
        name
        nameEng
        category
        subsidyPercent
        employeePercent
        unitPrice
        vendorName
        requiresContract
        flowType
        optionsDescription
        duration
      }
    }
  `;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: {} }),
    });

    if (!res.ok) {
      console.error(`HTTP ${res.status}: ${res.statusText}`);
      process.exit(1);
    }

    const json = (await res.json()) as {
      data?: { benefits: Array<{ id: string; name: string; category: string }> };
      errors?: Array<{ message: string }>;
    };

    if (json.errors?.length) {
      console.error("GraphQL errors:", json.errors);
      process.exit(1);
    }

    const benefits = json.data?.benefits ?? [];
    const ids = new Set(benefits.map((b) => b.id));

    console.log(`API: ${API_URL}`);
    console.log(`Returned ${benefits.length} benefits:\n`);
    benefits.forEach((b) => {
      console.log(`  ${b.id}: ${b.name} (${b.category})`);
    });

    const missing = EXPECTED_BENEFIT_IDS.filter((id) => !ids.has(id));
    const extra = benefits.filter((b) => !EXPECTED_BENEFIT_IDS.includes(b.id));

    if (missing.length > 0) {
      console.error(`\nMissing expected benefits: ${missing.join(", ")}`);
      process.exit(1);
    }
    if (extra.length > 0) {
      console.log(`\nAdditional benefits (not in expected list): ${extra.map((b) => b.id).join(", ")}`);
    }

    console.log(`\nAll 11 benefits are present.`);
  } catch (err) {
    console.error("Request failed:", err);
    process.exit(1);
  }
}

main();

// scripts/fetch-secrets.mjs
import fs from "fs";

const domain = (process.env.INFISICAL_DOMAIN || "https://env.kemenag-baritoutara.com").replace(/\/$/, "");
const clientId = process.env.INFISICAL_CLIENT_ID;
const clientSecret = process.env.INFISICAL_CLIENT_SECRET;
const projectId = process.env.INFISICAL_PROJECT_ID;
const envName = process.env.INFISICAL_ENV || "prod";

if (!clientId || !clientSecret || !projectId) {
  console.error("[Infisical Error] Missing required credentials: INFISICAL_CLIENT_ID, INFISICAL_CLIENT_SECRET, or INFISICAL_PROJECT_ID must be set in Environment Variables.");
  process.exit(1);
}

async function main() {
  console.log("[Infisical] Logging in via Universal Auth to", domain);
  const loginRes = await fetch(`${domain}/api/v1/auth/universal-auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ clientId, clientSecret }),
  });

  if (!loginRes.ok) {
    const text = await loginRes.text();
    throw new Error(`Login failed (${loginRes.status}): ${text}`);
  }

  const { accessToken } = await loginRes.json();

  console.log(`[Infisical] Fetching secrets for environment '${envName}'...`);
  const secretsRes = await fetch(
    `${domain}/api/v3/secrets/raw?workspaceId=${projectId}&environment=${envName}`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  if (!secretsRes.ok) {
    const text = await secretsRes.text();
    throw new Error(`Fetch secrets failed (${secretsRes.status}): ${text}`);
  }

  const data = await secretsRes.json();
  const secrets = data.secrets || [];

  const envLines = secrets.map((s) => {
    // If value contains newlines or quotes, format safely
    let val = s.secretValue;
    if (val.includes("\n") || val.includes(" ") || val.includes('"')) {
      val = `"${val.replace(/"/g, '\\"')}"`;
    }
    return `${s.secretKey}=${val}`;
  });

  fs.writeFileSync(".env", envLines.join("\n") + "\n", "utf8");
  console.log(`[Infisical] Done! Successfully wrote ${secrets.length} secrets to .env`);
}

main().catch((err) => {
  console.error("[Infisical Error]", err);
  process.exit(1);
});

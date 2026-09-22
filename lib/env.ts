/**
 * One-shot startup diagnostic for missing configuration.
 *
 * Without these vars the app still boots — pages fall back to the bundled
 * default content — but the database and sign-in are both dead, and the
 * underlying errors surface as dozens of scattered `MissingSecret` and
 * connection failures per request. This collapses them into a single
 * actionable message.
 *
 * Server-only: importing this from a client component would be a mistake, but
 * it reads no secret values, only whether each name is set.
 */

const REQUIRED = [
  ["MONGODB_URI", "database reads and writes"],
  ["AUTH_SECRET", "admin sign-in"],
] as const;

const RECOMMENDED = [
  ["ADMIN_EMAIL", "admin sign-in"],
  ["CLOUDINARY_CLOUD_NAME", "image uploads"],
  ["CLOUDINARY_API_KEY", "image uploads"],
  ["CLOUDINARY_API_SECRET", "image uploads"],
] as const;

let reported = false;

export function reportMissingEnv() {
  if (reported) return;
  reported = true;

  const isSet = (name: string) => (process.env[name] ?? "").trim().length > 0;

  const missingRequired = REQUIRED.filter(([name]) => !isSet(name));
  const missingRecommended = RECOMMENDED.filter(([name]) => !isSet(name));

  // The password can be supplied as either a hash or, in development, plaintext.
  const missingPassword = !isSet("ADMIN_PASSWORD_HASH") && !isSet("ADMIN_PASSWORD");

  if (missingRequired.length === 0 && missingRecommended.length === 0 && !missingPassword) {
    return;
  }

  const lines = [
    "",
    "  Configuration incomplete. Copy .env.example to .env.local and fill it in.",
    "",
  ];

  for (const [name, purpose] of missingRequired) {
    lines.push(`    missing  ${name.padEnd(24)} required for ${purpose}`);
  }

  if (missingPassword) {
    lines.push(
      `    missing  ${"ADMIN_PASSWORD_HASH".padEnd(24)} required for admin sign-in` +
        ` — generate with: npm run hash -- "your-password"`,
    );
  }

  for (const [name, purpose] of missingRecommended) {
    lines.push(`    unset    ${name.padEnd(24)} needed for ${purpose}`);
  }

  lines.push(
    "",
    "  Public pages will render with placeholder content until MONGODB_URI is set.",
    "",
  );

  console.warn(lines.join("\n"));
}

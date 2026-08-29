/**
 * Generates the bcrypt hash for ADMIN_PASSWORD_HASH.
 *
 *   npm run hash -- "your-password-here"
 *
 * Storing the hash rather than the plaintext means the deployment environment
 * never holds a password that could be reused elsewhere if the env leaks.
 */
import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash -- "your-password-here"');
  process.exit(1);
}

if (password.length < 10) {
  console.error("Use at least 10 characters for an admin password.");
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 12);

console.log("\nAdd this to .env.local (and to your host's env vars):\n");
console.log(`ADMIN_PASSWORD_HASH='${hash}'\n`);
console.log(
  "Single quotes matter — a bcrypt hash contains $ characters that some shells expand.\n",
);

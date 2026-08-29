/**
 * Asserts that no mutating endpoint can be reached without an admin session.
 *
 * A 401 here proves the guard inside the handler is doing the work, rather than
 * the redirect in proxy.ts (which fetch bypasses by not sending a cookie).
 */
const base = process.env.SMOKE_BASE ?? "http://localhost:3000";

const cases = [
  ["POST", "/api/projects"],
  ["PATCH", "/api/projects/reorder"],
  ["PATCH", "/api/projects/64b7f1c2a1b2c3d4e5f60718"],
  ["DELETE", "/api/projects/64b7f1c2a1b2c3d4e5f60718"],
  ["POST", "/api/blog"],
  ["PATCH", "/api/blog/some-slug"],
  ["DELETE", "/api/blog/some-slug"],
  ["POST", "/api/products"],
  ["PATCH", "/api/products/64b7f1c2a1b2c3d4e5f60718"],
  ["DELETE", "/api/products/64b7f1c2a1b2c3d4e5f60718"],
  ["POST", "/api/tools"],
  ["PATCH", "/api/tools/some-slug"],
  ["DELETE", "/api/tools/some-slug"],
  ["PATCH", "/api/profile"],
  ["POST", "/api/skills"],
  ["PATCH", "/api/skills/64b7f1c2a1b2c3d4e5f60718"],
  ["DELETE", "/api/skills/64b7f1c2a1b2c3d4e5f60718"],
  ["POST", "/api/experience"],
  ["PATCH", "/api/experience/64b7f1c2a1b2c3d4e5f60718"],
  ["DELETE", "/api/experience/64b7f1c2a1b2c3d4e5f60718"],
  ["POST", "/api/upload"],
  ["GET", "/api/messages"],
  ["PATCH", "/api/messages/64b7f1c2a1b2c3d4e5f60718"],
  ["DELETE", "/api/messages/64b7f1c2a1b2c3d4e5f60718"],
];

let leaked = 0;

for (const [method, route] of cases) {
  const res = await fetch(base + route, {
    method,
    headers: { "content-type": "application/json" },
    body: method === "GET" || method === "POST" && route === "/api/upload"
      ? undefined
      : JSON.stringify({ title: "unauthorised write attempt" }),
  });

  const ok = res.status === 401;
  if (!ok) leaked++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${res.status}  ${method} ${route}`);
}

console.log(
  leaked === 0
    ? "\nAll mutating endpoints require an admin session."
    : `\n${leaked} endpoint(s) did not return 401.`,
);

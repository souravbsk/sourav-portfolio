const base = process.env.SMOKE_BASE ?? "http://localhost:3000";

const routes = [
  "/",
  "/projects",
  "/blog",
  "/resume",
  "/admin",
  "/admin/login",
  "/api/projects",
  "/api/profile",
  "/api/blog",
  "/api/tools",
  "/api/products",
  "/nope-404",
];

let failures = 0;

for (const route of routes) {
  try {
    const res = await fetch(base + route, { redirect: "manual" });
    const body = await res.text();
    const location = res.headers.get("location");
    const flag = res.status >= 500 ? " <-- SERVER ERROR" : "";
    if (res.status >= 500) failures++;
    console.log(
      `${res.status} ${route}${location ? ` -> ${location}` : ""} (${body.length}b)${flag}`,
    );
    if (res.status >= 500) console.log(`      ${body.slice(0, 300)}`);
  } catch (error) {
    failures++;
    console.log(`ERR ${route}: ${error.message}`);
  }
}

console.log(failures === 0 ? "\nAll routes responded without a 5xx." : `\n${failures} failing route(s).`);

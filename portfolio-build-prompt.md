# Portfolio Rebuild — Full Build Prompt

## Context

I have an existing portfolio site at souravbasak.com, currently split across two repos:

- **Frontend**: `sourav-portfolio` — Vite + React 18, react-router-dom v6, Tailwind + daisyUI.
  Real routing lives in `src/main.jsx` (not `App.jsx`, which is unused Vite boilerplate).
  Structure: `layout/Main.jsx` (Header + `<Outlet/>` + Footer) → `components/Home/Home.jsx`
  composes `HeroSection`, `About`, `Skilles`, `Projects`, `Experience`, `Contact`.
  Dashboard screens live in `src/Dashboard/` (`AddAProject.jsx`, `AllProjects.jsx`,
  `UpdateProject.jsx`) and are **publicly accessible with no login** — anyone can
  add/edit/delete projects. Image upload posts directly to imgbb from the browser with
  an **API key hardcoded in the client source**. Firebase is initialized but unused
  anywhere — dead weight, drop it.

- **Backend**: `sourav-portfolio-server` — a single `index.js` (~126 lines), Express +
  the native `mongodb` driver (not Mongoose), one collection (`Projects` in a
  `souravPortfolio` database). Five routes: `POST /projects`, `GET /projects?tabValue=`
  (regex-filtered by a `skills` string field), `GET /projects/:id`,
  `POST /projects/:id` (misused for update — should be PATCH/PUT), `DELETE /projects/:id`.
  No input validation, no try/catch, no auth on any route. Deployed on Vercel already.

I'm handing you both repos. Rebuild this as a single full-stack Next.js app. Read the
existing code first — reuse actual copy/content (skills, experience, project data) from
it rather than inventing placeholder content, and preserve the existing MongoDB
`Projects` collection's field names so no data migration is required.

## Goal

A more professional, creative portfolio showcasing my product/design work, with a
real 3D landing page, and an admin dashboard where I can manage everything — projects,
a category-based blog, and (in the future) my own built tools — without touching code.

## Stack decisions (already made — don't re-litigate these)

- **Framework**: Next.js (App Router), migrated fully from the Vite React app.
- **Backend**: merged into Next.js API routes (`app/api/*`) — no separate Express
  server. Same MongoDB Atlas cluster, accessed via **Mongoose** (not the native driver)
  for schema validation.
- **3D**: full **react-three-fiber** + `@react-three/drei` scene in the hero — not a
  lightweight CSS/SVG approximation. Cartoon-3D look: flat-shaded / toon materials
  (`MeshToonMaterial`), not photorealistic PBR.
- **Animation**: Framer Motion for scroll reveals, staggered entrances, hover
  micro-interactions.
- **UI kit**: shadcn/ui (New York style is fine), Tailwind CSS.
- **Auth**: NextAuth (Auth.js v5), Credentials provider, **single admin account** from
  env vars — this is a one-owner site, no need for multi-user or a users collection.
- **Image hosting**: Cloudinary, uploaded through a **server-side signed route** — never
  expose the API key to the browser (this fixes a real vulnerability in the current
  site — see Security section).

## Design system

Keep the site's existing identity (deep navy background, cyan/violet accents) rather
than switching to a generic template palette — elevate it, don't replace it.

- **Colors**: `#060B18` (background), `#0D1730` / `#121D3D` (panels), `#EAF1FF` (text),
  `#8EA0C4` (muted text), `#3FE6D6` (cyan accent), `#9C7CFF` (violet accent), `#FFB673`
  (small warm highlight, used sparingly).
- **Type**: Space Grotesk (display/headings), Inter (body), JetBrains Mono (nav labels,
  skill tags, eyebrow text — functional, ties to the developer identity, not just
  decorative).
- **Header/footer**: slim, minimal height, not a standard bulky portfolio nav.
- **3D signature element**: a toon-shaded icosahedron "core" with a wireframe outer
  shell, three smaller octahedron "satellites" orbiting it at different speeds/tilts
  (representing individual projects), subtle mouse-parallax rotation on the whole
  group, gentle float animation. This is the one memorable visual element — keep
  everything else around it quiet.
- Respect `prefers-reduced-motion`. Responsive down to mobile. Visible keyboard focus
  states throughout, including inside the admin dashboard.

## Site structure

```
/                       Landing page: Hero (3D) → About → Skills → Projects → Experience → Contact
/blog                   Blog index, filterable by category
/blog/[category]/[slug] Individual post
/resume                 Resume page — prominently shown, not buried; viewable + downloadable
/admin/login            Admin sign-in
/admin                  Protected dashboard — project list, edit, delete
/admin/projects/new     Add project (title, description, links, skills, category, status, image upload)
/admin/projects/[id]/edit
/admin/blog             Blog post list/create/edit (mirror the projects admin pattern)
/admin/tools            Tools list/create/edit (mirror the projects admin pattern) — build the
                         data layer and CRUD now even though I don't have tools to upload yet;
                         I'll add real tools later without needing new code.
```

## Data models (Mongoose)

**Project** (migrated from the existing `Projects` collection — keep field names as-is):
`title`, `description`, `liveLink`, `clientLink`, `serverLink`, `skills: string[]`,
`photoUrl`, `projectSS: string[]` (screenshot gallery), `status: "special" | "normal"`,
`category: "html" | "react" | "mern" | "next" | "wordpress"`, timestamps.

**BlogPost** (new): `title`, `slug` (unique), `category`, `coverImage`, `excerpt`,
`content` (markdown), `published: boolean`, `publishedAt`, timestamps.

**Tool** (new): `name`, `slug` (unique), `description`, `icon`, `url`,
`embedType: "link" | "iframe" | "internal"`, `published: boolean`, timestamps.

## API routes

- `GET/POST /api/projects` — list (filterable by category via a `tab` query param),
  create (admin-only)
- `GET/PATCH/DELETE /api/projects/[id]` — mutations admin-only
- Same pattern for `/api/blog` (+ `[slug]`) and `/api/tools` (+ `[slug]`)
- `POST /api/upload` — admin-only, multipart form-data, uploads to Cloudinary
  server-side, returns the resulting URL only
- NextAuth's own route for sign-in/session

## Security requirements (fixing real issues in the current site)

1. **No public write access.** Every mutating route (`POST`/`PATCH`/`DELETE` on
   projects/blog/tools, and the upload route) must reject unauthenticated requests with
   a 401 — check this server-side in the route handler itself, not just by hiding the
   UI. The current site has zero protection on these.
2. **No client-exposed secrets.** The Cloudinary API secret, Mongo URI, and NextAuth
   secret must only ever be read server-side (env vars without a `NEXT_PUBLIC_` prefix).
   The current site hardcodes an imgbb key directly in browser-shipped code — don't
   repeat that pattern anywhere.
3. Gate all of `/admin/*` (except `/admin/login`) behind an authenticated-session check
   using Next.js's route-protection convention for whatever Next.js version you're
   building against (this has changed across versions — verify the current convention
   rather than assuming `middleware.ts` is still correct).
4. Validate all API input against the Mongoose schemas (`runValidators: true` on
   updates) instead of trusting `req.body` directly, which the old backend did.

## Content

Pull real copy from the existing repo — my actual skills list, experience/roles,
existing project descriptions — rather than inventing placeholder text. Where the old
site's copy is thin or awkward, tighten it, but keep it factually accurate to what's
already there. Don't invent employers, dates, or project details that aren't in the
source repos.

## Acceptance checklist

- [ ] `npm run build` passes clean — no type errors, no lint errors
- [ ] Landing page 3D hero renders and responds to mouse movement
- [ ] Scroll-triggered animations fire once, respect reduced-motion
- [ ] Admin routes 401/redirect when logged out; work end-to-end when logged in
  (create → appears on landing page → edit → delete)
- [ ] Image upload works and the Cloudinary secret never appears in any client bundle
  (check the Network tab / rendered HTML, not just the source)
- [ ] Existing MongoDB `Projects` documents display correctly with no migration script
- [ ] Mobile responsive, keyboard-navigable admin forms
- [ ] `.env.example` lists every required variable with a one-line comment on where to
  get it

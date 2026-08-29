# souravbasak.com

Full-stack portfolio built as a single Next.js application. Replaces the
previous split of a Vite + React front end and a separate Express server.

- **Public site**: 3D hero, About, Skills, Work, Experience, Contact, plus
  `/projects`, `/blog` and a readable `/resume`.
- **Admin dashboard** at `/admin`: manage projects, blog posts, tools, skills,
  experience, the whole profile/resume, and read contact-form messages. No code
  change or redeploy needed to update anything on the site.

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 (CSS-first config), shadcn/ui-style primitives |
| 3D | react-three-fiber 9 + drei, `MeshToonMaterial` |
| Animation | Motion (Framer Motion 13) |
| Database | MongoDB Atlas via Mongoose 9 |
| Auth | Auth.js v5 (NextAuth), Credentials, single admin from env |
| Images | Cloudinary, uploaded through a server-side route |

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in every value
npm run hash -- "your-admin-password"   # paste the result into .env.local
npm run seed                   # seeds profile, skills and experience
npm run dev
```

Open <http://localhost:3000>, and <http://localhost:3000/admin> to sign in.

`.env.example` documents every variable and where to get it.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run seed` | Seed profile/skills/experience (add `--force` to overwrite) |
| `npm run hash -- "pw"` | Generate the bcrypt hash for `ADMIN_PASSWORD_HASH` |
| `npm run verify` | typecheck + lint + build, in one go |
| `npm run smoke` | Hit every page and API route against a running server |
| `npm run smoke:auth` | Assert every mutating endpoint returns 401 without a session |

`smoke:auth` is worth running after touching any route handler. It sends
unauthenticated writes to all 20 mutating endpoints and fails if any of them
returns something other than 401.

## Data model notes

The existing `Projects` collection in the `souravPortfolio` database is reused
as-is. Two details matter if you touch the schema:

- **The cover image field is `PhotoUrl`, with a capital P.** Every document
  written by the previous admin form used that spelling. `lib/models/project.ts`
  keeps it, and `lib/content.ts` also falls back to a lowercase `photoUrl` for
  any stray document that used the other casing.
- **Filtering now uses `category`.** The old Express route filtered by running
  regexes against the `skills` array, while the admin form wrote a `category`
  field that nothing ever read. `projectFilter()` in `lib/content.ts` prefers
  `category` and falls back to the legacy regex, so documents created before the
  category field existed still appear under the right tab. `npm run seed`
  backfills `category` and `order` on any document missing them.

New collections: `BlogPosts`, `Tools`, `Profile` (a singleton keyed
`primary`), `Skills`, `Experiences`, `Messages`.

## How authorisation works

Next.js 16 renamed `middleware.ts` to `proxy.ts`, moved it to the Node runtime,
and **silently ignores a leftover `middleware.ts` at build time**. Vercel's own
guidance is that this layer is not a security boundary, so there are three
distinct pieces here:

1. `proxy.ts` — checks only whether a session cookie exists, purely so a
   logged-out visitor is redirected before an admin shell renders. A forged
   cookie gets past this, by design.
2. `app/admin/(dashboard)/layout.tsx` — calls `auth()` server-side and
   redirects unless the session carries the admin role. `/admin/login` sits
   outside this route group so the gate cannot lock you out of signing in.
3. `requireAdmin()` in `lib/api.ts` — called at the top of **every** `POST`,
   `PATCH` and `DELETE` handler and the upload route, returning 401. This is
   what actually protects the data, independent of any UI.

The admin password is stored as a bcrypt hash. `authorize()` runs a bcrypt
compare against a dummy hash when the email does not match, so a wrong email and
a wrong password take the same amount of time and the account cannot be probed.
Login and the public contact form are both rate limited per IP.

## Image uploads

`POST /api/upload` is admin-only, accepts multipart form data, validates the MIME
type and an 8MB size cap, uploads server-side with the Cloudinary SDK, and
returns only the resulting URL. The API key and secret are read from
non-`NEXT_PUBLIC_` env vars, so Next.js cannot inline them into a client bundle.

This replaces the previous approach, where an imgbb API key was hardcoded in
`src/Dashboard/AddAProject.jsx` and shipped to every visitor's browser.

Legacy project images still point at `i.ibb.co`; that hostname is allow-listed in
`next.config.ts` so existing documents keep rendering through `next/image`.

## Accessibility and motion

Every scroll animation goes through `components/motion/reveal.tsx`, which reads
`useReducedMotion` and collapses to a plain visible state when the visitor has
asked for reduced motion. The 3D scene drops to `frameloop="demand"` in that
case, so it renders one static frame and never runs an animation loop. Canvas
quality is also reduced on coarse-pointer and small-viewport devices.

Focus is visible globally via a `:focus-visible` outline using the theme's ring
colour, including throughout the admin forms.

## Deployment

Set every variable from `.env.example` in your host's environment, with
`NEXTAUTH_URL` and `NEXT_PUBLIC_SITE_URL` pointing at the production domain, then
build. Note that `proxy.ts` is Node-runtime only in Next.js 16 — the Edge runtime
is not supported for it and cannot be configured.

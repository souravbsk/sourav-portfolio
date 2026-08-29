import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPosts, getProducts, getProfile, getProjects } from "@/lib/content";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetched here rather than per page so the header's command palette can
  // search everything from any route.
  const [profile, projects, posts, products] = await Promise.all([
    getProfile(),
    getProjects(),
    getPosts(),
    getProducts(),
  ]);

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader projects={projects} posts={posts} products={products} />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter profile={profile} />
    </div>
  );
}

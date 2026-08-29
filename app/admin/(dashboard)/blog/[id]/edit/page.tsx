import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/admin-page";
import { BlogForm } from "@/components/admin/blog-form";
import { getPostById } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) notFound();

  return (
    <>
      <AdminPageHeader
        title="Edit post"
        description={post.title}
        backHref="/admin/blog"
      />
      <BlogForm post={post} />
    </>
  );
}

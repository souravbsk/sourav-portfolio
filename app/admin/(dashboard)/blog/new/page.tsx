import { AdminPageHeader } from "@/components/admin/admin-page";
import { BlogForm } from "@/components/admin/blog-form";

export default function NewPostPage() {
  return (
    <>
      <AdminPageHeader
        title="New post"
        description="Write in markdown. Save as a draft first if it is not ready."
        backHref="/admin/blog"
      />
      <BlogForm />
    </>
  );
}

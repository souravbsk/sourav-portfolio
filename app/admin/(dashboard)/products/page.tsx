import { AdminPageHeader } from "@/components/admin/admin-page";
import { ProductManager } from "@/components/admin/product-manager";
import { getProducts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await getProducts({ includeDrafts: true });

  return (
    <>
      <AdminPageHeader
        title="Products"
        description="Links in the public header Products dropdown. Add a name and a URL — no redesign needed when you ship something new."
      />
      <ProductManager products={products} />
    </>
  );
}

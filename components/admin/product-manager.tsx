"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ExternalLinkIcon, LoaderIcon, PlusIcon, SaveIcon } from "lucide-react";
import { toast } from "sonner";

import { AdminCard } from "@/components/admin/admin-page";
import { DeleteButton } from "@/components/admin/delete-button";
import { Field, FieldRow } from "@/components/admin/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { apiRequest, RequestError } from "@/lib/admin-client";
import type { ProductData } from "@/types/content";

type Draft = {
  name: string;
  url: string;
  description: string;
  order: number;
  published: boolean;
};

const EMPTY: Draft = {
  name: "",
  url: "https://",
  description: "",
  order: 0,
  published: true,
};

export function ProductManager({ products }: { products: ProductData[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);

  async function handleCreate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    try {
      await apiRequest("/api/products", {
        method: "POST",
        body: JSON.stringify({
          ...draft,
          order: draft.order || products.length + 1,
        }),
      });
      toast.success("Product added to the header menu");
      setDraft(EMPTY);
      router.refresh();
    } catch (error) {
      if (error instanceof RequestError) {
        setErrors(error.fieldErrors);
        toast.error(error.message);
      } else {
        toast.error("Could not add the product");
      }
    } finally {
      setPending(false);
    }
  }

  async function patchProduct(id: string, changes: Partial<ProductData>) {
    setSavingId(id);
    try {
      await apiRequest(`/api/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Update failed");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-5">
      <AdminCard
        title="Add a product"
        description="Published products appear as links in the header Products dropdown. Change a URL here and the menu updates immediately."
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <FieldRow>
            <Field id="product-name" label="Name" error={errors.name}>
              <Input
                id="product-name"
                value={draft.name}
                required
                onChange={(event) =>
                  setDraft({ ...draft, name: event.target.value })
                }
                placeholder="Invoice studio"
              />
            </Field>

            <Field id="product-url" label="Link" error={errors.url}>
              <Input
                id="product-url"
                type="url"
                value={draft.url}
                required
                onChange={(event) =>
                  setDraft({ ...draft, url: event.target.value })
                }
                placeholder="https://your-product.com"
              />
            </Field>
          </FieldRow>

          <FieldRow>
            <Field
              id="product-description"
              label="Short line"
              hint="Optional. Shown under the name in the dropdown."
              error={errors.description}
            >
              <Input
                id="product-description"
                value={draft.description}
                onChange={(event) =>
                  setDraft({ ...draft, description: event.target.value })
                }
                placeholder="Invoices for freelancers"
              />
            </Field>

            <Field id="product-order" label="Sort order" error={errors.order}>
              <Input
                id="product-order"
                type="number"
                value={draft.order}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    order: Number(event.target.value) || 0,
                  })
                }
              />
            </Field>
          </FieldRow>

          <Button type="submit" variant="gradient" disabled={pending}>
            {pending ? (
              <>
                <LoaderIcon className="animate-spin" />
                Adding
              </>
            ) : (
              <>
                <PlusIcon />
                Add product
              </>
            )}
          </Button>
        </form>
      </AdminCard>

      <AdminCard
        title={`Header products (${products.length})`}
        description="Edit a name or URL and it saves when the field loses focus."
      >
        {products.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing in the menu yet. Add a name and a live URL above.
          </p>
        ) : (
          <ul className="space-y-2">
            {products.map((product) => (
              <li
                key={product._id}
                className="flex flex-wrap items-center gap-3 rounded-lg border border-border p-2.5"
              >
                <Input
                  defaultValue={product.name}
                  aria-label={`${product.name} name`}
                  onBlur={(event) => {
                    const name = event.target.value.trim();
                    if (name && name !== product.name) {
                      void patchProduct(product._id, { name });
                    }
                  }}
                  className="h-9 w-40 flex-1"
                />

                <Input
                  defaultValue={product.url}
                  aria-label={`${product.name} URL`}
                  onBlur={(event) => {
                    const url = event.target.value.trim();
                    if (url && url !== product.url) {
                      void patchProduct(product._id, { url });
                    }
                  }}
                  className="h-9 min-w-48 flex-[2]"
                />

                <Input
                  defaultValue={product.description}
                  aria-label={`${product.name} description`}
                  onBlur={(event) => {
                    const description = event.target.value.trim();
                    if (description !== product.description) {
                      void patchProduct(product._id, { description });
                    }
                  }}
                  placeholder="Optional line"
                  className="h-9 w-44"
                />

                <label className="flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted-foreground">
                  <Switch
                    checked={product.published}
                    onCheckedChange={(published) =>
                      void patchProduct(product._id, { published })
                    }
                    aria-label={`Show ${product.name} in the header`}
                  />
                  Live
                </label>

                <a
                  href={product.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={`Open ${product.name}`}
                  className="grid size-8 place-items-center rounded-md text-muted-foreground hover:text-cyan-brand"
                >
                  <ExternalLinkIcon className="size-3.5" />
                </a>

                {savingId === product._id ? (
                  <span className="grid size-8 place-items-center text-muted-foreground">
                    <SaveIcon className="size-3.5 animate-pulse" />
                  </span>
                ) : (
                  <DeleteButton
                    endpoint={`/api/products/${product._id}`}
                    label="Product"
                    name={product.name}
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </AdminCard>
    </div>
  );
}

import { redirect } from "next/navigation";

/** People type /login; the form lives at /admin/login. */
export default function LoginRedirectPage() {
  redirect("/admin/login");
}

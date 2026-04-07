import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyJwt } from "@/lib/auth";

export default async function AdminRoot() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin-token")?.value;

  if (token) {
    const payload = await verifyJwt(token);
    if (payload) {
      redirect("/admin/dashboard");
    }
  }

  redirect("/admin/login");
}

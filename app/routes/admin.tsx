import { Outlet, useLocation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/utils/auth.server";
import { getPosts, getTags } from "~/utils/supabase.server";
import Layout from "~/components/Layout";
import DashboardSummary from "~/components/DashboardSummary";

export async function loader({ request }: LoaderFunctionArgs) {
  // Require authentication for all admin routes
  const user = await requireAuth(request);
  
  if (!user) {
    return redirect("/login");
  }
  
  // Fetch data for the dashboard
  const posts = await getPosts();
  const tags = await getTags();
  
  return json({ user, posts, tags });
}

export default function Admin() {
  const location = useLocation();
  const isRootAdminRoute = location.pathname === "/admin";
  
  return (
    <Layout>
      {isRootAdminRoute ? (
        <DashboardSummary posts={[]} tags={[]} />
      ) : (
        <Outlet />
      )}
    </Layout>
  );
}

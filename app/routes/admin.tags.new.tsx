import { json, redirect } from "@remix-run/node";
import { createTag } from "~/utils/supabase.server";
import Layout from "~/components/Layout";
import TagForm from "~/components/TagForm";
import type { ActionFunctionArgs } from "@remix-run/node";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const name = formData.get("name") as string;
  
  // Validate required fields
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // Create tag
  await createTag(name);
  
  return redirect("/admin/tags");
}

export default function NewTag() {
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Tag</h1>
        <TagForm />
      </div>
    </Layout>
  );
}

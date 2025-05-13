import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { supabase } from "~/utils/supabase.server";
import Layout from "~/components/Layout";
import TagForm from "~/components/TagForm";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const tagId = params.id as string;
  
  const { data: tag, error } = await supabase
    .from('tags')
    .select('*')
    .eq('id', tagId)
    .single();
  
  if (error) throw error;
  
  return json({ tag });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const tagId = params.id as string;
  const formData = await request.formData();
  const name = formData.get("name") as string;
  
  // Validate required fields
  const errors: Record<string, string> = {};
  if (!name) errors.name = "Name is required";
  
  if (Object.keys(errors).length > 0) {
    return json({ errors });
  }
  
  // Update tag
  const { error } = await supabase
    .from('tags')
    .update({ name })
    .eq('id', tagId);
  
  if (error) throw error;
  
  return redirect("/admin/tags");
}

export default function EditTag() {
  const { tag } = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Tag</h1>
        <TagForm tag={tag} />
      </div>
    </Layout>
  );
}

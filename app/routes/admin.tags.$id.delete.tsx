import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { supabase } from "~/utils/supabase.server";
import Layout from "~/components/Layout";
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

export async function action({ params }: ActionFunctionArgs) {
  const tagId = params.id as string;
  
  // First check if tag is used in any posts
  const { data: postTags, error: checkError } = await supabase
    .from('posts_tags')
    .select('post_id')
    .eq('tag_id', tagId);
  
  if (checkError) throw checkError;
  
  if (postTags && postTags.length > 0) {
    return json({ 
      error: "Cannot delete this tag because it is used in one or more posts." 
    });
  }
  
  // Delete tag
  const { error } = await supabase
    .from('tags')
    .delete()
    .eq('id', tagId);
  
  if (error) throw error;
  
  return redirect("/admin/tags");
}

export default function DeleteTag() {
  const { tag, error } = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Tag</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <p className="mb-6">
          Are you sure you want to delete the tag "{tag.name}"? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-4">
          <a
            href="/admin/tags"
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Cancel
          </a>
          
          <Form method="post">
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete
            </button>
          </Form>
        </div>
      </div>
    </Layout>
  );
}

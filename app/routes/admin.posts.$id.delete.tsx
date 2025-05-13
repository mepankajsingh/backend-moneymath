import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { getPost, deletePost } from "~/utils/supabase.server";
import Layout from "~/components/Layout";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ params }: LoaderFunctionArgs) {
  const postId = params.id as string;
  const post = await getPost(postId);
  return json({ post });
}

export async function action({ params }: ActionFunctionArgs) {
  const postId = params.id as string;
  await deletePost(postId);
  return redirect("/admin/posts");
}

export default function DeletePost() {
  const { post } = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Delete Post</h1>
        
        <p className="mb-6">
          Are you sure you want to delete the post "{post.title}"? This action cannot be undone.
        </p>
        
        <div className="flex justify-end space-x-4">
          <a
            href="/admin/posts"
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

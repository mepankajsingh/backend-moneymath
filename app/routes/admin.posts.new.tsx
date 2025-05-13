import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { createPost, getTags, updatePostTags } from "~/utils/supabase.server";
import Layout from "~/components/Layout";
import PostForm from "~/components/PostForm";
import type { ActionFunctionArgs } from "@remix-run/node";

export async function loader() {
  try {
    const tags = await getTags();
    return json({ tags });
  } catch (error) {
    console.error("Loader error:", error);
    throw error;
  }
}

export async function action({ request }: ActionFunctionArgs) {
  try {
    const formData = await request.formData();
    
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string || null;
    const pubDate = formData.get("pub_date") as string || null;
    const tagIds = formData.getAll("tagIds") as string[];
    
    // Validate required fields
    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!slug) errors.slug = "Slug is required";
    if (!description) errors.description = "Description is required";
    if (!content) errors.content = "Content is required";
    
    if (Object.keys(errors).length > 0) {
      return json({ errors });
    }
    
    // Create post
    const post = await createPost({
      title,
      slug,
      description,
      content,
      image,
      pub_date: pubDate
    });
    
    // Update post tags
    if (post && post.id) {
      await updatePostTags(post.id, tagIds);
    }
    
    return redirect(`/admin/posts`);
  } catch (error) {
    console.error("Action error:", error);
    throw error;
  }
}

export default function NewPost() {
  const { tags } = useLoaderData<typeof loader>();
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Create New Post</h1>
        <PostForm tags={tags} />
      </div>
    </Layout>
  );
}

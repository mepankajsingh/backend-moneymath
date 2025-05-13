import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getPost, getTags, getPostTags, updatePostWithTags } from "~/utils/supabase.server";
import PostForm from "~/components/PostForm";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/utils/auth.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
  try {
    const session = await getSession(request);
    const accessToken = session.get("accessToken");
    
    if (!accessToken) {
      return redirect("/login");
    }
    
    const postId = params.id as string;
    const [post, tags, postTags] = await Promise.all([
      getPost(postId, accessToken),
      getTags(accessToken),
      getPostTags(postId, accessToken)
    ]);
    
    return json({ post, tags, postTags });
  } catch (error) {
    console.error("Loader error:", error);
    throw error;
  }
}

export async function action({ request, params }: ActionFunctionArgs) {
  const postId = params.id as string;
  const formData = await request.formData();
  
  try {
    // Get access token from session
    const session = await getSession(request);
    const accessToken = session.get("accessToken");
    
    if (!accessToken) {
      return redirect("/login");
    }
    
    // Extract form data
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const image = formData.get("image") as string;
    const pubDate = formData.get("pub_date") as string;
    
    // Get tag IDs, ensuring we have an array even if none are selected
    const tagIds = formData.getAll("tagIds").map(id => id.toString());
    
    // Validate required fields
    const errors: Record<string, string> = {};
    if (!title) errors.title = "Title is required";
    if (!slug) errors.slug = "Slug is required";
    if (!description) errors.description = "Description is required";
    if (!content) errors.content = "Content is required";
    
    if (Object.keys(errors).length > 0) {
      return json({ errors });
    }
    
    // Use the new combined function to update both post and tags in one operation
    await updatePostWithTags(
      postId,
      {
        title,
        slug,
        description,
        content,
        image: image || null,
        pub_date: pubDate || null,
        updated_at: new Date().toISOString()
      },
      tagIds,
      accessToken
    );
    
    return redirect(`/admin/posts`);
  } catch (error: any) {
    console.error("Action error:", error);
    return json({ 
      formError: `An error occurred while updating the post: ${error.message || "Unknown error"}` 
    }, { status: 500 });
  }
}

export default function EditPost() {
  const { post, tags, postTags } = useLoaderData<typeof loader>();
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Edit Post</h1>
      <PostForm post={post} tags={tags} selectedTags={postTags} />
    </div>
  );
}

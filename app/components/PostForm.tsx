import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { Post, Tag } from "~/types";
import RichTextEditor from "./RichTextEditor";

interface PostFormProps {
  post?: Post;
  tags?: Tag[];
  selectedTags?: Tag[];
}

export default function PostForm({ post, tags = [], selectedTags = [] }: PostFormProps) {
  const actionData = useActionData<{ 
    errors?: Record<string, string>,
    formError?: string 
  }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="compact-form">
      {post?.id && <input type="hidden" name="id" value={post.id} />}
      
      {actionData?.formError && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>{actionData.formError}</p>
        </div>
      )}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={post?.title}
          required
          className="compact-input"
        />
        {actionData?.errors?.title && (
          <p className="text-red-500 text-xs mt-1">{actionData.errors.title}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
          Slug
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          defaultValue={post?.slug}
          required
          className="compact-input"
        />
        {actionData?.errors?.slug && (
          <p className="text-red-500 text-xs mt-1">{actionData.errors.slug}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={2}
          defaultValue={post?.description}
          required
          className="compact-input"
        />
        {actionData?.errors?.description && (
          <p className="text-red-500 text-xs mt-1">{actionData.errors.description}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700">
          Content
        </label>
        <RichTextEditor
          id="content"
          name="content"
          initialValue={post?.content || ""}
          required
        />
        {actionData?.errors?.content && (
          <p className="text-red-500 text-xs mt-1">{actionData.errors.content}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          Featured Image URL
        </label>
        <input
          type="text"
          id="image"
          name="image"
          defaultValue={post?.image || ""}
          className="compact-input"
        />
        {actionData?.errors?.image && (
          <p className="text-red-500 text-xs mt-1">{actionData.errors.image}</p>
        )}
      </div>
      
      <div>
        <label htmlFor="pub_date" className="block text-sm font-medium text-gray-700">
          Publication Date
        </label>
        <input
          type="date"
          id="pub_date"
          name="pub_date"
          defaultValue={post?.pub_date ? new Date(post.pub_date).toISOString().split('T')[0] : ''}
          className="compact-input"
        />
        {actionData?.errors?.pub_date && (
          <p className="text-red-500 text-xs mt-1">{actionData.errors.pub_date}</p>
        )}
      </div>
      
      {tags.length > 0 && (
        <div>
          <span className="block text-sm font-medium text-gray-700 mb-1">Tags</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  name="tagIds"
                  value={tag.id}
                  defaultChecked={selectedTags.some(selectedTag => selectedTag.id === tag.id)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="compact-button"
        >
          {isSubmitting ? "Saving..." : post ? "Update Post" : "Create Post"}
        </button>
      </div>
    </Form>
  );
}

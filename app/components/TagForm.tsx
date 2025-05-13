import { Form, useActionData, useNavigation } from "@remix-run/react";
import type { Tag } from "~/types";

interface TagFormProps {
  tag?: Tag;
}

export default function TagForm({ tag }: TagFormProps) {
  const actionData = useActionData<{ errors?: Record<string, string> }>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="compact-form">
      {tag?.id && <input type="hidden" name="id" value={tag.id} />}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Tag Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={tag?.name}
          required
          className="compact-input"
        />
        {actionData?.errors?.name && (
          <p className="text-red-500 text-xs mt-1">{actionData.errors.name}</p>
        )}
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="compact-button"
        >
          {isSubmitting ? "Saving..." : tag ? "Update Tag" : "Create Tag"}
        </button>
      </div>
    </Form>
  );
}

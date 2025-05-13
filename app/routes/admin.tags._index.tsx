import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getTags } from "~/utils/supabase.server";
import type { Tag } from "~/types";
import { requireAuth, getSession } from "~/utils/auth.server";

export async function loader({ request }) {
  // Ensure user is authenticated
  await requireAuth(request);
  
  // Get session to pass access token
  const session = await getSession(request);
  const accessToken = session.get("accessToken");
  
  const tags = await getTags(accessToken);
  return json({ tags });
}

export default function TagsIndex() {
  const { tags } = useLoaderData<typeof loader>();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tags</h1>
        <Link
          to="/admin/tags/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          New Tag
        </Link>
      </div>

      {tags.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No tags found. Create your first tag!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tags.map((tag: Tag) => (
                <tr key={tag.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{tag.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(tag.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/tags/${tag.id}`}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/admin/tags/${tag.id}/delete`}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

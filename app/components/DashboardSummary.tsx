import { Link } from "@remix-run/react";
import type { Post, Tag } from "~/types";

interface DashboardSummaryProps {
  posts: Post[];
  tags: Tag[];
}

export default function DashboardSummary({ posts, tags }: DashboardSummaryProps) {
  // Get the 5 most recent posts
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5);

  // Count published vs draft posts
  const publishedPosts = posts.filter(post => post.pub_date).length;
  const draftPosts = posts.length - publishedPosts;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Posts summary card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Posts</h2>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-indigo-600">{posts.length}</div>
            <Link 
              to="/admin/posts" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View all →
            </Link>
          </div>
          <div className="mt-2 text-sm text-gray-500">
            <span className="inline-block mr-3">{publishedPosts} published</span>
            <span className="inline-block">{draftPosts} drafts</span>
          </div>
        </div>
        
        {/* Tags summary card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Tags</h2>
          <div className="flex justify-between items-center">
            <div className="text-3xl font-bold text-indigo-600">{tags.length}</div>
            <Link 
              to="/admin/tags" 
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View all →
            </Link>
          </div>
        </div>
        
        {/* Quick actions card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link 
              to="/admin/posts/new" 
              className="block w-full py-2 px-4 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 transition-colors"
            >
              Create New Post
            </Link>
            <Link 
              to="/admin/tags/new" 
              className="block w-full py-2 px-4 bg-white text-indigo-600 text-center rounded-md border border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Create New Tag
            </Link>
          </div>
        </div>
      </div>
      
      {/* Recent posts section */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-gray-900">Recent Posts</h2>
          <Link 
            to="/admin/posts" 
            className="text-sm text-indigo-600 hover:text-indigo-800"
          >
            View all →
          </Link>
        </div>
        
        {recentPosts.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No posts yet. Create your first post!</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {recentPosts.map(post => (
              <li key={post.id} className="py-3">
                <div className="flex justify-between">
                  <div>
                    <Link 
                      to={`/admin/posts/${post.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-indigo-600"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1">
                      {post.pub_date 
                        ? `Published on ${new Date(post.pub_date).toLocaleDateString()}`
                        : "Draft"}
                    </p>
                  </div>
                  <Link 
                    to={`/admin/posts/${post.id}`}
                    className="text-xs text-indigo-600 hover:text-indigo-800"
                  >
                    Edit
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

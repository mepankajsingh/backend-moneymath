import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, supabaseAdmin } from '../lib/supabase';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { BlogPost } from '../lib/database.types';
import { useAuth } from '../context/AuthContext';

const PostsList = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientType, setClientType] = useState<'admin' | 'auth' | 'anon'>('admin');
  const { user, session } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        console.log('Fetching posts with client type:', clientType);
        console.log('Current user:', user?.email);
        console.log('Session exists:', !!session);
        
        let result;
        
        // Try different client types if needed
        if (clientType === 'admin') {
          // Use admin client which should bypass RLS
          result = await supabaseAdmin
            .from('blog_posts')
            .select('*')
            .order('updated_at', { ascending: false });
        } else if (clientType === 'auth' && session) {
          // Use authenticated client with session
          result = await supabase
            .from('blog_posts')
            .select('*')
            .order('updated_at', { ascending: false });
        } else {
          // Fallback to anon client (will likely fail with RLS)
          result = await supabase
            .from('blog_posts')
            .select('*')
            .order('updated_at', { ascending: false });
        }
        
        const { data, error } = result;
        
        if (error) {
          console.error('Supabase error details:', error);
          throw error;
        }
        
        console.log('Posts fetched successfully:', data?.length || 0);
        setPosts(data || []);
      } catch (err: any) {
        console.error('Error fetching posts:', err);
        setError(`Failed to load posts: ${err.message || 'Unknown error'}`);
        
        // If admin client fails, try authenticated client
        if (clientType === 'admin') {
          console.log('Admin client failed, trying authenticated client...');
          setClientType('auth');
        } else if (clientType === 'auth') {
          console.log('Authenticated client failed, trying anon client...');
          setClientType('anon');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user, clientType, session]);

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      console.log('Deleting post with ID:', id);
      
      // First delete any tag relations
      const relationResult = await supabaseAdmin
        .from('blog_post_tags')
        .delete()
        .eq('post_id', id);
        
      if (relationResult.error) {
        console.error('Error deleting tag relations:', relationResult.error);
      }
        
      // Then delete the post
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error('Error deleting post:', error);
        throw error;
      }
      
      console.log('Post deleted successfully');
      // Update the posts list
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post. Please try again.');
    }
  };

  const handleEditPost = (id: number) => {
    navigate(`/posts/${id}/edit`);
  };

  const createSamplePost = async () => {
    try {
      console.log('Creating sample post...');
      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .insert([
          {
            title: 'Sample Post',
            slug: 'sample-post-' + Date.now(),
            excerpt: 'This is a sample post for testing.',
            content: '<p>This is a sample post content.</p>',
            featured_image: null,
            author: user?.email || 'Admin',
            published_at: null,
            updated_at: new Date().toISOString(),
            tags: null,
            is_published: false,
            is_featured: false
          }
        ])
        .select();
      
      if (error) {
        console.error('Error creating sample post:', error);
        throw error;
      }
      
      console.log('Sample post created:', data);
      
      // Refresh the posts list
      setClientType('admin'); // Reset to admin client
      window.location.reload();
    } catch (err) {
      console.error('Error creating sample post:', err);
      alert('Failed to create sample post. Please try again.');
    }
  };

  const toggleClientType = () => {
    if (clientType === 'admin') {
      setClientType('auth');
    } else if (clientType === 'auth') {
      setClientType('anon');
    } else {
      setClientType('admin');
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
        <div className="mt-2 flex space-x-2">
          <button onClick={() => window.location.reload()} className="text-sm text-blue-600">Retry</button>
          <button onClick={toggleClientType} className="text-sm text-blue-600">
            Try with {clientType === 'admin' ? 'Auth' : clientType === 'auth' ? 'Anon' : 'Admin'} Client
          </button>
          <button onClick={createSamplePost} className="text-sm text-blue-600">Create Sample Post</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Posts</h1>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-gray-100 text-xs rounded">
            Using: {clientType} client
          </span>
          <Link to="/posts/new" className="px-3 py-1 bg-blue-600 text-white text-sm rounded">New</Link>
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="bg-white p-4 rounded-md text-center">
          <p className="text-gray-500 mb-2">No posts found</p>
          <div className="flex justify-center space-x-2">
            <button onClick={createSamplePost} className="text-sm text-blue-600">Create Sample Post</button>
            <button onClick={toggleClientType} className="text-sm text-blue-600">
              Try with {clientType === 'admin' ? 'Auth' : clientType === 'auth' ? 'Anon' : 'Admin'} Client
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map(post => (
                <tr key={post.id}>
                  <td className="px-4 py-3">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      <div className="text-xs text-gray-500 truncate">{post.slug}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {post.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-1">
                      <Link to={`/posts/${post.id}/preview`} className="p-1 text-gray-500 hover:text-gray-700">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button 
                        onClick={() => handleEditPost(post.id)} 
                        className="p-1 text-blue-500 hover:text-blue-700"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDeletePost(post.id)} className="p-1 text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
};

export default PostsList;

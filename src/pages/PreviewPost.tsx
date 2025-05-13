import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Edit } from 'lucide-react';
import type { BlogPost } from '../lib/database.types';

const PreviewPost = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        // Fetch post data
        const { data, error } = await supabase
          .from('blog_posts')
          .select(`
            *,
            blog_post_tags(
              tag_id,
              blog_tags(name, slug)
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setPost(data);
        } else {
          setError('Post not found');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 my-4">
        <p>{error || 'Post not found'}</p>
        <Link to="/posts" className="mt-4 inline-flex items-center text-red-600 hover:text-red-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to posts
        </Link>
      </div>
    );
  }

  // Extract tags from the nested structure
  const tags = post.blog_post_tags?.map(relation => relation.blog_tags) || [];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link to="/posts" className="inline-flex items-center text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to posts
        </Link>
        
        <Link 
          to={`/posts/${id}/edit`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          <Edit className="h-4 w-4 mr-2" />
          Edit Post
        </Link>
      </div>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
              post.is_published ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {post.is_published ? 'Published' : 'Draft'}
            </span>
          </div>
          
          {post.author && (
            <p className="mt-1 text-sm text-gray-500">
              By {post.author}
            </p>
          )}
          
          {post.published_at && (
            <p className="mt-1 text-sm text-gray-500">
              Published on {new Date(post.published_at).toLocaleDateString()}
            </p>
          )}
          
          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                tag && (
                  <span 
                    key={index} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag.name}
                  </span>
                )
              ))}
            </div>
          )}
        </div>
        
        {post.featured_image && (
          <div className="border-t border-gray-200">
            <img 
              src={post.featured_image} 
              alt={post.title} 
              className="w-full h-64 object-cover"
            />
          </div>
        )}
        
        {post.excerpt && (
          <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
            <p className="text-lg italic text-gray-700">{post.excerpt}</p>
          </div>
        )}
        
        <div className="px-4 py-5 sm:px-6 border-t border-gray-200">
          <div 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </div>
    </div>
  );
};

export default PreviewPost;

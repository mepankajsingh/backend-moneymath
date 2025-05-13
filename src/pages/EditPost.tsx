import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabase, supabaseAdmin } from '../lib/supabase';
import slugify from 'slugify';
import PostForm from '../components/PostForm';
import type { BlogPost } from '../lib/database.types';

type FormData = Omit<BlogPost, 'id'> & {
  tags: string;
};

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      author: '',
      tags: '',
      is_published: false,
      is_featured: false,
    }
  });

  const { watch, reset } = form;
  const content = watch('content');

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Use supabaseAdmin to bypass RLS for fetching post data
        const { data, error } = await supabaseAdmin
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching post:', error);
          throw error;
        }
        
        if (data) {
          console.log('Post data fetched:', data);
          // Convert tags to string regardless of whether it's an array or string
          let tagsString = '';
          
          if (data.tags) {
            if (Array.isArray(data.tags)) {
              tagsString = data.tags.join(', ');
            } else if (typeof data.tags === 'string') {
              tagsString = data.tags;
            }
          }
          
          reset({
            ...data,
            tags: tagsString,
          });
        } else {
          throw new Error('Post not found');
        }
      } catch (error: any) {
        console.error('Error fetching post:', error);
        setError(`Failed to load post: ${error.message || 'Unknown error'}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id, reset]);

  const handleTitleChange = (title: string) => {
    if (title && !form.getValues('slug')) {
      const generatedSlug = slugify(title, { lower: true, strict: true });
      form.setValue('slug', generatedSlug);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!id) return;
    
    setIsSubmitting(true);
    try {
      // Process tags - safely handle string or array
      let tagsList: string[] = [];
      
      if (typeof data.tags === 'string') {
        tagsList = data.tags
          .split(',')
          .map(tag => tag.trim())
          .filter(Boolean);
      } else if (Array.isArray(data.tags)) {
        tagsList = data.tags.filter(Boolean);
      }
      
      // Prepare post data
      const postData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        featured_image: data.featured_image,
        author: data.author,
        tags: tagsList,
        is_published: data.is_published,
        is_featured: data.is_featured,
        published_at: data.is_published && !form.getValues('published_at') 
          ? new Date().toISOString() 
          : form.getValues('published_at'),
        updated_at: new Date().toISOString(),
      };

      console.log('Updating post with data:', postData);

      // Update post using supabaseAdmin to bypass RLS
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .update(postData)
        .eq('id', id);

      if (error) {
        console.error('Error updating post:', error);
        throw error;
      }

      console.log('Post updated successfully');
      navigate('/posts');
    } catch (error: any) {
      console.error('Error updating post:', error);
      alert(`Failed to update post: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
        <div className="mt-4">
          <button 
            onClick={() => navigate('/posts')} 
            className="text-sm text-blue-600"
          >
            Back to Posts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Post</h1>
      
      <PostForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        handleTitleChange={handleTitleChange}
        content={content}
        isEditing={true}
      />
    </div>
  );
};

export default EditPost;

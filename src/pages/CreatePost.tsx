import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { supabaseAdmin } from '../lib/supabase';
import slugify from 'slugify';
import PostForm from '../components/PostForm';
import type { BlogPost } from '../lib/database.types';

type FormData = Omit<BlogPost, 'id'> & {
  selectedTags: number[];
};

const CreatePost = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const form = useForm<FormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      featured_image: '',
      author: '',
      tags: '',
      selectedTags: [],
      is_published: false,
      is_featured: false,
      updated_at: new Date().toISOString()
    }
  });

  const { watch } = form;
  const content = watch('content');

  const handleTitleChange = (title: string) => {
    if (title && !form.getValues('slug')) {
      const generatedSlug = slugify(title, { lower: true, strict: true });
      form.setValue('slug', generatedSlug);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      console.log('Submitting data:', data);
      
      // Format tags as comma-separated string if using the tags column
      let tagsString = '';
      if (data.selectedTags && data.selectedTags.length > 0) {
        // We'll need to fetch the tag names based on IDs
        const { data: tagData, error: tagError } = await supabaseAdmin
          .from('blog_tags')
          .select('name')
          .in('id', data.selectedTags);
          
        if (tagError) {
          console.error('Error fetching tag names:', tagError);
        } else if (tagData) {
          tagsString = tagData.map(tag => tag.name).join(', ');
        }
      }
      
      // Create post first
      const postData = {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt || null,
        content: data.content,
        featured_image: data.featured_image || null,
        author: data.author || null,
        published_at: data.is_published ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
        tags: tagsString || data.tags || null,
        is_published: data.is_published || false,
        is_featured: data.is_featured || false
      };

      console.log('Post data to insert:', postData);

      // Use supabaseAdmin for elevated permissions
      const { error: postError, data: newPost } = await supabaseAdmin
        .from('blog_posts')
        .insert(postData)
        .select()
        .single();

      if (postError) {
        console.error('Supabase error creating post:', postError);
        throw postError;
      }

      console.log('Post created successfully:', newPost);
      
      // If there are tags, create the post-tag relationships
      if (data.selectedTags && data.selectedTags.length > 0 && newPost) {
        const postTagRelations = data.selectedTags.map(tagId => ({
          post_id: newPost.id,
          tag_id: tagId
        }));
        
        const { error: tagRelationError } = await supabaseAdmin
          .from('blog_post_tags')
          .insert(postTagRelations);
          
        if (tagRelationError) {
          console.error('Error creating tag relations:', tagRelationError);
          // Don't throw here, as the post was already created
        }
      }

      navigate('/posts');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Post</h1>
      
      <PostForm
        form={form}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        previewMode={previewMode}
        setPreviewMode={setPreviewMode}
        handleTitleChange={handleTitleChange}
        content={content}
        isEditing={false}
      />
    </div>
  );
};

export default CreatePost;

import { createClient } from '@supabase/supabase-js';
import type { Database } from '~/types/supabase';

// Initialize Supabase client
const supabaseUrl = 'https://bsiljvigjitplouyjqiz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaWxqdmlnaml0cGxvdXlqcWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUxNzk1NTcsImV4cCI6MjA2MDc1NTU1N30.vgfZ7kbCzA2D3MbzQUJ0i3FbmdEXpcICiDg6ZKVeHhE';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzaWxqdmlnaml0cGxvdXlqcWl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTE3OTU1NywiZXhwIjoyMDYwNzU1NTU3fQ.YCWWNHFNK1UM5z2KBjIy4oleWu7wPDTCaF0cxu3XgZU';

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Create a service role client that bypasses RLS
export const adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Create an authenticated client with a session
export function getAuthenticatedClient(accessToken: string) {
  return createClient<Database>(supabaseUrl, supabaseKey, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }
  });
}

// Authentication functions
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
}

// Helper functions for posts
export async function getPosts(accessToken?: string) {
  const client = accessToken ? getAuthenticatedClient(accessToken) : supabase;
  
  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

export async function getPost(id: string, accessToken?: string) {
  const client = accessToken ? getAuthenticatedClient(accessToken) : supabase;
  
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

export async function getPostBySlug(slug: string, accessToken?: string) {
  const client = accessToken ? getAuthenticatedClient(accessToken) : supabase;
  
  const { data, error } = await client
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .single();
  
  if (error) throw error;
  return data;
}

export async function createPost(post: {
  title: string;
  slug: string;
  description: string;
  content: string;
  image?: string | null;
  pub_date?: string | null;
}, accessToken?: string) {
  const client = accessToken ? getAuthenticatedClient(accessToken) : supabase;
  
  // Ensure null values are properly handled
  const cleanedPost = {
    title: post.title,
    slug: post.slug,
    description: post.description,
    content: post.content,
    image: post.image || null,
    pub_date: post.pub_date || null
  };

  const { data, error } = await client
    .from('posts')
    .insert([cleanedPost])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function updatePost(id: string, post: {
  title?: string;
  slug?: string;
  description?: string;
  content?: string;
  image?: string | null;
  pub_date?: string | null;
  updated_at?: string;
}, accessToken?: string) {
  try {
    const client = accessToken ? getAuthenticatedClient(accessToken) : supabase;
    
    // Create a clean update object
    const updateObject: Record<string, any> = {};
    
    if (post.title) updateObject.title = post.title;
    if (post.slug) updateObject.slug = post.slug;
    if (post.description) updateObject.description = post.description;
    if (post.content) updateObject.content = post.content;
    
    // Handle null fields explicitly
    updateObject.image = post.image;
    updateObject.pub_date = post.pub_date;
    
    // Always update the updated_at timestamp
    updateObject.updated_at = post.updated_at || new Date().toISOString();

    const { data, error } = await client
      .from('posts')
      .update(updateObject)
      .eq('id', id)
      .select();
    
    if (error) {
      console.error("Supabase update error:", error);
      throw error;
    }
    
    return data[0];
  } catch (error) {
    console.error("Error in updatePost:", error);
    throw error;
  }
}

export async function deletePost(id: string, accessToken?: string) {
  // Use admin client to bypass RLS for post deletion and related operations
  
  // First delete any post_tags relationships
  try {
    await adminClient
      .from('posts_tags')
      .delete()
      .eq('post_id', id);
  } catch (error) {
    console.error("Error deleting post tags:", error);
  }
  
  // Then delete the post
  const { error } = await adminClient
    .from('posts')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Helper functions for tags
export async function getTags(accessToken?: string) {
  const client = accessToken ? getAuthenticatedClient(accessToken) : supabase;
  
  const { data, error } = await client
    .from('tags')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data || [];
}

export async function createTag(name: string, accessToken?: string) {
  // Use admin client to bypass RLS for tag creation
  const { data, error } = await adminClient
    .from('tags')
    .insert([{ name }])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

export async function getPostTags(postId: string, accessToken?: string) {
  try {
    const client = accessToken ? getAuthenticatedClient(accessToken) : supabase;
    
    const { data, error } = await client
      .from('posts_tags')
      .select('tag_id')
      .eq('post_id', postId);
    
    if (error) throw error;
    
    // Get the actual tag objects
    if (!data || data.length === 0) return [];
    
    const tagIds = data.map(item => item.tag_id);
    const { data: tags, error: tagsError } = await client
      .from('tags')
      .select('*')
      .in('id', tagIds);
    
    if (tagsError) throw tagsError;
    return tags || [];
  } catch (error) {
    console.error("Error getting post tags:", error);
    return [];
  }
}

export async function updatePostTags(postId: string, tagIds: string[], accessToken?: string) {
  try {
    // Use admin client to bypass RLS for post_tags operations
    console.log(`Updating tags for post ${postId} with tags: ${JSON.stringify(tagIds)}`);
    
    // First delete existing relationships
    const { error: deleteError } = await adminClient
      .from('posts_tags')
      .delete()
      .eq('post_id', postId);
    
    if (deleteError) {
      console.error("Error deleting existing post tags:", deleteError);
      throw deleteError;
    }
    
    // If there are no tags to add, we're done
    if (!tagIds || tagIds.length === 0) {
      return true;
    }
    
    // Prepare the post_tags records
    const postTags = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));
    
    // Insert new relationships using admin client
    const { error: insertError } = await adminClient
      .from('posts_tags')
      .insert(postTags);
    
    if (insertError) {
      console.error(`Error inserting post tags:`, insertError);
      throw insertError;
    }
    
    return true;
  } catch (error) {
    console.error("Error updating post tags:", error);
    throw error;
  }
}

// Update post and tags in a single operation
export async function updatePostWithTags(
  postId: string, 
  postData: {
    title?: string;
    slug?: string;
    description?: string;
    content?: string;
    image?: string | null;
    pub_date?: string | null;
    updated_at?: string;
  }, 
  tagIds: string[],
  accessToken: string
) {
  try {
    // Use admin client for all operations to bypass RLS
    
    // 1. Update the post first
    const updateObject: Record<string, any> = {};
    
    if (postData.title) updateObject.title = postData.title;
    if (postData.slug) updateObject.slug = postData.slug;
    if (postData.description) updateObject.description = postData.description;
    if (postData.content) updateObject.content = postData.content;
    
    // Handle null fields explicitly
    updateObject.image = postData.image;
    updateObject.pub_date = postData.pub_date;
    
    // Always update the updated_at timestamp
    updateObject.updated_at = postData.updated_at || new Date().toISOString();

    const { data: updatedPost, error: updateError } = await adminClient
      .from('posts')
      .update(updateObject)
      .eq('id', postId)
      .select();
    
    if (updateError) {
      console.error("Error updating post:", updateError);
      throw updateError;
    }
    
    // 2. Delete existing post_tags relationships
    const { error: deleteError } = await adminClient
      .from('posts_tags')
      .delete()
      .eq('post_id', postId);
    
    if (deleteError) {
      console.error("Error deleting existing post tags:", deleteError);
      throw deleteError;
    }
    
    // 3. Insert new post_tags relationships if there are any
    if (tagIds && tagIds.length > 0) {
      const postTags = tagIds.map(tagId => ({
        post_id: postId,
        tag_id: tagId
      }));
      
      const { error: insertError } = await adminClient
        .from('posts_tags')
        .insert(postTags);
      
      if (insertError) {
        console.error("Error inserting post tags:", insertError);
        throw insertError;
      }
    }
    
    return updatedPost[0];
  } catch (error) {
    console.error("Error in updatePostWithTags:", error);
    throw error;
  }
}

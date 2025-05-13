-- Enable Row Level Security on all tables
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for blog_posts table
-- First, drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to select blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to insert blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to update their own blog_posts" ON blog_posts;
DROP POLICY IF EXISTS "Allow authenticated users to delete their own blog_posts" ON blog_posts;

-- Create new policies with more permissive settings
CREATE POLICY "Allow authenticated users to select blog_posts" 
  ON blog_posts FOR SELECT 
  USING (true);  -- Allow anyone to select (read) posts

CREATE POLICY "Allow authenticated users to insert blog_posts" 
  ON blog_posts FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update blog_posts" 
  ON blog_posts FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete blog_posts" 
  ON blog_posts FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create policies for blog_tags table
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to select blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to insert blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to update blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog_tags" ON blog_tags;

-- Create new policies with more permissive settings
CREATE POLICY "Allow authenticated users to select blog_tags" 
  ON blog_tags FOR SELECT 
  USING (true);  -- Allow anyone to select (read) tags

CREATE POLICY "Allow authenticated users to insert blog_tags" 
  ON blog_tags FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update blog_tags" 
  ON blog_tags FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete blog_tags" 
  ON blog_tags FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create policies for blog_post_tags table
-- First, drop existing policies if they exist
DROP POLICY IF EXISTS "Allow authenticated users to select blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow authenticated users to insert blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow authenticated users to update blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog_post_tags" ON blog_post_tags;

-- Create new policies with more permissive settings
CREATE POLICY "Allow authenticated users to select blog_post_tags" 
  ON blog_post_tags FOR SELECT 
  USING (true);  -- Allow anyone to select (read) post-tag relations

CREATE POLICY "Allow authenticated users to insert blog_post_tags" 
  ON blog_post_tags FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update blog_post_tags" 
  ON blog_post_tags FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete blog_post_tags" 
  ON blog_post_tags FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Create a special policy for service role (optional, as service role bypasses RLS by default)
-- This is just for documentation purposes
COMMENT ON TABLE blog_posts IS 'Service role bypasses RLS';
COMMENT ON TABLE blog_tags IS 'Service role bypasses RLS';
COMMENT ON TABLE blog_post_tags IS 'Service role bypasses RLS';

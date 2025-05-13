-- First, ensure RLS is enabled on the tag tables
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for blog_tags table to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to select blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to insert blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to update blog_tags" ON blog_tags;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog_tags" ON blog_tags;

-- Create explicit policies for blog_tags with clear authentication checks
CREATE POLICY "Allow anyone to select blog_tags" 
  ON blog_tags FOR SELECT 
  USING (true);  -- Allow anyone to read tags

CREATE POLICY "Allow authenticated users to insert blog_tags" 
  ON blog_tags FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update blog_tags" 
  ON blog_tags FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete blog_tags" 
  ON blog_tags FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Drop existing policies for blog_post_tags table to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to select blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow authenticated users to insert blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow authenticated users to update blog_post_tags" ON blog_post_tags;
DROP POLICY IF EXISTS "Allow authenticated users to delete blog_post_tags" ON blog_post_tags;

-- Create explicit policies for blog_post_tags with clear authentication checks
CREATE POLICY "Allow anyone to select blog_post_tags" 
  ON blog_post_tags FOR SELECT 
  USING (true);  -- Allow anyone to read post-tag relations

CREATE POLICY "Allow authenticated users to insert blog_post_tags" 
  ON blog_post_tags FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update blog_post_tags" 
  ON blog_post_tags FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete blog_post_tags" 
  ON blog_post_tags FOR DELETE 
  USING (auth.role() = 'authenticated');

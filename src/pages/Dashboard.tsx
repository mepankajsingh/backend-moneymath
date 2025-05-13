import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabaseAdmin } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    drafts: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        
        // Get total posts count
        const { count: totalCount, error: totalError } = await supabaseAdmin
          .from('blog_posts')
          .select('*', { count: 'exact', head: true });
        
        if (totalError) throw totalError;
        
        // Get published posts count
        const { count: publishedCount, error: publishedError } = await supabaseAdmin
          .from('blog_posts')
          .select('*', { count: 'exact', head: true })
          .eq('is_published', true);
        
        if (publishedError) throw publishedError;
        
        // Calculate drafts
        const draftsCount = (totalCount || 0) - (publishedCount || 0);
        
        setStats({
          total: totalCount || 0,
          published: publishedCount || 0,
          drafts: draftsCount
        });
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Welcome to MoneyMath Blog Admin</h2>
        <p className="text-gray-600">
          Hello {user?.email}, welcome to your dashboard. From here you can manage all your blog content.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Posts</h3>
          <p className="text-gray-600 mb-4">Manage your blog posts</p>
          <a href="/posts" className="text-blue-600 hover:text-blue-800 font-medium">
            View all posts →
          </a>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Tags</h3>
          <p className="text-gray-600 mb-4">Organize your content</p>
          <a href="/tags" className="text-blue-600 hover:text-blue-800 font-medium">
            Manage tags →
          </a>
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Create</h3>
          <p className="text-gray-600 mb-4">Start writing</p>
          <a href="/posts/new" className="text-blue-600 hover:text-blue-800 font-medium">
            New post →
          </a>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-800 mb-4">Blog Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-600 font-medium">Total Posts</p>
            <p className="text-2xl font-bold text-blue-800">
              {isLoading ? '...' : stats.total}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-green-600 font-medium">Published</p>
            <p className="text-2xl font-bold text-green-800">
              {isLoading ? '...' : stats.published}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-sm text-yellow-600 font-medium">Drafts</p>
            <p className="text-2xl font-bold text-yellow-800">
              {isLoading ? '...' : stats.drafts}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

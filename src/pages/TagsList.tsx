import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Edit, Trash2 } from 'lucide-react';
import type { BlogTag } from '../lib/database.types';

const TagsList = () => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTagName, setNewTagName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTag, setEditingTag] = useState<BlogTag | null>(null);

  useEffect(() => {
    fetchTags();
  }, []);

  const fetchTags = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('blog_tags')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setTags(data || []);
    } catch (err) {
      console.error('Error fetching tags:', err);
      setError('Failed to load tags');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;
    
    try {
      setIsAdding(true);
      const slug = newTagName.toLowerCase().replace(/\s+/g, '-');
      
      const { error } = await supabase
        .from('blog_tags')
        .insert({
          name: newTagName.trim(),
          slug,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
      setNewTagName('');
      fetchTags();
    } catch (err) {
      console.error('Error adding tag:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleUpdateTag = async () => {
    if (!editingTag || !editingTag.name.trim()) return;
    
    try {
      const slug = editingTag.name.toLowerCase().replace(/\s+/g, '-');
      
      const { error } = await supabase
        .from('blog_tags')
        .update({
          name: editingTag.name.trim(),
          slug,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingTag.id);
      
      if (error) throw error;
      
      setEditingTag(null);
      fetchTags();
    } catch (err) {
      console.error('Error updating tag:', err);
    }
  };

  const handleDeleteTag = async (id: number) => {
    if (!confirm('Delete this tag?')) return;
    
    try {
      // First delete any tag relations
      await supabase
        .from('blog_post_tags')
        .delete()
        .eq('tag_id', id);
        
      // Then delete the tag
      const { error } = await supabase
        .from('blog_tags')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      fetchTags();
    } catch (err) {
      console.error('Error deleting tag:', err);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><div className="animate-spin h-8 w-8 border-2 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-red-800">{error}</p>
        <button onClick={() => window.location.reload()} className="mt-2 text-sm text-blue-600">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-medium">Tags</h1>
      </div>

      <div className="bg-white rounded-md p-4 mb-4">
        <div className="flex">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="New tag name"
            className="flex-1 border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={handleAddTag}
            disabled={isAdding || !newTagName.trim()}
            className="px-3 py-2 bg-blue-600 text-white text-sm rounded-r-md disabled:bg-blue-300"
          >
            Add
          </button>
        </div>
      </div>

      {tags.length === 0 ? (
        <div className="bg-white p-4 rounded-md text-center">
          <p className="text-gray-500">No tags found</p>
        </div>
      ) : (
        <div className="bg-white rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tags.map(tag => (
                <tr key={tag.id}>
                  <td className="px-4 py-3">
                    {editingTag?.id === tag.id ? (
                      <input
                        type="text"
                        value={editingTag.name}
                        onChange={(e) => setEditingTag({...editingTag, name: e.target.value})}
                        className="w-full border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    ) : (
                      <div className="text-sm font-medium text-gray-900">{tag.name}</div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm text-gray-500">{tag.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editingTag?.id === tag.id ? (
                      <div className="flex justify-end space-x-1">
                        <button onClick={handleUpdateTag} className="p-1 text-blue-500 hover:text-blue-700">Save</button>
                        <button onClick={() => setEditingTag(null)} className="p-1 text-gray-500 hover:text-gray-700">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex justify-end space-x-1">
                        <button onClick={() => setEditingTag(tag)} className="p-1 text-blue-500 hover:text-blue-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDeleteTag(tag.id)} className="p-1 text-red-500 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
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

export default TagsList;

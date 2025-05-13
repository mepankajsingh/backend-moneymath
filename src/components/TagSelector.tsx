import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Tag, X } from 'lucide-react';
import type { BlogTag } from '../lib/database.types';

interface TagSelectorProps {
  selectedTagIds: number[];
  onChange: (tagIds: number[]) => void;
}

const TagSelector = ({ selectedTagIds, onChange }: TagSelectorProps) => {
  const [tags, setTags] = useState<BlogTag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredTags, setFilteredTags] = useState<BlogTag[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from('blog_tags')
          .select('*')
          .order('name');
        
        if (error) throw error;
        setTags(data || []);
        setFilteredTags(data || []);
      } catch (error) {
        console.error('Error fetching tags:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredTags(
        tags.filter(tag => 
          tag.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredTags(tags);
    }
  }, [searchTerm, tags]);

  const handleTagClick = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onChange(selectedTagIds.filter(id => id !== tagId));
    } else {
      onChange([...selectedTagIds, tagId]);
    }
  };

  const getSelectedTags = () => {
    return tags.filter(tag => selectedTagIds.includes(tag.id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-2">
        {getSelectedTags().map(tag => (
          <span 
            key={tag.id}
            className="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800"
          >
            <Tag size={14} className="mr-1" />
            {tag.name}
            <button 
              type="button"
              onClick={() => handleTagClick(tag.id)}
              className="ml-1 text-blue-500 hover:text-blue-700"
            >
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <div className="relative">
        <input
          type="text"
          placeholder="Search tags..."
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500 inline-block mr-2"></span>
          Loading tags...
        </div>
      ) : (
        <div className="max-h-40 overflow-y-auto border rounded-md">
          {filteredTags.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredTags.map(tag => (
                <li 
                  key={tag.id}
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                    selectedTagIds.includes(tag.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleTagClick(tag.id)}
                >
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedTagIds.includes(tag.id)}
                      onChange={() => {}}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-3 block text-sm text-gray-700">
                      {tag.name}
                    </label>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-4 text-gray-500">
              No tags found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;

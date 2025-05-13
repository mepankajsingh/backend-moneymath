import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Eye, Code } from 'lucide-react';
import RichTextEditor from './RichTextEditor';
import ImageUploader from './ImageUploader';
import TagSelector from './TagSelector';

interface FormTabsProps {
  form: UseFormReturn<any>;
  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
  handleTitleChange: (title: string) => void;
  content: string;
}

const FormTabs = ({
  form,
  previewMode,
  setPreviewMode,
  handleTitleChange,
  content,
}: FormTabsProps) => {
  const { register, formState: { errors }, watch, setValue, getValues } = form;
  const [activeTab, setActiveTab] = useState<'basic' | 'content' | 'seo'>('basic');
  const [showFeaturedImagePreview, setShowFeaturedImagePreview] = useState(false);

  const watchTitle = watch('title');
  const watchFeaturedImage = watch('featured_image');

  const handleEditorChange = (html: string) => {
    setValue('content', html, { shouldValidate: true });
  };

  const handleFeaturedImageUploaded = (url: string) => {
    setValue('featured_image', url, { shouldValidate: true });
    setShowFeaturedImagePreview(true);
  };

  const handleTagsChange = (tagIds: number[]) => {
    setValue('tags', tagIds, { shouldValidate: true });
  };

  return (
    <>
      <div className="mb-6">
        <div className="sm:hidden">
          <label htmlFor="tabs" className="sr-only">Select a tab</label>
          <select
            id="tabs"
            name="tabs"
            className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as any)}
          >
            <option value="basic">Basic Info</option>
            <option value="content">Content</option>
            <option value="seo">SEO & Settings</option>
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="flex space-x-4" aria-label="Tabs">
            <button
              type="button"
              onClick={() => setActiveTab('basic')}
              className={`${
                activeTab === 'basic'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Basic Info
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`${
                activeTab === 'content'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              Content
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('seo')}
              className={`${
                activeTab === 'seo'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-500 hover:text-gray-700'
              } px-3 py-2 font-medium text-sm rounded-md`}
            >
              SEO & Settings
            </button>
          </nav>
        </div>
      </div>

      {activeTab === 'basic' && (
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              className={`mt-1 block w-full rounded-md ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
              {...register('title', { 
                required: 'Title is required',
                onChange: (e) => handleTitleChange(e.target.value)
              })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
              Slug <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="slug"
              className={`mt-1 block w-full rounded-md ${
                errors.slug ? 'border-red-300' : 'border-gray-300'
              } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm`}
              {...register('slug', { required: 'Slug is required' })}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600">{errors.slug.message as string}</p>
            )}
          </div>

          <div>
            <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
              Excerpt
            </label>
            <textarea
              id="excerpt"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              placeholder="Brief summary of the post"
              {...register('excerpt')}
            />
          </div>

          <div>
            <label htmlFor="featured_image" className="block text-sm font-medium text-gray-700">
              Featured Image
            </label>
            <div className="mt-1 flex items-center">
              <div className="relative flex-grow">
                <input
                  type="text"
                  id="featured_image"
                  className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="https://example.com/image.jpg"
                  {...register('featured_image')}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <ImageUploader onImageUploaded={handleFeaturedImageUploaded} />
                </div>
              </div>
            </div>
            {watchFeaturedImage && showFeaturedImagePreview && (
              <div className="mt-2">
                <img 
                  src={watchFeaturedImage} 
                  alt="Featured preview" 
                  className="h-32 w-auto object-cover rounded-md border border-gray-300" 
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">
              Author
            </label>
            <input
              type="text"
              id="author"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              {...register('author')}
            />
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                !previewMode ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Code size={16} className="inline mr-1" /> Editor
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode(true)}
              className={`px-3 py-1 text-sm font-medium rounded-md ${
                previewMode ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Eye size={16} className="inline mr-1" /> Preview
            </button>
          </div>

          {!previewMode ? (
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <RichTextEditor 
                content={content} 
                onChange={handleEditorChange}
                placeholder="Write your post content here..."
              />
              <input type="hidden" {...register('content', { required: 'Content is required' })} />
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content.message as string}</p>
              )}
            </div>
          ) : (
            <div className="border rounded-md p-4 prose max-w-none">
              <h1>{watchTitle || 'Post Title'}</h1>
              {content ? (
                <div dangerouslySetInnerHTML={{ __html: content }} />
              ) : (
                <p className="text-gray-400">No content to preview</p>
              )}
            </div>
          )}
        </div>
      )}

      {activeTab === 'seo' && (
        <div className="space-y-6">
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <input type="hidden" {...register('tags')} />
            <TagSelector 
              selectedTagIds={getValues('tags') || []} 
              onChange={handleTagsChange} 
            />
          </div>

          <div className="flex items-center">
            <input
              id="is_published"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('is_published')}
            />
            <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
              Publish immediately
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="is_featured"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              {...register('is_featured')}
            />
            <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
              Featured post
            </label>
          </div>
        </div>
      )}
    </>
  );
};

export default FormTabs;

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { Save, Calendar } from 'lucide-react';
import FormTabs from './FormTabs';

interface PostFormProps {
  form: UseFormReturn<any>;
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
  previewMode: boolean;
  setPreviewMode: (value: boolean) => void;
  handleTitleChange: (title: string) => void;
  content: string;
  isEditing?: boolean;
}

const PostForm = ({
  form,
  onSubmit,
  isSubmitting,
  previewMode,
  setPreviewMode,
  handleTitleChange,
  content,
  isEditing = false,
}: PostFormProps) => {
  const { handleSubmit, register, formState: { errors }, setValue, watch } = form;
  const publishedDate = watch('published_at') || '';
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <FormTabs 
            form={form}
            previewMode={previewMode}
            setPreviewMode={setPreviewMode}
            handleTitleChange={handleTitleChange}
            content={content}
          />
          
          <div className="mt-6 border-t border-gray-200 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <Calendar size={18} className="text-gray-500" />
                <label htmlFor="published_at" className="block text-sm font-medium text-gray-700">
                  Publication Date
                </label>
              </div>
              
              <div className="mt-2 sm:mt-0">
                <input
                  type="date"
                  id="published_at"
                  {...register('published_at')}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
                {errors.published_at && (
                  <p className="mt-1 text-sm text-red-600">{errors.published_at.message as string}</p>
                )}
              </div>
            </div>
            
            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-2">
                <label htmlFor="is_published" className="block text-sm font-medium text-gray-700">
                  Publication Status
                </label>
              </div>
              
              <div className="mt-2 sm:mt-0 flex items-center space-x-4">
                <div className="flex items-center">
                  <input
                    id="is_published"
                    type="checkbox"
                    {...register('is_published')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_published" className="ml-2 block text-sm text-gray-700">
                    Published
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="is_featured"
                    type="checkbox"
                    {...register('is_featured')}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="is_featured" className="ml-2 block text-sm text-gray-700">
                    Featured
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 sm:px-6 flex justify-between">
          <Link
            to="/posts"
            className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                Saving...
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                {isEditing ? 'Update Post' : 'Create Post'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PostForm;

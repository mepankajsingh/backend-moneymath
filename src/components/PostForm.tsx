import { useState } from 'react';
import { Link } from 'react-router-dom';
import { UseFormReturn } from 'react-hook-form';
import { Save } from 'lucide-react';
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
  const { handleSubmit } = form;
  
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

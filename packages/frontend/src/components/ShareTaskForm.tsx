import React, { useState } from 'react';

interface ShareTaskFormProps {
  onSubmit: (data: { userEmail: string }) => void;
  onCancel: () => void;
}

const ShareTaskForm: React.FC<ShareTaskFormProps> = ({ onSubmit, onCancel }) => {
  const [userEmail, setUserEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ userEmail });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium" htmlFor="userEmail">
          User Email
        </label>
        <input
          id="userEmail"
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full rounded-md border border-gray-300 p-2"
          placeholder="Enter email address to share with"
          required
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Share
        </button>
      </div>
    </form>
  );
};

export default ShareTaskForm;
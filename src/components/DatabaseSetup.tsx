import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { createUserProfilesTable } from '../lib/database';

const DatabaseSetup: React.FC = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleCreateTable = async () => {
    setIsCreating(true);
    setStatus('idle');
    setMessage('');

    try {
      const result = await createUserProfilesTable();
      
      if (result.success) {
        setStatus('success');
        setMessage('user_profiles table created successfully!');
      } else {
        setStatus('error');
        setMessage(result.error || 'Failed to create table');
      }
    } catch (error) {
      setStatus('error');
      setMessage('An unexpected error occurred');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-dark/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 max-w-sm">
      <div className="flex items-center space-x-3 mb-3">
        <Database size={20} className="text-purple-400" />
        <h3 className="text-white font-semibold">Database Setup</h3>
      </div>
      
      <p className="text-gray-400 text-sm mb-4">
        Create the user_profiles table in your Supabase database.
      </p>

      {status === 'success' && (
        <div className="flex items-center space-x-2 mb-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
          <CheckCircle size={16} className="text-green-400" />
          <span className="text-green-200 text-sm">{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center space-x-2 mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg">
          <AlertCircle size={16} className="text-red-400" />
          <span className="text-red-200 text-sm">{message}</span>
        </div>
      )}

      <button
        onClick={handleCreateTable}
        disabled={isCreating || status === 'success'}
        className="w-full btn-primary py-2 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCreating ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>Creating Table...</span>
          </>
        ) : status === 'success' ? (
          <>
            <CheckCircle size={16} />
            <span>Table Created</span>
          </>
        ) : (
          <>
            <Database size={16} />
            <span>Create user_profiles Table</span>
          </>
        )}
      </button>
    </div>
  );
};

export default DatabaseSetup;
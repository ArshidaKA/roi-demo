import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">404</h1>
      <p className="text-slate-600 mb-6">Page not found.</p>
      <Link to="/" className="text-indigo-600 hover:underline">Return to Dashboard</Link>
    </div>
  );
};

export default NotFoundPage;

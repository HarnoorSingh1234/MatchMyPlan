export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50 text-center">
      <div className="w-24 h-24 mb-8 text-blue-600">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
      </div>
      <h1 className="text-2xl font-bold mb-4 text-gray-900">No connection</h1>
      <p className="text-lg mb-6 text-gray-700">
        You're currently offline
      </p>
      <p className="mb-8 text-gray-600 text-sm">
        Don't worry! You can still access your existing tasks and create new ones.
        They'll sync when you're back online.
      </p>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <button 
          onClick={() => window.location.href = '/'}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors w-full"
        >
          Go to Home
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors w-full"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
import { useState } from 'react';

const ChatInput = ({ onSend, isResponding }) => {
  const [content, setContent] = useState('');

  const handleSend = () => {
    if (content.trim() && !isResponding) {
      onSend(content);
      setContent('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-200 p-4 bg-white">
      <div className="flex gap-3 items-end">
        {/* Textarea */}
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask StuG Bot anything..."
            disabled={isResponding}
            rows={1}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              focus:border-transparent resize-none disabled:opacity-50 
              disabled:cursor-not-allowed text-gray-900 placeholder-gray-400
              max-h-32 overflow-y-auto"
            style={{ minHeight: '48px' }}
          />
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={isResponding || !content.trim()}
          className={`p-3 rounded-xl transition-all duration-200 flex items-center 
            justify-center min-w-[48px] min-h-[48px] ${
            isResponding || !content.trim()
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }`}
        >
          {isResponding ? (
            // Loading Spinner
            <svg
              className="animate-spin h-6 w-6 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            // Send Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Helper Text */}
      <p className="text-xs text-gray-400 mt-2 text-center">
        Press <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-600">Enter</kbd> to send, 
        <kbd className="px-2 py-0.5 bg-gray-100 rounded text-gray-600 ml-1">Shift + Enter</kbd> for new line
      </p>
    </div>
  );
};

export default ChatInput;
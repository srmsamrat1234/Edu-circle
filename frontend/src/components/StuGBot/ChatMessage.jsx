import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

const ChatMessage = ({ message }) => {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl shadow-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : isAssistant
            ? 'bg-gray-100 text-gray-900 rounded-bl-sm border border-gray-200'
            : ''
        }`}
      >
        {isAssistant ? (
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  return !inline ? (
                    <code className="bg-gray-800 text-gray-100 px-2 py-1 rounded text-sm block my-2 overflow-x-auto" {...props}>
                      {children}
                    </code>
                  ) : (
                    <code className="bg-gray-200 text-gray-800 px-1 py-0.5 rounded text-sm" {...props}>
                      {children}
                    </code>
                  );
                },
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
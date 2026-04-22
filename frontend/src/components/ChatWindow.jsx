import { useState, useEffect, useRef } from 'react';
import API from '../services/api';

const ChatWindow = ({ receiverId, receiverName, onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await API.get(`/messages/${receiverId}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const response = await API.post('/messages', {
        receiverId,
        message: newMessage
      });
      setMessages([...messages, response.data.message]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 right-4 w-96 bg-white rounded-t-2xl shadow-2xl border border-gray-200 z-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
        <div>
          <h3 className="font-bold">{receiverName}</h3>
          <p className="text-xs text-blue-100">💬 Chat</p>
        </div>
        <button onClick={onClose} className="text-white hover:text-gray-200 text-xl">✕</button>
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">No messages yet. Say hello! 👋</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.sender._id === msg.receiver._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-xl ${
                  msg.sender._id === msg.receiver._id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                <p className="text-sm">{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender._id === msg.receiver._id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !newMessage.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            📤
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatWindow;
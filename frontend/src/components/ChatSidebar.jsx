import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

const ChatSidebar = ({ isOpen, onClose, selectedUser }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUserState, setSelectedUserState] = useState(selectedUser || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Sync selectedUser prop to state
  useEffect(() => {
    if (selectedUser) {
      setSelectedUserState(selectedUser);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (isOpen) {
      loadConversations();
      const interval = setInterval(loadConversations, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedUserState) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [selectedUserState]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const loadConversations = async () => {
    try {
      let relevantUsers = [];

      if (user?.role === 'student' || user?.role === 'parent') {
        const bookingsRes = await API.get('/bookings/my-bookings');
        const bookings = bookingsRes.data.bookings;
        const tutorIds = [...new Set(bookings.map(b => b.tutor?._id).filter(id => id))];
        
        if (tutorIds.length > 0) {
          const tutorsRes = await API.get('/tutors');
          const allTutors = tutorsRes.data.tutors;
          relevantUsers = allTutors.filter(tutor => tutorIds.includes(tutor._id));
        }
      } 
      else if (user?.role === 'tutor') {
        const bookingsRes = await API.get('/bookings/tutor-bookings');
        const bookings = bookingsRes.data.bookings.filter(b => b.status === 'accepted');
        
        const studentsMap = new Map();
        bookings.forEach(b => {
          if (b.student?._id && !studentsMap.has(b.student._id)) {
            studentsMap.set(b.student._id, b.student);
          }
        });
        relevantUsers = Array.from(studentsMap.values());
      }

      const convos = await Promise.all(
        relevantUsers.map(async (contact) => {
          try {
            const msgRes = await API.get(`/messages/${contact._id}`);
            const msgs = msgRes.data.messages;
            const lastMsg = msgs[msgs.length - 1];
            return {
              user: contact,
              lastMessage: lastMsg,
              unreadCount: 0
            };
          } catch {
            return { user: contact, lastMessage: null, unreadCount: 0 };
          }
        })
      );
      
      setConversations(convos.filter(c => c.user));
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadMessages = async () => {
    if (!selectedUserState) return;
    try {
      const response = await API.get(`/messages/${selectedUserState._id}`);
      setMessages(response.data.messages);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUserState) return;

    setLoading(true);
    try {
      const response = await API.post('/messages', {
        receiverId: selectedUserState._id,
        message: newMessage
      });
      setMessages(prev => [...prev, response.data.message]);
      setNewMessage('');
      loadConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !selectedUserState) return;

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF and image files (PDF, JPG, PNG, GIF, WebP) are allowed');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('receiverId', selectedUserState._id);
    formData.append('fileType', file.type === 'application/pdf' ? 'pdf' : 'image');
    formData.append('fileName', file.name);
    formData.append('fileSize', file.size);

    try {
      const response = await API.post('/messages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessages(prev => [...prev, response.data.message]);
      loadConversations();
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploadingFile(false);
      e.target.value = '';
    }
  };

  const handleOpenFile = (fileUrl, fileName, fileType) => {
    const baseURL = API.defaults.baseURL || 'http://localhost:5000';
    const fullUrl = `${baseURL}${fileUrl}`;
    
    if (fileType === 'image') {
      window.open(fullUrl, '_blank');
    } else {
      const newWindow = window.open(fullUrl, '_blank');
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName || 'download.pdf';
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const getFileIcon = (fileType) => {
    if (fileType === 'pdf') {
      return (
        <svg className="w-8 h-8 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      );
    } else {
      return (
        <svg className="w-8 h-8 flex-shrink-0 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
        </svg>
      );
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.user.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Full Screen Chat Interface */}
      <div className="fixed inset-0 bg-white z-50 flex">
        
        {/* LEFT SIDEBAR: Conversations List */}
        <div className="w-96 border-r border-gray-200 flex flex-col bg-white">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">💬 Messages</h2>
              <button onClick={onClose} className="text-white hover:text-gray-200 text-2xl transition">✕</button>
            </div>
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-blue-700 bg-opacity-50 text-white placeholder-blue-200 border border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="text-center text-gray-500 mt-20 p-4">
                <p className="text-4xl mb-2">💬</p>
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Book a session to start chatting</p>
              </div>
            ) : (
              filteredConversations.map((conv, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedUserState(conv.user)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition ${
                    selectedUserState?._id === conv.user._id ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600 text-lg flex-shrink-0">
                      {conv.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900 truncate">{conv.user.name}</h3>
                        {conv.lastMessage && (
                          <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {conv.lastMessage?.fileType === 'pdf' ? '📄 PDF Document' : 
                         conv.lastMessage?.fileType === 'image' ? '🖼️ Image' : 
                         conv.lastMessage?.message || 'No messages yet'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* RIGHT SIDEBAR: Chat Window */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {selectedUserState ? (
            <>
              {/* Chat Header */}
              <div className="bg-blue-600 text-white p-4 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  {selectedUserState.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold">{selectedUserState.name}</h3>
                  <p className="text-sm text-blue-100 capitalize">{selectedUserState.role}</p>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center text-gray-500 mt-20">
                    <p className="text-4xl mb-2">👋</p>
                    <p>Start a conversation with {selectedUserState.name}</p>
                  </div>
                ) : (
                  messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.sender._id === user._id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] p-3 rounded-xl ${msg.sender._id === user._id ? 'bg-blue-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                        
                        {/* File Display */}
                        {msg.fileType && msg.fileUrl ? (
                          <div className="space-y-2">
                            <div 
                              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                                msg.sender._id === user._id 
                                  ? 'bg-white bg-opacity-20 hover:bg-opacity-30' 
                                  : 'bg-gray-100 hover:bg-gray-200'
                              }`}
                              onClick={() => handleOpenFile(msg.fileUrl, msg.fileName, msg.fileType)}
                            >
                              {getFileIcon(msg.fileType)}
                              <div className="flex-1 min-w-0">
                                <p className={`font-semibold text-sm truncate ${
                                  msg.sender._id === user._id ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {msg.fileName || (msg.fileType === 'pdf' ? 'Document.pdf' : 'Image.jpg')}
                                </p>
                                <p className={`text-xs ${
                                  msg.sender._id === user._id ? 'text-blue-100' : 'text-gray-500'
                                }`}>
                                  {formatFileSize(msg.fileSize)}
                                </p>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenFile(msg.fileUrl, msg.fileName, msg.fileType);
                                }}
                                className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-sm ${
                                  msg.sender._id === user._id 
                                    ? 'bg-white text-blue-600 hover:bg-blue-50' 
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                {msg.fileType === 'image' ? 'View' : 'Open'}
                              </button>
                            </div>
                            {msg.message && msg.message !== `📄 ${msg.fileName}` && msg.message !== `🖼️ ${msg.fileName}` && (
                              <p className="text-sm">{msg.message}</p>
                            )}
                            {msg.fileType === 'image' && (
                              <img 
                                src={`${API.defaults.baseURL || 'http://localhost:5000'}${msg.fileUrl}`} 
                                alt="Shared image" 
                                className="max-w-full rounded-lg mt-2 cursor-pointer hover:opacity-90"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenFile(msg.fileUrl, msg.fileName, msg.fileType);
                                }}
                              />
                            )}
                          </div>
                        ) : (
                          <p className="text-sm">{msg.message}</p>
                        )}
                        
                        <p className={`text-xs mt-1 ${msg.sender._id === user._id ? 'text-blue-100' : 'text-gray-500'}`}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileUpload} 
                    accept=".pdf,.jpg,.jpeg,.png,.gif,.webp,application/pdf,image/*" 
                    className="hidden" 
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingFile}
                    className="px-4 py-3 border-2 border-blue-600 text-blue-600 rounded-xl font-semibold hover:bg-blue-50 transition disabled:opacity-50 flex items-center justify-center"
                    title="Send PDF or Image"
                  >
                    {uploadingFile ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    )}
                  </button>

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={loading || uploadingFile}
                  />

                  <button
                    type="submit"
                    disabled={!newMessage.trim() || loading || uploadingFile}
                    className="px-4 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="currentColor">
                        <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z"/>
                      </svg>
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">📎 PDF & Images up to 10MB</p>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center text-gray-500">
                <div className="text-8xl mb-4">💬</div>
                <h3 className="text-2xl font-bold text-gray-700 mb-2">Welcome to Messaging</h3>
                <p className="text-gray-600">Select a contact from the left to start chatting</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChatSidebar;
import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const StuGBotContext = createContext();

export const useStuGBot = () => {
  const context = useContext(StuGBotContext);
  if (!context) {
    throw new Error('useStuGBot must be used within StuGBotProvider');
  }
  return context;
};

export const StuGBotProvider = ({ children }) => {
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isResponding, setIsResponding] = useState(false);
  const [chatId, setChatId] = useState(null);

  // ========== ROLE-BASED SYSTEM PROMPTS ==========
  const getSystemPrompt = () => {
    const role = user?.role || 'student';
    const userName = user?.name || 'User';
    const userSubjects = user?.subjects || [];
    
    const prompts = {
      student: `You are STUG-Bot, an AI study assistant for ${userName} on Educircle.
      
${userName} is a student${userSubjects.length > 0 ? ` studying: ${userSubjects.join(', ')}` : ''}.

Your role is to:
1. Help understand concepts clearly with simple explanations
2. Provide step-by-step guidance for problems (don't just give answers)
3. Ask clarifying questions to understand what they need
4. Encourage active learning and critical thinking
5. Adapt explanations to their grade/level
6. Suggest study tips and resources when helpful

Always be friendly, patient, and supportive. Use markdown for formatting.`,

      tutor: `You are STUG-Bot, an AI teaching assistant for ${userName} on Educircle.

${userName} is a tutor${userSubjects.length > 0 ? ` teaching: ${userSubjects.join(', ')}` : ''}.

Your role is to:
1. Help with lesson planning and teaching strategies
2. Suggest engaging activities and explanations for difficult topics
3. Provide tips for student engagement and classroom management
4. Recommend educational resources and tools
5. Help explain complex topics in simpler ways for students
6. Assist with creating quizzes, assignments, and study materials

Always be professional, practical, and supportive. Use markdown for formatting.`,

      admin: `You are STUG-Bot, an AI assistant for ${userName} on Educircle.

${userName} is an administrator managing the Educircle platform.

Your role is to:
1. Help with platform management and user support questions
2. Provide guidance on best practices for online tutoring platforms
3. Suggest strategies for user engagement and retention
4. Help troubleshoot common platform issues
5. Recommend features and improvements for the platform
6. Assist with data interpretation and reporting insights

Always be professional, solution-oriented, and clear. Use markdown for formatting.`,

      parent: `You are STUG-Bot, an AI assistant for ${userName} on Educircle.

${userName} is a parent supporting their child's education.

Your role is to:
1. Help understand how to support their child's learning journey
2. Explain educational concepts so parents can help with homework
3. Suggest age-appropriate study strategies and resources
4. Provide tips for creating effective study environments at home
5. Help interpret progress reports and learning goals
6. Recommend ways to stay engaged with their child's education

Always be warm, encouraging, and practical. Use markdown for formatting.`
    };
    
    return prompts[role] || prompts.student;
  };

  // Load chat history from localStorage on mount
  useEffect(() => {
    const userId = user?._id || 'guest';
    const savedChat = localStorage.getItem(`stugbot-chat-${userId}`);
    
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        setMessages(parsed.messages || []);
        setChatId(parsed.chatId || Date.now().toString());
      } catch (error) {
        console.error('Error loading chat history:', error);
        initializeNewChat();
      }
    } else {
      initializeNewChat();
    }
  }, [user?._id]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    const userId = user?._id || 'guest';
    if (chatId) {
      localStorage.setItem(`stugbot-chat-${userId}`, JSON.stringify({
        chatId,
        messages,
        userId,
        userRole: user?.role,
        updatedAt: new Date().toISOString()
      }));
    }
  }, [messages, chatId, user?._id, user?.role]);

  // Initialize new chat
  const initializeNewChat = () => {
    const newChatId = Date.now().toString();
    setChatId(newChatId);
    
    const role = user?.role || 'student';
    const userName = user?.name || 'there';
    
    const welcomeMessages = {
      student: `Hello ${userName}! 👋 I'm **StuG Bot** 🤖\n\nYour personal AI study assistant for Educircle!\n\nI can help you with:\n- 📚 Understanding tough concepts\n- 📝 Homework guidance (step-by-step)\n- ❓ Doubt clearing, anytime\n- 🎯 Study tips & exam prep\n\nWhat would you like to learn today?`,
      
      tutor: `Hello ${userName}! 👋 I'm **StuG Bot** 🤖\n\nYour AI teaching assistant for Educircle!\n\nI can help you with:\n- 📋 Lesson planning & strategies\n- 💡 Explaining difficult topics simply\n- 🎨 Engaging activities for students\n- 📊 Student progress insights\n\nHow can I support your teaching today?`,
      
      admin: `Hello ${userName}! 👋 I'm **StuG Bot** 🤖\n\nYour AI assistant for Educircle platform management!\n\nI can help you with:\n- 🔧 Platform management tips\n- 📈 User engagement strategies\n- 🔍 Troubleshooting guidance\n- 💡 Feature recommendations\n\nWhat would you like to discuss?`,
      
      parent: `Hello ${userName}! 👋 I'm **StuG Bot** 🤖\n\nYour AI assistant for supporting your child's education!\n\nI can help you with:\n- 📚 Understanding your child's subjects\n- 🏠 Creating effective study routines\n- 💬 Talking to tutors about progress\n- 🎯 Supporting learning at home\n\nHow can I help your child succeed today?`
    };
    
    setMessages([{
      role: 'assistant',
      content: welcomeMessages[role] || welcomeMessages.student
    }]);
  };

  // ========== SEND MESSAGE TO AI (FINAL CORRECTED) ==========
  const sendMessage = async (content) => {
    if (!content.trim() || isResponding) return;

    // Add user message
    const userMessage = { role: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsResponding(true);

    try {
      // Get API key
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      // Validate API key
      if (!apiKey) {
        throw new Error('API key is missing. Please add VITE_OPENROUTER_API_KEY to your .env file');
      }

      // Call OpenRouter API using fetch
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': import.meta.env.VITE_SITE_URL || 'http://localhost:5173',
          'X-Title': import.meta.env.VITE_SITE_NAME || 'Educircle'
        },
        body: JSON.stringify({
          // ✅ CORRECT MODEL NAME (Working Free Model)
          model: "meta-llama/llama-3.1-8b-instruct:free",
          messages: [
            {
              role: "system",
              content: getSystemPrompt()
            },
            ...messages,
            userMessage
          ]
        })
      });

      // Handle API errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 404) {
          throw new Error('Model not found. Please check the model name in OpenRouter.');
        } else if (response.status === 401) {
          throw new Error('Invalid API key. Please check your .env file.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (response.status === 500) {
          throw new Error('AI service temporarily unavailable. Please try again later.');
        }
        
        throw new Error(errorData.error?.message || `API Error: ${response.status}`);
      }

      // Parse response
      const data = await response.json();
      
      // Add AI response
      const aiContent = data?.choices?.[0]?.message?.content || "⚠️ No response from AI. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: aiContent }]);

    } catch (error) {
      console.error('StuGBot API Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `⚠️ **Error:** ${error.message}` 
      }]);
    } finally {
      setIsResponding(false);
    }
  };
  // ==========================================================

  // Clear chat history
  const clearChat = () => {
    const userId = user?._id || 'guest';
    localStorage.removeItem(`stugbot-chat-${userId}`);
    initializeNewChat();
  };

  // Toggle chat panel
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Context value
  const value = {
    isOpen,
    setIsOpen,
    messages,
    isResponding,
    sendMessage,
    clearChat,
    toggleChat,
    chatId,
    userRole: user?.role
  };

  return (
    <StuGBotContext.Provider value={value}>
      {children}
    </StuGBotContext.Provider>
  );
};
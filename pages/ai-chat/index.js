import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function AIChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Update messages with user input
    const updatedMessages = [...messages, { 
      text: inputMessage, 
      sender: 'user' 
    }];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      // Update messages with AI response
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: data.message, 
          sender: 'ai',
          sources: data.sources || []
        }
      ]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: 'Sorry, I encountered an error. Please try again.', 
          sender: 'ai' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const MessageWithSources = ({ message }) => {
    const [showSources, setShowSources] = useState(false);

    return (
      <div className="mb-4 p-3 rounded-lg max-w-[80%] bg-green-100 dark:bg-green-900 mr-auto text-left">
        <div className="prose dark:prose-invert">
          {message.text}
        </div>
        
        {message.sources && message.sources.length > 0 && (
          <div className="mt-4">
            <button
              onClick={() => setShowSources(!showSources)}
              className="flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              <span>References ({message.sources.length})</span>
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  showSources ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showSources && (
              <div className="mt-2 space-y-1">
                {message.sources.map((source, index) => (
                  <div key={index} className="text-sm">
                    <Link 
                      href={`/blog/${source.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      {source.title}
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            Ayurvedic Wellness AI Assistant
          </h1>
          <button 
            onClick={() => router.push('/')}
            className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 pt-20 pb-24 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-4 ${
                message.sender === 'user' 
                  ? 'ml-auto' 
                  : 'mr-auto'
              }`}
            >
              {message.sender === 'user' ? (
                <div className="p-3 rounded-lg max-w-[80%] bg-blue-100 dark:bg-blue-900 text-right">
                  {message.text}
                </div>
              ) : (
                <MessageWithSources message={message} />
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="text-center text-gray-500">
              Generating response...
            </div>
          )}
        </div>
      </div>

      {/* Message Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t p-4">
        <div className="max-w-4xl mx-auto flex space-x-2">
          <input 
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about Ayurvedic wellness..."
            className="flex-grow p-2 border rounded dark:bg-gray-700"
          />
          <button 
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from 'react';
import { useRouter } from 'next/router';

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
        { text: data.message, sender: 'ai' }
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

  // Rest of the component remains the same as in previous implementation
  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-center flex-grow">
          Ayurvedic Wellness AI Assistant
        </h1>
        <button 
          onClick={() => router.push('/')}
          className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded"
        >
          ← Back
        </button>
      </div>
      
      {/* Chat Messages Container */}
      <div className="h-[500px] overflow-y-auto border rounded-lg p-4 mb-4 bg-gray-50 dark:bg-gray-800">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`mb-4 p-3 rounded-lg max-w-[80%] ${
              message.sender === 'user' 
                ? 'bg-blue-100 dark:bg-blue-900 ml-auto text-right' 
                : 'bg-green-100 dark:bg-green-900 mr-auto text-left'
            }`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && (
          <div className="text-center text-gray-500">
            Generating response...
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="flex space-x-2">
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
  );
}
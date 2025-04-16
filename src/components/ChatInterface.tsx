'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatInterface() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);


    try {
      // Dummy backend URL - replace with your actual backend URL
      const response = await fetch('http://192.168.1.8:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: userMessage.text }),
      });

      const data = await response.json();
      
      // Add bot response to chat
      const botMessage: Message = {
        id: Date.now().toString(),
        text: data.response || 'I apologize, but I am having trouble processing your request.',
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message to chat
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: 'I apologize, but I am having trouble connecting to the server.',
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 flex flex-col p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4">
              <Image
                src="/polit-logo.svg"
                alt="Polit Logo"
                width={64}
                height={64}
              />
            </div>
            <h1 className="text-2xl font-semibold mb-2">Hello, I'm Polit</h1>
            <p className="text-gray-500">How can I help you today?</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    msg.sender === 'user'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-lg p-4">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="border-t p-4 max-w-3xl mx-auto w-full">
        <div className="relative">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask your question here"
            className="w-full p-4 pr-24 rounded-full border border-gray-300 focus:border-green-500 focus:ring-1 focus:ring-green-500 outline-none"
            disabled={isLoading}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
              aria-label="Voice input"
              disabled={isLoading}
            >
              <MicIcon className="w-6 h-6 text-gray-500" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-full disabled:opacity-50"
              aria-label="Send message"
              onClick={handleSendMessage}
              disabled={isLoading || !message.trim()}
            >
              <SendIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 mt-4">
          Polit can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  )
}

function MicIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
      />
    </svg>
  )
}

function SendIcon({ className = "w-6 h-6" }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
      />
    </svg>
  )
} 
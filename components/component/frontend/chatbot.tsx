"use client";

import React, { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import { chatbot } from "@/lib/chat";
import { Send, X, Copy, Check, AlertCircle } from "lucide-react";
import { useTheme } from "next-themes";
import ReactMarkdown from 'react-markdown';
interface ChatMessage {
  role: "user" | "assistant" | "error";
  content: string;
  timestamp: Date;
  id: string; 
}

const Chatbot = ({ onClose }: { onClose: () => void }) => {
  // Update state to use new interface
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add copy to clipboard functionality
  const copyToClipboard = async (content: string, id: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Add message grouping helper
  const shouldShowTimestamp = (currentMsg: ChatMessage, prevMsg?: ChatMessage) => {
    if (!prevMsg) return true;
    const timeDiff = currentMsg.timestamp.getTime() - prevMsg.timestamp.getTime();
    return timeDiff > 60000 || prevMsg.role !== currentMsg.role;
  };

  const formatMessageContent = (content: string) => {
    return (
      <ReactMarkdown
        components={{
          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "text-blue-500 hover:underline",
                isDark && "text-blue-400"
              )}
              aria-label={`Open link: ${href}`}
            >
              {children}
            </a>
          ),
          code: ({ children }) => (
            <code className={clsx(
              "px-1 py-0.5 rounded text-sm font-mono",
              isDark ? "bg-gray-800" : "bg-gray-100"
            )}>
              {children}
            </code>
          ),
          ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
        }}
        className={clsx(
          "prose prose-sm max-w-none",
          isDark && "prose-invert"
        )}
      >
        {content}
      </ReactMarkdown>
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date(),
      id: `user-${Date.now()}`
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const data = await chatbot({ question: input });

      if (data?.response) {
        const assistantMessage: ChatMessage = {
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          id: `assistant-${Date.now()}`
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('No response from assistant');
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        role: "error",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
        id: `error-${Date.now()}`
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setInput("");
    }
  };

  return (
    <div className={clsx(
      "fixed sm:bottom-16 sm:right-4 sm:w-96 w-full bottom-0 right-0",
      "shadow-xl rounded-lg overflow-hidden z-50 transition-colors duration-200",
      isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200",
      "border backdrop-blur-sm backdrop-filter"
    )}>
      <div className={clsx(
        "flex justify-between items-center px-4 py-3",
        isDark ? "bg-gradient-to-r from-indigo-900 to-purple-900" : "bg-gradient-to-r from-blue-600 to-blue-700"
      )}>
        <h3 className="font-bold text-lg text-white">Chat Assistant</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
          title="Close chat"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      <div className={clsx(
        "p-4 h-[calc(100vh-200px)] sm:h-96 overflow-y-auto space-y-2 scroll-smooth",
        isDark ? "bg-gray-900" : "bg-gray-50"
      )}>
        {messages.map((msg, idx) => (
          <div
            key={msg.id}
            className={clsx(
              "flex flex-col animate-slideIn",
              msg.role === "user" ? "items-end" : "items-start",
              !shouldShowTimestamp(msg, messages[idx - 1]) && "mt-1"
            )}
          >
            <div className="group relative pr-8"> {/* Added padding-right */}
              <div
                className={clsx(
                  "px-4 py-2 rounded-2xl shadow-sm transition-all",
                  "max-w-[85%] w-auto inline-block",
                  msg.role === "error" 
                    ? "bg-red-100 text-red-800 border-red-200"
                    : msg.role === "user"
                      ? isDark 
                        ? "bg-indigo-600 text-white rounded-br-none"
                        : "bg-blue-600 text-white rounded-br-none"
                      : isDark
                        ? "bg-gray-800 text-gray-100 rounded-bl-none border-gray-700"
                        : "bg-white text-gray-800 rounded-bl-none border-gray-200",
                  "border hover:shadow-md transition-shadow duration-200"
                )}
              >
                {msg.role === "error" ? (
                  <div className="flex items-center space-x-2">
                    <AlertCircle size={16} />
                    <span>{msg.content}</span>
                  </div>
                ) : (
                  formatMessageContent(msg.content)
                )}
                {msg.role === "assistant" && (
                  <button
                    onClick={() => copyToClipboard(msg.content, msg.id)}
                    className={clsx(
                      "absolute right-0 top-2 p-1.5 rounded opacity-0 group-hover:opacity-100",
                      "transition-all duration-200 ease-in-out hover:scale-110",
                      isDark 
                        ? "hover:bg-gray-700 bg-gray-800/50" 
                        : "hover:bg-gray-200 bg-white/50",
                      "backdrop-blur-sm"
                    )}
                    title="Copy to clipboard"
                  >
                    {copiedId === msg.id ? (
                      <Check size={16} className="text-green-500" />
                    ) : (
                      <Copy size={16} className={isDark ? "text-gray-400" : "text-gray-600"} />
                    )}
                  </button>
                )}
              </div>
            </div>
            {shouldShowTimestamp(msg, messages[idx - 1]) && (
              <span className={clsx(
                "text-xs mt-1",
                isDark ? "text-gray-400" : "text-gray-500"
              )}>
                {msg.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </span>
            )}
          </div>
        ))}
        {isLoading && (
          <div className={clsx(
            "flex items-center space-x-2",
            isDark ? "text-gray-400" : "text-gray-500"
          )}>
            <div className="flex space-x-1">
              <div className="w-2 h-2 rounded-full animate-bounce bg-current"></div>
              <div className="w-2 h-2 rounded-full animate-bounce delay-75 bg-current"></div>
              <div className="w-2 h-2 rounded-full animate-bounce delay-150 bg-current"></div>
            </div>
            <span className="text-sm">Assistant is typing...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={clsx(
        "flex flex-col p-4 border-t",
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      )}>
        {input.length > 0 && (
          <div className={clsx(
            "text-xs mb-1 text-right",
            isDark ? "text-gray-400" : "text-gray-500"
          )}>
            {input.length}/500 characters
          </div>
        )}
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className={clsx(
              "flex-grow p-3 rounded-lg focus:outline-none focus:ring-2 transition-colors",
              isDark 
                ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-indigo-500"
                : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
            )}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            className={clsx(
              "ml-3 p-3 rounded-lg shadow transition-all flex items-center justify-center",
              (!input.trim() || isLoading)
                ? isDark 
                  ? "bg-gray-700 cursor-not-allowed"
                  : "bg-gray-400 cursor-not-allowed"
                : isDark
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;

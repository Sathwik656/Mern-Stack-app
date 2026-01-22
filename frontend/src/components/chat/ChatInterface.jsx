import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import aiService from '../../services/aiService.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Spinner from '../common/Spinner';
import MarkdownRenderer from '../common/MarkdownRenderer.jsx';

const ChatInterface = () => {
  const { id: documentId } = useParams();
  const { user } = useAuth();

  const [history, setHistory] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        setInitialLoading(true);
        const response = await aiService.getChatHistory(documentId);
        setHistory(response.data || []);
      } catch (error) {
        console.error('Failed to fetch chat history:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [documentId]);

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setHistory((prev) => [...prev, userMessage]);
    setMessage('');
    setLoading(true);

    try {
      const response = await aiService.chat(documentId, userMessage.content);
      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.data.answer,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      setHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex h-[70vh] items-center justify-center rounded-2xl border bg-white/80">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] rounded-2xl border bg-white/80 overflow-hidden">
      {/* CHAT BODY */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {history.length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center mb-4">
              <MessageSquare className="text-emerald-600" />
            </div>
            <p className="text-slate-500 text-sm">
              Ask anything about this document
            </p>
          </div>
        )}

        {history.map((msg, index) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={index}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="mr-3 mt-1 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                  <Sparkles size={16} />
                </div>
              )}

              <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed
                  ${
                    isUser
                      ? 'bg-emerald-500 text-white rounded-br-sm'
                      : 'bg-slate-100 text-slate-800 rounded-bl-sm'
                  }`}
              >
                {isUser ? (
                  msg.content
                ) : (
                  <MarkdownRenderer content={msg.content} />
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 p-4 border-t bg-white"
      >
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask a follow-up question..."
          className="flex-1 h-11 px-4 rounded-xl border text-sm focus:outline-none focus:border-emerald-500"
          disabled={loading}
        />

        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-500 text-white disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default ChatInterface;

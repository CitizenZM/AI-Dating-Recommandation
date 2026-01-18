
import React from 'react';
import { Message } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, isLoading }) => {
  const [input, setInput] = React.useState('');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const formatText = (text: string) => {
    // Simple markdown-ish bolding and line breaks
    return text.split('\n').map((line, i) => (
      <p key={i} className="mb-2">
        {line.split(/(\*\*.*?\*\*)/).map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-bold text-rose-900">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </p>
    ));
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl shadow-xl border border-rose-100 overflow-hidden">
      <div className="p-4 bg-rose-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-robot text-xl"></i>
          <span className="font-semibold">Amour AI Concierge</span>
        </div>
        <div className="text-xs opacity-80">Online</div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] p-4 rounded-2xl shadow-sm ${
                msg.role === 'user'
                  ? 'bg-rose-600 text-white rounded-br-none'
                  : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}
            >
              <div className="text-sm leading-relaxed">
                {formatText(msg.content)}
              </div>
              
              {msg.groundingUrls && msg.groundingUrls.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                  <span className="text-xs font-semibold text-slate-500 w-full mb-1">Source links:</span>
                  {msg.groundingUrls.map((url, i) => (
                    <a
                      key={i}
                      href={url.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded hover:bg-rose-100 transition-colors flex items-center gap-1"
                    >
                      <i className="fa-solid fa-link text-[10px]"></i>
                      {url.title}
                    </a>
                  ))}
                </div>
              )}
              
              <div className={`text-[10px] mt-1 opacity-60 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 rounded-bl-none animate-pulse flex gap-2 items-center">
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-75"></div>
              <div className="w-2 h-2 bg-rose-400 rounded-full animate-bounce delay-150"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-100 bg-white">
        <div className="relative">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask for more details or changes..."
            className="w-full pl-4 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 outline-none transition-all"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors disabled:opacity-50"
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;

// frontend/src/pages/carbobot.tsx
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../language/useTranslation';
import api from '../services/api';

interface AiApiResponse {
  success: boolean;
  response: string;
}

export const Carbobot = () => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([
    { content: "Bonjour ! Je suis CarboBot. Pose-moi une question sur ton empreinte carbone 🌱", isUser: false }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    setInputValue(''); 
    
    setMessages((prev) => [...prev, { content: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const result = await api.post<AiApiResponse>('/ai/chat', { prompt: userMessage });
      const aiResponse = result.data.response; 
      setMessages((prev) => [...prev, { content: aiResponse, isUser: false }]);
    } catch (error) {
      // gestion erreur silencieuse
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-950 relative text-slate-50">
      
      {/* Zone d'affichage des messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-48 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"> 
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[85%] px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap text-sm leading-relaxed ${
                msg.isUser
                  ? 'bg-emerald-600 text-white rounded-br-none' // Message utilisateur (Vert Emerald)
                  : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none' // Message Bot (Sombre)
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        
        {/* Animation de chargement adaptée au thème sombre */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-2xl rounded-bl-none animate-pulse text-slate-400 text-xs">
              CarboBot réfléchit...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie (Input) */}
      {/* Fond sombre (slate-950) et bordure subtile (slate-800) */}
      <div className="fixed bottom-[70px] left-0 right-0 p-3 bg-slate-950 border-t border-slate-800 z-40">
        <div className="flex space-x-2 max-w-3xl mx-auto items-end">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={t("carbobot.send") || "Pose une question..."}
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 disabled:opacity-50 text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-lg shadow-emerald-900/20"
          >
            {/* Icône d'envoi SVG simple pour faire plus propre */}
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carbobot;
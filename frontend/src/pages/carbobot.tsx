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
      //erreur
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 p-4">
      {/* Zone d'affichage des messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-20"> {/* mb-20 pour laisser place à l'input */}
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg shadow-sm whitespace-pre-wrap ${
                msg.isUser
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-200 px-4 py-2 rounded-lg rounded-bl-none animate-pulse text-gray-500">
              CarboBot écrit...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200 bg-white absolute bottom-0 left-0 right-0">
        <div className="flex space-x-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={t('chat.placeholder') || "Posez votre question..."} // Fallback si la trad manque
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:bg-gray-100"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? '...' : 'Envoyer'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carbobot;
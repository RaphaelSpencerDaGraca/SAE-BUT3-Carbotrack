import { useState } from 'react';
import { useTranslation } from '../language/useTranslation';
import api from '../services/api';

export const Carbobot = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Array<{ content: string; isUser: boolean }>>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    // Ajoute le message utilisateur
    setMessages((prev) => [...prev, { content: inputValue, isUser: true }]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Appelle l'API backend pour obtenir la réponse de l'IA
      const response = await api.post('/chat', { prompt: inputValue });
      // Ajoute la réponse de l'IA
      setMessages((prev) => [...prev, { content: response.data.response, isUser: false }]);
    } catch (error) {
      console.error('Erreur:', error);
      setMessages((prev) => [...prev, { content: t('chat.error'), isUser: false }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-gray-50 p-4">
      {/* Zone d'affichage des messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.isUser
                  ? 'bg-green-600 text-white rounded-br-none'
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Zone de saisie */}
      <div className="p-4 border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0">
        <div className="flex space-x-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chat.placeholder')}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            {t('chat.send')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carbobot;
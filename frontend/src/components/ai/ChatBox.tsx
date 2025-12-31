// frontend/src/components/ai/ChatBox.tsx
import { useState } from "react";
import { sendMessageToAi } from "../../services/aiService";

export const ChatBox = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsLoading(true);
    setResponse(""); 

    try {
      const aiText = await sendMessageToAi(input);
      setResponse(aiText);
    } catch (error) {
      setResponse("Erreur : Impossible de joindre l'IA.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-xl font-bold mb-4">CarboBot IA 🤖</h2>
      
      <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Pose ta question..."
          className="flex-1 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "..." : "Envoyer"}
        </button>
      </form>

      {/* Zone de réponse */}
      {response && (
        <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
          <p className="whitespace-pre-wrap text-gray-800">{response}</p>
        </div>
      )}
    </div>
  );
};
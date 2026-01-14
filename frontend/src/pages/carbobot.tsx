// frontend/src/pages/carbobot.tsx
import { useState, useRef, useEffect, useMemo } from "react";
import { useTranslation } from "../language/useTranslation";
import api from "../services/api";

interface AiApiResponse {
    success: boolean;
    response: string;
}

type Msg = { content: string; isUser: boolean };

function safeT(t: (key: string) => string, key: string, fallback: string) {
    const v = t(key);
    return !v || v === key ? fallback : v;
}

export const Carbobot = () => {
    const { t } = useTranslation();

    const [messages, setMessages] = useState<Msg[]>([
        {
            content: "Bonjour ! Je suis CarboBot. Pose-moi une question sur ton empreinte carbone 🌱",
            isUser: false,
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const placeholder = useMemo(
        () => safeT(t, "carbobot.send", "Pose une question…"),
        [t]
    );

    const scrollToBottom = () => {
        // "smooth" peut parfois donner une sensation de bug si le layout bouge,
        // mais ici on le garde comme avant.
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        setInputValue("");
        setMessages((prev) => [...prev, { content: trimmed, isUser: true }]);
        setIsLoading(true);

        try {
            const result = await api.post<AiApiResponse>("/ai/chat", { prompt: trimmed });
            const aiResponse = result.data.response;
            setMessages((prev) => [...prev, { content: aiResponse, isUser: false }]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    content: "Oups… je n’arrive pas à répondre pour le moment. Réessaie dans quelques secondes.",
                    isUser: false,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const canSend = !isLoading && inputValue.trim().length > 0;

    return (
        <div className="flex flex-col h-[100dvh] bg-gray-950 text-white">
            {/* Zone d'affichage des messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-48 scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent">
                {/* header discret */}
                <div className="mx-auto max-w-3xl">
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80">
                                🌱
                            </div>
                            <div>
                                <p className="text-[11px] font-medium uppercase tracking-wide text-white/45">
                                    Assistant
                                </p>
                                <h1 className="text-sm font-semibold text-white/90">CarboBot</h1>
                            </div>
                        </div>

                        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/60">
        Conseils CO₂
      </span>
                    </div>
                </div>

                {/* messages + loader : UN SEUL ENDROIT */}
                <div className="mx-auto max-w-3xl space-y-4">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={[
                                    "max-w-[85%] px-4 py-2.5 rounded-2xl whitespace-pre-wrap text-sm leading-relaxed",
                                    msg.isUser
                                        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-br-md shadow-[0_10px_30px_-18px_rgba(16,185,129,0.65)]"
                                        : "border border-white/10 bg-white/[0.06] text-white/80 rounded-bl-md",
                                ].join(" ")}
                            >
                                {msg.content}
                            </div>
                        </div>
                    ))}

                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="border border-white/10 bg-white/[0.06] px-4 py-2.5 rounded-2xl rounded-bl-md animate-pulse text-white/60 text-xs">
                                CarboBot réfléchit…
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>


            {/* Zone de saisie */}
            <div className="fixed bottom-[70px] left-0 right-0 p-3 bg-gray-950/70 border-t border-white/10 backdrop-blur-xl z-40">
                <div className="flex space-x-2 max-w-3xl mx-auto items-end">
                    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && canSend && handleSend()}
                            placeholder={placeholder}
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                            disabled={isLoading}
                        />
                        <div className="mt-1 flex items-center justify-between">
                            <p className="text-[11px] text-white/40">
                                Ex : “Comment réduire mon CO₂ au quotidien ?”
                            </p>
                            <button
                                type="button"
                                onClick={() => setInputValue("")}
                                disabled={isLoading || inputValue.length === 0}
                                className="text-[11px] text-white/35 hover:text-white/60 disabled:opacity-50"
                            >
                                Effacer
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!canSend}
                        className="rounded-2xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-[0_10px_30px_-18px_rgba(16,185,129,0.65)] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Envoyer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
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
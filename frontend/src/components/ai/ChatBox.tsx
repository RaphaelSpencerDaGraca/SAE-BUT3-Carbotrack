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
            const aiText = await sendMessageToAi(input.trim());
            setResponse(aiText);
        } catch (error) {
            setResponse("Erreur : Impossible de joindre l'IA.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative mx-auto max-w-3xl px-4 pb-24 pt-6">
            <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl shadow-[0_30px_90px_-45px_rgba(0,0,0,0.85)]">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/80">
                        🤖
                    </div>
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-white/45">
                            Assistant
                        </p>
                        <h2 className="text-sm font-semibold text-white/90">CarboBot</h2>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="mt-5 flex items-end gap-2">
                    <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Pose ta question…"
                            className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
                            disabled={isLoading}
                        />
                        <p className="mt-1 text-[11px] text-white/40">
                            Ex : “Comment réduire mon CO₂ au quotidien ?”
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="shrink-0 rounded-2xl px-4 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white shadow-[0_10px_30px_-18px_rgba(16,185,129,0.65)] transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "…" : "Envoyer"}
                    </button>
                </form>

                {response && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 text-sm text-white/80 whitespace-pre-wrap">
                        {response}
                    </div>
                )}
            </div>
        </div>
    );
};
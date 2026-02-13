
import React, { useState } from 'react';
import { Send, Bot, ShieldAlert, Sparkles, Loader2 } from 'lucide-react';
import { getSecurityAdvice } from '../services/geminiService';

const AIConsultant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const advice = await getSecurityAdvice(query);
      setResponse(advice);
    } catch (err) {
      setResponse("Lo siento, tuve un problema al procesar tu consulta de seguridad. Por favor, intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const suggestions = [
    "¿Qué es 2FA y por qué lo necesito?",
    "¿Cómo guardo mis códigos de respaldo?",
    "¿Es seguro usar esto sin internet?",
    "¿Qué hago si pierdo mis llaves secretas?"
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col max-h-[600px] animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-blue-600 p-6 text-white shadow-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md shadow-inner">
            <Bot size={28} />
          </div>
          <div>
            <h2 className="font-bold text-lg tracking-tight">Asistente de Seguridad</h2>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(74,222,128,0.8)]"></span>
              <span className="text-[10px] uppercase font-bold tracking-widest opacity-90">IA Experta Activa</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-blue-100 leading-relaxed font-medium">
          Pregúntame sobre seguridad de cuentas, protocolos 2FA o cómo usar OmniAuth profesionalmente.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-slate-50/30">
        {!response && !isLoading ? (
          <div className="space-y-6">
            <div className="flex gap-3 items-start">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                <Sparkles size={18} className="text-blue-500" />
              </div>
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <p className="text-sm text-slate-600 font-medium">Hola, soy tu consultor de ciberseguridad personal. ¿Cómo puedo ayudarte hoy?</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-2.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1 mb-1">Temas sugeridos</p>
              {suggestions.map((s, idx) => (
                <button 
                  key={idx}
                  onClick={() => setQuery(s)}
                  className="text-left p-4 text-xs bg-white border border-slate-100 rounded-2xl hover:border-blue-400 hover:text-blue-600 transition-all text-slate-600 font-bold shadow-sm"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
             <div className="flex justify-end">
                <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-tr-none text-sm max-w-[85%] font-bold shadow-lg shadow-blue-100">
                  {query}
                </div>
             </div>
             {isLoading ? (
               <div className="flex gap-3 items-start">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 shadow-sm">
                  <Loader2 size={18} className="animate-spin" />
                </div>
                <div className="bg-white p-4 rounded-2xl rounded-tl-none flex items-center gap-2 border border-slate-100 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
             ) : (
               <div className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2">
                <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600 shadow-sm">
                  <Bot size={18} />
                </div>
                <div className="bg-white p-5 rounded-2xl rounded-tl-none text-sm text-slate-700 leading-relaxed border border-slate-100 shadow-sm font-medium">
                  {response}
                </div>
              </div>
             )}
          </div>
        )}
      </div>

      <div className="p-5 border-t border-slate-100 bg-white">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            placeholder="Escribe tu duda de seguridad..." 
            className="w-full pl-5 pr-14 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-medium"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md active:scale-90"
            disabled={!query.trim() || isLoading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIConsultant;

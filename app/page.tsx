'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Paintbrush, Palette, Loader2, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '¡Hola artista!  ¡Qué alegría verte por el taller! Aquí están los óleos, aquí las acuarelas... ¡Tú mandas! 😊 ¿En qué pincelada creativa andamos atascados hoy? ¡Pregúntame lo que necesites!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  // Auto-scroll suave
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: inputValue.trim() };
    const newMessages = [...messages, userMessage];
    
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Falla en el servidor");
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply }
      ]);
    } catch (error: any) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { 
          role: 'assistant', 
          content: error.message || 'Interferencias en la red temporalmente... Mis pinceles digitales se han atascado. ¡Vuelve a intentarlo en un momento, artista!'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    if (confirm('¿Quieres limpiar el lienzo y empezar de nuevo?')) {
      setMessages([messages[0]]); // Guardar primer mensaje
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 font-sans text-stone-900 overflow-hidden relative selection:bg-rose-200 selection:text-rose-900">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-rose-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur border-b border-stone-200 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-400 to-orange-400 flex items-center justify-center text-white shadow-sm ring-2 ring-white">
            <Palette className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight tracking-tight text-stone-800">Profe de Plástica</h1>
            <p className="text-xs text-stone-500 font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" /> 
              Taller Abierto
            </p>
          </div>
        </div>
        <button 
          onClick={resetChat}
          className="text-stone-400 hover:text-stone-600 transition-colors p-2 rounded-full hover:bg-stone-100"
          title="Limpiar el lienzo"
        >
          <RefreshCcw className="w-5 h-5" />
        </button>
      </header>

      {/* Chat Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'assistant' && (
                <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-stone-200 items-center justify-center mr-3 mt-1 shadow-sm">
                  <Palette className="w-4 h-4 text-stone-600" />
                </div>
              )}
              
              <div 
                className={`max-w-[90%] sm:max-w-[80%] rounded-2xl px-5 py-3.5 leading-relaxed shadow-sm whitespace-pre-wrap
                  ${msg.role === 'user' 
                    ? 'bg-stone-800 text-stone-50 rounded-tr-md' 
                    : 'bg-white bg-opacity-80 backdrop-blur-sm border border-stone-100 text-stone-800 rounded-tl-md'
                  }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="hidden sm:flex shrink-0 w-8 h-8 rounded-full bg-stone-200 items-center justify-center mr-3 mt-1 shadow-sm">
                <Palette className="w-4 h-4 text-stone-600" />
              </div>
              <div className="flex items-center gap-2 max-w-[80%] rounded-2xl px-5 py-3.5 bg-white bg-opacity-80 backdrop-blur border border-stone-100 text-stone-500 rounded-tl-md shadow-sm">
                <Paintbrush className="w-4 h-4 animate-bounce text-rose-400" />
                <span className="text-sm font-medium animate-pulse">Mezclando colores y pensando...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={endOfMessagesRef} />
      </main>

      {/* Input Area */}
      <footer className="bg-white/80 backdrop-blur border-t border-stone-200 p-4 sticky bottom-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto flex gap-2 sm:gap-3 items-end relative">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Pregunta sobre proporciones, técnica de manchas, colores complementarios..."
            className="flex-1 max-h-32 min-h-[56px] resize-none bg-white border border-stone-300 rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 transition-all font-medium text-stone-800 placeholder-stone-400 disabled:opacity-50"
            disabled={isLoading}
            rows={1}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="shrink-0 h-[56px] w-[56px] flex items-center justify-center rounded-2xl bg-stone-900 text-white hover:bg-stone-800 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 shadow-md"
            title="Enviar mensaje"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin text-stone-400" />
            ) : (
              <Send className="w-5 h-5 ml-1" />
            )}
          </button>
        </form>
        <p className="text-center text-xs text-stone-400 mt-3 font-medium">
          Dibuja, mancha y pregunta con libertad. 🎨
        </p>
      </footer>
    </div>
  );
}

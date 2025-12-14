import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    LogOut,
    Bot,
    Menu,
    X,
    Send,
    RefreshCw,
    User,
    Sparkles,
    MessageSquare
} from 'lucide-react';
import { useAgent } from '../context/AgentContext';

const AgentPage: React.FC = () => {
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    const { messages, isLoading, sendMessage, startNewSession } = useAgent();

    // Función para formatear markdown básico
    const formatMarkdown = (text: string) => {
        // Procesar el texto línea por línea
        const lines = text.split('\n');
        const elements: React.ReactNode[] = [];

        lines.forEach((line, index) => {
            let formattedLine: React.ReactNode = line;

            // Headers
            if (line.startsWith('### ')) {
                formattedLine = <h3 key={index} className="text-base font-bold mt-3 mb-1">{line.slice(4)}</h3>;
            } else if (line.startsWith('## ')) {
                formattedLine = <h2 key={index} className="text-lg font-bold mt-3 mb-1">{line.slice(3)}</h2>;
            } else if (line.startsWith('# ')) {
                formattedLine = <h1 key={index} className="text-xl font-bold mt-3 mb-2">{line.slice(2)}</h1>;
            }
            // Lista con asterisco o guión
            else if (line.match(/^[*-]\s/)) {
                const content = line.slice(2);
                formattedLine = (
                    <div key={index} className="flex gap-2 ml-2 my-0.5">
                        <span className="text-primary">•</span>
                        <span>{formatInlineMarkdown(content)}</span>
                    </div>
                );
            }
            // Línea vacía
            else if (line.trim() === '') {
                formattedLine = <div key={index} className="h-2"></div>;
            }
            // Texto normal con formato inline
            else {
                formattedLine = <p key={index} className="my-0.5">{formatInlineMarkdown(line)}</p>;
            }

            elements.push(formattedLine);
        });

        return elements;
    };

    // Formatear markdown inline (bold, italic, etc)
    const formatInlineMarkdown = (text: string): React.ReactNode => {
        const parts: React.ReactNode[] = [];
        let keyIndex = 0;

        // Regex para **bold**
        const boldRegex = /\*\*([^*]+)\*\*/g;
        let lastIndex = 0;
        let match;

        while ((match = boldRegex.exec(text)) !== null) {
            // Texto antes del match
            if (match.index > lastIndex) {
                parts.push(text.slice(lastIndex, match.index));
            }
            // El texto en bold
            parts.push(<strong key={keyIndex++} className="font-semibold text-primary">{match[1]}</strong>);
            lastIndex = match.index + match[0].length;
        }

        // Texto restante
        if (lastIndex < text.length) {
            parts.push(text.slice(lastIndex));
        }

        return parts.length > 0 ? parts : text;
    };

    const handleLogout = () => {
        localStorage.removeItem('isAuthenticated');
        navigate('/');
    };

    const handleSendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const message = inputMessage;
        setInputMessage('');
        await sendMessage(message);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Focus input on load
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const formatTime = (date: Date) => {
        return new Date(date).toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-base-200 flex font-sans text-base-content">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-base-100 shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-primary">NextBlock</h1>
                    <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden btn btn-ghost btn-sm btn-circle">
                        <X size={20} />
                    </button>
                </div>
                <ul className="menu p-4 w-full h-full text-base-content space-y-2">
                    <li>
                        <a onClick={() => navigate('/admin')} className="font-medium cursor-pointer hover:bg-base-200">
                            <LayoutDashboard size={20} /> Dashboard
                        </a>
                    </li>
                    <li>
                        <a className="active font-medium bg-primary/10 text-primary">
                            <Bot size={20} /> Agente IA
                        </a>
                    </li>
                </ul>
                <div className="p-4 border-t border-base-200">
                    <button onClick={handleLogout} className="btn btn-outline btn-error w-full gap-2">
                        <LogOut size={18} /> Salir
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="bg-base-100 shadow-sm border-b border-base-200 p-4">
                    <div className="flex justify-between items-center max-w-6xl mx-auto">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden btn btn-square btn-ghost">
                                <Menu size={24} />
                            </button>
                            <div className="flex items-center gap-4">
                                <div className="relative">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
                                        <Bot size={24} className="text-white" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-success rounded-full border-2 border-base-100"></div>
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold flex items-center gap-2">
                                        Morgan
                                        <span className="text-xs font-normal text-base-content/50">• Consultor Senior IA</span>
                                    </h2>
                                    <p className="text-xs text-base-content/50">
                                        NextBlock Real Estate Analytics
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={startNewSession}
                                className="btn btn-ghost btn-sm gap-2 hover:bg-base-200"
                                title="Nueva conversación"
                            >
                                <RefreshCw size={16} />
                                <span className="hidden sm:inline">Nueva Sesión</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-base-100 to-base-200/50">
                    <div className="max-w-4xl mx-auto space-y-6">
                        {/* Welcome Message */}
                        {messages.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full text-center px-4 py-12">
                                <div className="bg-gradient-to-br from-primary/20 to-secondary/20 p-8 rounded-3xl mb-8 shadow-lg">
                                    <Sparkles size={56} className="text-primary" />
                                </div>
                                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                                    ¡Hola! Soy Morgan
                                </h3>
                                <p className="text-lg text-base-content/60 mb-2">Tu Consultor Senior de Inversiones</p>
                                <p className="text-base-content/70 max-w-md mb-8">
                                    Estoy aquí para ayudarte a tomar decisiones inteligentes de inversión inmobiliaria
                                    usando nuestra base de datos de análisis predictivo.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl w-full">
                                    <button
                                        onClick={() => sendMessage('¿Cuáles son las mejores zonas para invertir en Texas?')}
                                        className="btn btn-ghost bg-base-100 border border-base-300 hover:border-primary hover:bg-primary/5 text-left justify-start gap-3 h-auto py-3 px-4 shadow-sm"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <MessageSquare size={18} className="text-primary" />
                                        </div>
                                        <span className="text-sm">Mejores zonas en Texas</span>
                                    </button>
                                    <button
                                        onClick={() => sendMessage('¿Qué zonas tienen mayor potencial de crecimiento?')}
                                        className="btn btn-ghost bg-base-100 border border-base-300 hover:border-primary hover:bg-primary/5 text-left justify-start gap-3 h-auto py-3 px-4 shadow-sm"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <MessageSquare size={18} className="text-primary" />
                                        </div>
                                        <span className="text-sm">Mayor potencial de crecimiento</span>
                                    </button>
                                    <button
                                        onClick={() => sendMessage('Dame un análisis de precios promedio por clasificación')}
                                        className="btn btn-ghost bg-base-100 border border-base-300 hover:border-primary hover:bg-primary/5 text-left justify-start gap-3 h-auto py-3 px-4 shadow-sm"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <MessageSquare size={18} className="text-primary" />
                                        </div>
                                        <span className="text-sm">Análisis de precios</span>
                                    </button>
                                    <button
                                        onClick={() => sendMessage('¿Cuáles son las zonas con mejor confianza de predicción?')}
                                        className="btn btn-ghost bg-base-100 border border-base-300 hover:border-primary hover:bg-primary/5 text-left justify-start gap-3 h-auto py-3 px-4 shadow-sm"
                                    >
                                        <div className="bg-primary/10 p-2 rounded-lg">
                                            <MessageSquare size={18} className="text-primary" />
                                        </div>
                                        <span className="text-sm">Mejor confianza de predicción</span>
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Messages */}
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                            >
                                {/* Avatar */}
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${message.role === 'user'
                                    ? 'bg-gradient-to-br from-slate-600 to-slate-800'
                                    : 'bg-gradient-to-br from-primary to-primary/80'
                                    }`}>
                                    {message.role === 'user'
                                        ? <User size={20} className="text-white" />
                                        : <Bot size={20} className="text-white" />
                                    }
                                </div>

                                {/* Message Content */}
                                <div className={`flex flex-col max-w-[75%] ${message.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-base-content/80">
                                            {message.role === 'user' ? 'Tú' : 'Morgan'}
                                        </span>
                                        <time className="text-xs text-base-content/40">{formatTime(message.timestamp)}</time>
                                    </div>
                                    <div className={`rounded-2xl px-4 py-3 shadow-sm ${message.role === 'user'
                                        ? 'bg-gradient-to-br from-slate-700 to-slate-800 text-white rounded-tr-sm'
                                        : 'bg-base-100 border border-base-200 text-base-content rounded-tl-sm'
                                        }`}>
                                        <div className="text-sm leading-relaxed">
                                            {message.role === 'agent'
                                                ? formatMarkdown(message.content)
                                                : <span className="whitespace-pre-wrap">{message.content}</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex gap-4 flex-row">
                                <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-br from-primary to-primary/80 shadow-md">
                                    <Bot size={20} className="text-white" />
                                </div>
                                <div className="flex flex-col items-start">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-semibold text-base-content/80">Morgan</span>
                                    </div>
                                    <div className="bg-base-100 border border-base-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                                        <div className="flex items-center gap-1">
                                            <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                            <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                            <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <div className="bg-base-100 border-t border-base-200 p-4 shadow-lg">
                    <div className="flex gap-3 max-w-4xl mx-auto">
                        <div className="flex-1 relative">
                            <textarea
                                ref={inputRef}
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Escribe tu mensaje..."
                                className="textarea textarea-bordered w-full resize-none bg-base-200/50 border-base-300 focus:border-primary focus:outline-none rounded-xl"
                                rows={1}
                                disabled={isLoading}
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputMessage.trim() || isLoading}
                            className="btn btn-primary rounded-xl shadow-md hover:shadow-lg transition-shadow"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                    <p className="text-xs text-center text-base-content/40 mt-3">
                        Morgan tiene acceso a la base de datos de NextBlock para análisis inmobiliario en tiempo real
                    </p>
                </div>
            </main>
        </div>
    );
};

export default AgentPage;

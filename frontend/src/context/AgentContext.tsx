import React, { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import axios from 'axios';

interface SavedMessage {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: string;
}

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    timestamp: Date;
}

interface AgentContextType {
    messages: Message[];
    sessionId: number;
    isLoading: boolean;
    sendMessage: (message: string) => Promise<void>;
    startNewSession: () => void;
    clearMessages: () => void;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

const AGENT_ENDPOINT = 'https://n8n.jenrycloud.com/webhook/agente-next';

// Genera un ID de sesión único
const generateSessionId = (): number => {
    return Math.floor(Math.random() * 900000) + 100000;
};

export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionId, setSessionId] = useState<number>(() => {
        // Intentar recuperar sessionId del localStorage
        const saved = localStorage.getItem('agentSessionId');
        return saved ? parseInt(saved) : generateSessionId();
    });
    const [isLoading, setIsLoading] = useState(false);

    // Persistir mensajes en localStorage
    useEffect(() => {
        const savedMessages = localStorage.getItem('agentMessages');
        if (savedMessages) {
            try {
                const parsed: SavedMessage[] = JSON.parse(savedMessages);
                setMessages(parsed.map((m) => ({ ...m, timestamp: new Date(m.timestamp) })));
            } catch (e) {
                console.error('Error parsing saved messages:', e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('agentMessages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        localStorage.setItem('agentSessionId', sessionId.toString());
    }, [sessionId]);

    const sendMessage = useCallback(async (message: string) => {
        if (!message.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: 'user',
            content: message,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const response = await axios.post(AGENT_ENDPOINT, {
                Id: sessionId,
                Mensaje: message
            });

            const agentResponse = response.data;
            const output = Array.isArray(agentResponse) && agentResponse[0]?.output
                ? agentResponse[0].output
                : typeof agentResponse === 'string'
                    ? agentResponse
                    : 'Lo siento, no pude procesar tu solicitud.';

            const agentMessage: Message = {
                id: `agent-${Date.now()}`,
                role: 'agent',
                content: output,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, agentMessage]);
        } catch (error) {
            console.error('Error sending message to agent:', error);
            const errorMessage: Message = {
                id: `agent-error-${Date.now()}`,
                role: 'agent',
                content: 'Lo siento, hubo un error al conectar con el agente. Por favor, intenta de nuevo.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    }, [sessionId]);

    const startNewSession = useCallback(() => {
        const newSessionId = generateSessionId();
        setSessionId(newSessionId);
        setMessages([]);
        localStorage.removeItem('agentMessages');
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
        localStorage.removeItem('agentMessages');
    }, []);

    return (
        <AgentContext.Provider value={{
            messages,
            sessionId,
            isLoading,
            sendMessage,
            startNewSession,
            clearMessages
        }}>
            {children}
        </AgentContext.Provider>
    );
};

export const useAgent = () => {
    const context = useContext(AgentContext);
    if (!context) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
};

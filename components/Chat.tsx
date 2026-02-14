
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ImagePlus, Heart, Loader2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || '';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface Message {
    id: number;
    text: string | null;
    imageUrl: string | null;
    sender: string;
    createdAt: string;
}

interface ChatProps {
    userName: string;
}

const Chat: React.FC<ChatProps> = ({ userName }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    // Load initial messages
    useEffect(() => {
        const loadMessages = async () => {
            const { data, error } = await supabase
                .from('Message')
                .select('*')
                .order('createdAt', { ascending: true })
                .limit(50);

            if (data) {
                setMessages(data);
                setTimeout(scrollToBottom, 100);
            }
            if (error) console.error('Load error:', error);
        };

        loadMessages();

        // Subscribe to new messages via Supabase Realtime
        const channel = supabase
            .channel('chat-messages')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'Message' },
                (payload) => {
                    const newMsg = payload.new as Message;
                    setMessages((prev) => {
                        // Avoid duplicates
                        if (prev.some((m) => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                    setTimeout(scrollToBottom, 100);
                }
            )
            .subscribe((status) => {
                setIsConnected(status === 'SUBSCRIBED');
            });

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const text = input.trim();
        setInput('');

        const { error } = await supabase.from('Message').insert({
            text,
            sender: userName,
        });

        if (error) console.error('Send error:', error);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const fileName = `${Date.now()}-${file.name}`;
            const { error: uploadError } = await supabase.storage
                .from('chat-images')
                .upload(fileName, file, { contentType: file.type });

            if (uploadError) {
                console.error('Upload error:', uploadError);
                return;
            }

            const { data: urlData } = supabase.storage
                .from('chat-images')
                .getPublicUrl(fileName);

            await supabase.from('Message').insert({
                imageUrl: urlData.publicUrl,
                sender: userName,
            });
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const formatTime = (dateStr: string) => {
        const d = new Date(dateStr);
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl mx-auto px-4 w-full h-full flex flex-col"
        >
            {/* Header */}
            <div className="text-center mb-4">
                <h3 className="text-3xl font-romantic text-[#ff4d6d] mb-1">Our Love Chat 💬</h3>
                <div className="flex items-center justify-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`}></span>
                    <p className="text-gray-400 text-xs">
                        {isConnected ? 'Connected with love 💕' : 'Connecting...'}
                    </p>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-xl p-4 mb-4 space-y-3"
                style={{ maxHeight: 'calc(100vh - 320px)', minHeight: '300px' }}
            >
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-pink-300 gap-3">
                        <Heart className="w-12 h-12 animate-pulse" />
                        <p className="font-romantic text-xl">Send your first message of love…</p>
                    </div>
                )}

                <AnimatePresence initial={false}>
                    {messages.map((msg) => {
                        const isMe = msg.sender.toLowerCase() === userName.toLowerCase();
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-md ${isMe
                                            ? 'bg-gradient-to-br from-[#ff4d6d] to-[#ff758f] text-white rounded-br-sm'
                                            : 'bg-white text-gray-700 border border-pink-100 rounded-bl-sm'
                                        }`}
                                >
                                    {!isMe && (
                                        <p className="text-[10px] uppercase tracking-widest font-bold text-pink-400 mb-1">
                                            {msg.sender} 💕
                                        </p>
                                    )}

                                    {msg.imageUrl && (
                                        <img
                                            src={msg.imageUrl}
                                            alt="Shared moment"
                                            className="rounded-xl max-w-full mb-2 border-2 border-white/50 shadow-sm cursor-pointer"
                                            onClick={() => window.open(msg.imageUrl!, '_blank')}
                                        />
                                    )}

                                    {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}

                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-gray-400'} text-right`}>
                                        {formatTime(msg.createdAt)}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-pink-100">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="p-2 text-pink-400 hover:text-[#ff4d6d] hover:bg-pink-50 rounded-full transition-colors"
                >
                    {isUploading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <ImagePlus className="w-5 h-5" />
                    )}
                </button>

                <input
                    type="text"
                    placeholder="Say something sweet…"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-pink-300 py-2"
                />

                <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className={`p-3 rounded-full transition-all ${input.trim()
                            ? 'bg-[#ff4d6d] text-white shadow-md hover:bg-[#ff758f] active:scale-95'
                            : 'bg-pink-100 text-pink-300 cursor-not-allowed'
                        }`}
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </motion.div>
    );
};

export default Chat;

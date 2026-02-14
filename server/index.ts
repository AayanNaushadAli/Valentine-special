import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import multer from 'multer';
import { PrismaClient } from '@prisma/client';
import { supabase } from './supabaseAdmin.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: { origin: '*' },
});

const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors());
app.use(express.json());

// ─── Upload image to Supabase Storage ────────────────────────────
app.post('/api/upload', upload.single('image'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            res.status(400).json({ error: 'No file provided' });
            return;
        }

        const fileName = `${Date.now()}-${file.originalname}`;
        const { data, error } = await supabase.storage
            .from('chat-images')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });

        if (error) {
            console.error('Supabase upload error:', error);
            res.status(500).json({ error: error.message });
            return;
        }

        const { data: urlData } = supabase.storage
            .from('chat-images')
            .getPublicUrl(fileName);

        res.json({ url: urlData.publicUrl });
    } catch (err) {
        console.error('Upload error:', err);
        res.status(500).json({ error: 'Upload failed' });
    }
});

// ─── Socket.io ───────────────────────────────────────────────────
io.on('connection', async (socket) => {
    console.log('💕 A lover connected:', socket.id);

    // Send the last 50 messages
    try {
        const messages = await prisma.message.findMany({
            orderBy: { createdAt: 'asc' },
            take: 50,
        });
        socket.emit('init', messages);
    } catch (err) {
        console.error('Error loading messages:', err);
    }

    // Handle new message
    socket.on('message', async (data: { text?: string; imageUrl?: string; sender: string }) => {
        try {
            const message = await prisma.message.create({
                data: {
                    text: data.text || null,
                    imageUrl: data.imageUrl || null,
                    sender: data.sender,
                },
            });
            io.emit('message', message);
        } catch (err) {
            console.error('Error saving message:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log('💔 A lover disconnected:', socket.id);
    });
});

// ─── Start ───────────────────────────────────────────────────────
const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log(`💌 Love Chat server running on http://localhost:${PORT}`);
});

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/legalchatbot")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Chat Schema
const chatSchema = new mongoose.Schema({
    userMessage: String,
    botResponse: String,
    createdAt: { type: Date, default: Date.now }
});

const Chat = mongoose.model("Chat", chatSchema);

// GROQ Setup
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message required" });
        }

        const completion = await openai.chat.completions.create({
            model: "llama-3.1-8b-instant",
            messages: [
                {
                    role: "system",
                    content: "You are a smart legal assistant for Indian law. Provide legal information only. Add disclaimer at end."
                },
                { role: "user", content: message }
            ],
        });

        const reply = completion.choices[0].message.content;

        await Chat.create({
            userMessage: message,
            botResponse: reply
        });

        res.json({ reply });

    } catch (error) {
        console.error("FULL ERROR:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
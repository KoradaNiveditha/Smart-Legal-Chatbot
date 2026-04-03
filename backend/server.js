require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

// GROQ Setup
const openai = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

// API Route
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

        res.json({ reply });

    } catch (error) {
        console.error("ERROR:", error.message);
        res.status(500).json({ error: "Backend error" });
    }
});

app.listen(5000, () => console.log("Server running on port 5000"));
console.log("KEY CHECK:", process.env.GROQ_API_KEY);
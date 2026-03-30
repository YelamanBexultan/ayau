import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend жұмыс істеп тұр");
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/ai", async (req, res) => {
  try {
    const text = req.body.text;

    if (!text) {
      return res.status(400).json({ result: "Сұраныс бос болмауы керек." });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ result: "OPENAI_API_KEY табылмады." });
    }

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Пользователь хочет план на день.

Сделай ответ строго в таком формате, каждая задача с новой строки:

09:00 - Утреннее планирование
10:00 - Учеба
12:00 - Перерыв
13:00 - Работа над проектом
15:00 - Отдых
17:00 - Спорт

Без лишних объяснений в начале.
После списка можешь добавить ОДНУ короткую рекомендацию с новой строки, начиная со слова "Совет:".
Запрос пользователя: ${text}
`
    });

    const result = response.output_text || "Жауап келмеді.";
    res.json({ result });
  } catch (error) {
    console.error("OPENAI ERROR:", error?.message || error);
    res.status(500).json({
      result: "Сервер қатесі шықты.",
      error: error?.message || "Unknown error"
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

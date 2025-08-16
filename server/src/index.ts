import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT: number = parseInt(process.env.PORT || "3000");
const WEATHER_KEY: string | undefined = process.env.OPENWEATHER_KEY;

app.use(cors());
app.use(express.json());

interface BasicRequest {
    question?: string;
}

interface BasicResponse {
    message?: string;
    error?: string;
}

if (!WEATHER_KEY) {
    console.error("❌ OPENWEATHER_KEY not found in environment variables");
    console.log("📝 Please add your API key to .env file: OPENWEATHER_KEY=your_api_key_here");
} else {
    console.log("✅ OpenWeather API key loaded");
}

app.get("/", (req: Request, res: Response<BasicResponse>) => {
    res.json({ message: "Agentic AI server is running 🚀" })
});

app

async function getWeatherData(params: type) {

}
app.post("/ask", (req, res) => {
    const { question } = req.body;

    const answer = `You asked: "${question}". This is a placeholder response from agent.`
    res.json({ answer });

});

app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
})
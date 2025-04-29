// backend/index.js
const express = require('express');
const axios = require('axios');
const cors = require('cors'); 
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// API URLs - going through Nginx
const HOROSCOPE_API_URL = 'http://nginx-proxy/horoscope/api/v1/get-horoscope/daily';
const OLLAMA_API_URL = 'http://nginx-proxy/ollama/api/generate';

app.use(cors());
app.use(bodyParser.json());

function getZodiacSign(day, month) {
    const zodiacSigns = [
        { sign: "Capricorn", from: { day: 22, month: 12 }, to: { day: 19, month: 1 } },
        { sign: "Aquarius", from: { day: 20, month: 1 }, to: { day: 18, month: 2 } },
        { sign: "Pisces", from: { day: 19, month: 2 }, to: { day: 20, month: 3 } },
        { sign: "Aries", from: { day: 21, month: 3 }, to: { day: 19, month: 4 } },
        { sign: "Taurus", from: { day: 20, month: 4 }, to: { day: 20, month: 5 } },
        { sign: "Gemini", from: { day: 21, month: 5 }, to: { day: 20, month: 6 } },
        { sign: "Cancer", from: { day: 21, month: 6 }, to: { day: 22, month: 7 } },
        { sign: "Leo", from: { day: 23, month: 7 }, to: { day: 22, month: 8 } },
        { sign: "Virgo", from: { day: 23, month: 8 }, to: { day: 22, month: 9 } },
        { sign: "Libra", from: { day: 23, month: 9 }, to: { day: 22, month: 10 } },
        { sign: "Scorpio", from: { day: 23, month: 10 }, to: { day: 21, month: 11 } },
        { sign: "Sagittarius", from: { day: 22, month: 11 }, to: { day: 21, month: 12 } },
    ];

    for (const zodiac of zodiacSigns) {
        const { from, to, sign } = zodiac;
        if (
            (month === from.month && day >= from.day) ||
            (month === to.month && day <= to.day)
        ) {
            return sign;
        }
    }
    return "Capricorn";
}

app.post('/horoscope', async (req, res) => {
    const { date } = req.body;
    if (!date) {
        return res.status(400).json({ error: "Date is required in DD/MM format." });
    }

    try {
        const [dayStr, monthStr] = date.split('/');
        const day = parseInt(dayStr, 10);
        const month = parseInt(monthStr, 10);

        const sign = getZodiacSign(day, month);
        const formattedSign = sign.toLowerCase().replace(/\s+/g, '-');


        // Step 1: Fetch the horoscope
        const horoscopeResponse = await axios.get(HOROSCOPE_API_URL, {
            params: {
                sign: formattedSign,
                day: 'TODAY'
            }
        });

        const horoscopeData = horoscopeResponse.data.data.horoscope_data;
        console.log("Horoscope Data: ", horoscopeData);

        // Step 2: Reformulate through Ollama
        const promptIntro = "Transform the following horoscope into creative investment advice for the world of cryptocurrency. Keep the spirit of the horoscope but reinterpret it to offer light, imaginative tips on crypto trading or investing.";
        const fullPrompt = `${promptIntro}\n${horoscopeData}`;

        const ollamaResponse = await axios.post(OLLAMA_API_URL, {
            model: 'mistral:7b',
            prompt: fullPrompt,
            stream: false
        });

        const rephrasedHoroscope = ollamaResponse.data.response;

        return res.json({ horoscope: rephrasedHoroscope });

    } catch (error) {
        console.error('Backend Error:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to generate horoscope.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});

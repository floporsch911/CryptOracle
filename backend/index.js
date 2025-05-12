// backend/index.js
const express = require('express');
const axios = require('axios');
const Parser = require('rss-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const nano = require('nano')('http://admin:password@couchdb:5984');
const parser = new Parser({
  customFields: {
    item: ['media:content', 'dc:creator']
  }
});

const app = express();
const PORT = 4000;
const DB_NAME = 'users';

// API URLs - going through Nginx
const HOROSCOPE_API_URL = 'http://nginx-proxy/horoscope/api/v1/get-horoscope/daily';
const OLLAMA_API_URL = 'http://nginx-proxy/ollama/api/generate';
const CRYPTO_NEWS_API_URL = 'http://nginx-proxy/crypto-news';

app.use(cors());
app.use(bodyParser.json());

// Ensure DB exists
(async () => {
    const dbList = await nano.db.list();
    if (!dbList.includes(DB_NAME)) {
        await nano.db.create(DB_NAME);
    }
})();

const usersDb = nano.db.use(DB_NAME);

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
        return res.status(400).json({ error: "The date is required." });
    }

    try {
        const [yearStr, monthStr, dayStr] = date.split('-');
        if (yearStr.length !== 4 || monthStr.length !== 2 || dayStr.length !== 2) {
            return res.status(400).json({ error: "Invalid date format. Use YYYY-MM-DD." });
        }
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

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
        const promptIntro = "Transform the following horoscope into creative investment advice for the world of cryptocurrency. Keep the spirit of the horoscope but express it in no more than 4 or 5 imaginative, engaging sentences. Make it light, playful, and insightful—like a quick cosmic tip for a crypto trader.";
        const fullPrompt = `${promptIntro}\n${horoscopeData}`;

        const ollamaResponse = await axios.post(OLLAMA_API_URL, {
            model: 'mistral:7b',
            prompt: fullPrompt,
            stream: false
        });

        const rephrasedHoroscope = ollamaResponse.data.response;

        return res.json({ sign: sign, horoscope: rephrasedHoroscope });

    } catch (error) {
        console.error('Backend Error:', error.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to generate horoscope.' });
    }
});

// Route to create a user
app.post('/users', async (req, res) => {
    const { username, password, birthDate, color } = req.body;

    if (!username || !password || !birthDate || !color) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const userDoc = {
            username,
            password,  // You should hash this in production
            birthDate,
            color,
            createdAt: new Date().toISOString(),
        };

        const response = await usersDb.insert(userDoc);
        res.status(201).json({ message: 'User created', id: response.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

// Route to authenticate a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Missing username or password' });
    }

    try {
        const result = await usersDb.find({
            selector: { username }
        });

        const user = result.docs[0];

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // In production, you'd hash and compare passwords securely
        if (user.password !== password) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        return res.status(200).json({
            message: 'Login successful',
            user: {
                username: user.username,
                birthDate: user.birthDate,
                color: user.color
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Login failed' });
    }
});

app.get('/crypto-news', async (req, res) => {
    try {
        const feed = await parser.parseURL('https://cointelegraph.com/rss');
        if (!feed || !feed.items) {
            return res.status(500).json({ error: "Impossible de lire le flux RSS 1" });
        }
        const news = feed.items.slice(0, 5).map(item => ({
            title: item.title,
            link: item.link,
            summary: item.contentSnippet,
            date: item.pubDate
        }));
        res.json(news);
    } catch (error) {
        console.error("RSS error:", error.message);
        res.status(500).json({ error: "Impossible de lire le flux RSS ${error.message}" });
    }
});

app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});

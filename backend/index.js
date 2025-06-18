// backend/index.js
const express = require('express');
const axios = require('axios');
const Parser = require('rss-parser');
const cors = require('cors');
const bodyParser = require('body-parser');
const nano = require('nano')('http://admin:password@couchdb:5984');
const parser = new Parser();
const qs = require('querystring');
const js2xmlparser = require('js2xmlparser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 4000;
const DB_USERS = '_users';

// API URLs - going through Nginx
const HOROSCOPE_API_URL = 'http://nginx-proxy/horoscope/api/v1/get-horoscope/daily';
const OLLAMA_API_URL = 'http://nginx-proxy/ollama/api/generate';
const CRYPTO_NEWS_API_URL = 'http://nginx-proxy/crypto-news';

app.use(cors());
app.use(bodyParser.json());

// Ensure DB _users exists
(async () => {
    const dbList = await nano.db.list();
    if (!dbList.includes(DB_USERS)) {
        await nano.db.create(DB_USERS);
    }
})();

// Ensure 'questions' DB exists and populate it
(async () => {
    const dbList = await nano.db.list();
    const QUESTIONS_DB_NAME = 'questions';

    if (!dbList.includes(QUESTIONS_DB_NAME)) {
        await nano.db.create(QUESTIONS_DB_NAME);
        const questionsDb = nano.db.use(QUESTIONS_DB_NAME);

        try {
            const questionsPath = path.join(__dirname, 'data', 'questions.json');
            const fileData = await fs.readFile(questionsPath, 'utf-8');
            const questions = JSON.parse(fileData);

            // Format as CouchDB bulk docs
            const docs = questions.map(q => ({ ...q }));
            await questionsDb.bulk({ docs });

            console.log('Questions successfully inserted into CouchDB.');
        } catch (err) {
            console.error('Failed to insert questions:', err.message);
        }
    }
})();

// Use the CouchDB _users database
const usersDb = nano.db.use(DB_USERS);

// Function to determine zodiac sign based on birth date
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

// Helper to negotiate response type
function negotiateResponse(req, res, data, rootName = "response", status = 200) {
    const accept = req.headers.accept || '';
    res.status(status);
    if (accept.includes('application/xml') || accept.includes('text/xml')) {
        res.set('Content-Type', 'application/xml');
        res.send(js2xmlparser.parse(rootName, data));
    } else {
        res.json(data);
    }
}

// handles the horoscope post request
app.post('/horoscope', async (req, res) => {
    const { date } = req.body;
    if (!date) {
        return negotiateResponse(req, res, { error: "The date is required." }, "error", 400);
    }

    try {
        const [yearStr, monthStr, dayStr] = date.split('-');
        if (yearStr.length !== 4 || monthStr.length !== 2 || dayStr.length !== 2) {
            return negotiateResponse(req, res, { error: "Invalid date format. Use YYYY-MM-DD." }, "error", 400);
        }
        const month = parseInt(monthStr, 10);
        const day = parseInt(dayStr, 10);

        const sign = getZodiacSign(day, month);
        const formattedSign = sign.toLowerCase().replace(/\s+/g, '-');

        // Step 1: Fetch the horoscope
        let horoscopeData = '';
        try {
            const horoscopeResponse = await axios.get(HOROSCOPE_API_URL, {
                params: {
                    sign: formattedSign,
                    day: 'TODAY'
                }
            });
            horoscopeData = horoscopeResponse?.data?.data?.horoscope_data || horoscopeResponse?.data?.horoscope || '';
        } catch (e) {
            console.error('Error fetching horoscope:', e.message || e);
            horoscopeData = '';
        }

        // Step 2: Reformulate through Ollama
        let rephrasedHoroscope = '';
        if (horoscopeData) {
            const promptIntro = "Transform the following horoscope into creative investment advice for the world of cryptocurrency. Keep the spirit of the horoscope but express it in no more than 4 or 5 imaginative, engaging sentences. Make it light, playful, and insightful—like a quick cosmic tip for a crypto trader.";
            const fullPrompt = `${promptIntro}\n${horoscopeData}`;
            try {
                const ollamaResponse = await axios.post(OLLAMA_API_URL, {
                    model: 'mistral:7b',
                    prompt: fullPrompt,
                    stream: false
                });
                rephrasedHoroscope = ollamaResponse?.data?.response || ollamaResponse?.data?.result || '';
            } catch (e) {
                console.error('Error reformulating horoscope with Ollama:', e.message || e);
                rephrasedHoroscope = '';
            }
        }
        return negotiateResponse(req, res, {
            sign: sign,
            horoscope: rephrasedHoroscope || "Aucune prédiction disponible pour aujourd'hui."
        }, "horoscope", 200);

    } catch (error) {
        console.error('Backend Error:', error.response?.data || error.message);
        return negotiateResponse(req, res, { error: 'Failed to generate horoscope.' }, "error", 500);
    }
});

// Route to create a user
app.post('/users', async (req, res) => {
    const { context, username, password, birthDate, color } = req.body;
    if (!context || !username || !birthDate || !color) {
        return negotiateResponse(req, res, { message: 'Missing required fields' }, "error", 400);
    }

    try {
        // Compose CouchDB _users document ID
        const userId = `org.couchdb.user:${username}`;
        if (context === 'createAccount') {
            // Check if user exists
            try {
                await usersDb.get(userId);
                return negotiateResponse(req, res, { message: 'Username already exists' }, "error", 409);
            } catch (err) {
                if (err.statusCode !== 404) throw err;  // If not a 404, rethrow
            }

            // User doc format as expected by CouchDB _users db
            const userDoc = {
                _id: userId,
                name: username,
                type: 'user',
                roles: [],
                password: password,  // Send plain password, CouchDB will hash it
                birthDate,
                color,
                createdAt: new Date().toISOString(),
            };

            const response = await usersDb.insert(userDoc);
            return res.status(200).json({ message: 'User created', id: response.id });
        } else if (context === 'modifyAccount') {
            // Find the existing user document
            try {
                await usersDb.get(userId);
            } catch (err) {
                if (err.statusCode === 404) {
                    return negotiateResponse(req, res, { message: 'User not found' }, "error", 404);
                }
                throw err;  // Rethrow other errors
            }
            // Fetch the user document
            const userDoc = await usersDb.get(userId);
            // Update the user document
            userDoc.birthDate = birthDate;
            userDoc.color = color;
            userDoc.updatedAt = new Date().toISOString();

            const response = await usersDb.insert(userDoc);
            return negotiateResponse(req, res, { message: 'User updated', id: response.id }, "user", 200);
        } else {
            return negotiateResponse(req, res, { message: 'Invalid context' }, "error", 400);
        }
    } catch (err) {
        console.error(err);
        return negotiateResponse(req, res, { message: 'Failed to process request' }, "error", 500);
    }
});

// Route to authenticate a user
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return negotiateResponse(req, res, { message: 'Missing username or password' }, "error", 400);
    }

    try {
        const formData = qs.stringify({ name: username, password });
        const loginResponse = await axios.post('http://admin:password@couchdb:5984/_session', formData, {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        });

        if (loginResponse.data.ok) {
            // Fetch user document from CouchDB
            const userId = `org.couchdb.user:${username}`;
            const userDoc = await usersDb.get(userId);
            // Return relevant user info
            return negotiateResponse(req, res, {
                message: 'Login successful',
                user: {
                    username: userDoc.name,
                    birthDate: userDoc.birthDate,
                    color: userDoc.color
                }
            }, "login", 200);
        } else {
            return negotiateResponse(req, res, { message: 'Invalid credentials' }, "error", 401);
        }
    } catch (err) {
        console.error(err.response?.data || err.message);
        return negotiateResponse(req, res, { message: 'Login failed' }, "error", 401);
    }
});

app.get('/crypto-news', async (req, res) => {
    try {
        let feed;
        try {
            const response = await axios.get(CRYPTO_NEWS_API_URL, {
                headers: {
                    'Accept': 'application/rss+xml, application/xml;q=0.9, */*;q=0.8',
                    'User-Agent': 'Mozilla/5.0 (Node.js server)'
                },
                responseType: 'text'
            });
            // Tolerant Reader: parser peut échouer ou le format peut varier
            feed = await parser.parseString(response?.data || '');
        } catch (e) {
            console.error('Error parsing RSS feed:', e.message || e);
            feed = null;
        }
        if (!feed || !Array.isArray(feed.items)) {
            return negotiateResponse(req, res, { error: "Impossible de lire le flux RSS." }, "error", 500);
        }
        const news = feed.items.slice(0, 5).map(item => ({
            title: item?.title || "Titre inconnu",
            link: item?.link || "",
            summary: item?.contentSnippet || item?.summary || "",
            date: item?.pubDate || item?.date || ""
        }));
        return negotiateResponse(req, res, news, "news", 200);
    } catch (error) {
        console.error("RSS error:", error.message);
        return negotiateResponse(req, res, { error: `Impossible de lire le flux RSS ${error.message}` }, "error", 500);
    }
});

app.get('/question', async (req, res) => {
    try {
        const questionsDb = nano.db.use('questions');
        // Get all _ids first
        const result = await questionsDb.list({ include_docs: false });
        const total = result.rows.length;

        if (total === 0) {
            return negotiateResponse(req, res, { error: "No questions available" }, "error", 404);
        }

        // Pick a random document
        const randomIndex = Math.floor(Math.random() * total);
        const randomId = result.rows[randomIndex].id;

        const doc = await questionsDb.get(randomId);
        return negotiateResponse(req, res, doc, "question", 200);
    } catch (error) {
        console.error("Error fetching question:", error.message);
        return negotiateResponse(req, res, { error: 'Failed to fetch question' }, "error", 500);
    }
});

app.get('/get/crypto/data', async (req, res) => {
    const { symbol, interval, startTime, endTime } = req.query;

    if (!symbol || !interval) {
        return negotiateResponse(req, res, { error: 'symbol and interval are required.' }, "error", 400);
    }

    try {
        const params = { symbol, interval };

        if (startTime) params.startTime = startTime;
        if (endTime) params.endTime = endTime;

        const binanceUrl = 'https://api.binance.com/api/v3/klines';
        const response = await axios.get(binanceUrl, { params });

        // ✅ Transform into array of candle objects
        const dataFiltered = response.data.map((item) => ({
            time: item[0] / 1000,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
        }));

        return negotiateResponse(req, res, { data: dataFiltered }, "cryptoData", 200);

    } catch (error) {
        console.error('Binance API Error:', error.message);
        return negotiateResponse(req, res, { error: 'Failed to fetch data from Binance.' }, "error", 500);
    }
});

app.get('/get/crypto/all', async (req, res) => {

    try {

        const binanceUrl = 'https://api.binance.com/api/v3/exchangeInfo';
        const response = await axios.get(binanceUrl);

        const tradingPairs = response.data.symbols
            .filter((s) => s.status === 'TRADING').map((s) => {

                return { symbol: s.symbol, name: s.baseAsset }
            });

        return negotiateResponse(req, res, { data: tradingPairs }, "tradingPairs", 200);

    } catch (error) {
        console.error('Binance API Error:', error.message);
        return negotiateResponse(req, res, { error: 'Failed to fetch trading pairs from Binance.' }, "error", 500);
    }
});

app.get('/calcul/gain/crypto', async (req, res) => {
    const { symbol } = req.query;

    if (!symbol) {
        return negotiateResponse(req, res, { error: 'symbol is required.' }, "error", 400);
    }

    try {
        const params = { symbol };

        const startTime = new Date();
        startTime.setDate(startTime.getDate() - 2);
        const endTime = new Date();

        params.startTime = startTime.getTime();
        params.endTime = endTime.getTime();
        params.interval = '1d';

        const binanceUrl = 'https://api.binance.com/api/v3/klines';
        const response = await axios.get(binanceUrl, { params });

        const dataFiltered = response.data.map((item) => ({
            time: item[0] / 1000,
            open: parseFloat(item[1]),
            high: parseFloat(item[2]),
            low: parseFloat(item[3]),
            close: parseFloat(item[4]),
        })).sort((a, b) => a.time - b.time);

        const gain = (((dataFiltered[dataFiltered.length - 1].close - dataFiltered[0].close) / dataFiltered[0].close) * 100).toFixed(2);
        return negotiateResponse(req, res, { data: gain }, "gain", 200);

    } catch (error) {
        console.error('Binance API Error:', error.message);
        return negotiateResponse(req, res, { error: 'Failed to fetch data from Binance.' }, "error", 500);
    }
});




app.listen(PORT, () => {
    console.log(`Backend server listening on port ${PORT}`);
});

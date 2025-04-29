const axios = require('axios');
const readline = require('readline');

// API URL for daily horoscope
const API_BASE_URL = 'https://horoscope-app-api.vercel.app/api/v1/get-horoscope/daily';

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

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your birth date DD/MM: ', async (date) => {
    const formattedDate = date.split('/');
    const day = parseInt(formattedDate[0], 10);
    const month = parseInt(formattedDate[1], 10);
    const sign = getZodiacSign(day, month);
    const formattedSign = sign.toLowerCase().replace(/\s+/g, '-'); // URL-friendly sign

    try {
        // Step 1: Fetch the horoscope
        const horoscopeResponse = await axios.get(API_BASE_URL, {
            params: {
                sign: formattedSign,
                day: 'TODAY'
            }
        });

        const horoscopeData = horoscopeResponse.data.data.horoscope_data;

        // Step 2: Send POST request with only horoscope_data
        const promptIntro = "Transform the following horoscope into creative investment advice for the world of cryptocurrency. Keep the spirit of the horoscope but reinterpret it to offer light, imaginative tips on crypto trading or investing.";
        const fullPrompt = `${promptIntro}\n${horoscopeData}`;

        const cryptoResponse = await axios.post('http://192.168.8.147:11434/api/generate', {
            model: 'mistral:7b',
            prompt: fullPrompt,
            stream: false
        });

        // Step 3: Only print the reformulated horoscope
        console.log(cryptoResponse.data.response);

    } catch (error) {
        console.error('❌ Error:', error.response?.data || error.message);
    } finally {
        rl.close();
    }
});

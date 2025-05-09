// frontend/src/components/HoroscopeFetcher.js
import { useState } from 'react';
import axios from 'axios';

function HoroscopeFetcher() {
    const [date, setDate] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchHoroscope = async () => {
        setLoading(true);
        setResult('');

        try {
            const response = await axios.post('/api/horoscope', {
                date: date
            });
            setResult(response.data.horoscope);
        } catch (error) {
            setResult('Error fetching horoscope.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Get Your Crypto Horoscope</h2>
            <input
                type="text"
                placeholder="Enter your birth date (DD/MM)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
            <button onClick={fetchHoroscope}>Fetch Horoscope</button>

            {loading && <p>Loading...</p>}
            {result && <div><h3>Result:</h3><p>{result}</p></div>}
        </div>
    );
}

export default HoroscopeFetcher;

import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function SelectCrypto({ selectedSymbol, setSelectedSymbol }) {
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
                const tradingPairs = response.data.symbols
                    .filter((s) => s.status === 'TRADING')
                    .map((s) => s.symbol);
                setSymbols(tradingPairs);
            } catch (error) {
                console.error('Erreur lors du chargement des symboles Binance :', error);
            }
        };

        fetchSymbols();
    }, []);

    const handleChange = (e) => {
        setSelectedSymbol(e.target.value);
    };

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial' }}>
            <h2>Sélecteur de cryptomonnaies Binance</h2>
            <select value={selectedSymbol} onChange={handleChange} style={{ padding: '10px', fontSize: '16px' }}>
                {symbols.map((symbol) => (
                    <option key={symbol} value={symbol}>
                        {symbol}
                    </option>
                ))}
            </select>
            {selectedSymbol && (
                <div style={{ marginTop: '20px', fontSize: '18px' }}>
                    <strong>Symbole sélectionné : </strong> {selectedSymbol}
                </div>
            )}
        </div>
    );
};

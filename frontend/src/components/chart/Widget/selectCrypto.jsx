import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./selectCrypto.css"

export default function SelectCrypto({ selectedSymbol, setSelectedSymbol }) {
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                const response = await axios.get('https://api.binance.com/api/v3/exchangeInfo');
                const tradingPairs = response.data.symbols
                    .filter((s) => s.status === 'TRADING').map((s) => {

                        return { symbol: s.symbol, name: s.baseAsset }
                    });
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
        <div className='select-container'>
            <span style={{ alignSelf: "center" }}>Crypto currency</span>
            <select value={selectedSymbol} onChange={handleChange} className='select-container-drop-down'>
                {symbols.map((symbol) => (
                    <option key={symbol.symbol} value={symbol.symbol}>
                        {symbol.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./selectCrypto.css"

export default function SelectCrypto({ selectedSymbol, setSelectedSymbol }) {
    const [symbols, setSymbols] = useState([]);

    useEffect(() => {
        const fetchSymbols = async () => {
            try {
                const response = await axios.get('/api/binance/crypto');
                setSymbols(response.data.data);
            } catch (error) {
                console.error('Erreur lors du chargement des symboles Binance :', error);
            }
        };

        fetchSymbols();
    }, []);

    const handleChange = (e) => {
        const selectedSymbolObj = symbols.find(s => s.symbol === e.target.value);
        setSelectedSymbol(selectedSymbolObj);
    };

    return (
        <div className='select-container'>
            <span style={{ alignSelf: "center" }}>Crypto currency</span>
            <select value={selectedSymbol.symbol} onChange={handleChange} className='select-container-drop-down'>
                {symbols.map((symbol) => (
                    <option key={symbol.symbol} value={symbol.symbol} >
                        {symbol.name} ({symbol.symbol.replace(symbol.name, "")})
                    </option>
                ))}
            </select>
        </div>
    );
};

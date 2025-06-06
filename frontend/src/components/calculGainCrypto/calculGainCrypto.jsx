import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './calculGainCrypto.css';

export default function CalculGainCrypto({ selectedSymbol }) {
    const [gain, setGain] = useState(null);
    const [value, setValue] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/api/calcul/gain/crypto?symbol=${selectedSymbol.symbol}`);
                setGain(response.data.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedSymbol]);

    const isGain = gain !== null && gain >= 0;
    const gainColor = isGain ? 'green' : 'red';
    return (
        <div className='main-element'>
            <label htmlFor='moneyToSpend'>
                {gain !== null && (
                    <p style={{ textAlign: 'center' }}>
                        Si hier vous aviez investi dans {selectedSymbol.name}, vous auriez{' '}
                        {isGain ? 'gagné' : 'perdu'}{' '} : <br />
                        <span style={{ color: gainColor, fontWeight: 'bold', fontSize: '1.5em' }}>
                            {Math.abs(gain)}%
                        </span>
                    </p>
                )}
            </label>
            <div style={{ marginTop: "24px" }}>
                <span>
                    Investie hier : <input className='calculGainCrypto-input' type='number' id='moneyToSpend' value={value} onChange={(e) => setValue(e.target.value)} placeholder='$'></input><br /> Aujourd'hui : {value != '' && (<span style={{ color: gainColor, fontWeight: 'bold' }}>{value * (1 + (gain / 100))}</span>)}
                </span>
            </div>
        </div>
    );
}

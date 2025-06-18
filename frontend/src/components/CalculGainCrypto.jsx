import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
        <div className='main-element nunito-body sim-gain-perte-fetcher'>
            <div className="orbitron title sim-gain-title">Simulation des gains</div>
            <div className="sim-gain-content">
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
                        Investie hier :
                        <span style={{ paddingLeft: "10px" }}>
                            <input
                                className='calculGainCrypto-input text-gain-perte'
                                type='number'
                                id='moneyToSpend'
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder=''
                            />
                            <span style={{ marginLeft: "6px" }}>$</span>
                        </span>
                        <br /> Aujourd'hui :<>
                            <input disabled value={value * (1 + (gain / 100))} style={{ color: gainColor, fontWeight: 'bold', marginTop: "10px", marginLeft: "14px" }} className='calculGainCrypto-input text-gain-perte' />
                            <span style={{ marginLeft: "6px" }}>$</span></>
                    </span>
                </div>
            </div>
        </div>
    );
}

import React, { useEffect, useState } from 'react';

const phrases = [
    'your horoscope',
    'your favorite number',
    'the color of your t-shirt'
];

const AnimatedSentence = () => {
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(false);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % phrases.length);
                setFade(true);
            }, 300); // Match this with fade-out duration
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="orbitron animated-sentence d-flex">
            Learn how to invest in crypto with&nbsp;
            <span className="animated-wrapper">
                <span className={`fade-text ${fade ? 'visible' : 'hidden'}`}>
                    {phrases[index]}
                </span>
            </span>
        </div>
    );
};

export default AnimatedSentence;
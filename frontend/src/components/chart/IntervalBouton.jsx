const timeframes = ["1s", "1m", "3m", "5m", "15m", "30m", "1h", "2h", "4h", "6h", "8h", "12h", "1d", "3d", "1w", "1M"];

export default function IntervalBouton({ interval, setInterval }) {

    return (
        <div className="timeframe-container">
            <div className="scroll-inner">
                {timeframes.map((tf) => (
                    <button
                        key={tf}
                        onClick={() => setInterval(tf)}
                        className={`timeframe-button ${interval === tf ? "active" : ""}`}
                    >
                        {tf}
                    </button>
                ))}
            </div>
        </div>
    );
}

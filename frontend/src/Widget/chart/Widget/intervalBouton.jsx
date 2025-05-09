import React, { useState } from "react";

const timeframes = ["1m", "5m", "1j", "7j"];

export default function IntervalBouton({ interval, setInterval }) {

    return (
        <div className="inline-flex rounded-lg shadow-sm overflow-hidden border border-gray-300">
            {timeframes.map((tf) => (
                <button
                    key={tf}
                    onClick={() => setInterval(tf)}
                    className={`px-4 py-2 text-sm font-medium border-l first:border-l-0 ${interval === tf
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                >
                    {tf}
                </button>
            ))}
        </div>
    );
}

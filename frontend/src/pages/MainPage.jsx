import React, { useState } from "react";
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import CryptoNews from "../components/CryptoNews";
import HoroscopeFetcher from "../components/HoroscopeFetcher";
import { Display } from "react-bootstrap-icons";
import FinancialChart from "../components/chart/financialChart";
import CalculGainCrypto from "../components/calculGainCrypto/calculGainCrypto";

const MainPage = () => {
    const [selectedSymbol, setSelectedSymbol] = useState({ symbol: "BTCUSDT", name: "BTC" });
    return (
        <div className="app-container text-light">
            <Header />
            <Main className="flex-grow-1 py-4">
                <div>
                    <div className="main-page-container">
                        <HoroscopeFetcher />
                        <CryptoNews />
                    </div>
                    <div className="main-page-container" style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
                        <div style={{ flex: 3 }}>
                            <FinancialChart selectedSymbol={selectedSymbol} setSelectedSymbol={setSelectedSymbol} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <CalculGainCrypto selectedSymbol={selectedSymbol} />
                        </div>
                    </div>

                </div>
            </Main >
            <Footer />

        </div >
    );
};

export default MainPage;
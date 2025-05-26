import React from "react";
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import CryptoNews from "../components/CryptoNews";
import HoroscopeFetcher from "../components/HoroscopeFetcher";
import QuestionFetcher from "../components/QuestionFetcher";

const MainPage = () => {
    return (
        <div className="app-container text-light">
            <Header />
            <Main className="flex-grow-1 py-4">
                <div className="main-page-container">
                    <HoroscopeFetcher />
                    <CryptoNews />
                    <QuestionFetcher />
                </div>
            </Main >
            <Footer />

        </div >
    );
};

export default MainPage;
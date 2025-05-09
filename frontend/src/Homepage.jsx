import React from "react";
import Header from './components/Header';
import Main from './components/Main';
import Footer from './components/Footer';
import AnimatedSentence from "./components/AnimatedSentence";

const HomePage = () => {
    return (
        <div className="app-container text-light">
            <Header />
            <Main className="flex-grow-1 py-4">
                <div className="d-flex justify-content-center">
                    <AnimatedSentence />
                </div>
                <span className="d-flex justify-content-center intro-sentence nunito-body">Our AI-based fortune teller</span>
                <div className="d-flex justify-content-center">
                    <img
                        src='/assets/bouleCrystal.gif'
                        alt="Fortune Teller"
                        width="300"
                        className="d-inline-block align-top fortune-teller-image"
                    />
                </div>
                <div className="d-flex justify-content-center mt-4">
                    <button
                        className="btn-create-account"
                        onMouseEnter={(e) => e.target.textContent = "Create an account to lose millions"}
                        onMouseLeave={(e) => e.target.textContent = "Create an account to win millions"}
                    >
                        Create an account to win millions
                    </button>
                </div>
                <div className="d-flex justify-content-center warning-sentence">
                    <span className="nunito-body">We, hereby, deny any responsibility for financial losses incurred as a result of using the information provided.</span>
                </div>
            </Main>
            <Footer />
        </div>
    );
};

export default HomePage;
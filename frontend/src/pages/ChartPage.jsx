import React from "react";
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import FinancialChart from "../components/chart/financialChart";

const ChartPage = () => {
    return (
        <div className="app-container text-light">
            <Header />
            <Main className="flex-grow-1 py-4">
                <FinancialChart />
            </Main>
            <Footer />
        </div>
    );
};

export default ChartPage;
import React from "react";
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';

const LoginPage = () => {
    return (
        <div className="app-container text-light">
            <Header />
            <Main className="flex-grow-1 py-4">
                Let's create your account
            </Main>
            <Footer />
        </div>
    );
};

export default LoginPage;
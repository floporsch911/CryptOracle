import React, { useState }  from "react";
import Header from '../components/Header';
import Main from '../components/Main';
import Footer from '../components/Footer';
import HoroscopeFetcher from '../components/HoroscopeFetcher';

const MainPage = () => {

  return (
    <div className="app-container text-light">
      <Header />
      <Main className="flex-grow-1 py-4">
          <HoroscopeFetcher />
      </Main>
      <Footer />
    </div>
  );
};

export default MainPage;
import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";

const AboutUsPage = () => {
  return (
    <div className="app-container text-light">
      <Header />
      <Main className="flex-grow-1 py-4">
        <Container>
          <h2 className="text-center mb-4 orbitron">About Us</h2>
          <div className="main-element p-4">
          <p className="text-justify nunito-body">
            Welcome to Crypt'Oracle, a service that combines tracking cryptocurrency trends with a parody of the unpredictability of the markets. Our project aims to create a platform where you can explore cryptocurrency trends, stay updated on related news, and receive personalized predictions based on your own data.
            By playing on the illusion of prediction, we highlight the unpredictable nature of the markets. Our mission is to inform users about cryptocurrency trends while improving transparency regarding actual gains and losses based on these trends. This helps raise awareness about the risks of investing in cryptocurrencies and their inherent unpredictability.
          </p>
          </div>
          <div className="text-center mt-4">
            <img
              src="/assets/flo1.png"
              alt="About Us Illustration"
              className="img-fluid"
              style={{ maxWidth: "20%", height: "auto" }}
            />
            <img
              src="/assets/luna.png"
              alt="About Us Illustration"
              className="img-fluid"
              style={{ maxWidth: "20.2%", height: "auto" }}
            />
            <img
              src="/assets/flo2.png"
              alt="About Us Illustration"
              className="img-fluid"
              style={{ maxWidth: "20%", height: "auto" }}
            />
          </div>
          <div className="d-flex justify-content-center warning-sentence mt-4">
          <span className="nunito-body -4">
            The predictions made by our service are purely for entertainment purposes and should not be considered as financial advice. We do not guarantee the accuracy or reliability of any information provided, and users should not rely solely on our predictions for making investment decisions.
            We encourage users to conduct their own research and exercise caution when investing in cryptocurrencies.
          </span>
        </div>
        <div className="text-center mt-4 warning-sentence">
          We, hereby, deny any responsibility for financial losses incurred as a result of using the information provided.
        </div>
        </Container>
      </Main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;

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
          <p className="text-center nunito-body">
            Welcome to Crypt'Oracle, your AI-based fortune teller! We are a team
            of passionate developers and data scientists dedicated to providing
            you with the most accurate predictions in the world of
            cryptocurrency. Our mission is to empower you with the knowledge and
            insights needed to make informed decisions in this ever-evolving
            market.
          </p>
          <p className="text-center nunito-body">
            Join us on this exciting journey and let us help you navigate the
            world of crypto with confidence!
          </p>
        </Container>
      </Main>
      <Footer />
    </div>
  );
};

export default AboutUsPage;

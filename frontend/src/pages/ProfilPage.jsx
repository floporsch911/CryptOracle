import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";

const ProfilPage = () => {
  return (
    <div className="app-container text-light">
      <Header />
      <Main className="flex-grow-1 py-4">
        <Container>
          To do....
        </Container>
      </Main>
      <Footer />
    </div>
  );
};

export default ProfilPage;

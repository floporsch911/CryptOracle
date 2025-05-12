import React from "react";
import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const handleClickAboutUs = () => {
    navigate("/aboutUs");
  };
  return (
    <footer className="orbitron py-3">
      <Container className="text-center">
        <small>
          &copy; 2025 - Crypt'Oracle - <span onClick={handleClickAboutUs} className="footer-button">about us</span>
        </small>
      </Container>
    </footer>
  );
};

export default Footer;
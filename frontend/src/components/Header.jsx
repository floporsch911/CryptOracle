import React from "react";
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

const Header = () => {
    return (
      <Navbar variant="dark" expand="lg" className="header-navbar">
        <Container>
          <Navbar.Brand className="d-flex align-items-center gap-2">
            <img
              src='/assets/icon.png'
              alt="Logo"
              width="60"
              className="d-inline-block align-top"
            />
            <span className="orbitron">Crypt'Oracle</span>
          </Navbar.Brand>
        </Container>
      </Navbar>
    );
  };
  
  export default Header;
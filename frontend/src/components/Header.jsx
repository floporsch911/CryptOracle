import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import { PersonCircle } from "react-bootstrap-icons";
import { Button, ButtonGroup } from "react-bootstrap";

const Header = () => {
  const navigate = useNavigate();
  const [showButtons, setShowButtons] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const goHomePage = () => {
    if (user) {
      // If user is logged in, navigate to the main page
      navigate("/main");
    } else {
      // If user is not logged in, navigate to the home page
      navigate("/");
    }
  };

  const handleLogOut = () => {
    // Remove the user data from localStorage and redirect to home
    localStorage.removeItem("user");
    localStorage.removeItem("horoscope");
    localStorage.removeItem("sign");
    navigate("/");
  };

  const handleCreateAccount = () => {
    navigate("/createAccount"); // Navigate to the account creation page
  };

  const handleLogIn = () => {
    navigate("/login"); // Navigate to the login page
  };

  const handleProfil = () => {
    navigate("/profil"); // Navigate to the profile page
  };

  return (
    <Navbar expand="lg" className="header-navbar">
      <Container
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        <Navbar.Brand className="d-flex align-items-center gap-2">
          <img
            src="/assets/icon.png"
            alt="Logo"
            width="60"
            className="d-inline-block align-top logo"
            onClick={goHomePage}
          />
          <span className="orbitron">Crypt'Oracle</span>
        </Navbar.Brand>
        <div
          className="ms-auto d-flex position-relative user-buttons"
          style={{ marginRight: "3%" }}
          onMouseEnter={() => setShowButtons(true)} // Show buttons on hover
          onMouseLeave={() => setShowButtons(false)} // Hide buttons on hover leave
        >
          <div style={{ cursor: "pointer" }}>
            <PersonCircle color="white" size={30} />
          </div>

          {showButtons && (
            <ButtonGroup className="d-flex flex-column position-absolute btn-user-group">
              {!user ? (
                <>
                  <button
                    className="btn-style btn-user"
                    onClick={handleCreateAccount}
                  >
                    Create Account
                  </button>
                  <button className="btn-style btn-user" onClick={handleLogIn}>
                    Log In
                  </button>
                </>
              ) : (
                <>
                  <button className="btn-style btn-user" onClick={handleProfil}>
                    Profil
                  </button>
                  <button className="btn-style btn-user" onClick={handleLogOut}>
                    Log Out
                  </button>
                </>
              )}
            </ButtonGroup>
          )}
        </div>
      </Container>
    </Navbar>
  );
};

export default Header;

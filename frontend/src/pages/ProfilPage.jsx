import React, { useState } from "react";
import { Container, Form, Row, Col, Toast, ToastContainer} from "react-bootstrap";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";

const ProfilPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [userData, setUserData] = useState(user ? user : {});
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedUser = { ...userData, context: "modifyAccount" };
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUserData(updatedUser);
        setMessage("Profile updated successfully!");
        setError(false);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message);
        setError(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage("An error occurred while modifying your information.")
      setError(true);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <div className="app-container text-light">
      <Header />
      <Main className="flex-grow-1 py-4">
        <Container>
          <h2 className="text-center mb-4 orbitron">Your Profile</h2>
          <Form onSubmit={handleSubmit} className="nunito-body">
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    value={userData.username || ""}
                    onChange={handleChange}
                    className="username-muted"
                    disabled // Le nom d'utilisateur ne peut pas être modifié
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formBirthDate">
                  <Form.Label>Birth Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="birthDate"
                    value={userData.birthDate || ""}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formColor">
                  <Form.Label>Favorite Color</Form.Label>
                  <Form.Control
                    as="select"
                    name="color"
                    value={userData.color || ""}
                    onChange={handleChange}
                  >
                    <option value="">Select a color</option>
                    <option value="red">🔴 Red</option>
                    <option value="blue">🔵 Blue</option>
                    <option value="green">🟢 Green</option>
                    <option value="yellow">🟡 Yellow</option>
                    <option value="purple">🟣 Purple</option>
                    <option value="orange">🟠 Orange</option>
                    <option value="pink">🟤 Brown</option>
                    <option value="black">⚫ Black</option>
                    <option value="white">⚪ White</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <button type="submit" className="btn-style">
              Save Changes
            </button>
          </Form>
        </Container>
      </Main>
      <Footer />
      <ToastContainer position="top-center" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={5000}
          autohide
          className={error ? "error-container" : "success-container"}
        >
          <Toast.Body className="text-toast nunito-body">
            {message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default ProfilPage;

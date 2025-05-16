import React, { useState } from "react";
import { Form, Container, Row, Col, Toast, ToastContainer } from "react-bootstrap";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleFill } from "react-bootstrap-icons";

const CreateAccountPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    birthDate: "",
    color: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormData({...formData, context: "createAccount"});
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(formData));
        // Redirect to the main page
        navigate("/main");

      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 5000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrorMessage("An error occurred while creating the account.")
      setShowToast(true);
      setTimeout(() => setShowToast(false), 5000);
    }
  };

  return (
    <div className="app-container text-light">
      <Header />
      <Main className="flex-grow-1 py-4">
        <Container>
          <h2 className="text-center mb-4 orbitron">
            Enter the realm of knowledge
          </h2>
          <Form onSubmit={handleSubmit} className="nunito-body">
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
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
                    value={formData.birthDate}
                    onChange={handleChange}
                    required
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
                    value={formData.color}
                    onChange={handleChange}
                    required
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
              Create Account
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
          className="error-container"
        >
          <Toast.Body className="nunito-body">
            <ExclamationTriangleFill className="me-2" />
            {errorMessage}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default CreateAccountPage;

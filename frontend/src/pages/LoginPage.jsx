import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Container, Row, Col } from "react-bootstrap";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/main");
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("An error occurred during login.");
    }
  };

  return (
    <div className="app-container text-light">
      <Header />
      <Main className="flex-grow-1 py-4">
        <Container>
          <h2 className="text-center mb-4 orbitron">Welcome Back</h2>
          <Form onSubmit={handleSubmit} className="nunito-body">
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="loginUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <Form.Group controlId="loginPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <button type="submit" className="btn-style">Log In</button>
          </Form>
        </Container>
      </Main>
      <Footer />
    </div>
  );
};

export default LoginPage;

// frontend/src/components/QuestionFetcher.js
import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "react-bootstrap";
import { FaSyncAlt } from "react-icons/fa";

function QuestionFetcher() {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAdvice, setSelectedAdvice] = useState("");
  const [showToast, setShowToast] = useState(false);

  const fetchQuestion = async () => {
    setQuestionData(null);
    setSelectedAdvice("");
    try {
      const response = await axios.get("/api/question");
      setQuestionData(response?.data || null);
    } catch (error) {
      console.error("Failed to fetch question:", error);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswerClick = (advice) => {
    setSelectedAdvice(advice);
    setShowToast(true);
  };

  const handleReload = () => {
    setSelectedAdvice("");
  };

  return (
    <div className="main-element question-fetcher nunito-body">
      <div className="question-header">
        <div className="orbitron title text-center w-100">
          Your daily advice
        </div>
        <button
          className="btn-share"
          onClick={handleReload}
          title="Answer again"
        >
          <FaSyncAlt />
        </button>
        <div style={{ height: "2.5rem" }} /> {/* Spacer for title height */}
      </div>
      <div className="question-content-wrapper">
        {!questionData && (
          <div className="loading-container">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {questionData && !selectedAdvice && (
          <div className="question-content">
            <p className="mb-4">{questionData.question}</p>
            <div className="d-flex flex-column gap-2">
              {questionData.answers.map((answer, index) => (
                <button
                  key={index}
                  className="btn-answer-question nunito-body"
                  onClick={() => handleAnswerClick(answer.advice)}
                >
                  {answer.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedAdvice && (
          <div className="advice-block nunito-body">
            <p>{selectedAdvice}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionFetcher;

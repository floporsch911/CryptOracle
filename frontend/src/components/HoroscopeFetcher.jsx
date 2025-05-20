// frontend/src/components/HoroscopeFetcher.js
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";

function HoroscopeFetcher() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [birthDate, setBirthDate] = useState(user ? user.birthDate : "");
  const [sign, setSign] = useState(
    JSON.parse(localStorage.getItem("sign")) || ""
  );
  const [horoscope, setHoroscope] = useState(
    JSON.parse(localStorage.getItem("horoscope")) || ""
  );
  const [loading, setLoading] = useState(false);
  const horoscopeIcons = {
    Aries: "🐏",
    Taurus: "🐂",
    Gemini: "👫",
    Cancer: "🦀",
    Leo: "🦁",
    Virgo: "👩‍🌾",
    Libra: "⚖️",
    Scorpio: "🦂",
    Sagittarius: "🏹",
    Capricorn: "🐐",
    Aquarius: "🏺",
    Pisces: "🐟",
  };

  useEffect(() => {
    if (!localStorage.getItem("horoscope") && birthDate) {
      fetchHoroscope();
    }
  }, []);

  const fetchHoroscope = async () => {
    setLoading(true);
    setHoroscope("");

    try {
      const response = await axios.post("/api/horoscope", {
        date: birthDate,
      });
      setHoroscope(response?.data?.horoscope || "No horoscope available.");
      setSign(response?.data?.sign || "Unknown");
      localStorage.setItem(
        "horoscope",
        JSON.stringify(response?.data?.horoscope || "No horoscope available.")
      );
      localStorage.setItem("sign", JSON.stringify(response?.data?.sign || "Unknown"));
    } catch (error) {
      setHoroscope("Error fetching horoscope.");
      setSign("Unknown");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-element horoscope-fetcher">
      <div className="orbitron title">Crypto Horoscope of the day</div>
      {loading && (
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {sign && (
        <div className="horoscope-sign nunito-body">
          {horoscopeIcons[sign]} {sign}
        </div>
      )}
      {horoscope && (
        <div className="horoscope-content nunito-body">
          <p>{horoscope}</p>
        </div>
      )}
    </div>
  );
}

export default HoroscopeFetcher;

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
      setHoroscope(response.data.horoscope);
      setSign(response.data.sign);
      localStorage.setItem(
        "horoscope",
        JSON.stringify(response.data.horoscope)
      );
      localStorage.setItem("sign", JSON.stringify(response.data.sign));
    } catch (error) {
      setHoroscope("Error fetching horoscope.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-element horoscope-fetcher">
      <div className="orbitron title">Crypto Horoscope of the day</div>
      {loading && <p>Loading...</p>}
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

import React, { useEffect, useState } from 'react';
import News from './News'; // Assure-toi que le chemin est correct

function CryptoNews() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/crypto-news');
      if (!res.ok) {
        setError("Failed to load crypto news...");
      }
      const data = await res.json();
      setNews(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="main-element crypto-news" style={{ paddingTop: '0px' }}>
      <h2 className='title sticky-title orbitron'>Crypto Actuality</h2>
      {loading && (
        <div className="loading-container">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {news.map((item, index) => (
          <News
            key={index}
            title={item.title}
            summary={item.summary}
            date={item.date}
            link={item.link}
            maxLength={100}
          />
        ))}
      </ul>
    </div>
  );
}

export default CryptoNews;

import React, { useEffect, useState } from 'react';
import News from './News'; // Assure-toi que le chemin est correct

function CryptoNews() {
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('/api/crypto-news')
      .then((res) => {
        if (!res.ok) throw new Error("Échec du chargement des actualités");
        return res.json();
      })
      .then((data) => setNews(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="news">
      <h2 className='title nunito-body'>Actualités Crypto</h2>
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

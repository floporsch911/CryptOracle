import React from 'react';
import './News.css'

function NewsItem({ title, summary, date, link, maxLength = 100 }) {
  const truncatedSummary =
    summary.length > maxLength ? summary.slice(0, maxLength) + '...' : summary;

  return (
    <li>
      <a href={link} target="_blank" rel="noopener noreferrer" className='news-link'>
        <strong className='news-title'>{title}</strong>
      </a>
      <p style={{ margin: '0.5em 0', fontSize: '0.9em' }}>{truncatedSummary}</p>
      <small style={{ color: '#666' }}>{new Date(date).toLocaleString()}</small>
    </li>
  );
}

export default NewsItem;

import React from "react";
import "./News.css";

function NewsItem({
  title = "Unknown title",
  summary = "No summary available.",
  date,
  link = "#",
  maxLength = 100,
}) {
  const truncatedSummary =
    summary && summary.length > maxLength
      ? summary.slice(0, maxLength) + "..."
      : summary;
  let displayDate = "Unknown date";
  try {
    displayDate = date ? new Date(date).toLocaleString() : "Unknown date";
  } catch {
    displayDate = "Unknown date";
  }
  return (
    <li>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="news-link"
      >
        <strong className="news-title">{title}</strong>
      </a>
      <p style={{ margin: "0.5em 0", fontSize: "0.9em" }}>{truncatedSummary}</p>
      <small className="news-date">{displayDate}</small>
    </li>
  );
}

export default NewsItem;

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./MovieDetail.css";

const API_URL = "http://www.omdbapi.com?apikey=71ff678a";

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}&i=${id}&plot=full`)
      .then((res) => res.json())
      .then((data) => setMovie(data));
  }, [id]);

  if (!movie) return <div className="movie-detail">Loading...</div>;

  return (
    <div
      className="movie-detail"
      style={{
        backgroundImage: `url(${movie.Poster})`,
      }}
    >
      <div className="movie-detail-overlay">
        <Link to="/" className="back-btn">← Back</Link>
        <div className="movie-detail-content">
          <img src={movie.Poster} alt={movie.Title} />
          <div className="info">
            <h1>{movie.Title}</h1>
            <p><strong>Released:</strong> {movie.Released}</p>
            <p><strong>Genre:</strong> {movie.Genre}</p>
            <p><strong>Rating:</strong> ⭐ {movie.imdbRating}</p>
            <p><strong>Plot:</strong> {movie.Plot}</p>
            <p><strong>Actors:</strong> {movie.Actors}</p>
            <p><strong>Director:</strong> {movie.Director}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

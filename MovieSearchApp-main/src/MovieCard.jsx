import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();

  return (
    <div className="movie" onClick={() => navigate(`/movie/${movie.imdbID}`)}>
      <button
        className="favorite-button"
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(movie);
        }}
      >
        {isFavorite ? <FaHeart style={{ color: "red" }} /> : <FaRegHeart />}
      </button>

      <div><p>{movie.Year}</p></div>
      <div>
        <img
          src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/400"}
          alt={movie.Title}
        />
      </div>
      <div>
        <span>{movie.Type}</span>
        <h3>{movie.Title}</h3>
      </div>
    </div>
  );
};

export default MovieCard;

import { useState, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";
import './App.css';
import SearchIcon from "./search.svg";
import MovieCard from "./MovieCard";
import { FaFilter } from "react-icons/fa";

const API_URL = "http://www.omdbapi.com?apikey=71ff678a";

function App() {
  const [movies, setMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState(() => {
    try {
      const stored = localStorage.getItem("favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [activeGenre, setActiveGenre] = useState("");
  const [showGenres, setShowGenres] = useState(false);
  const [activeType, setActiveType] = useState("");
  const [showTypes, setShowTypes] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const searchMovies = async (query) => {
    if (!query.trim()) return;
    try {
      const res = await fetch(`${API_URL}&s=${query}`);
      const data = await res.json();
      setMovies(data.Search || []);
    } catch (err) {
      console.error("Fetch failed:", err);
    }
  };

  const debouncedSearch = useCallback(
    debounce((query) => {
      setActiveGenre("");
      setActiveType("");
      searchMovies(query);
    }, 600),
    []
  );

  useEffect(() => {
    const trendingTitles = ["Oppenheimer", "John Wick", "Dune"];
    const randomTitle = trendingTitles[Math.floor(Math.random() * trendingTitles.length)];
    searchMovies(randomTitle);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    if (searchTerm.trim().length > 2) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm, debouncedSearch]);

  const toggleFavorite = (movie) => {
    setFavorites((prev) => {
      const exists = prev.find((m) => m.imdbID === movie.imdbID);
      return exists
        ? prev.filter((m) => m.imdbID !== movie.imdbID)
        : [...prev, movie];
    });
  };

  return (
    <div className={`app ${searchFocused ? "glow-border" : ""}`}>
      <div className="background-blur" />
      <div className="app-content">
        <h1>MOVIE VILLA</h1>

        {/* Search Bar */}
        <div className="search">
          <input
            placeholder="Search for movies"
            value={searchTerm}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <img
            src={SearchIcon}
            alt="search"
            style={{ opacity: 0.3, pointerEvents: "none" }}
          />
        </div>

        {/* Genre Toggle */}
        <button className="toggle-genre-btn" onClick={() => setShowGenres(!showGenres)}>
          <FaFilter style={{ marginRight: "8px" }} />
          {showGenres ? "Hide Genres" : "Show Genres"}
        </button>

        {/* Type Toggle */}
        <button className="toggle-type-btn" onClick={() => setShowTypes(!showTypes)}>
          <FaFilter style={{ marginRight: "8px" }} />
          {showTypes ? "Hide Types" : "Show Types"}
        </button>

        {/* Genres List */}
        {showGenres && (
          <div className="genres-floating">
            <h3>🎭 GENRES </h3>
            <ul className="genres-list">
              {["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Romance", "Thriller"].map((genre) => (
                <li
                  key={genre}
                  onClick={() => {
                    setActiveGenre(genre);
                    setActiveType("");
                    searchMovies(genre);
                  }}
                  className={activeGenre === genre ? "active-genre" : ""}
                >
                  {genre}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Types List */}
        {showTypes && (
          <div className="types-floating">
            <h3>🌍 FILTER </h3>6
            <ul className="types-list">
              {["Hollywood", "Bollywood", "Tollywood", "Anime", "Korean"].map((type) => (
                <li
                  key={type}
                  onClick={() => {
                    setActiveType(type);
                    setActiveGenre("");
                    searchMovies(type);
                  }}
                  className={activeType === type ? "active-type" : ""}
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Favorites */}
        <div className="favorites-floating">
          <h3>❤️ Favorites</h3>
          <div className="favorites-list">
            {favorites.map((fav) => (
              <img key={fav.imdbID} src={fav.Poster} alt={fav.Title} />
            ))}
          </div>
        </div>

        <h2 style={{ color: "#f9d3b4", marginTop: "20px" }}>
          🎬 {activeGenre
            ? `Genre: ${activeGenre}`
            : activeType
            ? `Type: ${activeType}`
            : "Recent Popular Movies"}
        </h2>

        {/* Movie Results */}
        {movies?.length > 0 ? (
          <div className="container">
            {movies.map((movie) => (
              <MovieCard
                key={movie.imdbID}
                movie={movie}
                isFavorite={favorites.some((f) => f.imdbID === movie.imdbID)}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        ) : (
          <div className="empty">
            <h2>No Movies Found</h2>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

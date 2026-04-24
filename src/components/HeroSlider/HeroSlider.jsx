import React, { useState, useEffect } from 'react';
import './HeroSlider.css';
import steamApi from '../../services/steamApi';
import { mapSteamGameToUI } from '../../services/dataMapper';
import { Link } from 'react-router-dom';

const HeroSlider = () => {
  const [games, setGames] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await steamApi.getFeatured();
        const featuredGames = (data.featured_win || []).slice(0, 6).map(mapSteamGameToUI);
        setGames(featuredGames);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured games:', error);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  useEffect(() => {
    if (games.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === games.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [games.length]);

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
  };

  if (loading) return <div className="hero-slider-container marg loading">Loading...</div>;
  if (games.length === 0) return null;

  return (
    <div className="hero-slider-container marg">
      {/* Main Slider */}
      <div className="hero-main-slider">
        <div className="carousel-inner">
          {games.map((game, index) => (
            <div
              key={game.id}
              className={`carousel-item ${index === activeIndex ? 'active' : ''}`}
            >
              <Link to={`/game/${game.id}`}>
                <img src={game.mainImage} className="d-block w-100" alt={game.name} />
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="hero-game-thumbnails">
        <ul>
          {games.map((game, index) => (
            <li
              key={game.id}
              onClick={() => handleThumbnailClick(index)}
              className={index === activeIndex ? 'active-thumbnail' : ''}
            >
              <div className="game-thumbnail">
                <span className="game-name">{game.name}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeroSlider;

import React, { useState, useEffect } from 'react';
import './FeaturedGameCard.css';
import steamApi from '../../services/steamApi';
import { mapSteamGameToUI } from '../../services/dataMapper';

const GamesWithAchievements = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await steamApi.getFeaturedCategories();
        // Use top_sellers or new_releases for variety
        const topSellers = (data.top_sellers?.items || []).slice(0, 3).map(mapSteamGameToUI);
        setGames(topSellers);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching top sellers:', error);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <div className="games-section loading">Loading...</div>;
  if (games.length === 0) return null;

  return (
    <div className="games-section">
      <div className="games-container">
        {/* Grid for desktop/tablet */}
        <div className="games-grid">
          {games.map((game, index) => (
            <div className="game-card transparent-card" key={index}>
              <img src={game.image} alt={game.name} className="game-image" />
              <div className="game-content">
                <h3 className="game-title">{game.name}</h3>
                <p className="game-description">{game.description}</p>
                <div className="game-price">{game.discountedPrice}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Slider for mobile */}
        <div className="slider-container">
          {games.map((game, index) => (
            <div className="game-card transparent-card slider-card" key={index}>
              <img src={game.image} alt={game.name} className="game-image" />
              <div className="game-content">
                <h3 className="game-title">{game.name}</h3>
                <p className="game-description">{game.description}</p>
                <div className="game-price">{game.discountedPrice}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesWithAchievements;

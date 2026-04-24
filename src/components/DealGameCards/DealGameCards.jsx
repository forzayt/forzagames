import React, { useState, useEffect } from 'react';
import './DealGameCards.css';
import steamApi from '../../services/steamApi';
import { mapSteamGameToUI } from '../../services/dataMapper';

const GamesWithAchievements = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await steamApi.getFeaturedCategories();
        // Extract games from spotlight categories
        const spotlightGames = [];
        Object.keys(data).forEach(key => {
          if (data[key].id === 'cat_spotlight' || data[key].id === 'cat_dailydeal') {
            data[key].items.forEach(item => {
              spotlightGames.push(mapSteamGameToUI(item));
            });
          }
        });
        setGames(spotlightGames.slice(0, 3));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching deal games:', error);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

  if (loading) return <div className="deal-section loading">Loading...</div>;
  if (games.length === 0) return null;

  return (
    <div className="deal-section">
      <div className="deal-container">
        <div className="deal-grid">
          {games.map((game, idx) => (
            <div className="deal-card transparent-card" key={idx}>
              <div className="deal-image-wrapper">
                <img src={game.image} alt={game.name} className="deal-image" />
              </div>
              <div className="deal-content">
                <h3 className="deal-title">{game.name}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="deal-slider">
          {games.map((game, idx) => (
            <div className="deal-card transparent-card deal-slider-card" key={idx}>
              <div className="deal-image-wrapper">
                <img src={game.image} alt={game.name} className="deal-image" />
              </div>
              <div className="deal-content">
                <h3 className="deal-title">{game.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GamesWithAchievements;

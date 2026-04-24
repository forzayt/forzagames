import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import steamApi from "../../services/steamApi";
import { mapSteamGameToUI } from "../../services/dataMapper";
import { useNavigate } from "react-router-dom";
import "./GameCardsSlider.css";

const GameCard = ({ game, onClick }) => (
  <div onClick={onClick} className="game-card" style={{ cursor: 'pointer' }}>
    <div className="image-container">
      <img src={game.image} alt={game.name} className="game-image" />
    </div>
    <p className="category">{game.category}</p>
    <h3 className="title">{game.name}</h3>
  </div>
);

const CARD_WIDTH = 180;

const GameSlider = ({ title = "Special Offers", category = "specials" }) => {
  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await steamApi.getFeaturedCategories();
        let items = [];
        
        if (category === "specials") {
          items = data.specials?.items || [];
        } else if (category === "top_sellers") {
          items = data.top_sellers?.items || [];
        } else if (category === "new_releases") {
          items = data.new_releases?.items || [];
        } else if (category === "coming_soon") {
          items = data.coming_soon?.items || [];
        } else {
          // Fallback to specials if category not found
           items = data.specials?.items || [];
          }
  
          const mappedGames = items.slice(0, 30).map(mapSteamGameToUI);
          
          // Remove duplicates based on ID to avoid React key warnings
          const uniqueGames = [];
          const seenIds = new Set();
          
          mappedGames.forEach(game => {
            if (!seenIds.has(game.id)) {
              seenIds.add(game.id);
              uniqueGames.push(game);
            }
          });

          setGames(uniqueGames);
          setLoading(false);
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
        setLoading(false);
      }
    };
    fetchGames();
  }, [category]);

  useEffect(() => {
    function updateItemsPerView() {
      const w = window.innerWidth;
      if (w < 480) setItemsPerView(1);
      else if (w < 768) setItemsPerView(2);
      else if (w < 1024) setItemsPerView(4);
      else setItemsPerView(6);
    }
    updateItemsPerView();
    window.addEventListener("resize", updateItemsPerView);
    return () => window.removeEventListener("resize", updateItemsPerView);
  }, []);

  const maxIndex = Math.max(0, games.length - itemsPerView);
  const step = itemsPerView < 4 ? 1 : itemsPerView;

  const goPrevious = () =>
    setCurrentIndex((prev) => Math.max(prev - step, 0));

  const goNext = () =>
    setCurrentIndex((prev) => Math.min(prev + step, maxIndex));

  const handlers = useSwipeable({
    onSwipedLeft: () => goNext(),
    onSwipedRight: () => goPrevious(),
    trackMouse: true,
  });

  if (loading) return <div className="game-slider-container loading">Loading...</div>;
  if (games.length === 0) return null;

  return (
    <div className="game-slider-container" {...handlers}>
      <div className="slider-header">
        <h2 className="slider-title">{title}</h2>
        <div className="nav-buttons">
          <button onClick={goPrevious} disabled={currentIndex === 0} aria-label="Previous">
            <ChevronLeft />
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next"
          >
            <ChevronRight />
          </button>
        </div>
      </div>

      <div className="slider-window">
        <div
          className="cards-wrapper"
          style={{
            width: `${games.length * CARD_WIDTH}px`,
            transform: `translateX(-${currentIndex * CARD_WIDTH}px)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="card-wrapper"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              <GameCard game={game} onClick={() => navigate(`/game/${game.id}`)} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSlider;

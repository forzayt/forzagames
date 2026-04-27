import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import steamApi from "../../services/steamApi";
import { useNavigate } from "react-router-dom";
import "./GameCardsSlider.css";

const GameCard = ({ game, onClick, index }) => (
  <div 
    onClick={onClick} 
    className="game-card" 
    style={{ 
      cursor: 'pointer',
      animationDelay: `${index * 0.1}s`
    }}
  >
    <div className="image-container">
      <img src={game.image} alt={game.name} className="game-image" />
    </div>
    <p className="category">{game.category}</p>
    <h3 className="title">{game.name}</h3>
  </div>
);

const GameCardSkeleton = () => (
  <div className="skeleton-card">
    <div className="skeleton-image" />
    <div className="skeleton-text" />
    <div className="skeleton-title" />
  </div>
);

const CARD_WIDTH = 180;

const GameSlider = ({ title = "Special Offers", category = "specials", gameIds = [] }) => {
  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        setLoading(true);
        if (gameIds && gameIds.length > 0) {
          // Initialize with nulls to show skeletons
          setGames(new Array(gameIds.length).fill(null));
          
          // Fetch games one by one to show progressive loading
          for (let i = 0; i < gameIds.length; i++) {
            const id = gameIds[i];
            const gameData = await steamApi.getGameDetails(id);
            if (gameData) {
              setGames(prev => {
                const newGames = [...prev];
                newGames[i] = gameData;
                return newGames;
              });
            }
          }
        } else {
          const data = await steamApi.getFeaturedCategories();
          const items = data[category]?.items || [];
          setGames(items);
        }
        setLoading(false);
      } catch (error) {
        console.error(`Error fetching games for ${title}:`, error);
        setLoading(false);
      }
    };
    fetchGames();
  }, [category, gameIds, title]);

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

  if (games.length === 0 && !loading) return null;

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
          {games.map((game, index) => (
            <div
              key={game ? game.id : `skeleton-${index}`}
              className="card-wrapper"
              style={{ width: `${CARD_WIDTH}px` }}
            >
              {game ? (
                <GameCard 
                  game={game} 
                  onClick={() => navigate(`/game/${game.id}`)} 
                  index={index}
                />
              ) : (
                <GameCardSkeleton />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSlider;

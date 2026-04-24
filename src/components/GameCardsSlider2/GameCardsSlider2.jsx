import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSwipeable } from "react-swipeable";
import steamApi from "../../services/steamApi";
import { mapSteamGameToUI } from "../../services/dataMapper";
import "./GameCardsSlider2.css";

const GameCard = ({ game }) => (
  <div className="game-card">
    <div className="image-container">
      <img src={game.image} alt={game.name} className="game-image" />
    </div>
    <p className="category">{game.category}</p>
    <h3 className="title">{game.name}</h3>
    <div className="pricing">
      {game.discount && <span className="discount-badge">{game.discount}</span>}
      {game.originalPrice && <span className="original-price">{game.originalPrice}</span>}
      <span className="sale-price">{game.discountedPrice}</span>
    </div>
  </div>
);

const CARD_WIDTH = 180;

const GameSlider = () => {
  const [games, setGames] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const data = await steamApi.getFeaturedCategories();
        const newReleases = (data.new_releases?.items || []).slice(0, 12).map(mapSteamGameToUI);
        setGames(newReleases);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching new releases:', error);
        setLoading(false);
      }
    };
    fetchGames();
  }, []);

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

  const step = itemsPerView < 4 ? 1 : itemsPerView;
  const maxIndex = Math.max(0, games.length - itemsPerView);

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
        <h2 className="slider-title">New Releases</h2>
        <div className="nav-buttons">
          <button
            onClick={goPrevious}
            disabled={currentIndex === 0}
            aria-label="Previous"
          >
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
              <GameCard game={game} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSlider;

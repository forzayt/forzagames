import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Monitor, X, ArrowUp, Star, Calendar } from "lucide-react";
import "./GameDetails.css";

import steamApi from "../services/steamApi";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const data = await steamApi.getGameDetails(id);
        if (!data) {
          throw new Error("Failed to fetch game details");
        }
        setGame(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameDetails();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="game-details-loading">
        <div className="spinner"></div>
        <p>Loading Game Details...</p>
      </div>
    );
  }

  if (error || !game) {
    return (
      <div className="game-details-error">
        <h2>Oops! </h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="back-btn">Go Back Home</button>
      </div>
    );
  }

  return (
    <div className="game-details-container">
      {/* Hero Section */}
      <div 
        className="game-details-hero" 
        style={{ backgroundImage: `url(${game.background_image_additional || game.background_image})` }}
      >
        <div className="hero-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} /> Back
          </button>
          <div className="hero-content">
            <img src={game.background_image} alt={game.name} className="game-cover" />
            <div className="hero-info">
              <div className="badges">
                {game.metacritic && <span className="metascore">Metascore: {game.metacritic}</span>}
                <span className="rating"><Star size={16} fill="currentColor" /> {game.rating}</span>
              </div>
              <h1>{game.name}</h1>
              <div className="genres">
                {game.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
              </div>
              <p className="short-desc">{game.description_raw?.slice(0, 300)}...</p>
              
              <div className="meta-compact">
                <span><Calendar size={18} /> {game.released}</span>
                <span><Monitor size={18} /> {game.platforms?.map(p => p.platform.name).slice(0, 3).join(', ')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="game-details-content">
        {/* About Section */}
        <section className="detail-section">
          <h2>About The Game</h2>
          <div className="about-text" dangerouslySetInnerHTML={{ __html: game.description }}></div>
        </section>

        {/* Screenshots Section */}
        {game.screenshots && game.screenshots.length > 0 && (
          <section className="detail-section">
            <h2>Screenshots</h2>
            <div className="screenshots-grid">
              {game.screenshots.slice(0, 8).map(ss => (
                <img 
                  key={ss.id} 
                  src={ss.image} 
                  alt="Screenshot" 
                  className="screenshot" 
                  onClick={() => setSelectedScreenshot(ss.image)}
                />
              ))}
            </div>
          </section>
        )}

        {/* System Requirements (if available) */}
        {game.platforms?.find(p => p.platform.name === "PC")?.requirements && (
          <section className="detail-section sys-req">
            <h2>System Requirements (PC)</h2>
            <div className="req-grid">
              <div className="req-block">
                <div dangerouslySetInnerHTML={{ __html: game.platforms.find(p => p.platform.name === "PC").requirements.minimum }}></div>
              </div>
              {game.platforms.find(p => p.platform.name === "PC").requirements.recommended && (
                <div className="req-block">
                  <div dangerouslySetInnerHTML={{ __html: game.platforms.find(p => p.platform.name === "PC").requirements.recommended }}></div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Additional Info */}
        <section className="detail-section meta-info">
          <h2>Game Details</h2>
          <div className="meta-grid">
            {game.developers && game.developers.length > 0 && (
              <div className="meta-item"><strong>Developer:</strong> {game.developers.map(d => d.name).join(", ")}</div>
            )}
            {game.publishers && game.publishers.length > 0 && (
              <div className="meta-item"><strong>Publisher:</strong> {game.publishers.map(p => p.name).join(", ")}</div>
            )}
            {game.tags && game.tags.length > 0 && (
              <div className="features-container">
                <strong>Tags:</strong>
                <div className="features-list">
                  {game.tags.slice(0, 15).map(t => (
                    <span key={t.id} className="feature-badge">{t.name}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Download Links Section */}
        {game.download_links && game.download_links.length > 0 && (
          <section className="detail-section download-section">
            <h2>Download Repacks</h2>
            <div className="download-grid">
              {game.download_links.map((link, index) => (
                <a 
                  key={index} 
                  href={link.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="download-card"
                >
                  <div className="download-icon">
                    <Download size={24} />
                  </div>
                  <div className="download-info">
                    <span className="hoster-name">{link.hoster || 'Mirror ' + (index + 1)}</span>
                    <span className="download-size">{link.size || 'N/A'}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedScreenshot && (
        <div className="screenshot-modal" onClick={() => setSelectedScreenshot(null)}>
          <div className="modal-content">
            <button className="close-modal" onClick={() => setSelectedScreenshot(null)}>
              <X size={32} />
            </button>
            <img src={selectedScreenshot} alt="Full size screenshot" className="modal-image" />
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button 
          className="scroll-top-btn" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default GameDetails;

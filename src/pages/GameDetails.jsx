import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Monitor, X, ArrowUp, Star, Calendar, PlayCircle, Globe, Info } from "lucide-react";
import "./GameDetails.css";

import steamApi from "../services/steamApi";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const data = await steamApi.getGameDetails(id);
        if (!data) throw new Error("Failed to fetch game details");
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
            <ChevronLeft size={20} /> Back
          </button>
          
          <div className="hero-content">
            <div className="hero-poster-wrapper">
              <img src={game.image || game.mainImage} alt={game.name} className="game-cover" />
            </div>
            
            <div className="hero-info">
              <div className="badges">
                {game.metacritic && <span className="metascore" title="Metacritic Score">Score: {game.metacritic}</span>}
                {game.rating && game.rating !== 'N/A' && <span className="rating"><Star size={16} fill="currentColor" /> {game.rating}</span>}
              </div>
              
              <h1>{game.name}</h1>
              
              <div className="genres">
                {game.genres?.map(g => <span key={g.id} className="genre-tag">{g.name}</span>)}
              </div>
              
              <p className="short-desc" dangerouslySetInnerHTML={{ __html: game.description_raw }}></p>
              
              <div className="meta-compact">
                <span><Calendar size={18} /> {game.released}</span>
                <span><Monitor size={18} /> {game.platforms?.map(p => p.platform.name).slice(0, 3).join(', ')}</span>
                {game.developers && game.developers.length > 0 && (
                  <span><Info size={18} /> {game.developers[0].name}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="game-details-content">
        
        <div className="content-main-grid">
          <div className="content-left">
            {/* About Section */}
            <section className="detail-section">
              <h2>About The Game</h2>
              <div className="about-text" dangerouslySetInnerHTML={{ __html: game.about_the_game || game.description }}></div>
            </section>

            {/* System Requirements */}
            {game.pc_requirements && (
              <section className="detail-section sys-req">
                <h2>System Requirements (PC)</h2>
                <div className="req-grid">
                  {game.pc_requirements.minimum && (
                    <div className="req-block min-req">
                      <div dangerouslySetInnerHTML={{ __html: game.pc_requirements.minimum }}></div>
                    </div>
                  )}
                  {game.pc_requirements.recommended && (
                    <div className="req-block rec-req">
                      <div dangerouslySetInnerHTML={{ __html: game.pc_requirements.recommended }}></div>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
          
          {/* Download links section hidden per user request
          <div className="content-right">
            {game.download_links && game.download_links.length > 0 && (
              <section className="detail-section download-section">
                <h2>Download Repacks</h2>
                <div className="download-list">
                  {game.download_links.map((link, index) => (
                    <a 
                      key={index} 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="download-card"
                    >
                      <div className="download-icon">
                        <Download size={20} />
                      </div>
                      <div className="download-info">
                        <span className="hoster-name">{link.hoster || 'Mirror ' + (index + 1)}</span>
                        {link.size && <span className="download-size">{link.size}</span>}
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
          */}
        </div>

        {/* Additional Info Sidebar - Now Full Width */}
        <section className="detail-section meta-info-sidebar full-width-meta">
          <h2>Game Details</h2>
          <div className="meta-list">
            {game.developers && game.developers.length > 0 && (
              <div className="meta-row">
                <span className="meta-label">Developer</span>
                <span className="meta-val">{game.developers.map(d => d.name).join(", ")}</span>
              </div>
            )}
            {game.publishers && game.publishers.length > 0 && (
              <div className="meta-row">
                <span className="meta-label">Publisher</span>
                <span className="meta-val">{game.publishers.map(p => p.name).join(", ")}</span>
              </div>
            )}
            {game.released && (
              <div className="meta-row">
                <span className="meta-label">Release Date</span>
                <span className="meta-val">{game.released}</span>
              </div>
            )}
          </div>

          {game.tags && game.tags.length > 0 && (
            <div className="features-container">
              <span className="meta-label">Features & Tags</span>
              <div className="features-list">
                {game.tags.slice(0, 12).map(t => (
                  <span key={t.id} className="feature-badge">{t.name}</span>
                ))}
              </div>
            </div>
          )}
          
          {game.supported_languages && (
            <div className="languages-container">
              <span className="meta-label"><Globe size={16} /> Supported Languages</span>
              <div className="lang-text" dangerouslySetInnerHTML={{ __html: game.supported_languages }}></div>
            </div>
          )}
        </section>

        {/* Media Section: Trailers & Screenshots */}
        {(game.movies?.length > 0 || game.screenshots?.length > 0) && (
          <section className="detail-section media-section">
            <h2>Media & Screenshots</h2>
            <div className="media-scroller">
              {/* Trailers */}
              {game.movies?.map(movie => (
                <div 
                  key={movie.id} 
                  className="media-item video-item"
                  onClick={() => window.open(movie.hls, '_blank')}
                  title="Open Video Stream"
                >
                  <img src={movie.thumbnail} alt={movie.name} />
                  <div className="play-overlay">
                    <PlayCircle size={48} />
                    <span>Trailer</span>
                  </div>
                </div>
              ))}
              
              {/* Screenshots */}
              {game.screenshots?.slice(0, 15).map(ss => (
                <div 
                  key={ss.id} 
                  className="media-item"
                  onClick={() => setSelectedMedia(ss.image)}
                >
                  <img src={ss.image} alt="Gameplay Screenshot" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedMedia && (
        <div className="media-modal" onClick={() => setSelectedMedia(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedMedia(null)}>
              <X size={32} />
            </button>
            <img src={selectedMedia} alt="Full size media" className="modal-image" />
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

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Monitor, HardDrive, Cpu, Layers } from "lucide-react";
import "./GameDetails.css";

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://fitgirlapi-qhc5.onrender.com/api/v1/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch game details");
        }
        const data = await response.json();
        setGame(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchGameDetails();
    // Scroll to top on mount
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
        <h2>Oops! Something went wrong.</h2>
        <p>{error}</p>
        <button onClick={() => navigate("/")} className="back-btn">Go Back Home</button>
      </div>
    );
  }

  const { steam_data: steam, download_data: downloads } = game;
  
  // Group download links by category
  const linksByCategory = downloads?.parsed_links?.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [];
    acc[link.category].push(link.url);
    return acc;
  }, {}) || {};

  return (
    <div className="game-details-container">
      {/* Hero Section */}
      <div 
        className="game-details-hero" 
        style={{ backgroundImage: `url(${steam.screenshots?.[0]?.path_full || steam.header_image})` }}
      >
        <div className="hero-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={24} /> Back
          </button>
          <div className="hero-content">
            <img src={steam.header_image} alt={steam.name} className="game-cover" />
            <div className="hero-info">
              <h1>{steam.name}</h1>
              <div className="genres">
                {steam.genres?.map(g => <span key={g.id} className="genre-tag">{g.description}</span>)}
              </div>
              <p className="short-desc" dangerouslySetInnerHTML={{ __html: steam.short_description }}></p>
            </div>
          </div>
        </div>
      </div>

      <div className="game-details-content">
        {/* About Section */}
        <section className="detail-section">
          <h2>About The Game</h2>
          <div className="about-text" dangerouslySetInnerHTML={{ __html: steam.about_the_game }}></div>
        </section>

        {/* Trailer Section */}
        {steam.movies && steam.movies.length > 0 && (
          <section className="detail-section trailer-section">
            <h2>Trailer</h2>
            <div className="video-container">
              <video 
                controls 
                poster={steam.movies[0].thumbnail}
                className="game-trailer"
              >
                <source src={steam.movies[0].webm?.max || steam.movies[0].mp4?.max} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </section>
        )}

        {/* Screenshots Section */}
        {steam.screenshots && steam.screenshots.length > 0 && (
          <section className="detail-section">
            <h2>Screenshots</h2>
            <div className="screenshots-grid">
              {steam.screenshots.slice(0, 8).map(ss => (
                <img key={ss.id} src={ss.path_full} alt="Screenshot" className="screenshot" />
              ))}
            </div>
          </section>
        )}

        {/* Download Links Section */}
        {Object.keys(linksByCategory).length > 0 && (
          <section className="detail-section downloads-section">
            <h2><Download size={24} /> Download Links</h2>
            <div className="download-groups">
              {Object.entries(linksByCategory).map(([category, urls]) => (
                <div key={category} className="download-group">
                  <h3>{category}</h3>
                  <div className="links-list">
                    {urls.map((url, idx) => (
                      <a key={idx} href={url} target="_blank" rel="noopener noreferrer" className="download-link">
                        {urls.length === 1 ? 'Download' : `Part ${idx + 1}`}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* System Requirements */}
        {steam.pc_requirements && (
          <section className="detail-section sys-req">
            <h2>System Requirements</h2>
            <div className="req-grid">
              <div className="req-block">
                <div dangerouslySetInnerHTML={{ __html: steam.pc_requirements.minimum }}></div>
              </div>
              {steam.pc_requirements.recommended && (
                <div className="req-block">
                  <div dangerouslySetInnerHTML={{ __html: steam.pc_requirements.recommended }}></div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Additional Info */}
        <section className="detail-section meta-info">
          <h2>Game Details</h2>
          <div className="meta-grid">
            {steam.developers && (
              <div className="meta-item"><strong>Developer:</strong> {steam.developers.join(", ")}</div>
            )}
            {steam.publishers && (
              <div className="meta-item"><strong>Publisher:</strong> {steam.publishers.join(", ")}</div>
            )}
            {steam.metacritic && (
              <div className="meta-item">
                <strong>Metacritic Score:</strong> 
                <span className="metascore">{steam.metacritic.score}</span>
              </div>
            )}
          </div>
          {steam.categories && (
            <div className="features-container">
              <strong>Features:</strong>
              <div className="features-list">
                {steam.categories.map(c => (
                  <span key={c.id} className="feature-badge">{c.description}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default GameDetails;

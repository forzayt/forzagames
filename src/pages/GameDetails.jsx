import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Download, Monitor, X, ArrowUp, Star, Calendar, PlayCircle, Globe, Info } from "lucide-react";
import "./GameDetails.css";

import steamApi from "../services/steamApi";

const DownloadPopup = React.memo(({ onClose, groupedLinks }) => {
  const [phase, setPhase] = useState("connecting");
  const [progress, setProgress] = useState(0);
  const [speeds, setSpeeds] = useState({ download: 0, upload: 0 });
  const [selectedHoster, setSelectedHoster] = useState(null);
  const [currentPart, setCurrentPart] = useState(0);
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    // Phase 1: Connecting (5 seconds)
    const connTimer = setTimeout(() => {
      setProgress(100);
    }, 100);

    const phaseTimer = setTimeout(() => {
      setPhase("speedtest");
    }, 5100);

    return () => {
      clearTimeout(connTimer);
      clearTimeout(phaseTimer);
    };
  }, []);

  useEffect(() => {
    if (phase !== "speedtest") return;

    const testDuration = 10000;
    const updateInterval = 200;
    let elapsed = 0;

    const testTimer = setInterval(() => {
      elapsed += updateInterval;
      setSpeeds({
        download: (Math.random() * 50 + 20).toFixed(1),
        upload: (Math.random() * 20 + 5).toFixed(1)
      });

      if (elapsed >= testDuration) {
        clearInterval(testTimer);
        setPhase("finished");
        
        const ffKey = Object.keys(groupedLinks).find(k => k.toLowerCase() === 'fuckingfast');
        if (ffKey) {
          setSelectedHoster(ffKey);
        } else if (Object.keys(groupedLinks).length > 0) {
          setSelectedHoster(Object.keys(groupedLinks)[0]);
        }
      }
    }, updateInterval);

    return () => clearInterval(testTimer);
  }, [phase, groupedLinks]);

  const handleStartDownload = async () => {
    if (!selectedHoster || !groupedLinks[selectedHoster]) return;
    
    setPhase("downloading");
    const links = groupedLinks[selectedHoster];
    const totalParts = links.length;

    for (let i = 0; i < totalParts; i++) {
      setCurrentPart(i + 1);
      // Simulate progress for each part
      for (let p = 0; p <= 100; p += 10) {
        setDownloadProgress(Math.round(((i * 100) + p) / totalParts));
        await new Promise(r => setTimeout(r, 150));
      }
      // Open the actual link
      window.open(links[i].url, '_blank');
      // Small delay between opening tabs to avoid browser blocking
      await new Promise(r => setTimeout(r, 800));
    }
    
    setDownloadProgress(100);
    setTimeout(() => {
      setPhase("completed");
    }, 1000);
  };

  const totalSize = useMemo(() => {
    if (!selectedHoster || !groupedLinks[selectedHoster]) return null;
    // Try to sum up sizes if they exist and are in consistent format (e.g. "1.2 GB")
    // For now just check if they exist
    return groupedLinks[selectedHoster][0]?.size ? "Multiple Parts" : null;
  }, [selectedHoster, groupedLinks]);

  return (
    <div className="download-popup-overlay" onClick={onClose}>
      <div className="download-popup-content" onClick={e => e.stopPropagation()}>
        <button className="popup-close-btn" onClick={onClose}><X size={20} /></button>
        
        {phase === "connecting" && (
          <>
            <div className="popup-header">
              <Download className="download-icon-anim" size={32} />
              <h3>Connecting to Servers</h3>
            </div>
            <p className="server-status">Establishing secure connection to FitGirl Repack servers...</p>
            
            <div className="progress-container">
              <div className="progress-bar-wrapper">
                <div 
                  className="progress-bar-fill animated" 
                  style={{ width: `${progress}%` }}
                >
                  <div className="progress-shimmer"></div>
                </div>
              </div>
              <div className="progress-stats">
                <span>{progress === 100 ? "100%" : "Connecting..."}</span>
                <span>{progress < 100 ? "Fetching manifest..." : "Connected!"}</span>
              </div>
            </div>
          </>
        )}

        {phase === "speedtest" && (
          <>
            <div className="popup-header">
              <Globe className="download-icon-anim" size={32} />
              <h3>Optimizing Download</h3>
            </div>
            <p className="server-status">Testing your connection for maximum throughput...</p>
            
            <div className="speed-test-container">
              <div className="speed-card">
                <span className="speed-label">DOWNLOAD</span>
                <span className="speed-value">{speeds.download}</span>
                <span className="speed-unit">Mbps</span>
                <div className="speed-bar download-bar">
                  <div className="speed-bar-fill" style={{ width: `${(speeds.download / 70) * 100}%` }}></div>
                </div>
              </div>
              
              <div className="speed-card">
                <span className="speed-label">UPLOAD</span>
                <span className="speed-value">{speeds.upload}</span>
                <span className="speed-unit">Mbps</span>
                <div className="speed-bar upload-bar">
                  <div className="speed-bar-fill" style={{ width: `${(speeds.upload / 25) * 100}%` }}></div>
                </div>
              </div>
            </div>
          </>
        )}

        {phase === "finished" && (
          <div className="selection-phase-content">
            <div className="popup-header">
              <div className="success-icon">✓</div>
              <h3>Download Ready</h3>
            </div>
            
            <div className="download-summary-card">
              <div className="summary-item">
                <span className="summary-label">Selected Server</span>
                <span className="summary-value highlight">{selectedHoster}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total Parts</span>
                <span className="summary-value">{groupedLinks[selectedHoster]?.length || 0} Parts</span>
              </div>
              {groupedLinks[selectedHoster]?.[0]?.size && (
                <div className="summary-item">
                  <span className="summary-label">Est. Size</span>
                  <span className="summary-value">{groupedLinks[selectedHoster][0].size} per part</span>
                </div>
              )}
            </div>

            <button className="main-download-btn" onClick={handleStartDownload}>
              <Download size={20} /> Start Download Now
            </button>
            
            <p className="download-hint">Parts will be queued sequentially in your browser</p>
          </div>
        )}

        {phase === "downloading" && (
          <div className="downloading-phase-content">
            <div className="popup-header">
              <div className="download-icon-anim active">
                <Download size={32} />
              </div>
              <h3>Downloading Parts</h3>
            </div>
            
            <div className="download-status-info">
              <span className="part-counter">Part {currentPart} of {groupedLinks[selectedHoster]?.length}</span>
              <span className="progress-percent">{downloadProgress}%</span>
            </div>

            <div className="progress-container">
              <div className="progress-bar-wrapper large">
                <div 
                  className="progress-bar-fill animated" 
                  style={{ width: `${downloadProgress}%` }}
                >
                  <div className="progress-shimmer"></div>
                </div>
              </div>
            </div>
            
            <p className="server-status">Please do not close this popup until all parts are queued.</p>
          </div>
        )}

        {phase === "completed" && (
          <div className="completed-phase-content">
            <div className="popup-header">
              <div className="success-icon large">✓</div>
              <h3>All Parts Queued</h3>
            </div>
            <p className="server-status">All download parts have been sent to your browser. You can now close this window.</p>
            <button className="main-download-btn secondary" onClick={onClose}>
              Close Popup
            </button>
          </div>
        )}

        <div className="popup-footer">
          <span className="security-tag">Encrypted SSL Connection</span>
        </div>
      </div>
    </div>
  );
});

const GameDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showDownloadPopup, setShowDownloadPopup] = useState(false);

  // Group download links by hoster/category
  const groupedLinks = useMemo(() => {
    return game?.download_links?.reduce((acc, link) => {
      const hoster = link.hoster || 'Mirror';
      if (!acc[hoster]) acc[hoster] = [];
      acc[hoster].push(link);
      return acc;
    }, {}) || {};
  }, [game]);

  const handleDownloadClick = () => {
    setShowDownloadPopup(true);
  };

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
      {/* Sticky Back Button */}
      <button 
        className="back-btn-sticky" 
        onClick={() => window.history.length > 1 ? navigate(-1) : navigate("/")}
      >
        <ChevronLeft size={20} /> Back
      </button>

      {/* Hero Section */}
      <div 
        className="game-details-hero" 
        style={{ backgroundImage: `url(${game.background_image_additional || game.background_image})` }}
      >
        <div className="hero-overlay">
          {/* Back button moved out for stickiness */}
          
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

              <button className="hero-download-btn" onClick={handleDownloadClick}>
                <Download size={24} /> Download
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="game-details-content">
        {/* Media Section: Trailers & Screenshots moved up */}
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
          
          {/* Download links section hidden per user request */}
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

      {/* Download Gimmick Popup */}
      {showDownloadPopup && (
        <DownloadPopup 
          onClose={() => setShowDownloadPopup(false)} 
          groupedLinks={groupedLinks}
        />
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

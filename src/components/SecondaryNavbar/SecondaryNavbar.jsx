import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FiHeart, FiShoppingCart } from "react-icons/fi";
import steamApi from "../../services/steamApi";
import { mapSteamSearchToUI } from "../../services/dataMapper";
import "./SecondaryNavbar.css";

const SubNavbar = () => {
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredGames, setFilteredGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.trim()) {
        setLoading(true);
        try {
          const data = await steamApi.searchGames(query);
          const results = (data.items || []).slice(0, 8).map(mapSteamSearchToUI);
          setFilteredGames(results);
        } catch (error) {
          console.error('Search error:', error);
          setFilteredGames([]);
        } finally {
          setLoading(false);
        }
      } else {
        setFilteredGames([]);
      }
    }, 500);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  return (
    <>
      {/* Mobile Navbar */}
      <div className="main">
        <div className="left_icon">
          <BiSearch
            className="icon"
            onClick={() => setSearchOpen(prev => !prev)}
            aria-label="Toggle Search"
          />
        </div>

        <div className="right_wishlist_mobile">
          <FiShoppingCart className="wishlist_icon" aria-label="Cart" />
        </div>

        {isSearchOpen && (
          <input
            type="text"
            className="mobile_search_input"
            placeholder="Search Store..."
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        )}

        {isSearchOpen && query && (
          <div className="search_results">
            {loading ? (
              <div className="search_item">Searching...</div>
            ) : filteredGames.length ? (
              filteredGames.map(game => (
                <div 
                  key={game.id} 
                  className="search_item"
                  onClick={() => {
                    console.log("Navigating to game:", game.id);
                    if (game.id) {
                      navigate(`/game/${game.id}`);
                      setQuery("");
                      setSearchOpen(false);
                    }
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {game.image && <img src={game.image} alt="" className="search_thumb" />}
                  <span>{game.name}</span>
                </div>
              ))
            ) : (
              <div className="search_item">No results found</div>
            )}
          </div>
        )}
      </div>

      {/* Desktop Navbar */}
      <div className="main_desktop">
        <div className="left">
          <div className="search_box">
            <BiSearch />
            <input
              type="text"
              placeholder="Search Store"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <div className="search_results desktop">
                {loading ? (
                  <div className="search_item">Searching...</div>
                ) : filteredGames.length ? (
                  filteredGames.map(game => (
                    <div 
                      key={game.id} 
                      className="search_item"
                      onClick={() => {
                        console.log("Navigating to game:", game.id);
                        if (game.id) {
                          navigate(`/game/${game.id}`);
                          setQuery("");
                        }
                      }}
                      style={{ cursor: 'pointer' }}
                    >
                      {game.image && <img src={game.image} alt="" className="search_thumb" />}
                      <span>{game.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="search_item">No results found</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubNavbar;

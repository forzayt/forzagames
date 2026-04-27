import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart, FiSearch } from "react-icons/fi";
import steamApi from "../../services/steamApi";
import "./SecondaryNavbar.css";

const SubNavbar = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const dropdownRef = useRef(null);
  const searchTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (query.trim().length > 1) {
      setIsSearching(true);
      setShowDropdown(true);
      searchTimeout.current = setTimeout(async () => {
        const results = await steamApi.searchGames(query);
        setSearchResults(results.slice(0, 8)); // Limit to 8 results
        setIsSearching(false);
      }, 500);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
      setIsSearching(false);
    }
  };

  const handleResultClick = (gameId) => {
    navigate(`/game/${gameId}`);
    setShowDropdown(false);
    setSearchQuery("");
  };

  return (
    <>
      {/* Mobile Navbar */}
      <div className="main">
        <div className="left_icon" ref={dropdownRef}>
          <div className="search-container-mobile">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search store"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
            />
          </div>
          
          {showDropdown && isMobile && (
            <div className="search-dropdown mobile">
              {isSearching ? (
                <div className="search-status">Searching...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((game) => (
                  <div
                    key={game.id}
                    className="search-result-item"
                    onClick={() => handleResultClick(game.id)}
                  >
                    <img src={game.image} alt={game.name} />
                    <div className="result-info">
                      <span className="result-name">{game.name}</span>
                      <span className="result-category">{game.category}</span>
                    </div>
                  </div>
                ))
              ) : searchQuery.trim().length > 1 ? (
                <div className="search-status">No results found</div>
              ) : null}
            </div>
          )}
        </div>

        <div className="right_wishlist_mobile">
          <FiShoppingCart className="wishlist_icon" aria-label="Cart" />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="main_desktop">
        <div className="left" ref={dropdownRef}>
          <div className="search-container">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search store"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => searchQuery.trim().length > 1 && setShowDropdown(true)}
            />
            
            {showDropdown && (
              <div className="search-dropdown">
                {isSearching ? (
                  <div className="search-status">Searching...</div>
                ) : searchResults.length > 0 ? (
                  searchResults.map((game) => (
                    <div
                      key={game.id}
                      className="search-result-item"
                      onClick={() => handleResultClick(game.id)}
                    >
                      <img src={game.image} alt={game.name} />
                      <div className="result-info">
                        <span className="result-name">{game.name}</span>
                        <span className="result-category">{game.category}</span>
                      </div>
                    </div>
                  ))
                ) : searchQuery.trim().length > 1 ? (
                  <div className="search-status">No results found</div>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SubNavbar;

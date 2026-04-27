import React from "react";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import "./SecondaryNavbar.css";

const SubNavbar = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile Navbar */}
      <div className="main">
        <div className="left_icon">
          {/* Search icon removed */}
        </div>

        <div className="right_wishlist_mobile">
          <FiShoppingCart className="wishlist_icon" aria-label="Cart" />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="main_desktop">
        <div className="left">
          {/* Search box removed */}
        </div>
      </div>
    </>
  );
};

export default SubNavbar;

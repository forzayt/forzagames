import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { FaGlobe, FaBars, FaTimes } from "react-icons/fa";

const EpicNavbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoDropdownOpen, setLogoDropdownOpen] = useState(false);
  const [distributeDropdownOpen, setDistributeDropdownOpen] = useState(false);
  const [globalDropdownOpen, setGlobalDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen((prev) => !prev);

  const toggleDropdown = (dropdownSetter, currentState) => {
    dropdownSetter(!currentState);
  };

  const closeAllDropdowns = () => {
    setLogoDropdownOpen(false);
    setDistributeDropdownOpen(false);
    setGlobalDropdownOpen(false);
  };

  
};

export default EpicNavbar;

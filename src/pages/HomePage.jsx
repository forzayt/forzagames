import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SecondaryNavbar from "../components/SecondaryNavbar/SecondaryNavbar";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import GameCardsSlider from "../components/GameCardsSlider/GameCardsSlider";
import GameCardsSlider2 from "../components/GameCardsSlider2/GameCardsSlider2";
import DealGameCards from "../components/DealGameCards/DealGameCards";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <SecondaryNavbar />
      <HeroSlider />
      <GameCardsSlider />
      <GameCardsSlider2 />
      <DealGameCards />
      <div className="copyright-container">
        <p>© 2026, Forza Games, Inc. All rights reserved.</p>
        <p>
          Inspired by{" "}
          <a
            href="https://store.epicgames.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Epic Games
          </a>
          , Powered by{" "}
          <a
            href="https://github.com/forzayt/FitgirlAPI"
            target="_blank"
            rel="noopener noreferrer"
          >
            FitgirlAPI
          </a>{" "}
          and Sourced by{" "}
          <a
            href="https://store.steampowered.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Steam
          </a>
        </p>
      </div>
    </div>
  );
};

export default HomePage;

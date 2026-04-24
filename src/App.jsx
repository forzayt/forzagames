import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import BrowseGames from "./pages/BrowseGames";
import GameDetails from "./pages/GameDetails";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/browse" element={<BrowseGames />} />
      <Route path="/game/:id" element={<GameDetails />} />
    </Routes>
  );
}

export default App;

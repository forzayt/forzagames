import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SecondaryNavbar from "../components/SecondaryNavbar/SecondaryNavbar";
import HeroSlider from "../components/HeroSlider/HeroSlider";
import GameCardsSlider from "../components/GameCardsSlider/GameCardsSlider";
import FeaturedGameCard from "../components/FeaturedGameCard/FeaturedGameCard";
import GameCardsSlider2 from "../components/GameCardsSlider2/GameCardsSlider2";
import DealGameCards from "../components/DealGameCards/DealGameCards";
import FreeGamesCard from "../components/FreeGamesCard/FreeGamesCard";

const HomePage = () => {
  return (
    <div>
      <Navbar />
      <SecondaryNavbar />
      <HeroSlider />
      <GameCardsSlider />
      <FeaturedGameCard />
      <GameCardsSlider2 />
      <DealGameCards />
      <FreeGamesCard />
      <div className="copyright-container">
        <p>
          © 2025, Epic Games, Inc. All rights reserved. Epic, Epic Games, the
          Epic Games logo, Fortnite, the Fortnite logo, Unreal, Unreal Engine,
          the Unreal Engine logo, Unreal Tournament, and the Unreal Tournament
          logo are trademarks or registered trademarks of Epic Games, Inc. in
          the United States of America and elsewhere. Other brands or product
          names are the trademarks of their respective owners. Our websites may
          contain links to other sites and resources provided by third parties.
          These links are provided for your convenience only. Epic Games has no
          control over the contents of those sites or resources, and accepts no
          responsibility for them or for any loss or damage that may arise from
          your use of them.
        </p>
      </div>
    </div>
  );
};

export default HomePage;

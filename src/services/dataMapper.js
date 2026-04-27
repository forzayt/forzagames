export const mapSteamGameToUI = (game) => {
  return {
    id: game.id,
    name: game.name,
    category: game.genres?.[0]?.name || 'Game',
    discount: game.rating > 4.5 ? 'Must Play' : null,
    originalPrice: null,
    discountedPrice: game.metacritic ? `Score: ${game.metacritic}` : 'N/A',
    image: game.background_image,
    // For HeroSlider
    mainImage: game.background_image,
    thumbnailImage: game.background_image,
    titleImage: game.background_image,
    description: game.released ? `Released: ${game.released}` : '',
    subtitle: game.platforms?.map(p => p.platform.name).slice(0, 2).join(', ') || 'Various Platforms',
  };
};

export const mapSteamSearchToUI = (item) => {
  return {
    id: item.id,
    name: item.name,
    category: item.genres?.[0]?.name || 'Game',
    discount: null,
    originalPrice: null,
    discountedPrice: item.released,
    image: item.background_image,
  };
};

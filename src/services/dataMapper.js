export const mapSteamGameToUI = (steamGame) => {
  const currencySymbol = steamGame.currency === 'INR' ? '₹' : steamGame.currency === 'USD' ? '$' : steamGame.currency || '';
  
  // Steam prices are usually in subunits (cents/paisa)
  const formatPrice = (price) => {
    if (price === 0) return 'Free';
    if (!price) return '';
    return `${currencySymbol}${(price / 100).toLocaleString()}`;
  };

  return {
    id: steamGame.id,
    name: steamGame.name,
    category: steamGame.type === 0 ? 'Base Game' : steamGame.type === 1 ? 'DLC' : 'Game',
    discount: steamGame.discount_percent > 0 ? `-${steamGame.discount_percent}%` : null,
    originalPrice: steamGame.original_price ? formatPrice(steamGame.original_price) : null,
    discountedPrice: steamGame.final_price ? formatPrice(steamGame.final_price) : null,
    image: steamGame.large_capsule_image || steamGame.header_image,
    // For HeroSlider
    mainImage: steamGame.large_capsule_image || steamGame.header_image,
    thumbnailImage: steamGame.small_capsule_image || steamGame.header_image,
    titleImage: steamGame.header_image, // Fallback as Steam doesn't provide logo in featured
    description: steamGame.headline || '', // Some endpoints provide headline
    subtitle: steamGame.type === 0 ? 'Base Game' : 'Special Edition',
  };
};

export const mapSteamSearchToUI = (item) => {
  return {
    id: item.id,
    name: item.name,
    category: 'Game',
    discount: item.discount_percent > 0 ? `-${item.discount_percent}%` : null,
    originalPrice: item.original_price, // Search API might return formatted strings
    discountedPrice: item.final_price,
    image: item.logo || item.image,
  };
};

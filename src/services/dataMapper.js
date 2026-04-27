
export const mapFitgirlToUI = (game) => {
  if (!game) return null;
  
  // The API seems to wrap steam details in a steam_data object
  const sData = game.steam_data || {};
  
  const mainImage = game.poster || sData.header_image || sData.background || game.header_image;
  const genres = sData.genres || game.genres || [];
  
  return {
    id: (game.id || sData.steam_appid || '').toString(),
    name: game.name || game.title || sData.name || 'Unknown Game',
    category: (typeof genres[0] === 'object' ? genres[0].description : genres[0]) || 'Game',
    image: mainImage,
    mainImage: sData.background || mainImage,
    thumbnailImage: mainImage,
    titleImage: mainImage,
    background_image: sData.background || mainImage,
    background_image_additional: sData.background_raw || sData.background || mainImage,
    description: game.description || sData.detailed_description || sData.short_description || 'No description available.',
    description_raw: game.description || sData.short_description || 'No description available.',
    released: game.release_date || sData.release_date?.date || 'N/A',
    rating: game.rating || (sData.metacritic?.score ? (sData.metacritic.score / 20).toFixed(1) : 'N/A'),
    metacritic: game.metacritic_score || sData.metacritic?.score,
    genres: genres.map((g, index) => ({ 
      id: g.id || index, 
      name: g.description || (typeof g === 'string' ? g : 'Game') 
    })),
    screenshots: (sData.screenshots || game.screenshots || []).map((s, index) => ({ 
      id: s.id || index, 
      image: s.path_full || s 
    })),
    platforms: sData.platforms ? 
      Object.entries(sData.platforms)
        .filter(([_, supported]) => supported)
        .map(([name]) => ({ platform: { name: name.toUpperCase() } })) : 
      [{ platform: { name: "PC" } }],
    developers: sData.developers ? sData.developers.map(d => ({ name: d })) : (game.developer ? [{ name: game.developer }] : []),
    publishers: sData.publishers ? sData.publishers.map(p => ({ name: p })) : (game.publisher ? [{ name: game.publisher }] : []),
    tags: genres.map((g, index) => ({ 
      id: g.id || index, 
      name: g.description || (typeof g === 'string' ? g : 'Game') 
    })),
    download_links: (game.download_links || game.download_data?.parsed_links || []).map(link => ({
      hoster: link.category || link.hoster,
      url: link.url,
      size: link.size
    }))
  };
};


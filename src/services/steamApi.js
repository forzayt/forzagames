const BASE_URL = 'https://api.rawg.io/api';
const API_KEY = import.meta.env.VITE_RAWG_API_KEY;

export const steamApi = {
  // CORE DISCOVERY
  getGames: async (params = {}) => {
    const urlParams = new URLSearchParams({
      key: API_KEY,
      ...params
    });
    const response = await fetch(`${BASE_URL}/games?${urlParams.toString()}`);
    const data = await response.json();
    return data.results || [];
  },

  getAppDetails: async (id) => {
    const response = await fetch(`${BASE_URL}/games/${id}?key=${API_KEY}`);
    return response.json();
  },

  // SEARCH
  searchGames: async (query) => {
    const results = await steamApi.getGames({ search: query, page_size: 10 });
    return { items: results };
  },

  // COMPATIBILITY WRAPPERS
  getFeaturedCategories: async () => {
    const [specials, topSellers, newReleases, comingSoon] = await Promise.all([
      steamApi.getGames({ ordering: '-rating', page_size: 10 }),
      steamApi.getGames({ ordering: '-added', page_size: 10 }),
      steamApi.getGames({ ordering: '-released', page_size: 10 }),
      steamApi.getGames({ dates: '2025-01-01,2026-12-31', ordering: 'released', page_size: 10 })
    ]);

    return {
      specials: { items: specials },
      top_sellers: { items: topSellers },
      new_releases: { items: newReleases },
      coming_soon: { items: comingSoon }
    };
  },

  getFeatured: async () => {
    const results = await steamApi.getGames({ ordering: '-metacritic', page_size: 6 });
    return { featured_win: results };
  }
};

export default steamApi;

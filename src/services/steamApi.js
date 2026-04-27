import { mapFitgirlToUI } from './dataMapper';

const FITGIRL_API_URL = import.meta.env.VITE_FITGIRL_API_URL;

// Global cache for all fetched games to enable local search
const gamesCache = new Map();

const CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 1 week in milliseconds
const CACHE_PREFIX = 'game_cache_';

const saveToLocalStorage = (id, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    localStorage.setItem(`${CACHE_PREFIX}${id}`, JSON.stringify(cacheData));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

const getFromLocalStorage = (id) => {
  try {
    const cached = localStorage.getItem(`${CACHE_PREFIX}${id}`);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    const isExpired = Date.now() - timestamp > CACHE_EXPIRY;

    if (isExpired) {
      localStorage.removeItem(`${CACHE_PREFIX}${id}`);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

// Import all JSON files from the data/id directory
const categoryFiles = import.meta.glob('../data/id/*.json', { eager: true });

export const steamApi = {
  // Get all categories from JSON files
  getCategories: () => {
    return Object.entries(categoryFiles).map(([path, module]) => {
      const name = path.split('/').pop().replace('.json', '');
      const ids = Array.isArray(module.default) ? module.default : [module.default];
      // Deduplicate IDs to prevent React key warnings
      const uniqueIds = [...new Set(ids)];
      
      return {
        id: name,
        title: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
        ids: uniqueIds
      };
    });
  },

  // Get details from Fitgirl API (used for both cards and details page)
  getGameDetails: async (id) => {
    const idStr = id.toString();

    // 1. Check in-memory cache first
    if (gamesCache.has(idStr)) {
      return gamesCache.get(idStr);
    }

    // 2. Check localStorage
    const cachedData = getFromLocalStorage(idStr);
    if (cachedData) {
      gamesCache.set(idStr, cachedData);
      return cachedData;
    }

    // 3. Fetch from API if not in cache
    try {
      const response = await fetch(`${FITGIRL_API_URL}/${id}`);
      if (!response.ok) throw new Error('Game not found');
      const data = await response.json();
      const mapped = mapFitgirlToUI(data);
      
      // Save to both caches
      if (mapped) {
        gamesCache.set(idStr, mapped);
        saveToLocalStorage(idStr, mapped);
      }
      
      return mapped;
    } catch (error) {
      console.error(`Error fetching Fitgirl details for ${id}:`, error);
      return null;
    }
  },

  // Search games locally from already loaded titles
  searchGames: async (query) => {
    if (!query || query.trim() === '') return [];
    
    const normalizedQuery = query.toLowerCase().trim();
    const results = [];
    
    // Search within the cache of already loaded games
    for (const game of gamesCache.values()) {
      if (game.name.toLowerCase().includes(normalizedQuery)) {
        results.push(game);
      }
    }
    
    return results;
  },

  // Compatibility wrappers
  getFeaturedCategories: async () => {
    const categories = steamApi.getCategories();
    const result = {};
    
    for (const cat of categories) {
      const items = await Promise.all(
        cat.ids.slice(0, 10).map(id => steamApi.getGameDetails(id))
      );
      result[cat.id] = { items: items.filter(Boolean) };
    }
    
    return result;
  }
};

export default steamApi;

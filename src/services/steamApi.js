import { mapFitgirlToUI } from './dataMapper';

const FITGIRL_API_URL = 'https://fitgirlapi-qhc5.onrender.com/api/v1';

// Import all JSON files from the data/id directory
const categoryFiles = import.meta.glob('../data/id/*.json', { eager: true });

export const steamApi = {
  // Get all categories from JSON files
  getCategories: () => {
    return Object.entries(categoryFiles).map(([path, module]) => {
      const name = path.split('/').pop().replace('.json', '');
      return {
        id: name,
        title: name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' '),
        ids: Array.isArray(module.default) ? module.default : [module.default]
      };
    });
  },

  // Get details from Fitgirl API (used for both cards and details page)
  getGameDetails: async (id) => {
    try {
      const response = await fetch(`${FITGIRL_API_URL}/${id}`);
      if (!response.ok) throw new Error('Game not found');
      const data = await response.json();
      return mapFitgirlToUI(data);
    } catch (error) {
      console.error(`Error fetching Fitgirl details for ${id}:`, error);
      return null;
    }
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

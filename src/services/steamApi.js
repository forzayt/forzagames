const BASE_URL = '/api/steam';
const OFFICIAL_API_URL = '/api/steam-official'; // We'll need another proxy for api.steampowered.com

export const steamApi = {
  // CORE STORE DISCOVERY
  getFeaturedCategories: async () => {
    const response = await fetch(`${BASE_URL}/api/featuredcategories`);
    return response.json();
  },
  getFeatured: async () => {
    const response = await fetch(`${BASE_URL}/api/featured`);
    return response.json();
  },
  getHomeContent: async () => {
    const response = await fetch(`${BASE_URL}/api/homecontent`);
    return response.json();
  },
  
  // SEARCH / FILTER ENGINE
  searchGames: async (query, params = {}) => {
    const urlParams = new URLSearchParams({
      term: query,
      l: 'english',
      cc: 'US',
      ...params
    });
    const response = await fetch(`${BASE_URL}/api/storesearch/?${urlParams.toString()}`);
    return response.json();
  },
  getSuggestions: async (query) => {
    const response = await fetch(`${BASE_URL}/search/suggest?term=${encodeURIComponent(query)}&f=games&cc=US&l=english`);
    return response.text();
  },
  renderSearch: async (query, start = 0, count = 20) => {
    const response = await fetch(`${BASE_URL}/search/render/?query=${encodeURIComponent(query)}&start=${start}&count=${count}&json=1`);
    return response.json();
  },

  // TAG SYSTEM
  getPopularTags: async () => {
    const response = await fetch(`${BASE_URL}/tagdata/populartags/english`);
    return response.json();
  },
  getTagItems: async () => {
    const response = await fetch(`${BASE_URL}/tagdata/tagitems/english`);
    return response.json();
  },
  getTags: async () => {
    const response = await fetch(`${BASE_URL}/tagdata/tags/english`);
    return response.json();
  },

  // APP / GAME DATA
  getAppDetails: async (appIds) => {
    const response = await fetch(`${BASE_URL}/api/appdetails?appids=${appIds}`);
    return response.json();
  },
  getAppUserDetails: async (appId) => {
    const response = await fetch(`${BASE_URL}/api/appuserdetails?appids=${appId}`);
    return response.json();
  },
  getPackageDetails: async (packageIds) => {
    const response = await fetch(`${BASE_URL}/api/packagedetails?packageids=${packageIds}`);
    return response.json();
  },
  getDlcForApp: async (appId) => {
    const response = await fetch(`${BASE_URL}/api/dlcforapp?appid=${appId}`);
    return response.json();
  },

  // REVIEWS / COMMUNITY
  getAppReviews: async (appId, params = {}) => {
    const urlParams = new URLSearchParams({
      json: 1,
      ...params
    });
    const response = await fetch(`${BASE_URL}/appreviews/${appId}?${urlParams.toString()}`);
    return response.json();
  },

  // FILTERED LISTS
  getTopSellers: async () => {
    const response = await fetch(`${BASE_URL}/search/results/?json=1&filter=topsellers`);
    return response.json();
  },
  getNewReleases: async () => {
    const response = await fetch(`${BASE_URL}/search/results/?json=1&sort_by=Released_DESC`);
    return response.json();
  },
  getSpecials: async () => {
    const response = await fetch(`${BASE_URL}/search/results/?json=1&specials=1`);
    return response.json();
  },
  getFreeGames: async () => {
    const response = await fetch(`${BASE_URL}/search/results/?json=1&price=free`);
    return response.json();
  },

  // WISHLIST
  getWishlistData: async (steamId) => {
    const response = await fetch(`${BASE_URL}/wishlist/profiles/${steamId}/wishlistdata`);
    return response.json();
  },

  // NEWS / EVENTS
  getAppEvents: async (appId) => {
    const response = await fetch(`${BASE_URL}/events/ajaxgeteventsforapp/?appid=${appId}`);
    return response.json();
  },
  getPartnerEvents: async (appId) => {
    const response = await fetch(`${BASE_URL}/events/ajaxgetpartnerevents/?appid=${appId}`);
    return response.json();
  },

  // CURATORS
  getTopCurators: async () => {
    const response = await fetch(`${BASE_URL}/curators/ajaxgettopcreatorhomes/`);
    return response.json();
  },

  // OFFICIAL API FALLBACKS
  getAppList: async () => {
    const response = await fetch(`${OFFICIAL_API_URL}/ISteamApps/GetAppList/v2/`);
    return response.json();
  },
  getNewsForApp: async (appId) => {
    const response = await fetch(`${OFFICIAL_API_URL}/ISteamNews/GetNewsForApp/v2/?appid=${appId}`);
    return response.json();
  },
};

export default steamApi;

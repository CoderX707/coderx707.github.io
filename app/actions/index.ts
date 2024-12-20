import axios from "axios";
import { getCache, setCache } from "@/utils/cache";

const githubAPIUrl = "https://api.github.com/users";
const userName = "CoderX707";

axios.interceptors.request.use((config) => {
  config.headers = {
    ...config.headers,
    // Authorization: "Bearer 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",
  };
  return config;
});

export const getGithubData = async () => {
  const cacheKey = `github_data_${userName}`; // Unique cache key for the user

  // Check if data is in cache
  const cachedData = getCache(cacheKey);
  if (cachedData) {
    return cachedData; // Return cached data if valid
  }

  try {
    // Make API calls to GitHub to fetch repos and profile
    const [reposResponse, profileResponse] = await Promise.all([
      axios.get(`${githubAPIUrl}/${userName}/repos`),
      axios.get(`${githubAPIUrl}/${userName}`),
    ]);

    const repos = reposResponse?.data || [];
    const profile = profileResponse?.data || null;

    // Combine repos and profile into a single object
    const result = { repos, profile };

    // Cache the result
    setCache(cacheKey, result);

    return result; // Return the fresh data
  } catch (error) {
    console.log(error);
    return { repos: [], profile: null };
  }
};

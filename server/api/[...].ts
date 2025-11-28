import { joinURL } from "ufo";

export default defineEventHandler(async (event) => {
  // get the runtime config base url
  const proxyUrl = useRuntimeConfig().apiBase; // Get the API base URL from runtime config

  const path = event.path.replace(/^\/api\//, ""); // Extract the path after /api/ e.g /api/users -> /users

  const target = joinURL(proxyUrl, path); // Construct the target URL

  // proxy the request to the target URL
  return proxyRequest(event, target);
});

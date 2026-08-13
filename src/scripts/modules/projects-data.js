/**
 * Central Projects Data Loader
 * Single source of truth module for loading and retrieving project data from public/data/projects.json.
 */

let projectsCache = null;
let fetchPromise = null;

export async function loadProjectsData() {
  if (projectsCache) {
    return projectsCache;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await fetch('./data/projects.json');
      if (!response.ok) {
        throw new Error(`Failed to load projects.json (${response.status})`);
      }
      projectsCache = await response.json();
      return projectsCache;
    } catch (err) {
      console.error('ProjectsData load error:', err);
      return {};
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

export function getCachedProjectsData() {
  return projectsCache || {};
}

export function getProjectById(id) {
  if (!projectsCache) return null;
  return projectsCache[id] || null;
}

export function getProjectsList() {
  if (!projectsCache) return [];
  return Object.values(projectsCache);
}

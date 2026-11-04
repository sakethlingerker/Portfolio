import type { Project } from "../../types/portfolio";

/**
 * Strongly Typed Projects Data Service
 * Provides single source of truth for portfolio project data.
 */

export interface ProjectsMap {
  [id: string]: Project;
}

let projectsCache: ProjectsMap | null = null;
let fetchPromise: Promise<ProjectsMap> | null = null;

/**
 * Loads project data from JSON endpoint
 */
export async function loadProjectsData(): Promise<ProjectsMap> {
  if (projectsCache) {
    return projectsCache;
  }

  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async (): Promise<ProjectsMap> => {
    try {
      const base = (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL || "./";
      const normalizedBase = base.endsWith("/") ? base : `${base}/`;
      let response = await fetch(`${normalizedBase}data/projects.json`);
      if (!response.ok) {
        response = await fetch("./data/projects.json");
      }
      if (!response.ok) {
        response = await fetch("data/projects.json");
      }
      if (!response.ok) {
        throw new Error(`Failed to load projects.json (${response.status})`);
      }
      projectsCache = (await response.json()) as ProjectsMap;
      return projectsCache;
    } catch (err) {
      console.error("ProjectsData load error:", err);
      return {};
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
}

/**
 * Synchronously retrieves cached projects dictionary
 */
export function getCachedProjectsData(): ProjectsMap {
  return projectsCache || {};
}

/**
 * Retrieves a single project by ID
 */
export function getProjectById(id: string): Project | null {
  if (!projectsCache) return null;
  return projectsCache[id] || null;
}

/**
 * Returns an array of all loaded projects
 */
export function getProjectsList(): Project[] {
  if (!projectsCache) return [];
  return Object.values(projectsCache);
}


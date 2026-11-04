/**
 * Central Projects Data Loader
 * Single source of truth module for loading and retrieving project data from public/data/projects.json.
 * Backed by typed projects-service.
 */

export {
  loadProjectsData,
  getCachedProjectsData,
  getProjectById,
  getProjectsList
} from "../data/projects-service.ts";

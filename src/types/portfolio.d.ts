/**
 * Type definitions for Saketh Lingerker's Systems & Portfolio Architecture
 */

export interface ProjectStage {
  stage: number;
  title: string;
  architecture_pattern: string;
  inputs: string;
  outputs: string;
  details: string;
}

export interface ProjectArchitecture {
  summary: string;
  core_technologies: string[];
  key_decisions: string[];
  stages: ProjectStage[];
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  category: "ai" | "mlops" | "systems" | "fullstack";
  summary: string;
  technologies: string[];
  architecture?: ProjectArchitecture;
  metrics?: Record<string, string>;
  links: {
    github?: string;
    live?: string;
    paper?: string;
  };
}

export interface ProfileExperience {
  company: string;
  role: string;
  period: string;
  details: string;
}

export interface ProfileCertification {
  name: string;
  score?: string;
  percentile?: string;
  type: string;
}

export interface ProfileData {
  profile: {
    name: string;
    role: string;
    education: string;
    summary: string;
    contact: string;
    truthRules: string[];
  };
  experience: ProfileExperience[];
  certifications: ProfileCertification[];
  skills: {
    languages: string[];
    ai_ml: string[];
    [category: string]: string[];
  };
}

export type WorkbenchMode = "projects" | "architecture" | "compare" | "ask";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  html?: string;
  timestamp: number;
}

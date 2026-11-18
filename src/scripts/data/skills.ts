/**
 * Centralized Technical Skills & Systems Atlas Data Model
 * Single Source of Truth for both Home (Technical Focus) and About (Systems Atlas) pages.
 */

export interface TechnologyItem {
  name: string;
  icon: string;
}

export interface DomainConnection {
  targetId: string;
  targetName: string;
  targetIndex: string;
  relationship: string;
}

export interface SkillCategory {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  count: number;
  description: string;
  technologies: TechnologyItem[];
  connections: DomainConnection[];
}

export const skillsData: SkillCategory[] = [
  {
    id: "full-stack-systems",
    index: "01",
    name: "Full-Stack Systems",
    subtitle: "Backend Services & Clean Contracts",
    count: 6,
    description: "Building complete applications with dependable backend services, clear API contracts, and responsive interfaces.",
    technologies: [
      { name: "Python", icon: "devicon-python-plain" },
      { name: "Java", icon: "devicon-java-plain" },
      { name: "FastAPI", icon: "devicon-fastapi-plain" },
      { name: "Node.js", icon: "devicon-nodejs-plain" },
      { name: "Express", icon: "devicon-express-original" },
      { name: "REST APIs", icon: "fas fa-network-wired" },
    ],
    connections: [
      {
        targetId: "data-storage",
        targetName: "Data & Storage",
        targetIndex: "03",
        relationship: "Exchanges structured records, schema models, and transactional queries with databases.",
      },
      {
        targetId: "applied-ai-retrieval",
        targetName: "Applied AI & Retrieval",
        targetIndex: "02",
        relationship: "Integrates AI inference endpoints, streaming responses, and vector query controllers.",
      },
      {
        targetId: "cloud-mlops",
        targetName: "Cloud & MLOps",
        targetIndex: "04",
        relationship: "Containerized with Docker and continuously deployed to AWS cloud infrastructure via CI/CD.",
      },
    ],
  },
  {
    id: "applied-ai-retrieval",
    index: "02",
    name: "Applied AI & Retrieval",
    subtitle: "Machine Learning & Grounded Generation",
    count: 7,
    description: "Developing practical AI applications using machine learning, retrieval pipelines, embedding search, and grounded response generation.",
    technologies: [
      { name: "PyTorch", icon: "devicon-pytorch-original" },
      { name: "TensorFlow", icon: "devicon-tensorflow-original" },
      { name: "LangChain", icon: "fas fa-link" },
      { name: "FAISS", icon: "fas fa-bolt" },
      { name: "ChromaDB", icon: "fas fa-cubes" },
      { name: "Scikit-learn", icon: "devicon-python-plain" },
      { name: "Hugging Face", icon: "fas fa-robot" },
    ],
    connections: [
      {
        targetId: "data-storage",
        targetName: "Data & Storage",
        targetIndex: "03",
        relationship: "Supplies document embeddings, dense vector indices, and preprocessed analytical matrices.",
      },
      {
        targetId: "full-stack-systems",
        targetName: "Full-Stack Systems",
        targetIndex: "01",
        relationship: "Exposes verified generation APIs, agentic orchestration, and speech/vision inference layers.",
      },
      {
        targetId: "cloud-mlops",
        targetName: "Cloud & MLOps",
        targetIndex: "04",
        relationship: "Packaged for reproducible cloud deployment, GPU-accelerated runners, and model monitoring.",
      },
    ],
  },
  {
    id: "data-storage",
    index: "03",
    name: "Data & Storage",
    subtitle: "Relational, NoSQL & Analytical Pipelines",
    count: 6,
    description: "Working with structured data, databases, processing workflows, and information retrieval.",
    technologies: [
      { name: "PostgreSQL", icon: "devicon-postgresql-plain" },
      { name: "MongoDB", icon: "devicon-mongodb-plain" },
      { name: "MySQL", icon: "devicon-mysql-plain" },
      { name: "Pandas", icon: "devicon-pandas-plain" },
      { name: "NumPy", icon: "devicon-numpy-plain" },
      { name: "SQL Server", icon: "devicon-microsoftsqlserver-plain" },
    ],
    connections: [
      {
        targetId: "full-stack-systems",
        targetName: "Full-Stack Systems",
        targetIndex: "01",
        relationship: "Provides transactional integrity, schema normalization, and low-latency indexed queries.",
      },
      {
        targetId: "applied-ai-retrieval",
        targetName: "Applied AI & Retrieval",
        targetIndex: "02",
        relationship: "Powers vector stores and structured knowledge repositories for grounded RAG lookups.",
      },
      {
        targetId: "cloud-mlops",
        targetName: "Cloud & MLOps",
        targetIndex: "04",
        relationship: "Managed via cloud-native volume persistence, automated snapshots, and environment provisioning.",
      },
    ],
  },
  {
    id: "cloud-mlops",
    index: "04",
    name: "Cloud & MLOps",
    subtitle: "Containerization, Cloud Infrastructure & CI/CD",
    count: 7,
    description: "Working with containerization, cloud infrastructure, automated delivery, and deployment workflows.",
    technologies: [
      { name: "Docker", icon: "devicon-docker-plain" },
      { name: "AWS EC2 / ECR", icon: "fab fa-aws" },
      { name: "GitHub Actions", icon: "devicon-githubactions-plain" },
      { name: "Git", icon: "devicon-git-plain" },
      { name: "Streamlit", icon: "devicon-streamlit-plain" },
      { name: "Postman", icon: "devicon-postman-plain" },
      { name: "Linux", icon: "devicon-linux-plain" },
    ],
    connections: [
      {
        targetId: "full-stack-systems",
        targetName: "Full-Stack Systems",
        targetIndex: "01",
        relationship: "Standardizes development runtime via Docker containers and executes automated build testing.",
      },
      {
        targetId: "applied-ai-retrieval",
        targetName: "Applied AI & Retrieval",
        targetIndex: "02",
        relationship: "Provisions cloud compute instances on AWS and runs end-to-end model evaluation pipelines.",
      },
      {
        targetId: "data-storage",
        targetName: "Data & Storage",
        targetIndex: "03",
        relationship: "Configures secure database networking, containerized DB instances, and migration automation.",
      },
    ],
  },
];

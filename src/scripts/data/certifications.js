/**
 * Centralized Certifications & Achievements Data Model
 * Extracted 100% strictly from verified PDF & JPG certificates located in public/assets/certificates/
 */

export const certificationsData = [
  {
    id: "iiit_aiml_research",
    title: "AI/ML Research Internship",
    issuer: "IIIT Hyderabad (LTRC)",
    issuerLogo: "https://cdn.brandfetch.io/idLjtzedAZ/w/388/h/200/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    date: "Dec 2024 to May 2025",
    category: "AI / ML",
    score: "6 Months",
    credentialId: null,
    isFeatured: true,
    skills: ["Voice Activity Detection (VAD)", "Automatic Speech Recognition (ASR)", "Question and Answering", "Video Stitching"],
    image: "assets/certificates/SakethCertificate-IIIT.png",
    pdfUrl: "assets/certificates/SakethCertificate-IIIT.pdf",
    type: "certification",
    description: "Six-month research internship at Speech Lab, Language Technologies Research Center (LTRC), IIIT Hyderabad focusing on Multimodal Multi-video Question Answering."
  },
  {
    id: "iiit_aiml_proficiency",
    title: "Certificate of Proficiency – AI / ML Training Course",
    issuer: "iHub-Data, IIIT Hyderabad",
    issuerLogo: "https://cdn.brandfetch.io/idLjtzedAZ/w/388/h/200/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",
    date: "May 2024 to Oct 2024",
    category: "AI / ML",
    score: "Certified",
    credentialId: null,
    isFeatured: true,
    skills: ["Artificial Intelligence", "Machine Learning", "Neural Networks", "Deep Learning Fundamentals"],
    image: "assets/certificates/IIIT-AIML.jpg",
    pdfUrl: "assets/certificates/IIIT-AIML.jpg",
    verificationUrl: null,
    type: "certification",
    description: "Six-month intensive training course on Artificial Intelligence/Machine Learning conducted by iHub-Data, IIIT Hyderabad."
  },
  {
    id: "aws_cloud_essentials",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services (AWS)",
    issuerLogo: "https://cdn.brandfetch.io/idqS9w5p2H/theme/dark/logo.png",
    date: "April 16, 2025",
    category: "Cloud",
    score: "Completed",
    credentialId: null,
    isFeatured: true,
    skills: ["Cloud Computing Fundamentals", "AWS Architecture", "Security & Billing"],
    image: "assets/certificates/AWS Cloud Practitioner Essentials.png",
    pdfUrl: "assets/certificates/AWS Cloud Practitioner Essentials.pdf",
    verificationUrl: "https://drive.google.com/file/d/1BuBgZQuYN4Y1LD1ccRbLMw-fSFjB_yol/view",
    type: "certification",
    description: "Official AWS Training & Certification validating core AWS Cloud Practitioner Essentials knowledge."
  },
  {
    id: "aws_certified_ai_practitioner_prep",
    title: "AWS Certified AI Practitioner (AIF-C01) Exam Prep",
    issuer: "Amazon Web Services (AWS)",
    issuerLogo: "https://cdn.brandfetch.io/idqS9w5p2H/theme/dark/logo.png",
    date: "April 2025",
    category: "AI / ML",
    score: "Completed",
    credentialId: null,
    isFeatured: false,
    skills: ["AWS Certified AI Practitioner (AIF-C01)", "Generative AI", "Machine Learning Services"],
    image: "assets/certificates/AWS Skill Builder Course Completion Certificate.png",
    pdfUrl: "assets/certificates/AWS Skill Builder Course Completion Certificate.pdf",
    verificationUrl: null,
    type: "certification",
    description: "AWS Skill Builder Certificate of Completion for Exam Prep Standard Course: AWS Certified AI Practitioner (AIF-C01)."
  },
  {
    id: "tcs_npt_proficiency_get",
    title: "Certificate of Proficiency – Graduate Engineer Trainee - IT",
    issuer: "TCS iON",
    issuerLogo: "https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",
    date: "February 9th, 2026",
    category: "Professional",
    score: "Certified",
    credentialId: "26090211096",
    isFeatured: false,
    skills: ["Graduate Engineer Trainee - IT", "Software Engineering", "Systems Proficiency"],
    image: "assets/certificates/Certificate of Proficiency.png",
    pdfUrl: "assets/certificates/Certificate of Proficiency.pdf",
    verificationUrl: null,
    type: "certification",
    description: "TCS iON Certificate of Proficiency designating qualification as Graduate Engineer Trainee - IT."
  },
  {
    id: "tcs_nqt_cognitive",
    title: "TCS iON NQT – Cognitive",
    issuer: "TCS iON",
    issuerLogo: "https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",
    date: "February 9th, 2026",
    category: "Professional",
    score: "91.51%",
    credentialId: "22071644909",
    isFeatured: true,
    skills: ["Numerical Ability (600/600)", "Verbal Ability (566.92/600)", "Reasoning Ability (480.32/600)"],
    image: "assets/certificates/TCS iON NQT - Cognitive.png",
    pdfUrl: "assets/certificates/TCS iON NQT - Cognitive.pdf",
    verificationUrl: null,
    type: "certification",
    description: "Standardized TCS iON National Qualifier Test (Cognitive) evaluating numerical ability, verbal proficiency, and logical reasoning."
  },
  {
    id: "deloitte_analytics_job_sim",
    title: "Data Analytics Job Simulation",
    issuer: "Deloitte Australia",
    issuerLogo: "https://cdn.brandfetch.io/idIu-Ji9Le/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1668076193075",
    date: "December 11th, 2025",
    category: "Data",
    score: "Completed",
    credentialId: "RubyKoEwttXCc7pDv",
    isFeatured: false,
    skills: ["Data Analysis", "Forensic Technology", "Executive Data Storytelling"],
    image: "assets/certificates/Data Analytics Job Simulation.png",
    pdfUrl: "assets/certificates/Data Analytics Job Simulation.pdf",
    verificationUrl: "https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_ffNQ5dnLojDbCZyqH_1765434824832_completion_certificate.pdf",
    type: "certification",
    description: "Deloitte Australia virtual job simulation via Forage completing practical tasks in Data Analysis and Forensic Technology."
  },
  {
    id: "genai_data_analytics_sim",
    title: "GenAI Powered Data Analytics Job Simulation",
    issuer: "Forage",
    issuerLogo: "https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",
    date: "December 12th, 2025",
    category: "Data",
    score: "Completed",
    credentialId: "4pc3JgG3CEuqSST9g",
    isFeatured: false,
    skills: ["Exploratory Data Analysis & Risk Profiling", "Predicting Delinquency with AI", "AI-driven Collections Strategy"],
    image: "assets/certificates/GenAI Powered Data Analytics Job Simulation.png",
    pdfUrl: "assets/certificates/GenAI Powered Data Analytics Job Simulation.pdf",
    verificationUrl: "https://www.theforage.com/completion-certificates/ifobHAoMjQs9s6bKS/gMTdCXwDdLYoXZ3wG_ifobHAoMjQs9s6bKS_ffNQ5dnLojDbCZyqH_1765520887303_completion_certificate.pdf",
    type: "certification",
    description: "Practical virtual tasks in EDA, risk profiling, AI delinquency prediction, and AI-driven business report strategy."
  },
  {
    id: "tcs_npt_get_it",
    title: "TCS iON NPT – GET IT",
    issuer: "TCS iON",
    issuerLogo: "https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",
    date: "February 9th, 2026",
    category: "Professional",
    score: "89.00%",
    credentialId: "26090211096",
    isFeatured: true,
    skills: ["Test of Knowledge (45/50)", "Test of Application (44/50)", "IT Engineering Systems"],
    image: "assets/certificates/TCS iON NPT - GET IT.png",
    pdfUrl: "assets/certificates/TCS iON NPT - GET IT.pdf",
    verificationUrl: null,
    type: "certification",
    description: "TCS iON National Proficiency Test for Graduate Engineer Trainee - IT assessing domain knowledge and practical application."
  },
  {
    id: "tcs_english_british_council",
    title: "TCS iON NPT – English with British Council",
    issuer: "TCS iON & British Council",
    issuerLogo: "https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",
    date: "February 9th, 2026",
    category: "Professional",
    score: "B1 / B2+",
    credentialId: "26090211144",
    isFeatured: false,
    skills: ["CEFR B1 Speaking", "CEFR B2+ Writing", "Business Communication"],
    image: "assets/certificates/English with British Council.png",
    pdfUrl: "assets/certificates/English with British Council.pdf",
    verificationUrl: null,
    type: "certification",
    description: "TCS iON NPT & British Council proficiency evaluation certifying CEFR B1 in Speaking and CEFR B2+ in Writing based on Aptis testing."
  }
];

export const achievementsData = [
  {
    id: "ach_coding_mentor",
    title: "Coding Club Mentor",
    issuer: "JNTUH College of Engineering Manthani",
    date: "2024 – 2025",
    tag: "50+ Students Mentored",
    description: "Organized and led coding classes for 50+ students, fostering skill development and collaboration.",
    type: "achievement"
  },
  {
    id: "ach_fest_coordinator",
    title: "College Fest Coordinator",
    issuer: "JNTUH College of Engineering Manthani",
    date: "2024 – 2025",
    tag: "Main Coordinator",
    description: "Managed technical setup and event logistics as Technical Coordinator for the College Fest.",
    type: "achievement"
  }
];

export function getCertifications() {
  return certificationsData;
}

export function getAchievements() {
  return achievementsData;
}

export function getCertificationById(id) {
  return certificationsData.find((c) => c.id === id) || null;
}

export function getCertificationsByCategory(category) {
  if (!category || category === "all") return certificationsData;
  if (category === "achievements") return [];
  return certificationsData.filter((c) => c.category.toLowerCase() === category.toLowerCase());
}

export function searchCertifications(query) {
  if (!query) return certificationsData;
  const q = query.toLowerCase().trim();
  return certificationsData.filter((c) => {
    const haystack = `${c.title} ${c.issuer} ${c.category} ${c.credentialId || ""} ${c.skills.join(" ")}`.toLowerCase();
    return haystack.includes(q);
  });
}

export function getFeaturedCertifications() {
  return certificationsData.filter((c) => c.isFeatured === true);
}

export function getCertificationsStats() {
  const certs = certificationsData;
  const achs = achievementsData;

  const totalCertifications = certs.length;
  
  const orgsSet = new Set([
    ...certs.map((c) => c.issuer),
    ...achs.map((a) => a.issuer)
  ]);
  const totalOrganizations = orgsSet.size;

  const domainsSet = new Set(certs.map((c) => c.category));
  const totalDomains = domainsSet.size;

  const totalAchievements = achs.length;

  return {
    certifications: totalCertifications,
    organizations: totalOrganizations,
    domains: totalDomains,
    achievements: totalAchievements
  };
}

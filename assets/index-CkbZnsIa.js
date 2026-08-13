(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&a(r)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function a(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();(function(){const e=document.getElementById("preloader");if(!e)return;document.body.classList.add("preloader-active");const t=()=>{e.classList.add("slide-out"),setTimeout(()=>{document.body.classList.remove("preloader-active"),e.remove()},800)};window.addEventListener("load",()=>{setTimeout(t,2500)}),setTimeout(()=>{document.body.classList.contains("preloader-active")&&t()},8e3)})();function se(){const s=document.getElementById("theme-toggle"),e=document.getElementById("theme-icon"),t=document.body;function a(n){n?(t.classList.add("light-mode"),t.classList.remove("dark"),e&&(e.innerHTML='<svg class="sun-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>')):(t.classList.remove("light-mode"),t.classList.add("dark"),e&&(e.innerHTML='<svg class="moon-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>'))}a(!0);let i=0;s&&s.addEventListener("click",()=>{i+=360,e&&(e.style.transform=`rotate(${i}deg)`);const n=!t.classList.contains("light-mode");a(n),localStorage.setItem("theme",n?"light":"dark")})}function ne(){var g,u,v;document.querySelector("#typed")&&typeof Typed<"u"&&new Typed("#typed",{strings:["Saketh Lingerker","Incoming Systems Engineer @ TCS","Full-Stack & AI Engineer","Former AI/ML Research Intern @ IIIT-H"],typeSpeed:50,backSpeed:80,backDelay:2e3,loop:!0,showCursor:!1}),typeof VanillaTilt<"u"&&VanillaTilt.init(document.querySelectorAll(".project-card, .experience-card, .skill-card"),{max:10,speed:400,glare:!0,"max-glare":.2}),document.querySelectorAll('a[href^="#"]').forEach(c=>{c.addEventListener("click",function(f){f.preventDefault();const m=document.querySelector(this.getAttribute("href"));m&&window.scrollTo({top:m.offsetTop-80,behavior:"smooth"})})});const s=[...document.querySelectorAll(".project-card"),...document.querySelectorAll(".experience-card"),...document.querySelectorAll(".skill-card"),...document.querySelectorAll(".skill-tag")];s.forEach(c=>{c.style.opacity="0",c.style.transform="translateY(30px)",c.style.transition="opacity 0.6s ease, transform 0.6s ease"});const e=new IntersectionObserver(c=>{c.forEach(f=>{f.isIntersecting&&(f.target.style.opacity="1",f.target.style.transform="translateY(0)",e.unobserve(f.target))})},{threshold:.1,rootMargin:"0px 0px -50px 0px"});s.forEach(c=>e.observe(c));const t=document.getElementById("mobile-menu-toggle"),a=document.getElementById("mobile-menu-close"),i=document.getElementById("mobile-nav-overlay");t&&t.addEventListener("click",()=>i.classList.add("active")),a&&a.addEventListener("click",()=>i.classList.remove("active")),document.querySelectorAll(".mobile-nav-links a").forEach(c=>{c.addEventListener("click",()=>i.classList.remove("active"))}),window.addEventListener("resize",()=>{window.innerWidth>900&&i.classList.contains("active")&&i.classList.remove("active")}),window.addEventListener("scroll",()=>{const c=document.querySelectorAll("section"),f=document.querySelectorAll(".main-nav-links a, .mobile-nav-links a"),m=document.querySelector(".header"),b=document.getElementById("scroll-progress"),T=document.getElementById("back-to-top"),x=window.pageYOffset||document.documentElement.scrollTop;let B="";c.forEach(k=>{x>=k.offsetTop-100&&(B=k.getAttribute("id"))}),f.forEach(k=>{var O;k.classList.toggle("active",((O=k.getAttribute("href"))==null?void 0:O.substring(1))===B)}),m&&m.classList.toggle("shrink",x>100);const $=document.documentElement.scrollHeight,M=window.innerHeight;let P=0;$>M&&(P=x/($-M)*100);const R=Math.min(100,Math.max(0,Math.round(P)));b&&(b.style.width=`${R}%`),T&&T.classList.toggle("visible",x>500)});const n=document.getElementById("back-to-top");n&&n.addEventListener("click",()=>window.scrollTo({top:0,behavior:"smooth"}));const r=document.getElementById("resume-modal"),o=document.getElementById("close-resume-modal"),d=document.querySelectorAll('a[href*="Saketh_Lingerker_8688791352.pdf"]');function l(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<=768}function h(){if(!r)return;const c=l();document.querySelectorAll(".desktop-view").forEach(m=>m.style.display=c?"none":"block");const f=document.querySelector(".mobile-view");f&&(f.style.display=c?"block":"none"),r.classList.add("open"),document.body.style.overflow="hidden"}r&&d.length>0&&(d.forEach(c=>{c.hasAttribute("download")||c.addEventListener("click",f=>{f.preventDefault(),h()})}),o==null||o.addEventListener("click",()=>{r.classList.remove("open"),document.body.style.overflow="auto"}),(g=document.getElementById("open-pdf-btn"))==null||g.addEventListener("click",()=>{window.open("assets/Saketh_Lingerker_8688791352.pdf","_blank"),r.classList.remove("open"),document.body.style.overflow="auto"}));const p=document.getElementById("project-modal"),E=document.getElementById("close-project-modal");document.querySelectorAll(".project-card").forEach(c=>{c.addEventListener("click",f=>{var R,k,O,G,J,Q;if(f.target.closest("a, button"))return;const m=((R=c.querySelector(".project-title"))==null?void 0:R.textContent.trim())||"";(k=c.querySelector(".project-description"))!=null&&k.textContent.trim();const b=((O=c.querySelector(".project-tags"))==null?void 0:O.innerHTML)||"",T=((G=c.querySelector(".project-links"))==null?void 0:G.innerHTML)||"",x=((J=c.querySelector(".project-problem"))==null?void 0:J.innerHTML.trim())||"";document.getElementById("modal-title").innerText=m,document.getElementById("modal-tags").innerHTML=b,document.getElementById("modal-links").innerHTML=T;const B=((Q=c.querySelector(".project-highlights"))==null?void 0:Q.innerHTML)||"",$=c.querySelector(".project-case-study");let M="";$&&$.querySelectorAll("h4").forEach(N=>{var I;N.textContent.toLowerCase().includes("impact")&&(M=((I=N.nextElementSibling)==null?void 0:I.innerHTML)||"")});const P=(V,N,q)=>{const I=document.getElementById(V),Y=document.getElementById(N);q&&q.trim()!==""&&I&&Y?(Y.innerHTML=q,I.style.display="block"):I&&(I.style.display="none")};P("modal-problem-section","modal-problem",x),P("modal-solution-section","modal-highlights",B),P("modal-impact-section","modal-impact",M),p.classList.add("open"),document.body.style.overflow="hidden"})}),E&&E.addEventListener("click",()=>{p.classList.remove("open"),document.body.style.overflow="auto"});const S=document.getElementById("privacy-modal");(u=document.getElementById("privacy-policy-link"))==null||u.addEventListener("click",()=>{S.classList.add("open"),document.body.style.overflow="hidden"}),(v=document.getElementById("close-privacy"))==null||v.addEventListener("click",()=>{S.classList.remove("open"),document.body.style.overflow="auto"}),document.querySelectorAll(".timeline-toggle").forEach(c=>{c.addEventListener("click",()=>{const f=c.closest(".timeline-content"),m=f?f.querySelector(".timeline-details"):null;if(m){const b=m.classList.contains("hidden");m.classList.toggle("hidden"),c.innerHTML=b?'Read Less <i class="fas fa-chevron-up"></i>':'Read More <i class="fas fa-chevron-down"></i>'}})}),window.addEventListener("click",c=>{(c.target===p||c.target===S||c.target===document.getElementById("quiz-modal"))&&(c.target.classList.remove("open"),document.body.style.overflow="auto")}),window.addEventListener("keydown",c=>{c.key==="Escape"&&document.querySelectorAll(".modal.open").forEach(f=>{f.classList.remove("open"),document.body.style.overflow="auto"})})}const ae="modulepreload",oe=function(s){return"/Portfolio/"+s},K={},re=function(e,t,a){let i=Promise.resolve();if(t&&t.length>0){document.getElementsByTagName("link");const r=document.querySelector("meta[property=csp-nonce]"),o=(r==null?void 0:r.nonce)||(r==null?void 0:r.getAttribute("nonce"));i=Promise.allSettled(t.map(d=>{if(d=oe(d),d in K)return;K[d]=!0;const l=d.endsWith(".css"),h=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${h}`))return;const p=document.createElement("link");if(p.rel=l?"stylesheet":ae,l||(p.as="script"),p.crossOrigin="",p.href=d,o&&p.setAttribute("nonce",o),document.head.appendChild(p),l)return new Promise((E,S)=>{p.addEventListener("load",E),p.addEventListener("error",()=>S(new Error(`Unable to preload CSS for ${d}`)))})}))}function n(r){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=r,window.dispatchEvent(o),!o.defaultPrevented)throw r}return i.then(r=>{for(const o of r||[])o.status==="rejected"&&n(o.reason);return e().catch(n)})},D={EMAILJS_PUBLIC_KEY:"GvfnZrKiGDpB0yff1",EMAILJS_SERVICE_ID:"service_oglwqbv",EMAILJS_TEMPLATE_ID:"template_n533ec8"};class ce{constructor(){this.container=null,this.toasts=new Map,this.init()}init(){document.querySelector(".toast-container")?this.container=document.querySelector(".toast-container"):(this.container=document.createElement("div"),this.container.className="toast-container",document.body.appendChild(this.container))}show(e={}){const{type:t="info",title:a="",message:i="",duration:n=5e3,closable:r=!0,progress:o=!0}=e,d=`toast-${Date.now()}-${Math.random().toString(36).substr(2,9)}`,l=document.createElement("div");l.className=`toast ${t}`,l.setAttribute("role","alert"),l.setAttribute("aria-live","polite"),l.id=d;const h={success:'<i class="fas fa-check-circle"></i>',error:'<i class="fas fa-exclamation-circle"></i>',warning:'<i class="fas fa-exclamation-triangle"></i>',info:'<i class="fas fa-info-circle"></i>'};if(l.innerHTML=`
            <div class="toast-icon">${h[t]||h.info}</div>
            <div class="toast-content">
                ${a?`<p class="toast-title">${a}</p>`:""}
                ${i?`<p class="toast-message">${i}</p>`:""}
            </div>
            ${r?'<button class="toast-close" aria-label="Close notification"><i class="fas fa-times"></i></button>':""}
            ${o?'<div class="toast-progress"><div class="toast-progress-bar"></div></div>':""}
        `,this.container.appendChild(l),requestAnimationFrame(()=>{l.classList.add("show")}),this.toasts.set(d,{element:l,timeout:null}),r&&l.querySelector(".toast-close").addEventListener("click",()=>this.hide(d)),n>0){const p=setTimeout(()=>this.hide(d),n);this.toasts.get(d).timeout=p}return d}hide(e){const t=this.toasts.get(e);if(!t)return;const{element:a,timeout:i}=t;i&&clearTimeout(i),a.classList.remove("show"),a.classList.add("hide"),setTimeout(()=>{a.parentNode&&a.parentNode.removeChild(a),this.toasts.delete(e)},400)}hideAll(){this.toasts.forEach((e,t)=>this.hide(t))}success(e,t,a){return this.show({type:"success",title:e,message:t,duration:a})}error(e,t,a){return this.show({type:"error",title:e,message:t,duration:a})}warning(e,t,a){return this.show({type:"warning",title:e,message:t,duration:a})}info(e,t,a){return this.show({type:"info",title:e,message:t,duration:a})}}const C=new ce;function le(){try{return localStorage.setItem("test","test"),localStorage.removeItem("test"),!0}catch{return console.warn("localStorage is blocked, using in-memory fallback"),window.localStorage||Object.defineProperty(window,"localStorage",{value:{_data:{},setItem:function(t,a){this._data[t]=String(a)},getItem:function(t){return this._data.hasOwnProperty(t)?this._data[t]:null},removeItem:function(t){delete this._data[t]},clear:function(){this._data={}}},writable:!0}),!1}}async function de(){le();let s;try{s=(await re(()=>import("./index-CQgKCrt3.js"),[])).default,console.log("EmailJS loaded successfully")}catch(a){console.error("Failed to load EmailJS (localStorage may be blocked):",a);const i=document.getElementById("contact-form");i&&i.addEventListener("submit",function(n){n.preventDefault(),C.error("Contact Form Unavailable","Please email me directly at saketh1805@gmail.com")});return}try{D.EMAILJS_PUBLIC_KEY,s.init(D.EMAILJS_PUBLIC_KEY),console.log("EmailJS initialized successfully")}catch(a){console.error("EmailJS initialization error:",a)}function e(){try{const a=localStorage.getItem("last_submission_time");if(a){const n=Date.now()-parseInt(a);if(n<3e5)return{limited:!0,remaining:Math.ceil((3e5-n)/6e4)}}}catch{console.warn("localStorage access denied, skipping rate limit check")}return{limited:!1}}let t=document.getElementById("contact-form");t||(t=document.querySelector("form.contact-form-modern")),console.log("Contact form found:",t),t?(console.log("Attaching submit listener to contact form"),t.addEventListener("submit",function(a){console.log("Form submit event triggered!"),a.preventDefault();const i=this.querySelector('input[name="_honey"]');if(i&&i.value){C.success("Message Sent!","I'll get back to you soon 👋"),this.reset();return}const n=this.querySelector('input[name="name"]').value.trim(),r=this.querySelector('input[name="email"]').value.trim(),o=this.querySelector('textarea[name="message"]').value.trim();if(!n||!r||!o){C.error("Missing Information","Please fill in all required fields.");return}if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r)){C.error("Invalid Email","Please enter a valid email address.");return}const l=e();if(l.limited){C.warning("Slow Down!",`Please wait ${l.remaining} minutes before sending another message.`);return}const h=this.querySelector("button[type='submit']"),p=h.textContent;h.classList.add("loading"),h.textContent="Sending...";const E=document.getElementById("email-time");E&&(E.value=new Date().toLocaleString()),s.sendForm(D.EMAILJS_SERVICE_ID,D.EMAILJS_TEMPLATE_ID,this).then(()=>{this.reset();try{localStorage.setItem("last_submission_time",Date.now().toString())}catch{console.warn("Could not save submission time to localStorage")}C.success("Message Sent!","Thanks for reaching out! I'll get back to you soon 👋"),h.classList.remove("loading"),h.textContent="Message Sent! 🚀",h.style.backgroundColor="var(--success)",setTimeout(()=>{h.textContent=p,h.style.backgroundColor=""},3e3)}).catch(S=>{h.classList.remove("loading"),h.textContent=p;let g=navigator.onLine?"Service Error":"No Internet Connection",u=navigator.onLine?"Something went wrong. Please try again later.":"Please check your connection and try again.";C.error(g,u),console.error("EmailJS Error:",S)})})):console.error("Contact form not found!")}function ue(){window.addEventListener("error",s=>{console.error("Global Error:",s.error)}),window.addEventListener("unhandledrejection",s=>{console.error("Unhandled Rejection:",s.reason)})}let w=null,_=null;async function W(){return w||_||(_=(async()=>{try{const s=await fetch("./data/projects.json");if(!s.ok)throw new Error(`Failed to load projects.json (${s.status})`);return w=await s.json(),w}catch(s){return console.error("ProjectsData load error:",s),{}}finally{_=null}})(),_)}function me(s){return w&&w[s]||null}function X(){return w?Object.values(w):[]}const y={profile:`
PROFILE & TRUTH CONTRACT:
- Full Name: Saketh Lingerker
- Primary Role & Status: Incoming Systems Engineer @ Tata Consultancy Services (TCS Digital Offer Accepted, Awaiting Official Onboarding).
- Truth Rule: Saketh ACCEPTED the TCS Digital offer following GET-IT (89%) & Cognitive NQT (91.51%) scores, but HAS NOT JOINED YET. Do NOT state that Saketh currently works at TCS.
- Core Summary: Software & AI Engineer specializing in Retrieval-Augmented Generation (RAG), Full-Stack REST APIs (Flask), Computer Vision (Stable Diffusion), and MLOps Cloud Pipelines (AWS + Docker + CI/CD).
- Location: Hyderabad, Telangana, India
- Links: Email: saketh1805@gmail.com | Portfolio: https://sakethlingerker.github.io/Portfolio/ | GitHub: https://github.com/sakethlingerker | LinkedIn: https://www.linkedin.com/in/sakethlingerker/
`,experience:`
EXPERIENCE:
1. Tata Consultancy Services (TCS iON Job Achiever)
   - Role: Graduate Engineer Trainee - IT (Systems Engineer Offer Accepted)
   - Duration: Jul 2025 - Feb 2026
   - Details: Accepted competitive TCS Digital / Systems Engineer offer following GET-IT and NQT readiness assessments. Currently awaiting official onboarding date.
   - Assessment Scores: TCS iON GET-IT (89%), TCS iON Cognitive NQT (91.51%), TCS Psychometric (High Performance), British Council English (CEFR B1 Speaking, B2+ Writing).

2. IIIT Hyderabad (International Institute of Information Technology)
   - Role: AI/ML Research Intern
   - Duration: Nov 2024 - Jun 2025
   - Truth Rule: Saketh was an AI/ML Research Intern (NOT a Master's student, NOT a Teaching Assistant, NOT a Co-founder).
   - Research Details: Researched Voice Activity Detection (VAD) algorithms for speech segment detection in noisy environments, built AI video summarization workflows, and conducted quantitative evaluations of acoustic feature extractors. Verified Research Certificate issued.
`,education:`
EDUCATION:
- Degree: Bachelor of Technology (B.Tech) in Computer Science & Engineering
- Institution: JNTUH University College of Engineering, Manthani
- Duration: Dec 2021 – Jul 2025
- CGPA: 7.47 / 10.0
- Truth Rule: Saketh completed B.Tech CSE at JNTUH. He DOES NOT hold a Master's degree.
`,skills:`
TECHNICAL SKILLS:
- Programming Languages: Python, JavaScript, SQL, HTML5, CSS3, C/C++
- AI & GenAI Frameworks: LangChain, FAISS, ChromaDB, Groq Llama 3.3 API, Google Gemini API, PyTorch, TensorFlow, Keras, Scikit-learn, OpenCV, NLTK, Stable Diffusion
- Backend & Databases: Flask RESTful APIs, JWT Authentication & RBAC, SQLite, MongoDB Atlas
- Cloud & MLOps Tools: AWS (EC2/ECR/S3), Docker Containerization, GitHub Actions CI/CD, Streamlit, Power BI, Git
- Truth Rule: Saketh does NOT use Azure or microservices frameworks not listed here.
`,certifications:`
CERTIFICATIONS & SCORES:
1. TCS iON NPT – GET IT: 89% Score (Verified PDF Certificate)
2. TCS iON NQT – Cognitive: 91.51% Score (Verified PDF Certificate)
3. TCS iON NQT – Psychometric: High Performance (Verified PDF Certificate)
4. TCS iON NPT – English with British Council: CEFR B1 Speaking, CEFR B2+ Writing (Verified PDF Certificate)
5. IIIT Hyderabad AI/ML Research Internship Certificate (Verified PDF Certificate)
`,projects:{}};function fe(s){s&&Object.values(s).forEach(e=>{var d,l,h;const t=e.id,a=e.quantifiableImpact?e.quantifiableImpact.map(p=>`${p.value} ${p.label}`).join(", "):"",i=e.tags?e.tags.join(", "):"",n=e.architecture?e.architecture.join(" -> "):"",r=((d=e.links)==null?void 0:d.github)||((l=e.links)==null?void 0:l.demo)||((h=e.links)==null?void 0:h.caseStudy)||"",o=`
PROJECT: ${e.title}
- Category: ${e.category}
- Tech Stack: ${i}
- Overview: ${e.subtitle||e.overview}
- Problem: ${e.problem||""}
- Solution: ${e.solution||""}
- Architecture: ${n}
- Impact: ${a}
- Link: ${r}
`;y.projects[t]=o,t==="mlops"&&(y.projects.mlops_pipeline=o),t==="interior_design"&&(y.projects.interior_designer=o)})}function pe(s,e=[]){const t=s.toLowerCase().trim();let a="GENERAL",i=[],n=[],r=null;if(e.length>0){const l=JSON.stringify(e).toLowerCase();l.includes("enterprise rag")||l.includes("enterprise-ready rag")?r=y.projects.enterprise_rag:l.includes("mlops")?r=y.projects.mlops_pipeline:l.includes("smart feedback")?r=y.projects.smart_feedback:l.includes("ats resume")&&(r=y.projects.ats_resume)}t.includes("compare")||t.includes("vs")||t.includes("versus")||t.includes("difference between")?(a="COMPARISON",i.push(y.projects.enterprise_rag),i.push(y.projects.smart_feedback),i.push(y.projects.mlops_pipeline),i.push(y.projects.ats_resume),n.push("⚖️ Project Matrix")):t.includes("recommend")||t.includes("best project")||t.includes("which project")||t.includes("hiring for")||t.includes("role")?(a="RECOMMENDATION",i.push(y.projects.enterprise_rag),i.push(y.projects.mlops_pipeline),i.push(y.projects.smart_feedback),n.push("🎯 Role Matcher")):t.includes("iiit")||t.includes("hyderabad")||t.includes("vad")||t.includes("speech")||t.includes("research")?(a="RESEARCH",i.push(y.experience),n.push("🔬 IIIT-H Research Intern")):t.includes("tcs")||t.includes("offer")||t.includes("get-it")||t.includes("nqt")||t.includes("digital")?(a="TCS",i.push(y.experience),i.push(y.certifications),n.push("💼 TCS Digital Offer")):t.includes("rag")||t.includes("langchain")||t.includes("faiss")||t.includes("llama")?(a="PROJECT",i.push(y.projects.enterprise_rag),n.push("🚀 Enterprise RAG Agent")):t.includes("mlops")||t.includes("aws")||t.includes("docker")||t.includes("ci/cd")?(a="PROJECT",i.push(y.projects.mlops_pipeline),n.push("⚙️ MLOps Pipeline")):t.includes("feedback")||t.includes("sentiment")||t.includes("nltk")||t.includes("jwt")?(a="PROJECT",i.push(y.projects.smart_feedback),n.push("⚡ Smart Feedback System")):t.includes("ats")||t.includes("gemini")||t.includes("resume")&&t.includes("expert")?(a="PROJECT",i.push(y.projects.ats_resume),n.push("📄 ATS Resume Expert")):t.includes("education")||t.includes("cgpa")||t.includes("college")||t.includes("jntuh")||t.includes("b.tech")||t.includes("degree")||t.includes("master")?(a="EDUCATION",i.push(y.education),n.push("🎓 Education @ JNTUH")):t.includes("skill")||t.includes("technology")||t.includes("technologies")||t.includes("stack")||t.includes("languages")||t.includes("tools")?(a="SKILLS",i.push(y.skills),n.push("🛠️ Tech Stack")):r&&(t.includes("why")||t.includes("how")||t.includes("choose")||t.includes("explain"))?(a="FOLLOW_UP",i.push(r),n.push("🔍 Follow-Up Context")):(a="ABOUT_ME",i.push(y.profile),i.push(y.experience),i.push(y.education),i.push(y.skills),n.push("📄 Verified Portfolio"));const o=[...new Set(i)].join(`
---
`),d=[...new Set(n)];return{intent:a,contextText:o,uniqueSources:d}}const ge=`You are Ask Saketh, Saketh Lingerker's Digital Twin Portfolio Assistant.

You speak as Saketh Lingerker's authorized digital representative and portfolio assistant.

STRICT TRUTH DIRECTIVES:
1. Answer ONLY using Saketh's verified portfolio information provided in the CONTEXT below.
2. NEVER invent experience, degrees, certifications, or technologies not explicitly listed in the context.
   - Saketh completed B.Tech CSE at JNTUH (Dec 2021 - Jul 2025 | CGPA 7.47/10.0). Saketh DOES NOT hold a Master's degree.
   - Saketh was an AI/ML Research Intern at IIIT Hyderabad (Nov 2024 - Jun 2025). Saketh was NOT a Teaching Assistant and NOT a Co-founder.
   - Saketh ACCEPTED the TCS Digital / Systems Engineer offer and is AWAITING JOINING. Saketh DOES NOT currently work at TCS.
   - Saketh does NOT use Azure or microservices frameworks not listed in his skills.
3. If the user asks for information NOT in the context, reply strictly:
   "I don't have verified information about that in Saketh's portfolio."

FORMATTING GUIDELINES:
- For Projects: Include Overview, Problem, Solution, Technologies, Architecture, Impact, and GitHub link.
- For Comparisons: Use a clean Markdown comparison table with metrics.
- For Role Recommendations: Detail the recommended projects with "Why it matters" bullet points.
- For Recruiter Summaries: Provide a clean, bulleted breakdown under 150 words.`;function he(s){if(!s)return"";let e=s.replace(/^### (.*$)/gim,"<h3>$1</h3>").replace(/^## (.*$)/gim,"<h2>$1</h2>").replace(/^# (.*$)/gim,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/__(.*?)__/g,"<strong>$1</strong>").replace(/\*(.*?)\*/g,"<em>$1</em>").replace(/```([\s\S]*?)```/g,"<pre><code>$1</code></pre>").replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\[([^\]]+)\]\(([^)]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1 🔗</a>').replace(/^[\•\-\*]\s+(.*$)/gim,"<li>$1</li>").replace(/(<li>.*<\/li>)/gim,"<ul>$1</ul>").replace(/\n\n/g,"<br/><br/>").replace(/\n/g,"<br/>");return e=e.replace(/<\/ul><br\/><ul>/g,"").replace(/<\/ul><ul>/g,""),e}class ve{constructor(){this.conversationHistory=[],this.dom={container:document.getElementById("ai-chatbot"),messages:document.getElementById("ai-chatbot-messages"),welcomeScreen:document.getElementById("chatbot-welcome-screen"),input:document.getElementById("chatbot-input"),sendBtn:document.getElementById("send-chatbot"),toggleBtn:document.getElementById("chatbot-toggle"),closeBtn:document.getElementById("close-chatbot"),clearBtn:document.getElementById("clear-chatbot")},this.init()}init(){var e,t,a,i,n;this.dom.container&&((e=this.dom.toggleBtn)==null||e.addEventListener("click",()=>this.toggle()),(t=this.dom.closeBtn)==null||t.addEventListener("click",()=>this.close()),(a=this.dom.clearBtn)==null||a.addEventListener("click",()=>this.clearChat()),(i=this.dom.sendBtn)==null||i.addEventListener("click",()=>this.handleUserInput()),(n=this.dom.input)==null||n.addEventListener("keydown",r=>{r.key==="Enter"&&this.handleUserInput()}),document.querySelectorAll(".prompt-chip").forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-prompt")||r.textContent.trim();this.submitPrompt(o)})}),this.createTypingIndicator())}toggle(){this.dom.container.classList.toggle("active")}close(){this.dom.container.classList.remove("active")}clearChat(){this.conversationHistory=[],this.dom.messages&&this.dom.welcomeScreen&&(this.dom.messages.innerHTML="",this.dom.messages.appendChild(this.dom.welcomeScreen),this.dom.welcomeScreen.style.display="flex",this.createTypingIndicator())}createTypingIndicator(){const e=document.createElement("div");e.className="typing-indicator",e.innerHTML='<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>',this.dom.messages.appendChild(e),this.typingIndicator=e}showTyping(){this.typingIndicator&&(this.typingIndicator.classList.add("active"),this.scrollToBottom())}hideTyping(){this.typingIndicator&&(this.typingIndicator.classList.remove("active"),this.dom.messages.appendChild(this.typingIndicator))}hideWelcomeScreen(){this.dom.welcomeScreen&&(this.dom.welcomeScreen.style.display="none")}appendUserMessage(e){this.hideWelcomeScreen();const t=document.createElement("div");t.className="message user-message",t.innerHTML=`<p>${e.replace(/</g,"&lt;").replace(/>/g,"&gt;")}</p>`,this.dom.messages.insertBefore(t,this.typingIndicator),this.scrollToBottom()}appendAIMessage(e,t=[]){this.hideWelcomeScreen();const a=he(e),i=document.createElement("div");i.className="message ai-message";let n="";t&&t.length>0&&(n=`<div class="message-sources">
        <span class="source-label"><i class="fas fa-microchip"></i> Digital Twin Context:</span>
        ${t.map(o=>`<span class="source-tag">${o}</span>`).join("")}
      </div>`),i.innerHTML=`
      <div class="ai-response-body">${a}</div>
      ${n}
      <div class="ai-response-actions">
        <button class="action-btn copy-btn" title="Copy Response"><i class="fas fa-copy"></i> Copy</button>
      </div>
    `,this.dom.messages.insertBefore(i,this.typingIndicator);const r=i.querySelector(".copy-btn");r&&r.addEventListener("click",()=>{navigator.clipboard.writeText(e).then(()=>{r.innerHTML='<i class="fas fa-check"></i> Copied',setTimeout(()=>{r.innerHTML='<i class="fas fa-copy"></i> Copy'},2e3)})}),this.scrollToBottom()}submitPrompt(e){e&&(this.appendUserMessage(e),this.fetchResponse(e))}handleUserInput(){const e=this.dom.input.value.trim();e&&(this.dom.input.value="",this.submitPrompt(e))}async fetchResponse(e){var n,r,o;this.showTyping();const{contextText:t,uniqueSources:a}=pe(e,this.conversationHistory),i=`VERIFIED PORTFOLIO CONTEXT (ONLY SOURCE OF TRUTH):
---
${t}
---

USER QUESTION:
${e}`;this.conversationHistory.push({role:"user",parts:[{text:i}]});try{const l=await(await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:this.conversationHistory,systemInstruction:ge})})).json();if(this.hideTyping(),l&&!l.fallback&&l.candidates&&((o=(r=(n=l.candidates[0])==null?void 0:n.content)==null?void 0:r.parts[0])!=null&&o.text)){const h=l.candidates[0].content.parts[0].text;this.conversationHistory.push({role:"model",parts:[{text:h}]}),this.appendAIMessage(h,a)}else this.appendAIMessage("I don't have verified information about that in Saketh's portfolio.",a)}catch{this.hideTyping(),this.appendAIMessage("I don't have verified information about that in Saketh's portfolio.",a)}}scrollToBottom(){this.dom.messages&&(this.dom.messages.scrollTop=this.dom.messages.scrollHeight)}}async function ye(){const s=await W();fe(s),window.chatbot=new ve}function be(){var p,E,S;const s=document.getElementById("portfolio-terminal"),e=document.getElementById("terminal-input"),t=document.getElementById("terminal-output"),a="saketh@portfolio:~$ ",i={TEXT:"text",HTML:"html",ACTION:"action",NULL:"null",ERROR:"error"},n={help:'Available commands: <span class="cmd-keyword">ls</span> - List portfolio sections <span class="cmd-keyword">goto [sec]</span> - Scroll to a section <span class="cmd-keyword">whoami</span> - About Saketh <span class="cmd-keyword">clear</span> - Clear terminal <span class="cmd-keyword">contact</span> - Show contact info <span class="cmd-keyword">skills</span> - List key skills',ls:'Sections: <span class="cmd-keyword">home</span>, <span class="cmd-keyword">experience</span>, <span class="cmd-keyword">skills</span>, <span class="cmd-keyword">projects</span>, <span class="cmd-keyword">achievements</span>, <span class="cmd-keyword">contact</span>',sections:'Available sections: <span class="cmd-keyword">home</span>, <span class="cmd-keyword">experience</span>, <span class="cmd-keyword">skills</span>, <span class="cmd-keyword">projects</span>, <span class="cmd-keyword">achievements</span>, <span class="cmd-keyword">contact</span>',whoami:"Saketh Lingerker - AI/ML Engineer & Full-Stack Developer.",skills:"AI/ML (TensorFlow, PyTorch, Generative AI), MLOps (AWS, Docker), Web (Flask, Django), Python, SQL.",projects:"ATS Resume Expert, AI Interior Designer, MLOps Pipeline, Polyglot AI, Crop Yield Prediction...",social:"GitHub: <a href='https://github.com/sakethlingerker' target='_blank'>github.com/sakethlingerker</a> <br>LinkedIn: <a href='https://www.linkedin.com/in/sakethlingerker/' target='_blank'>linkedin.com/in/sakethlingerker/</a>",contact:"Email: <a href='mailto:saketh1805@gmail.com'>saketh1805@gmail.com</a> | Phone: +91 8688791352","about.txt":"I am an AI/ML Engineer and Full-Stack Developer passionate about building intelligent systems. I specialize in Generative AI, MLOps, and scalable web applications.","contact.info":"Email: <a href='mailto:saketh1805@gmail.com'>saketh1805@gmail.com</a> | Phone: +91 8688791352","resume.pdf":"Opening resume..."},r={home:{id:"home",name:"Home",description:"Hero section with introduction"},experience:{id:"experience",name:"Experience & Education",description:"Timeline of work and education"},skills:{id:"skills",name:"Skills",description:"Technical skills and technologies"},projects:{id:"projects",name:"Projects",description:"Project showcase"},"project-matchmaker":{id:"project-matchmaker",name:"Project Matchmaker",description:"Interactive project recommender"},achievements:{id:"achievements",name:"Achievements",description:"Certifications and awards"},contact:{id:"contact",name:"Contact",description:"Get in touch section"}},o=g=>{var v;const u=g.toLowerCase().trim();if(u.startsWith("goto ")){const c=u.split(" ")[1];return d(c)}if(u.startsWith("cat ")){const c=u.split(" ")[1];return n[c]?{type:["contact.info","social","contact","help","ls","sections"].includes(c)?i.HTML:i.TEXT,content:n[c]}:{type:i.ERROR,content:`cat: ${c}: No such file or directory`}}if(r[u])return d(u);if(u==="about.txt"||u==="contact.info")return{type:u==="contact.info"?i.HTML:i.TEXT,content:n[u]};if(u==="resume"||u==="resume.pdf"){const c=document.querySelector('a[href*="Saketh_Lingerker_8688791352.pdf"]');return c?(c.click(),{type:i.TEXT,content:"Opening resume preview..."}):{type:i.ERROR,content:"Error: Resume file not found."}}return u==="social"?{type:i.HTML,content:n.social}:u==="contact"?{type:i.HTML,content:n.contact}:u==="theme"?((v=document.getElementById("theme-toggle"))==null||v.click(),{type:i.TEXT,content:"Theme toggled."}):u==="clear"?(t.innerHTML=`
        <div class="terminal-line">Welcome to Saketh's Interactive Terminal v1.0.0</div>
        <div class="terminal-line">Type 'help' to see available commands.</div>
        <div class="terminal-line">Tip: Try 'social' or 'goto projects' to navigate</div>
      `,{type:i.NULL,content:null}):u==="gui"||u==="exit"?(s.classList.remove("active"),{type:i.TEXT,content:"Exiting terminal mode..."}):u==="about"?{type:i.TEXT,content:n["about.txt"]}:u==="help"?{type:i.HTML,content:n.help}:u==="ls"?{type:i.HTML,content:n.ls}:u==="sections"?{type:i.HTML,content:n.sections}:u==="skills"?{type:i.TEXT,content:n.skills}:u==="projects"?{type:i.TEXT,content:n.projects}:u==="whoami"?{type:i.TEXT,content:n.whoami}:{type:i.ERROR,content:`Command not found: ${g}. Type 'help' for options.`}},d=g=>{const u=r[g];if(!u){const v=Object.keys(r).filter(c=>c.includes(g)||r[c].name.toLowerCase().includes(g));if(v.length===0)return{type:i.ERROR,content:`Section '${g}' not found. Available: ${Object.keys(r).join(", ")}`};if(v.length===1){const c=r[v[0]];return l(c.id),{type:i.TEXT,content:`Navigating to ${c.name}...`}}return{type:i.TEXT,content:`Multiple matches found: ${v.join(", ")}. Please be more specific.`}}return l(u.id),{type:i.TEXT,content:`Navigating to ${u.name}...`}},l=g=>{const u=document.getElementById(g);u?(s.classList.remove("active"),setTimeout(()=>{var m;const v=((m=document.querySelector("header"))==null?void 0:m.offsetHeight)||80,f=u.getBoundingClientRect().top+window.pageYOffset-v;window.scrollTo({top:f,behavior:"smooth"}),u.style.boxShadow="0 0 0 3px var(--accent)",setTimeout(()=>{u.style.boxShadow=""},2e3)},300)):console.warn(`Section with id '${g}' not found`)},h=()=>{t.innerHTML=`
      <div class="terminal-line">Welcome to Saketh's Interactive Terminal v1.0.0</div>
      <div class="terminal-line">Type 'help' to see available commands.</div>
      <div class="terminal-line">Tip: Try 'social' or 'goto projects' to navigate</div>
    `};if((p=document.getElementById("terminal-toggle"))==null||p.addEventListener("click",()=>{s.classList.toggle("active"),s.classList.contains("active")&&setTimeout(()=>e.focus(),100)}),(E=document.getElementById("close-terminal"))==null||E.addEventListener("click",()=>{s.classList.remove("active")}),window.addEventListener("keydown",g=>{g.key==="`"&&!g.ctrlKey&&!g.metaKey&&(g.preventDefault(),s.classList.toggle("active"),s.classList.contains("active")&&setTimeout(()=>e.focus(),100))}),e){e.addEventListener("keypress",v=>{if(v.key==="Enter"){const c=e.value;if(e.value="",c.trim().toLowerCase()!=="clear"){const f=document.createElement("div");f.className="terminal-line",f.innerHTML=`<span class="terminal-prompt">${a}</span><span class="terminal-command-history">${c}</span>`,t.appendChild(f)}try{const f=o(c);if(f.type!==i.NULL){const m=document.createElement("div");m.className="terminal-line command-output",f.type===i.ERROR&&m.classList.add("error"),f.type===i.HTML?m.innerHTML=f.content:m.textContent=f.content,t.appendChild(m)}}catch(f){console.error("Terminal Error:",f);const m=document.createElement("div");m.className="terminal-line command-output error",m.textContent="System Error: "+f.message,t.appendChild(m)}t.scrollTop=t.scrollHeight}});let g=[],u=-1;e.addEventListener("keydown",v=>{if(v.key==="ArrowUp")v.preventDefault(),g.length>0&&(u<0?u=g.length-1:u>0&&u--,e.value=g[u]||"");else if(v.key==="ArrowDown")v.preventDefault(),g.length>0&&(u<g.length-1?(u++,e.value=g[u]||""):(u=g.length,e.value=""));else if(v.key==="Enter"){const c=e.value.trim();c&&c.toLowerCase()!=="clear"&&(g.push(c),u=g.length)}})}e&&e.addEventListener("input",g=>{const u=e.value.trim();if(u.startsWith("goto ")){const v=u.substring(5).toLowerCase();Object.keys(r).filter(f=>f.startsWith(v)||r[f].name.toLowerCase().startsWith(v)).length}}),(S=document.getElementById("close-terminal-traffic-light"))==null||S.addEventListener("click",()=>{s.classList.remove("active")}),h()}let A={},F="enterprise_rag",j="all";async function Ee(){if(document.querySelector(".finder-window")){try{if(A=await W(),!A||Object.keys(A).length===0)return}catch(e){console.error("Failed to initialize projects module:",e);return}Se(),Te(),ke(),Z(),z(F)}}function Se(){const s=document.querySelectorAll(".finder-cat-btn");s.forEach(e=>{e.addEventListener("click",()=>{s.forEach(t=>t.classList.remove("active")),e.classList.add("active"),j=e.getAttribute("data-category"),Z()})})}function Te(){const s=document.querySelector("#finder-mobile-toggle"),e=document.querySelector("#finder-sidebar");!s||!e||s.addEventListener("click",()=>{e.classList.toggle("mobile-open");const t=e.classList.contains("mobile-open");s.innerHTML=t?'<i class="fas fa-times"></i> <span>Close</span>':'<i class="fas fa-list"></i> <span>Projects</span>'})}function ke(){const s=document.querySelector("#finder-lightbox"),e=document.querySelector("#finder-lightbox-backdrop"),t=document.querySelector("#finder-lightbox-close");if(!s)return;const a=()=>{s.classList.remove("active"),s.setAttribute("aria-hidden","true"),document.body.classList.remove("finder-lightbox-open")};e&&e.addEventListener("click",a),t&&t.addEventListener("click",a),s.addEventListener("click",i=>{(i.target===s||i.target.classList.contains("finder-lightbox-container"))&&a()}),document.addEventListener("keydown",i=>{i.key==="Escape"&&s.classList.contains("active")&&a()})}function Le(s,e){const t=document.querySelector("#finder-lightbox"),a=document.querySelector("#finder-lightbox-img"),i=document.querySelector("#finder-lightbox-caption");!t||!a||(a.src=s,a.alt=e,i&&(i.textContent=`${e} — Click outside to close`),t.classList.add("active"),t.setAttribute("aria-hidden","false"),document.body.classList.add("finder-lightbox-open"))}function we(){const s=Object.values(A);return j==="all"?s:j==="featured"?s.filter(e=>e.isFeatured===!0):s.filter(e=>e.category===j)}function Z(){const s=document.querySelector("#finder-project-list");if(!s)return;const e=we();if(e.length===0){s.innerHTML=`
      <div class="finder-empty-state">
        <i class="fas fa-folder-open" style="margin-bottom: 6px; font-size: 1.1rem; opacity: 0.5;"></i>
        <p>No projects match criteria</p>
      </div>
    `;return}s.innerHTML=e.map(t=>{const a=t.id===F?"active":"",i=t.heroImage||"src/assets/enterprise_rag_agent.png";return`
        <div class="finder-nav-item ${a}" data-id="${t.id}" tabindex="0" role="button" aria-label="Select ${t.title}">
          <div class="finder-item-thumb-wrapper">
            <img src="${i}" alt="${t.title}" class="finder-item-thumb" />
          </div>
          <div class="finder-item-info">
            <div class="finder-item-title">${t.title}</div>
            <div class="finder-item-subtitle">${t.subtitle||t.category}</div>
          </div>
          <div class="finder-active-indicator"></div>
        </div>
      `}).join(""),s.querySelectorAll(".finder-nav-item").forEach(t=>{const a=()=>{const i=t.getAttribute("data-id");i&&i!==F&&ee(i);const n=document.querySelector("#finder-sidebar");if(n&&n.classList.contains("mobile-open")){n.classList.remove("mobile-open");const r=document.querySelector("#finder-mobile-toggle");r&&(r.innerHTML='<i class="fas fa-list"></i> <span>Projects</span>')}};t.addEventListener("click",a),t.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),a())})})}function ee(s){if(!A[s])return;F=s,document.querySelectorAll(".finder-nav-item").forEach(a=>{a.getAttribute("data-id")===s?a.classList.add("active"):a.classList.remove("active")});const e=document.querySelector("#finder-detail-container"),t=document.querySelector("#finder-workspace");e?(e.classList.add("finder-fade-out"),setTimeout(()=>{z(s),e.classList.remove("finder-fade-out"),t&&(t.scrollTop=0)},200)):(z(s),t&&(t.scrollTop=0))}function Ie(s,e="ai-ml"){if(!s||s.length===0)return"";const t=(i,n,r)=>{const o=i.toLowerCase();let d="PROCESSING";n===0||o.includes("upload")||o.includes("ingestion")||o.includes("input")||o.includes("dataset")||o.includes("raw")||o.includes("client")||o.includes("source")||o.includes("search")||o.includes("user")?e==="fullstack"?d="FRONTEND":e==="mlops"?d="DATA SOURCE":d="INPUT":n===r-1||o.includes("output")||o.includes("citation")||o.includes("dashboard")||o.includes("ui")||o.includes("prediction")||o.includes("result")||o.includes("delivery")||o.includes("monitoring")||o.includes("pages")||o.includes("report")?e==="fullstack"?d="RESPONSE":e==="mlops"?d="MONITORING":e==="datascience"?d="PREDICTION":d="OUTPUT":o.includes("vector")||o.includes("faiss")||o.includes("chroma")||o.includes("retriev")?d="RETRIEVAL":o.includes("mongo")||o.includes("sql")||o.includes("database")?d="DATABASE":o.includes("registry")?d="MODEL REGISTRY":o.includes("model")||o.includes("llm")||o.includes("neural")||o.includes("pytorch")||o.includes("groq")||o.includes("gemini")||o.includes("classifi")||o.includes("ensemble")||o.includes("svm")||o.includes("stable diffusion")||o.includes("keras")?d="INTELLIGENCE":o.includes("evaluat")||o.includes("validat")||o.includes("benchmark")?d="EVALUATION":o.includes("api")||o.includes("flask")||o.includes("backend")||o.includes("express")?d="BACKEND API":o.includes("deploy")||o.includes("docker")||o.includes("ecr")||o.includes("ec2")||o.includes("cicd")||o.includes("action")?d="DEPLOYMENT":(o.includes("chunk")||o.includes("parse")||o.includes("preprocess")||o.includes("normaliz")||o.includes("clean")||o.includes("feature")||o.includes("extract")||o.includes("token"))&&(o.includes("feature")?d="FEATURE ENG":d="PROCESSING");let l=i,h="";if(i.includes("&")){const p=i.split("&");l=p[0].trim(),h=p.slice(1).join("&").trim()}else if(i.includes("-")){const p=i.split("-");l=p[0].trim(),h=p.slice(1).join("-").trim()}else if(i.includes("(")){const p=i.split("(");l=p[0].trim(),h=p[1].replace(")","").trim()}else if(i.includes(":")){const p=i.split(":");l=p[0].trim(),h=p.slice(1).join(":").trim()}return{stepNumber:String(n+1).padStart(2,"0"),category:d,title:l,desc:h}};return`
    <div class="finder-card span-full finder-system-architecture-card">
      <div class="finder-system-flow-header">
        <span class="finder-sys-eyebrow">SYSTEM ARCHITECTURE</span>
        <h3 class="finder-card-header"><i class="fas fa-sitemap"></i> How It Works</h3>
      </div>
      <div class="finder-system-flow-container">
        <div class="finder-system-flow-track">
          ${s.map((i,n)=>{const{stepNumber:r,category:o,title:d,desc:l}=t(i,n,s.length),h=n===s.length-1;return`
        <div class="finder-sys-stage" data-step="${r}">
          <div class="finder-sys-stage-box">
            <div class="finder-sys-stage-meta">
              <span class="finder-sys-num">[${r}]</span>
              <span class="finder-sys-cat">${o}</span>
            </div>
            <h4 class="finder-sys-title">${d}</h4>
            ${l?`<p class="finder-sys-desc">${l}</p>`:""}
          </div>
          ${h?"":`
            <div class="finder-sys-connector" aria-hidden="true">
              <i class="fas fa-arrow-right sys-conn-arrow"></i>
            </div>
          `}
        </div>
      `}).join("")}
        </div>
      </div>
    </div>
  `}function z(s){var c,f;const e=A[s]||X()[0];if(!e)return;const t=document.querySelector("#finder-breadcrumb");t&&(t.textContent=`Projects / ${e.title}`);const a=document.querySelector("#finder-detail-container");if(!a)return;const i=e.heroImage||"src/assets/enterprise_rag_agent.png",n=e.techStackDetailed?e.techStackDetailed.map(m=>`
      <span class="finder-tech-badge" title="${m.name}">
        <img src="${m.badge}" alt="${m.name}" loading="lazy" />
      </span>
    `).join(""):(e.tags||[]).map(m=>`<span class="finder-tag-pill">${m}</span>`).join(""),r=e.keyFeatures?e.keyFeatures.map(m=>`
      <li><i class="fas fa-check-circle"></i> <span>${m}</span></li>
    `).join(""):"",o=Ie(e.architecture,e.category),d=e.quantifiableImpact?e.quantifiableImpact.map(m=>`
      <div class="finder-impact-card">
        <div class="finder-impact-val">${m.value}</div>
        <div class="finder-impact-lbl">${m.label}</div>
      </div>
    `).join(""):"",l=e.relatedProjectIds?e.relatedProjectIds.map(m=>{const b=A[m];return b?`
        <div class="finder-related-card" data-rel-id="${b.id}" tabindex="0" role="button" aria-label="View related project ${b.title}">
          <img src="${b.heroImage||"src/assets/enterprise_rag_agent.png"}" alt="${b.title}" class="finder-related-thumb" />
          <div class="finder-related-info">
            <div class="finder-related-title">${b.title}</div>
            <span class="finder-related-cat">${b.category}</span>
          </div>
        </div>
      `:""}).join(""):"",p={"ai-ml":"AI / Machine Learning",fullstack:"Full Stack Web Engineering",mlops:"MLOps & Cloud Architecture",datascience:"Data Science & Analytics"}[e.category]||e.category.toUpperCase(),E=((c=e.links)==null?void 0:c.github)||null,S=((f=e.links)==null?void 0:f.demo)||null;a.innerHTML=`
    <!-- TOP WORKSPACE HEADER & HERO IMAGE (Strict Hierarchy: Category -> Title -> Subtitle -> Action Links -> Screenshot Frame) -->
    <div class="finder-workspace-header">
      <div class="finder-header-info">
        <div class="finder-meta-bar">
          <span class="finder-category-badge">${p}</span>
          ${e.isFeatured?'<span class="finder-featured-badge"><i class="fas fa-star"></i> Featured</span>':""}
        </div>
        <h1 class="finder-project-title">${e.title}</h1>
        <p class="finder-project-subtitle">${e.subtitle||e.overview}</p>
        
        <div class="finder-action-links">
          ${S?`<a href="${S}" target="_blank" rel="noopener noreferrer" class="btn btn-primary finder-btn-cta"><i class="fas fa-external-link-alt"></i> Live Demo</a>`:""}
          ${E?`<a href="${E}" target="_blank" rel="noopener noreferrer" class="btn btn-outline finder-btn-cta"><i class="fab fa-github"></i> GitHub Repo</a>`:""}
        </div>
      </div>

      <div class="finder-preview-frame" tabindex="0" role="button" aria-label="Click to enlarge ${e.title} preview image">
        <div class="finder-frame-bar">
          <span class="finder-frame-url">${e.title.toLowerCase().replace(/[^a-z0-9]/g,"-")}.local</span>
        </div>
        <div class="finder-preview-img-wrapper">
          <img src="${i}" alt="${e.title} Preview" class="finder-preview-img" />
          <div class="finder-zoom-overlay">
            <i class="fas fa-search-plus"></i> <span>Click to Enhance</span>
          </div>
        </div>
      </div>
    </div>

    <!-- PROMINENT MOBILE-ONLY DETAILS TOGGLE BUTTON -->
    <button 
      id="finder-mobile-details-toggle" 
      class="btn-mobile-details-toggle" 
      aria-expanded="false" 
      aria-controls="finder-details-grid-wrapper" 
      type="button"
    >
      <span class="toggle-text">View Project Details</span>
      <i class="fas fa-chevron-down toggle-chevron" aria-hidden="true"></i>
    </button>

    <!-- WORKSPACE BENTO DETAILS GRID WRAPPER (Documented Case Study Content) -->
    <div id="finder-details-grid-wrapper" class="finder-details-grid-wrapper mobile-collapsed">
      <div class="finder-details-grid">
        <!-- 1. OVERVIEW -->
        <div class="finder-card span-full">
          <h3 class="finder-card-header"><i class="fas fa-align-left"></i> Overview</h3>
          <p class="finder-card-text">${e.overview}</p>
        </div>

        <!-- 2. PROBLEM & SOLUTION -->
        <div class="finder-card span-half">
          <h3 class="finder-card-header"><i class="fas fa-exclamation-triangle"></i> Problem Statement</h3>
          <p class="finder-card-text">${e.problem}</p>
        </div>

        <div class="finder-card span-half">
          <h3 class="finder-card-header"><i class="fas fa-lightbulb"></i> Engineering Solution</h3>
          <p class="finder-card-text">${e.solution}</p>
        </div>

        <!-- 3. SYSTEM ARCHITECTURE / HOW IT WORKS -->
        ${o}

        <!-- 4. QUANTIFIED IMPACT & TECH STACK -->
        ${d?`
          <div class="finder-card span-half">
            <h3 class="finder-card-header"><i class="fas fa-chart-line"></i> Quantified Impact</h3>
            <div class="finder-impact-grid">
              ${d}
            </div>
          </div>
        `:""}

        <div class="finder-card ${d?"span-half":"span-full"}">
          <h3 class="finder-card-header"><i class="fas fa-cubes"></i> Technology Stack</h3>
          <div class="finder-tech-badges">
            ${n}
          </div>
        </div>

        <!-- 5. KEY FEATURES & ENGINEERING DECISIONS -->
        ${r?`
          <div class="finder-card span-half">
            <h3 class="finder-card-header"><i class="fas fa-list-check"></i> Key Features</h3>
            <ul class="finder-features-list">
              ${r}
            </ul>
          </div>
        `:""}

        ${e.engineeringDecisions?`
          <div class="finder-card span-half">
            <h3 class="finder-card-header"><i class="fas fa-cogs"></i> Engineering Decisions</h3>
            <ul class="finder-features-list">
              ${e.engineeringDecisions.map(m=>`<li><i class="fas fa-sliders-h"></i> <span>${m}</span></li>`).join("")}
            </ul>
          </div>
        `:""}

        <!-- 6. RELATED PROJECTS -->
        ${l?`
          <div class="finder-card span-full">
            <h3 class="finder-card-header"><i class="fas fa-network-wired"></i> Related Projects</h3>
            <div class="finder-related-grid">
              ${l}
            </div>
          </div>
        `:""}
      </div>
    </div>
  `;const g=a.querySelector("#finder-mobile-details-toggle"),u=a.querySelector("#finder-details-grid-wrapper");g&&u&&g.addEventListener("click",()=>{g.getAttribute("aria-expanded")==="true"?(g.setAttribute("aria-expanded","false"),u.classList.remove("expanded"),u.classList.add("mobile-collapsed"),g.querySelector(".toggle-text").textContent="View Project Details",g.querySelector(".toggle-chevron").className="fas fa-chevron-down toggle-chevron"):(g.setAttribute("aria-expanded","true"),u.classList.remove("mobile-collapsed"),u.classList.add("expanded"),g.querySelector(".toggle-text").textContent="Hide Project Details",g.querySelector(".toggle-chevron").className="fas fa-chevron-up toggle-chevron")});const v=a.querySelector(".finder-preview-frame");if(v){const m=()=>Le(i,e.title);v.addEventListener("click",m),v.addEventListener("keydown",b=>{(b.key==="Enter"||b.key===" ")&&(b.preventDefault(),m())})}a.querySelectorAll(".finder-related-card").forEach(m=>{const b=()=>{const T=m.getAttribute("data-rel-id");T&&ee(T)};m.addEventListener("click",b),m.addEventListener("keydown",T=>{(T.key==="Enter"||T.key===" ")&&(T.preventDefault(),b())})})}let U={};async function Ce(){window.handleQuizAnswer=Ae,window.resetQuiz=Pe,await W()}function Ae(s,e){U[`q${s}`]=e;const t=document.getElementById("quiz-progress-fill");if(t&&(t.style.width=`${s/2*100}%`),s===1){const a=document.getElementById("quiz-q2-text"),i=document.getElementById("quiz-q2-options"),n=document.getElementById("quiz-step-1"),r=document.getElementById("quiz-step-2");n&&n.classList.remove("active"),r&&r.classList.add("active"),e==="genai"?(a&&(a.textContent="What interests you most?"),i&&(i.innerHTML=`
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'resume')">
                        <i class="fas fa-file-alt"></i>
                        <span>Automating Resume Optimization</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'visual')">
                        <i class="fas fa-palette"></i>
                        <span>Visual Design & Creativity</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'language')">
                        <i class="fas fa-language"></i>
                        <span>Global Language Detection</span>
                    </button>
                `)):e==="ml_data"?(a&&(a.textContent="What interests you most?"),i&&(i.innerHTML=`
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'financial')">
                        <i class="fas fa-dollar-sign"></i>
                        <span>Predicting Financial/Travel Costs</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'agriculture')">
                        <i class="fas fa-seedling"></i>
                        <span>Optimizing Agriculture Output</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'environmental')">
                        <i class="fas fa-leaf"></i>
                        <span>Visualizing Environmental Impact</span>
                    </button>
                `)):(a&&(a.textContent="What interests you most?"),i&&(i.innerHTML=`
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'backend')">
                        <i class="fas fa-database"></i>
                        <span>Complex Backend & Analytics</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'frontend')">
                        <i class="fas fa-mobile-alt"></i>
                        <span>Frontend UX & APIs</span>
                    </button>
                    <button class="quiz-option-btn" onclick="handleQuizAnswer(2, 'cloud')">
                        <i class="fas fa-cloud"></i>
                        <span>Cloud Infra & CI/CD Pipelines</span>
                    </button>
                `))}else s===2&&xe()}function xe(){var h,p;const s=document.getElementById("quiz-step-2"),e=document.getElementById("quiz-result-step");s&&s.classList.remove("active"),e&&e.classList.add("active");const t={genai_resume:"ats_resume",genai_visual:"interior_design",genai_language:"polyglot",ml_data_financial:"flight_fare",ml_data_agriculture:"crop_yield",ml_data_environmental:"clearview",engineering_backend:"smart_feedback",engineering_frontend:"cloudcast",engineering_cloud:"mlops"},a=`${U.q1}_${U.q2}`,i=t[a];let n=me(i);n||(n=X()[0]||null);const r=document.getElementById("quiz-recommendation-display");if(!r||!n)return;const o=((h=n.links)==null?void 0:h.github)||((p=n.links)==null?void 0:p.caseStudy)||"#",d=(n.tags||[]).slice(0,4).map(E=>`<span class="result-tag">${E}</span>`).join("");r.innerHTML=`
        <div class="quiz-results-header">
            <i class="fas fa-check-circle" style="font-size: 2.5rem; color: var(--accent); margin-bottom: 1rem;"></i>
            <h3 style="margin-bottom: 0.5rem;">Perfect Match Found!</h3>
            <p style="color: var(--text-secondary); margin-bottom: 2rem;">
                Based on your interests, here's your best project match
            </p>
        </div>
        
        <div class="single-result-container">
            <div class="quiz-result-card featured-match">
                <div class="relevance-badge">Perfect Match</div>
                <h4 class="result-card-title">${n.title}</h4>
                <p class="result-card-description">${n.subtitle||n.overview}</p>
                <div class="result-card-tags">
                    ${d}
                </div>
                <a href="${o}" target="_blank" rel="noopener noreferrer" 
                   class="result-card-btn">
                    <i class="fab fa-github"></i> View Project
                </a>
            </div>
        </div>
    `;const l=document.querySelector("#quiz-result-step .primary-btn");l&&(l.style.display="inline-block")}function Pe(){U={};const s=document.getElementById("quiz-result-step"),e=document.getElementById("quiz-step-2"),t=document.getElementById("quiz-step-1");s&&s.classList.remove("active"),e&&e.classList.remove("active"),t&&t.classList.add("active");const a=document.getElementById("quiz-progress-fill");a&&(a.style.width="0%")}const te=[{id:"iiit_aiml_research",title:"AI/ML Research Internship",issuer:"IIIT Hyderabad (LTRC)",issuerLogo:"https://cdn.brandfetch.io/idLjtzedAZ/w/388/h/200/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",date:"Dec 2024 to May 2025",category:"AI / ML",score:"6 Months",credentialId:null,isFeatured:!0,skills:["Voice Activity Detection (VAD)","Automatic Speech Recognition (ASR)","Question and Answering","Video Stitching"],image:"assets/certificates/SakethCertificate-IIIT.png",pdfUrl:"assets/certificates/SakethCertificate-IIIT.pdf",type:"certification",description:"Six-month research internship at Speech Lab, Language Technologies Research Center (LTRC), IIIT Hyderabad focusing on Multimodal Multi-video Question Answering."},{id:"iiit_aiml_proficiency",title:"Certificate of Proficiency – AI / ML Training Course",issuer:"iHub-Data, IIIT Hyderabad",issuerLogo:"https://cdn.brandfetch.io/idLjtzedAZ/w/388/h/200/theme/dark/logo.png?c=1dxbfHSJFAPEGdCLU4o5B",date:"May 2024 to Oct 2024",category:"AI / ML",score:"Certified",credentialId:null,isFeatured:!0,skills:["Artificial Intelligence","Machine Learning","Neural Networks","Deep Learning Fundamentals"],image:"assets/certificates/IIIT-AIML.jpg",pdfUrl:"assets/certificates/IIIT-AIML.jpg",verificationUrl:null,type:"certification",description:"Six-month intensive training course on Artificial Intelligence/Machine Learning conducted by iHub-Data, IIIT Hyderabad."},{id:"aws_cloud_essentials",title:"AWS Cloud Practitioner Essentials",issuer:"Amazon Web Services (AWS)",issuerLogo:"https://cdn.brandfetch.io/idqS9w5p2H/theme/dark/logo.png",date:"April 16, 2025",category:"Cloud",score:"Completed",credentialId:null,isFeatured:!0,skills:["Cloud Computing Fundamentals","AWS Architecture","Security & Billing"],image:"assets/certificates/AWS Cloud Practitioner Essentials.png",pdfUrl:"assets/certificates/AWS Cloud Practitioner Essentials.pdf",verificationUrl:"https://drive.google.com/file/d/1BuBgZQuYN4Y1LD1ccRbLMw-fSFjB_yol/view",type:"certification",description:"Official AWS Training & Certification validating core AWS Cloud Practitioner Essentials knowledge."},{id:"aws_certified_ai_practitioner_prep",title:"AWS Certified AI Practitioner (AIF-C01) Exam Prep",issuer:"Amazon Web Services (AWS)",issuerLogo:"https://cdn.brandfetch.io/idqS9w5p2H/theme/dark/logo.png",date:"April 2025",category:"AI / ML",score:"Completed",credentialId:null,isFeatured:!1,skills:["AWS Certified AI Practitioner (AIF-C01)","Generative AI","Machine Learning Services"],image:"assets/certificates/AWS Skill Builder Course Completion Certificate.png",pdfUrl:"assets/certificates/AWS Skill Builder Course Completion Certificate.pdf",verificationUrl:null,type:"certification",description:"AWS Skill Builder Certificate of Completion for Exam Prep Standard Course: AWS Certified AI Practitioner (AIF-C01)."},{id:"tcs_npt_proficiency_get",title:"Certificate of Proficiency – Graduate Engineer Trainee - IT",issuer:"TCS iON",issuerLogo:"https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",date:"February 9th, 2026",category:"Professional",score:"Certified",credentialId:"26090211096",isFeatured:!1,skills:["Graduate Engineer Trainee - IT","Software Engineering","Systems Proficiency"],image:"assets/certificates/Certificate of Proficiency.png",pdfUrl:"assets/certificates/Certificate of Proficiency.pdf",verificationUrl:null,type:"certification",description:"TCS iON Certificate of Proficiency designating qualification as Graduate Engineer Trainee - IT."},{id:"tcs_nqt_cognitive",title:"TCS iON NQT – Cognitive",issuer:"TCS iON",issuerLogo:"https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",date:"February 9th, 2026",category:"Professional",score:"91.51%",credentialId:"22071644909",isFeatured:!0,skills:["Numerical Ability (600/600)","Verbal Ability (566.92/600)","Reasoning Ability (480.32/600)"],image:"assets/certificates/TCS iON NQT - Cognitive.png",pdfUrl:"assets/certificates/TCS iON NQT - Cognitive.pdf",verificationUrl:null,type:"certification",description:"Standardized TCS iON National Qualifier Test (Cognitive) evaluating numerical ability, verbal proficiency, and logical reasoning."},{id:"deloitte_analytics_job_sim",title:"Data Analytics Job Simulation",issuer:"Deloitte Australia",issuerLogo:"https://cdn.brandfetch.io/idIu-Ji9Le/theme/light/logo.svg?c=1bxid64Mup7aczewSAYMX&t=1668076193075",date:"December 11th, 2025",category:"Data",score:"Completed",credentialId:"RubyKoEwttXCc7pDv",isFeatured:!1,skills:["Data Analysis","Forensic Technology","Executive Data Storytelling"],image:"assets/certificates/Data Analytics Job Simulation.png",pdfUrl:"assets/certificates/Data Analytics Job Simulation.pdf",verificationUrl:"https://www.theforage.com/completion-certificates/9PBTqmSxAf6zZTseP/io9DzWKe3PTsiS6GG_9PBTqmSxAf6zZTseP_ffNQ5dnLojDbCZyqH_1765434824832_completion_certificate.pdf",type:"certification",description:"Deloitte Australia virtual job simulation via Forage completing practical tasks in Data Analysis and Forensic Technology."},{id:"genai_data_analytics_sim",title:"GenAI Powered Data Analytics Job Simulation",issuer:"Forage",issuerLogo:"https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",date:"December 12th, 2025",category:"Data",score:"Completed",credentialId:"4pc3JgG3CEuqSST9g",isFeatured:!1,skills:["Exploratory Data Analysis & Risk Profiling","Predicting Delinquency with AI","AI-driven Collections Strategy"],image:"assets/certificates/GenAI Powered Data Analytics Job Simulation.png",pdfUrl:"assets/certificates/GenAI Powered Data Analytics Job Simulation.pdf",verificationUrl:"https://www.theforage.com/completion-certificates/ifobHAoMjQs9s6bKS/gMTdCXwDdLYoXZ3wG_ifobHAoMjQs9s6bKS_ffNQ5dnLojDbCZyqH_1765520887303_completion_certificate.pdf",type:"certification",description:"Practical virtual tasks in EDA, risk profiling, AI delinquency prediction, and AI-driven business report strategy."},{id:"tcs_npt_get_it",title:"TCS iON NPT – GET IT",issuer:"TCS iON",issuerLogo:"https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",date:"February 9th, 2026",category:"Professional",score:"89.00%",credentialId:"26090211096",isFeatured:!0,skills:["Test of Knowledge (45/50)","Test of Application (44/50)","IT Engineering Systems"],image:"assets/certificates/TCS iON NPT - GET IT.png",pdfUrl:"assets/certificates/TCS iON NPT - GET IT.pdf",verificationUrl:null,type:"certification",description:"TCS iON National Proficiency Test for Graduate Engineer Trainee - IT assessing domain knowledge and practical application."},{id:"tcs_english_british_council",title:"TCS iON NPT – English with British Council",issuer:"TCS iON & British Council",issuerLogo:"https://cdn.brandfetch.io/id_rL0cW_y/theme/dark/logo.png",date:"February 9th, 2026",category:"Professional",score:"B1 / B2+",credentialId:"26090211144",isFeatured:!1,skills:["CEFR B1 Speaking","CEFR B2+ Writing","Business Communication"],image:"assets/certificates/English with British Council.png",pdfUrl:"assets/certificates/English with British Council.pdf",verificationUrl:null,type:"certification",description:"TCS iON NPT & British Council proficiency evaluation certifying CEFR B1 in Speaking and CEFR B2+ in Writing based on Aptis testing."}];function ie(){return te}function $e(s){return te}let Me="",L=null;function Oe(){if(!(document.querySelector("#achievements")||document.querySelector(".certifications-section")))return;const e=ie();e.length>0&&(L=e[0].id),H()}function _e(){let s=ie();return Me.trim()&&(s=$e()),s}function H(){const s=_e(),e=document.querySelector("#cert-grid-root"),t=document.querySelector("#cert-inspector-root");if(!e||!t)return;if(s.length===0){e.innerHTML=`
      <div style="grid-column: span 2; padding: 40px; text-align: center; color: #8b949e;">
        <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 10px; opacity: 0.5;"></i>
        <p>No certifications match your criteria</p>
      </div>
    `,t.innerHTML='<div style="padding: 20px; color: #8b949e; text-align: center;">Select a certification to inspect details</div>';return}!s.some(r=>r.id===L)&&s.length>0&&(L=s[0].id),e.innerHTML=s.map(r=>`
        <div class="cert-item-card ${r.id===L?"active":""}" data-id="${r.id}">
          <div class="cert-card-top">
            <div class="cert-card-title-group">
              <h5 class="cert-card-title">${r.title}</h5>
              <p class="cert-card-issuer">${r.issuer}</p>
            </div>
            ${r.score?`<span class="cert-card-score">${r.score}</span>`:""}
          </div>
          <div class="cert-card-bottom">
            <span class="cert-card-date"><i class="far fa-calendar-alt"></i> ${r.date}</span>
            <span class="cert-card-cat">${r.category}</span>
          </div>
        </div>
      `).join(""),e.querySelectorAll(".cert-item-card").forEach(r=>{r.addEventListener("click",()=>{const o=r.getAttribute("data-id");o&&(L=o,H())})});const i=s.findIndex(r=>r.id===L),n=s[i>=0?i:0];if(n){t.innerHTML=`
      <div class="cert-inspector-panel">
        <div class="inspector-nav-header">
          <div class="inspector-counter">
            <button class="nav-arrow-btn" id="cert-nav-prev" ${i===0?'disabled style="opacity:0.3;"':""}>
              <i class="fas fa-chevron-left"></i>
            </button>
            <span>${i+1} / ${s.length}</span>
            <button class="nav-arrow-btn" id="cert-nav-next" ${i===s.length-1?'disabled style="opacity:0.3;"':""}>
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>

        <div class="inspector-preview-frame" id="inspector-preview-trigger">
          <img src="${n.image}" alt="${n.title}" class="inspector-preview-img" onerror="this.src='src/assets/enterprise_rag_agent.png'" />
        </div>

        <div class="inspector-details">
          <h3 class="inspector-title">${n.title}</h3>
          <p class="inspector-issuer">${n.issuer}</p>

          <div class="inspector-meta-table">
            <div class="inspector-meta-row">
              <span>Issued:</span>
              <span class="inspector-meta-val">${n.date}</span>
            </div>
            ${n.credentialId?`
              <div class="inspector-meta-row">
                <span>Credential ID:</span>
                <span class="inspector-meta-val">${n.credentialId}</span>
              </div>
            `:""}
            <div class="inspector-meta-row">
              <span>Category:</span>
              <span class="inspector-meta-val">${n.category}</span>
            </div>
            ${n.score?`
              <div class="inspector-meta-row">
                <span>Result:</span>
                <span class="inspector-meta-val">${n.score}</span>
              </div>
            `:""}
          </div>

          <div style="margin-top: 10px;">
            <span style="font-size: 0.76rem; color: #8b949e; font-weight: 700; text-transform: uppercase;">Skills Demonstrated</span>
            <div class="inspector-skills-list">
              ${n.skills.map(l=>`<div class="inspector-skill-item"><i class="fas fa-check-circle"></i> <span>${l}</span></div>`).join("")}
            </div>
          </div>
        </div>

        <div class="inspector-actions">
          ${n.verificationUrl?`
            <a href="${n.verificationUrl}" target="_blank" class="btn-inspector-primary">
              View Verification <i class="fas fa-external-link-alt"></i>
            </a>
          `:""}
          ${n.pdfUrl?`
            <a href="${n.pdfUrl}" target="_blank" class="btn-inspector-secondary" download>
              <i class="fas fa-download"></i> Download PDF
            </a>
          `:""}
        </div>
      </div>
    `;const r=t.querySelector("#cert-nav-prev"),o=t.querySelector("#cert-nav-next");r&&i>0&&r.addEventListener("click",()=>{L=s[i-1].id,H()}),o&&i<s.length-1&&o.addEventListener("click",()=>{L=s[i+1].id,H()});const d=t.querySelector("#inspector-preview-trigger");d&&d.addEventListener("click",()=>Be(n))}}function Be(s){let e=document.querySelector("#cert-lightbox-modal");e||(e=document.createElement("div"),e.id="cert-lightbox-modal",e.className="finder-lightbox active",document.body.appendChild(e)),e.innerHTML=`
    <div class="finder-lightbox-backdrop" id="cert-lightbox-backdrop"></div>
    <div class="finder-lightbox-container">
      <button class="finder-lightbox-close" id="cert-lightbox-close" aria-label="Close modal">
        <i class="fas fa-times"></i> <span>Close</span>
      </button>
      <img src="${s.image}" alt="${s.title}" class="finder-lightbox-img" onerror="this.src='src/assets/enterprise_rag_agent.png'" />
      <div class="finder-lightbox-caption">${s.title} — ${s.issuer} (${s.date})</div>
    </div>
  `,e.classList.add("active"),document.body.classList.add("finder-lightbox-open");const t=()=>{e.classList.remove("active"),document.body.classList.remove("finder-lightbox-open")},a=e.querySelector("#cert-lightbox-backdrop"),i=e.querySelector("#cert-lightbox-close");a&&a.addEventListener("click",t),i&&i.addEventListener("click",t);const n=r=>{r.key==="Escape"&&(t(),document.removeEventListener("keydown",n))};document.addEventListener("keydown",n)}function Re(){document.querySelectorAll(".btn, .filter-btn, button:not(.mobile-toggle):not(.mobile-close):not(#back-to-top)").forEach(e=>{e.addEventListener("mousemove",t=>{const a=e.getBoundingClientRect(),i=t.clientX-a.left-a.width/2,n=t.clientY-a.top-a.height/2;e.style.transform=`translate(${i*.3}px, ${n*.3}px)`,e.style.transition="transform 0.1s ease-out"}),e.addEventListener("mouseleave",()=>{e.style.transform="translate(0, 0)",e.style.transition="transform 0.3s ease"})})}function Ne(){if(window.innerWidth<=768||window.matchMedia("(pointer: coarse)").matches||document.querySelector(".cursor"))return;const s=document.createElement("div");s.classList.add("cursor");const e=document.createElement("div");e.classList.add("cursor-follower"),document.body.appendChild(s),document.body.appendChild(e),document.body.classList.add("custom-cursor-active");let t=-100,a=-100,i=-100,n=-100,r=!0,o=!1;document.addEventListener("mousemove",l=>{t=l.clientX,a=l.clientY,r=!0,o||(i=t,n=a,o=!0),s.style.transform=`translate3d(${t}px, ${a}px, 0) translate(-50%, -50%)`});function d(){if(r){const l=t-i,h=a-n;i+=l*.25,n+=h*.25,e.style.transform=`translate3d(${i}px, ${n}px, 0) translate(-50%, -50%)`,Math.abs(l)<.05&&Math.abs(h)<.05&&(r=!1)}requestAnimationFrame(d)}d(),document.addEventListener("mouseover",l=>{l.target.closest("a, button, .btn, input, textarea, select, .project-card, .skill-card, .timeline-item, .achievement-card, .filter-btn")&&(s.classList.add("hover"),e.classList.add("hover"))}),document.addEventListener("mouseout",l=>{l.target.closest("a, button, .btn, input, textarea, select, .project-card, .skill-card, .timeline-item, .achievement-card, .filter-btn")&&(s.classList.remove("hover"),e.classList.remove("hover"))})}document.addEventListener("DOMContentLoaded",async function(){window.AOS&&AOS.init(),ue(),se(),ne();try{await de()}catch(s){console.error("EmailJS initialization failed:",s)}await Ee(),await ye(),await Ce(),Oe(),be(),Re(),Ne(),"serviceWorker"in navigator&&window.addEventListener("load",()=>{navigator.serviceWorker.register("./sw.js").then(s=>{}).catch(s=>{})})});
//# sourceMappingURL=index-CkbZnsIa.js.map

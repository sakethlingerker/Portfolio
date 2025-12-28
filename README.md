# Saketh Lingerker | Professional Portfolio 🚀

A high-performance, premium portfolio website built for the modern web. This project has evolved from a simple static page into a modular, Vite-powered web application featuring an interactive NLP chatbot, a project matchmaker, and a futuristic terminal interface.

[![Deploy to GitHub Pages](https://github.com/sakethlingerker/Portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/sakethlingerker/Portfolio/actions/workflows/deploy.yml)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=flat&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)

## ✨ Key Features

- **🤖 Intelligent Chatbot** - Custom NLP-driven assistant with quick replies and structured data interaction.
- **🧭 Project Matchmaker** - Interactive quiz to recommend the most relevant projects based on user interests.
- **📟 Developer Terminal** - Fully functional CLI-style interface for exploring the codebase and bio.
- **🌓 Adaptive Theme** - Seamless Dark/Light mode transitions with persistent state.
- **📱 Premium Mobile UX** - Enhanced navigation with glassmorphism effects and optimized touch interactions.
- **⚡ High Performance** - Modular architecture, lazy-loaded assets, and optimized build process via Vite.

## 🛠️ Tech Stack

- **Core**: HTML5, Vanilla CSS (Modern Variables & Flex/Grid), JavaScript (ES6 Modules)
- **Tooling**: [Vite](https://vitejs.dev/) (Bundler), [NPM](https://www.npmjs.com/)
- **Libraries**:
  - `Typed.js` (Dynamic typing effects)
  - `AOS` (Scroll animations)
  - `Vanilla Tilt` (3D parallax effects)
  - `EmailJS` (Secure contact form handling)
  - `Font Awesome` (Iconography)

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/sakethlingerker/Portfolio.git
   cd Portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
PORTFOLIO/
├── css/
│   ├── base/           # Core variables, resets, and typography
│   ├── components/     # Modular styles (navbar, terminal, chatbot, etc.)
│   └── utils/          # Helper classes and print styles
├── js/
│   ├── modules/        # Feature-specific logic (email, ui, theme, chatbot)
│   ├── config.js       # App configuration and environment handling
│   └── main.js         # Entry point
├── assets/             # Optimized images, PDFs, and media
├── index.html          # Main entry (Vite processed)
└── vite.config.js      # Build & deployment configuration
```

## ⚙️ Configuration & Secrets

### Email Service (EmailJS)
This project uses GitHub Secrets to handle credentials securely during deployment.

1. **Local Setup**: Create a `.env` file in the root:
   ```env
   VITE_EMAILJS_PUBLIC_KEY=your_key
   VITE_EMAILJS_SERVICE_ID=your_id
   VITE_EMAILJS_TEMPLATE_ID=your_template
   ```

2. **GitHub Deployment**: Add these as **Repository Secrets** in GitHub Settings (`Settings > Secrets and variables > Actions`):
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`

## 👤 Author

**Saketh Lingerker**
- GitHub: [@sakethlingerker](https://github.com/sakethlingerker)
- LinkedIn: [Saketh Lingerker](https://linkedin.com/in/sakethlingerker/)
- Email: saketh1805@gmail.com

---
⭐ **If you like this project, feel free to give it a star!**

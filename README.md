# Saketh Lingerker | Portfolio Website

A modern, responsive portfolio website showcasing my work as an AI/ML Engineer and Full-Stack Developer. Built with vanilla HTML, CSS, and JavaScript.

## ✨ Features

- **Modern Design** - Glassmorphism UI with dark/light mode toggle
- **Fully Responsive** - Optimized for desktop, tablet, and mobile
- **Interactive Animations** - Smooth scroll, typing effects, 3D card tilts
- **Project Showcase** - Filterable grid with detailed modals
- **Contact Form** - EmailJS integration for direct messaging
- **SEO Optimized** - Meta tags, Open Graph, and JSON-LD schema

## 🛠️ Tech Stack

**Frontend:** HTML5, CSS3, JavaScript (ES6+)

**Libraries:** Typed.js, AOS, Vanilla Tilt, EmailJS, Font Awesome

## � Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/sakethlingerker/Portfolio.git
   cd Portfolio
   ```

2. **Open `index.html` in your browser** or use a local server:
   ```bash
   python -m http.server 8000
   ```

3. **Customize**
   - Update content in `index.html`
   - Modify styles in `css/style.css`
   - Configure EmailJS in `js/script.js`

## 📁 Structure

```
PORTFOLIO/
├── index.html          # Main HTML
├── css/style.css       # Styles
├── js/script.js        # JavaScript
└── assets/             # Images & files
```

## ⚙️ EmailJS Setup

1. Create account at [EmailJS](https://www.emailjs.com/)
2. Update in `js/script.js`:
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY");
   emailjs.sendForm("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", this)
   ```

##  Author

**Saketh Lingerker**
- GitHub: [@sakethlingerker](https://github.com/sakethlingerker)
- LinkedIn: [Saketh Lingerker](https://linkedin.com/in/sakethlingerker/)
- Email: saketh1805@gmail.com

---

⭐ **Star this repo if you found it helpful!**

# FINAL Execution Plan: Portfolio Modernization

## Goal
Transform the current single-file HTML/CSS/JS portfolio into a structured, optimized, and maintainable Vite project.

## Execution Rules
- **Atomic Operations**: Perform one refactor step at a time.
- **Verification**: Run `npm run dev` or `npm run build` after each major step to ensure no regression.
- **Safety**: Do not delete original files until the new structure is verified.

## Phase 1: Preparation & Structure
1.  **Backup**: Create a distinct copy of the current `index.html` as `index.html.bak` and `css/` as `css_backup/`.
2.  **Initialize Folders**:
    - Create `src/` directory.
    - Create `src/styles`, `src/scripts`, `src/assets`, `src/components`.
    - Create `public/` directory (if not exists).
3.  **Asset Migration**:
    - Move `assets/` content to `src/assets/` (for imported assets) or `public/` (for static references like favicon).
    - *Decision*: Move logo/favicon to `public/`, strict UI images to `src/assets/`.

## Phase 2: Configuration & Dependencies
4.  **Vite Config**:
    - Create/Update `vite.config.js`.
    - Configure alias `@` to resolve to `/src`.
    - Ensure build output is set to `dist/`.
5.  **Tailwind Setup**:
    - Ensure `tailwindcss` and `autoprefixer` are installed.
    - Create `postcss.config.js` and `tailwind.config.js`.
    - Configure Tailwind to scan `./index.html` and `./src/**/*.{js,html}`.
    - Create `src/styles/main.css` with `@tailwind base; @tailwind components; @tailwind utilities;`.

## Phase 3: Code Refactoring (The Heavy Lift)
6.  **CSS Migration**:
    - Read `css/main.css`.
    - Split it into modular files if large, or move content to `src/styles/custom.css`.
    - Import `custom.css` in `src/styles/main.css`.
7.  **JS Modularization**:
    - Create `src/scripts/main.js` as the entry point.
    - **Extract**: Identify the "Theme Toggle" logic in `index.html` -> Move to `src/scripts/theme.js`.
    - **Extract**: Identify "Project Matchmaker" logic -> Move to `src/scripts/matchmaker.js`.
    - **Extract**: Identify "Scroll/Navigation" logic -> Move to `src/scripts/ui.js`.
    - Import all modules in `src/scripts/main.js`.
8.  **HTML Cleanup**:
    - Update `index.html` to remove inline scripts/styles.
    - Change the `<script>` tag to `type="module"` and source `src/scripts/main.js`.
    - Update all `<img>` tags to point to the new asset paths (e.g., `src/assets/...` will be handled by Vite import or public path).

## Phase 4: Optimization & Features
9.  **Image Optimization**:
    - Identify large images in `src/assets`.
    - Convert to WebP format using an external tool or script if possible (or note for user).
10. **SEO & Accessibility**:
    - Audit `index.html` `<head>` tags.
    - Ensure unique `alt` text for all images.
    - Verify `meta` description and keywords (already present, but double-check).
11. **Performance**:
    - Remove unused CSS (PurgeCSS is handled by Tailwind by default in build).
    - Ensure lazy loading is active on images (`loading="lazy"`).

## Phase 5: Deployment Prep
12. **Build Test**:
    - Run `npm run build`.
    - Check the `dist/` folder.
    - Run `npm run preview` to verify the production build locally.
13. **Git Workflow**:
    - Create `.gitignore` (node_modules, dist, .env).
    - Commit changes.

## Verification Checklist
- [ ] Site loads without console errors.
- [ ] Theme toggle works (persists across reload).
- [ ] "Project Matchmaker" functions correctly.
- [ ] Mobile navigation opens/closes smoothly.
- [ ] Build command succeeds.

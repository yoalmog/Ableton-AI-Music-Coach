# Deployment Guide — Ableton AI Music Coach (GitHub Pages)

Custom Domain: **https://abletonaimusiccoach.qd.je**

This guide covers deploying the Ableton AI Music Coach web application to **GitHub Pages** with a custom domain, HTTPS, PWA installation support, SPA routing, and Local Ollama AI configuration.

---

## 1. Push Project to GitHub

1. Initialize git and commit your project:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit - Ableton AI Music Coach"
   \`\`\`
2. Create a new repository on GitHub (e.g., `ableton-ai-music-coach`).
3. Link your remote and push:
   \`\`\`bash
   git remote add origin https://github.com/YOUR_USERNAME/ableton-ai-music-coach.git
   git branch -M main
   git push -u origin main
   \`\`\`

---

## 2. GitHub Pages Configuration & Workflow

The project includes an automated GitHub Actions deployment workflow located at `.github/workflows/deploy.yml`.

1. Go to your GitHub repository in the browser.
2. Navigate to **Settings** > **Pages**.
3. Under **Build and deployment**, select **Source**: **GitHub Actions**.
4. The `.github/workflows/deploy.yml` workflow will automatically run on every push to `main`, building the React application, copying `public/CNAME` and creating `dist/404.html` for SPA routing, and publishing the `dist/` directory to GitHub Pages.

---

## 3. Custom Domain & DNS Configuration (DigitalPlat / Registrar)

A `public/CNAME` file containing `abletonaimusiccoach.qd.je` is automatically included in the build and deployed to root.

To point your custom domain **abletonaimusiccoach.qd.je** to GitHub Pages, configure your DNS provider (e.g., Cloudflare, Namecheap, DigitalPlat):

### Option A: Apex Domain (`abletonaimusiccoach.qd.je`)
Add the following **A Records** pointing to GitHub Pages IPv4 addresses:
- **Type**: `A` | **Host**: `@` | **Value**: `185.199.108.153`
- **Type**: `A` | **Host**: `@` | **Value**: `185.199.109.153`
- **Type**: `A` | **Host**: `@` | **Value**: `185.199.110.153`
- **Type**: `A` | **Host**: `@` | **Value**: `185.199.111.153`

### Option B: CNAME Record (if using a subdomain)
- **Type**: `CNAME` | **Host**: `abletonaimusiccoach` | **Value**: `YOUR_USERNAME.github.io`

---

## 4. HTTPS (SSL/TLS)

1. In your GitHub repository **Settings** > **Pages**, once DNS has propagated, check the box for **Enforce HTTPS**.
2. GitHub will automatically provision and manage a free Let's Encrypt SSL/TLS certificate for `https://abletonaimusiccoach.qd.je`.

---

## 5. SPA Routing (GitHub Pages 404 Fallback)

Because Ableton AI Music Coach is a client-side React SPA, refreshing or directly opening sub-routes (e.g., `/learn`, `/coach`, `/practice`, `/midi`, `/settings`) would normally trigger a GitHub 404 error. 
- The deployment workflow automatically copies `dist/index.html` to `dist/404.html`, ensuring all routing requests are correctly intercepted and routed by React Router.

---

## 6. PWA (Progressive Web App)

The application includes a Web App Manifest (`public/manifest.json`), icons (`/branding/symbol.png`, `/branding/logo.png`), and a Service Worker (`public/sw.js`). Users visiting `https://abletonaimusiccoach.qd.je` can install the app as a standalone desktop/mobile application.

---

## 7. Local Ollama AI Configuration for Web

GitHub Pages runs purely client-side static hosting and cannot execute server-side AI runtimes.
- **Local Ollama**: If Ollama is running on the user's local computer, the browser connects to `http://127.0.0.1:11434`.
- **LAN Ollama**: If Ollama runs on another machine on the local network, configure the custom Ollama Host endpoint in **AI Settings** (e.g., `http://192.168.1.100:11434`).
- **CORS**: Ensure the Ollama host allows cross-origin requests by starting Ollama with:
  \`\`\`bash
  OLLAMA_ORIGINS="*" ollama serve
  \`\`\`

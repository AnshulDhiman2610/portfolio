# Anshul Dhiman — Portfolio Website

Multi-page, fully responsive portfolio built with **HTML + CSS + JavaScript** and a **reusable Navbar/Footer** loaded across pages.

## Pages
- `index.html` (Home)
- `about.html`
- `whatido.html`
- `projects.html`
- `resume.html`
- `contact.html`
- `achievements.html`

## How to run (important)
This site loads the shared navbar/footer using `fetch()` from `components/`.

Browsers often block `fetch()` when opening HTML directly using `file://...`.
Run it with a local web server instead:

- **VS Code / Cursor**: install “Live Server”, then right-click `index.html` → **Open with Live Server**
- Or PowerShell:

```powershell
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Replace resume
Replace `resume.pdf` with your real resume PDF (keep the filename exactly `resume.pdf`).

## Customize
- **Theme + UI**: `assets/css/main.css`
- **Navbar/Footer injection, active link, typing, animations**: `assets/js/main.js`
- **Shared components**: `components/navbar.html`, `components/footer.html`


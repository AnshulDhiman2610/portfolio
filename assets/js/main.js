async function injectComponent(selector, url) {
  const mount = document.querySelector(selector);
  if (!mount) return null;

  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load ${url}`);
  const html = await res.text();
  mount.innerHTML = html;
  return mount;
}

function setActiveNavLink() {
  const path = (window.location.pathname.split("/").pop() || "index.html").toLowerCase();
  document.querySelectorAll(".nav-link").forEach((a) => {
    const href = (a.getAttribute("href") || "").toLowerCase();
    if (href === path) a.classList.add("is-active");
  });
}

function setupMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (!toggle || !nav) return;

  const close = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    if (isOpen) close();
    else open();
  });

  nav.addEventListener("click", (e) => {
    const target = e.target;
    if (target instanceof HTMLAnchorElement) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  document.addEventListener("click", (e) => {
    if (!(e.target instanceof Element)) return;
    if (!nav.contains(e.target) && !toggle.contains(e.target)) close();
  });
}

function setupRevealAnimations() {
  const els = Array.from(document.querySelectorAll(".reveal"));
  if (els.length === 0) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const ent of entries) {
        if (ent.isIntersecting) {
          ent.target.classList.add("in-view");
          io.unobserve(ent.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

function setupTyping() {
  const el = document.querySelector("[data-typing]");
  if (!el) return;

  const phrases = (el.getAttribute("data-typing") || "")
    .split("|")
    .map((s) => s.trim())
    .filter(Boolean);
  if (phrases.length === 0) return;

  let p = 0;
  let i = 0;
  let deleting = false;

  const tick = () => {
    const current = phrases[p];
    const next = deleting ? current.slice(0, i - 1) : current.slice(0, i + 1);
    el.textContent = next;

    if (!deleting) i++;
    else i--;

    let delay = deleting ? 45 : 65;
    if (!deleting && i === current.length) {
      delay = 900;
      deleting = true;
    } else if (deleting && i === 0) {
      deleting = false;
      p = (p + 1) % phrases.length;
      delay = 220;
    }

    window.setTimeout(tick, delay);
  };

  tick();
}

function setFooterYear() {
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = String(new Date().getFullYear());
}

function setupScrollUX() {
  const progress = document.createElement("div");
  progress.className = "scroll-progress";
  progress.innerHTML = `<div class="scroll-progress-bar" aria-hidden="true"></div>`;
  document.body.appendChild(progress);

  const bar = progress.querySelector(".scroll-progress-bar");

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Back to top");
  toTop.innerHTML = `<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>`;
  document.body.appendChild(toTop);

  toTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  const update = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop || 0;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (bar) bar.style.width = `${pct}%`;

    if (scrollTop > 420) toTop.classList.add("is-visible");
    else toTop.classList.remove("is-visible");
  };

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
}

async function init() {
  await injectComponent("#site-nav", "components/navbar.html");
  await injectComponent("#site-footer", "components/footer.html");

  setActiveNavLink();
  setupMobileNav();
  setupRevealAnimations();
  setupTyping();
  setFooterYear();
  setupScrollUX();
}

init().catch((err) => {
  console.error(err);
});


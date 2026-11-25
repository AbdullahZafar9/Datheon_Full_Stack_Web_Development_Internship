const root = document.documentElement;
const themeBtn = document.querySelector("#theme-toggle");
const menuBtn = document.querySelector("#menu-toggle");
const nav = document.querySelector("#site-nav");
const dialog = document.querySelector("#project-dialog");
const dialogContent = document.querySelector("#dialog-content");
const form = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");
const themeMeta = document.querySelector('meta[name="theme-color"]');

let lastFocus = null;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  localStorage.setItem("az-theme", theme);
  const dark = theme === "dark";
  themeBtn.setAttribute("aria-pressed", String(dark));
  themeBtn.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
  if (themeMeta) themeMeta.setAttribute("content", dark ? "#07111f" : "#f6f1e8");
}

themeBtn.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
});

applyTheme(root.getAttribute("data-theme") || "dark");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  document.body.classList.toggle("nav-open", open);
}

menuBtn.addEventListener("click", () => {
  setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

window.addEventListener("resize", () => {
  if (window.innerWidth >= 760) setMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && nav.classList.contains("is-open")) setMenu(false);
});

function openProject(id) {
  const template = document.querySelector(`#tpl-${id}`);
  if (!template) return;
  lastFocus = document.activeElement;
  dialogContent.replaceChildren(template.content.cloneNode(true));
  dialog.showModal();
  const closeBtn = dialog.querySelector("[data-close]");
  closeBtn.focus();
}

document.querySelectorAll("[data-open-project]").forEach((button) => {
  button.addEventListener("click", () => openProject(button.getAttribute("data-open-project")));
});

dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener("close", () => {
  dialogContent.replaceChildren();
  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get("name") || "").trim();
  const email = String(data.get("email") || "").trim();
  const message = String(data.get("message") || "").trim();
  const subject = encodeURIComponent(`Portfolio note from ${name}`);
  const body = encodeURIComponent(`${message}\n\n— ${name}\n${email}`);
  formStatus.textContent = "Opening your email app…";
  window.location.href = `mailto:qazia7513@gmail.com?subject=${subject}&body=${body}`;
});

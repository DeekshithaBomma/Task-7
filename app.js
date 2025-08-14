const API = "https://jsonplaceholder.typicode.com/users";
const usersEl = document.getElementById("users");
const statusEl = document.getElementById("status");
const reloadBtn = document.getElementById("reloadBtn");

function setStatus(msg = "", asError = false) {
  statusEl.className = asError ? "error" : "";
  statusEl.textContent = msg;
}

function showSkeleton(count = 8) {
  usersEl.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const sk = document.createElement("div");
    sk.className = "skeleton";
    usersEl.appendChild(sk);
  }
}

function renderUsers(users) {
  usersEl.innerHTML = users.map(u => {
    const addr = u.address ? `${u.address.suite}, ${u.address.street}, ${u.address.city} — ${u.address.zipcode}` : "N/A";
    return `
      <article class="card">
        <h2>${escapeHTML(u.name)}</h2>
        <div class="row">👤 <strong>${escapeHTML(u.username)}</strong></div>
        <div class="row">✉️ <a href="mailto:${encodeURI(u.email)}">${escapeHTML(u.email)}</a></div>
        <div class="row">📍 ${escapeHTML(addr)}</div>
        <div class="row">🌐 <a href="http://${encodeURI(u.website)}" target="_blank" rel="noopener">${escapeHTML(u.website)}</a></div>
        <div class="row">🏢 ${u.company ? escapeHTML(u.company.name) : "—"}</div>
      </article>
    `;
  }).join("");
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function fetchUsers() {
  try {
    setStatus("Loading users…");
    showSkeleton(8);
    const res = await fetch(API, { headers: { "Accept": "application/json" } });
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
    const data = await res.json();
    renderUsers(data);
    setStatus(`Loaded ${data.length} users.`);
  } catch (err) {
    console.error(err);
    usersEl.innerHTML = "";
    setStatus(`Failed to load users. ${err.message}. Check your internet and try again.`, true);
  }
}

reloadBtn.addEventListener("click", fetchUsers);
window.addEventListener("DOMContentLoaded", fetchUsers);

// Optional UX: tell user when they go offline/online
window.addEventListener("offline", () => setStatus("You are offline. Reload when back online.", true));
window.addEventListener("online", () => setStatus("Back online. Click Reload to refresh."));

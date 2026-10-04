(function () {
  const G = window.GALLERY;
  const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (id) => document.getElementById(id);
  const colorOf = (p) => (G.categories.find((c) => c.name === p.category) || {}).color || "blue";

  $("title").textContent = G.title;
  $("script").textContent = G.script;
  $("intro").textContent = G.intro;
  $("owner").textContent = G.owner;
  $("footer").textContent = G.footer;

  // ---------- thumbnails ----------
  function placeholderThumb(p) {
    if (p.view === "dataviz") {
      const bars = [34, 58, 44, 76, 62, 88, 70].map((h, i) =>
        `<rect x="${24 + i * 36}" y="${118 - h}" width="24" height="${h}" rx="4" fill="${i % 2 ? "#7A1F35" : "#14172B"}"/>`).join("");
      return `<svg viewBox="0 0 280 140" role="img" aria-label="Placeholder chart"><line x1="14" y1="118" x2="268" y2="118" stroke="#14172B" stroke-width="2"/>${bars}</svg>`;
    }
    return `<svg viewBox="0 0 280 140" role="img" aria-label="Placeholder app screen"><rect x="84" y="10" width="112" height="124" rx="14" fill="none" stroke="#14172B" stroke-width="2"/><rect x="98" y="26" width="84" height="12" rx="6" fill="#14172B"/><rect x="98" y="48" width="38" height="32" rx="8" fill="#7A1F35"/><rect x="144" y="48" width="38" height="32" rx="8" fill="#14172B" opacity=".25"/><rect x="98" y="90" width="84" height="10" rx="5" fill="#14172B" opacity=".25"/><rect x="98" y="108" width="52" height="10" rx="5" fill="#14172B" opacity=".25"/></svg>`;
  }
  const thumb = (p) => p.thumb
    ? `<img src="${esc(p.thumb)}" alt="${esc(p.thumbAlt || p.title)}" loading="lazy">`
    : placeholderThumb(p);

  // ---------- filters + cards ----------
  let active = "All projects";
  const names = ["All projects"].concat(G.categories.map((c) => c.name));

  function renderFilters() {
    $("filters").innerHTML = names.map((n) =>
      `<button class="chip" type="button" aria-pressed="${n === active}" data-filter="${esc(n)}">${esc(n)}</button>`).join("");
  }

  function renderCards() {
    const list = G.projects.filter((p) => active === "All projects" || p.category === active);
    $("count").textContent = active === "All projects"
      ? `${list.length} project${list.length === 1 ? "" : "s"}`
      : `${list.length} of ${G.projects.length} projects`;
    $("cards").innerHTML = list.map((p) => `
      <button class="card ${colorOf(p)}" type="button" data-open="${esc(p.id)}" aria-haspopup="dialog">
        <span class="thumb ${p.thumbFit === "bleed" ? "bleed" : ""}">${thumb(p)}</span>
        <span class="meta">
          <span class="tag">${esc(p.category)}${p.status === "soon" ? " · In progress" : ""}</span>
          <span class="name">${esc(p.title)}</span>
          <span class="hook">${esc(p.hook)}</span>
        </span>
      </button>`).join("");
  }

  $("filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-filter]");
    if (!b) return;
    active = b.dataset.filter;
    renderFilters();
    renderCards();
  });

  // ---------- detail views ----------
  const tags = (p) => `<ul class="tags">${p.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;

  function actions(p) {
    const b = (label, href, primary) => href
      ? `<a class="btn ${primary ? "primary" : ""}" href="${esc(href)}" target="_blank" rel="noopener">${label}</a>`
      : `<span class="btn off" aria-disabled="true">${label}</span>`;
    return `<div class="actions">${b(p.status === "soon" ? "Coming soon" : (p.openLabel || "Open app"), p.links.app, true)}${b("View code", p.links.code)}</div>`;
  }

  function head(p) {
    return `
      <div class="sheet-head">
        <span class="pill-dark">${esc(p.category)}${p.status === "soon" ? " · In progress" : ""}</span>
        <button class="close" type="button" data-close>Close</button>
      </div>
      <h2 id="detail-title">${esc(p.title)}</h2>
      <p class="lead">${esc(p.hook)}</p>`;
  }

  const views = {
    default(p) {
      return `${head(p)}
        <div class="viz ${p.heroPortrait ? "portrait" : ""}">${p.hero ? `<img src="${esc(p.hero)}" alt="${esc(p.heroAlt || p.title)}" loading="lazy">` : thumb(p)}</div>
        <p>${esc(p.about)}</p>
        <h3>How I built it</h3>
        <ul class="built">${p.built.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
        ${tags(p)}${actions(p)}`;
    },
    dataviz(p) {
      return `${head(p)}
        <div class="viz ${colorOf(p)}">${thumb(p)}</div>
        <dl class="facts">
          <div><dt>Question</dt><dd>${esc(p.question)}</dd></div>
          <div><dt>Data</dt><dd>${esc(p.source)}</dd></div>
          <div class="finding"><dt>Key finding</dt><dd>${esc(p.finding)}</dd></div>
        </dl>
        ${tags(p)}${actions(p)}`;
    },
    purposes(p) {
      const tabs = p.purposes.map((u, i) =>
        `<button role="tab" type="button" class="tab" id="tab-${i}" aria-selected="${i === 0}" aria-controls="panel" data-tab="${i}">${esc(u.label)}</button>`).join("");
      return `${head(p)}
        <p class="label">Use it for</p>
        <div class="tabs" role="tablist" aria-label="Ways to use ${esc(p.title)}">${tabs}</div>
        <div class="panel" id="panel" role="tabpanel" aria-labelledby="tab-0"><p>${esc(p.purposes[0].text)}</p></div>
        ${tags(p)}${actions(p)}`;
    }
  };

  const dlg = $("detail");
  let current = null, opener = null;

  function open(id, fromEl) {
    const p = G.projects.find((x) => x.id === id);
    if (!p) return;
    current = p; opener = fromEl || null;
    $("sheet").innerHTML = (views[p.view] || views.default)(p);
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
    history.replaceState(null, "", "#" + id);
  }

  function close() {
    if (dlg.open) dlg.close();
  }

  dlg.addEventListener("close", () => {
    history.replaceState(null, "", location.pathname + location.search);
    if (opener && document.contains(opener)) opener.focus();
    current = null;
  });
  dlg.addEventListener("click", (e) => {
    if (e.target === dlg || e.target.closest("[data-close]")) close();
    const tab = e.target.closest("[data-tab]");
    if (tab && current && current.purposes) {
      const i = +tab.dataset.tab;
      dlg.querySelectorAll(".tab").forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      const panel = $("panel");
      panel.setAttribute("aria-labelledby", tab.id);
      panel.innerHTML = `<p>${esc(current.purposes[i].text)}</p>`;
    }
  });

  $("cards").addEventListener("click", (e) => {
    const c = e.target.closest("[data-open]");
    if (c) open(c.dataset.open, c);
  });

  renderFilters();
  renderCards();
  if (location.hash.length > 1) open(decodeURIComponent(location.hash.slice(1)));
})();

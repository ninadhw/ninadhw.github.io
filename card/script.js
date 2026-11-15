(() => {
  const cfg = window.CARD_CONFIG || {};
  const links = document.getElementById("contact-links");
  const tagline = document.getElementById("tagline");
  const location = document.getElementById("location");

  document.title = `${cfg.name || "Ninad Watve"} — Digital Visiting Card`;
  document.getElementById("person-name").textContent = cfg.name || "Ninad Watve";

  if (cfg.tagline) {
    tagline.textContent = cfg.tagline;
    tagline.hidden = false;
  }
  if (cfg.location) location.textContent = cfg.location;

  const items = [
    ["Email", cfg.email ? `mailto:${cfg.email}` : ""],
    ["Call", cfg.phone ? `tel:${cfg.phone.replace(/[^\d+]/g, "")}` : ""],
    ["WhatsApp", cfg.whatsapp ? `https://wa.me/${cfg.whatsapp.replace(/\D/g, "")}` : ""],
    ["Website", cfg.website],
    ["LinkedIn", cfg.linkedin],
    ["Instagram", cfg.instagram],
    ["GitHub", cfg.github]
  ];

  items.forEach(([label, href]) => {
    if (!href) return;
    const a = document.createElement("a");
    a.className = "contact-link";
    a.href = href;
    a.textContent = label;
    if (/^https?:\/\//i.test(href)) {
      a.target = "_blank";
      a.rel = "noopener noreferrer";
    }
    const arrow = document.createElement("span");
    arrow.className = "arrow";
    arrow.setAttribute("aria-hidden", "true");
    arrow.textContent = "↗";
    a.appendChild(arrow);
    links.appendChild(a);
  });

  document.getElementById("save-contact").addEventListener("click", () => {
    const fullName = cfg.name || "Ninad Watve";
    const parts = fullName.trim().split(/\s+/);
    const last = parts.length > 1 ? parts.pop() : "";
    const first = parts.join(" ");
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${escapeVCard(last)};${escapeVCard(first)};;;`,
      `FN:${escapeVCard(fullName)}`
    ];
    if (cfg.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCard(cfg.email)}`);
    if (cfg.phone) lines.push(`TEL;TYPE=CELL:${escapeVCard(cfg.phone)}`);
    if (cfg.website) lines.push(`URL:${escapeVCard(cfg.website)}`);
    if (cfg.linkedin) lines.push(`X-SOCIALPROFILE;TYPE=linkedin:${escapeVCard(cfg.linkedin)}`);
    if (cfg.location) lines.push(`ADR;TYPE=WORK:;;;;${escapeVCard(cfg.location)};;;`);
    lines.push("END:VCARD");

    const blob = new Blob([lines.join("\r\n") + "\r\n"], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Ninad-Watve.vcf";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  });

  function escapeVCard(value) {
    return String(value).replace(/\\/g, "\\\\").replace(/\n/g, "\\n")
      .replace(/,/g, "\\,").replace(/;/g, "\\;");
  }
})();

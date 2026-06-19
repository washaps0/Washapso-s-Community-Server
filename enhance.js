(() => {
  const currentPage = location.pathname.split("/").pop() || "index.html";

  const progress = document.createElement("div");
  progress.className = "page-progress";
  document.body.prepend(progress);

  document.querySelectorAll(".nav-links a").forEach((link) => {
    if (link.getAttribute("href") === currentPage) link.classList.add("active");
  });

  const revealItems = document.querySelectorAll(".card,.step,.ip-box,.time-schedule,.time-note,.section-title");
  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min(index * 35, 220)}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));

  document.querySelectorAll(".ip").forEach((ip) => {
    const badge = document.createElement("span");
    badge.className = "copy-badge";
    badge.textContent = "Скопировано";
    ip.after(badge);
    ip.title = "Нажми, чтобы скопировать";
    ip.addEventListener("click", async () => {
      const text = ip.textContent.trim();
      const showBadge = (message) => {
        badge.textContent = message;
        badge.classList.add("show");
        window.setTimeout(() => badge.classList.remove("show"), 1400);
      };
      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
          showBadge("Скопировано");
          return;
        }
        throw new Error("Clipboard API is unavailable");
      } catch {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.left = "-999px";
        document.body.append(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        showBadge(copied ? "Скопировано" : "Выдели и скопируй");
      }
    });
  });

  document.querySelectorAll(".card,.step").forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
      card.style.transform = `translateY(-7px) rotateX(${y}deg) rotateY(${x}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });

  const rows = [...document.querySelectorAll(".time-row")];
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  let activeRow = null;
  rows.forEach((row) => {
    const timeText = row.querySelector(".time-cell")?.textContent.trim() || "";
    const match = timeText.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return;
    const rowMinutes = Number(match[1]) * 60 + Number(match[2]);
    if (rowMinutes <= currentMinutes) activeRow = row;
  });
  activeRow?.classList.add("active");

  const toTop = document.createElement("button");
  toTop.className = "to-top";
  toTop.type = "button";
  toTop.setAttribute("aria-label", "Наверх");
  toTop.textContent = "↑";
  document.body.append(toTop);
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    progress.style.width = `${ratio * 100}%`;
    toTop.classList.toggle("show", window.scrollY > 420);
  };
  updateScroll();
  window.addEventListener("scroll", updateScroll, { passive: true });
})();

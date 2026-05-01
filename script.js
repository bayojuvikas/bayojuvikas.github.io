const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const focusWords = [
  "agentic AI systems",
  "voice assistants",
  "LLM workflows",
  "multi-agent products",
];
const typedFocus = document.querySelector("#typedFocus");
let focusIndex = 0;
let charIndex = 0;
let deleting = false;

function typeFocus() {
  if (!typedFocus) return;

  const word = focusWords[focusIndex];
  typedFocus.textContent = word.slice(0, charIndex);

  if (!deleting && charIndex < word.length) {
    charIndex += 1;
    setTimeout(typeFocus, 72);
    return;
  }

  if (!deleting && charIndex === word.length) {
    deleting = true;
    setTimeout(typeFocus, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    setTimeout(typeFocus, 34);
    return;
  }

  deleting = false;
  focusIndex = (focusIndex + 1) % focusWords.length;
  setTimeout(typeFocus, 260);
}

typeFocus();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((item) => revealObserver.observe(item));

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.done) return;

      entry.target.dataset.done = "true";
      const target = Number(entry.target.dataset.count);
      const isDecimal = !Number.isInteger(target);
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / 1100, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = target * eased;
        entry.target.textContent = isDecimal ? value.toFixed(2) : Math.round(value);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          entry.target.textContent = isDecimal ? target.toFixed(2) : target;
        }
      }

      requestAnimationFrame(update);
    });
  },
  { threshold: 0.65 }
);

document.querySelectorAll("[data-count]").forEach((counter) => counterObserver.observe(counter));

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    document.querySelectorAll("[data-project]").forEach((card) => {
      const categories = card.dataset.project.split(" ");
      card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
    });
  });
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 8;
    const rotateX = ((y / rect.height) - 0.5) * -8;

    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "";
  });
});

const themeToggle = document.querySelector("#themeToggle");

themeToggle?.addEventListener("click", () => {
  document.body.classList.toggle("dark-theme");
});

const canvas = document.querySelector("#networkCanvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let pointer = { x: 0, y: 0, active: false };

function readCssColor(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function resizeCanvas() {
  if (!canvas || !ctx) return;

  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const count = Math.min(90, Math.max(38, Math.floor(window.innerWidth / 18)));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.45,
    vy: (Math.random() - 0.5) * 0.45,
    r: Math.random() * 1.8 + 1,
  }));
}

function drawNetwork() {
  if (!canvas || !ctx) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const lineColor = readCssColor("--canvas-line");
  const dotColor = readCssColor("--canvas-dot");

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < 0 || particle.x > window.innerWidth) particle.vx *= -1;
    if (particle.y < 0 || particle.y > window.innerHeight) particle.vy *= -1;

    if (pointer.active) {
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 160) {
        particle.x -= dx * 0.002;
        particle.y -= dy * 0.002;
      }
    }
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 135) {
        ctx.globalAlpha = 1 - distance / 135;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  ctx.globalAlpha = 1;
  particles.forEach((particle) => {
    ctx.fillStyle = dotColor;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawNetwork);
}

if (canvas && ctx) {
  resizeCanvas();
  drawNetwork();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}

const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const bootScreen = document.querySelector("#bootScreen");
const bootLines = document.querySelector("#bootLines");
const bootProgress = document.querySelector("#bootProgress");
const bootMessages = [
  "loading profile: vikas_bayoju.ai",
  "connecting agents: langchain / langgraph / langsmith",
  "mounting systems: forecasting / voice / nlp",
  "verifying proof: mar-a-thon / 10 lakhs / 50k subscribers",
  "portfolio ready",
];

function runBoot() {
  if (!bootScreen || !bootLines || !bootProgress) {
    return;
  }

  let index = 0;
  const timer = window.setInterval(() => {
    const line = document.createElement("div");
    line.textContent = `> ${bootMessages[index]}`;
    bootLines.appendChild(line);
    bootProgress.style.width = `${((index + 1) / bootMessages.length) * 100}%`;
    index += 1;

    if (index === bootMessages.length) {
      window.clearInterval(timer);
      window.setTimeout(() => {
        bootScreen.classList.add("done");
      }, 520);
    }
  }, 260);
}

runBoot();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((item) => {
  revealObserver.observe(item);
});

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || entry.target.dataset.counted) {
        return;
      }

      entry.target.dataset.counted = "true";
      const target = Number(entry.target.dataset.count);
      const isDecimal = !Number.isInteger(target);
      const start = performance.now();

      function update(now) {
        const progress = Math.min((now - start) / 1000, 1);
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
  { threshold: 0.6 }
);

document.querySelectorAll("[data-count]").forEach((counter) => {
  counterObserver.observe(counter);
});

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter").forEach((item) => {
      item.classList.remove("active");
    });
    button.classList.add("active");

    document.querySelectorAll("[data-project]").forEach((card) => {
      const categories = card.dataset.project.split(" ");
      const shouldHide = filter !== "all" && !categories.includes(filter);
      card.classList.toggle("hidden", shouldHide);
    });
  });
});

const stackConsole = document.querySelector("#stackConsole");
const stackText = `const vikas = {
  role: "AI Engineer",
  languages: ["Python", "JavaScript basics", "Bash"],
  orchestration: ["LangChain", "LangGraph", "LangSmith"],
  interfaces: ["FastAPI", "Streamlit", "REST APIs"],
  voice: ["Whisper", "pyttsx3", "STT/TTS"],
  ml: ["PyTorch", "TensorFlow", "Scikit-learn"],
  focus: "agentic systems that ship"
};`;

let consoleStarted = false;
const consoleObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || consoleStarted || !stackConsole) {
        return;
      }

      consoleStarted = true;
      let i = 0;
      const type = () => {
        stackConsole.textContent = stackText.slice(0, i);
        i += 1;

        if (i <= stackText.length) {
          window.setTimeout(type, 14);
        }
      };

      type();
    });
  },
  { threshold: 0.45 }
);

if (stackConsole) {
  consoleObserver.observe(stackConsole);
}

const cursorLight = document.querySelector("#cursorLight");
const scrollMeter = document.querySelector("#scrollMeter");
const magneticItems = document.querySelectorAll(".magnetic");

window.addEventListener("pointermove", (event) => {
  document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
  document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);

  if (cursorLight) {
    cursorLight.style.transform = `translate(${event.clientX - 180}px, ${event.clientY - 180}px)`;
  }
});

window.addEventListener("scroll", () => {
  if (!scrollMeter) {
    return;
  }

  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? (window.scrollY / max) * 100 : 0;
  scrollMeter.style.width = `${progress}%`;
});

magneticItems.forEach((item) => {
  item.addEventListener("pointermove", (event) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const moveX = (x - rect.width / 2) * 0.025;
    const moveY = (y - rect.height / 2) * 0.025;

    item.style.transform = `translate(${moveX}px, ${moveY}px)`;
    item.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
    item.style.setProperty("--my", `${(y / rect.height) * 100}%`);
  });

  item.addEventListener("pointerleave", () => {
    item.style.transform = "";
  });
});

const canvas = document.querySelector("#signalCanvas");
const ctx = canvas?.getContext("2d");
let particles = [];
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };

function resizeCanvas() {
  if (!canvas || !ctx) {
    return;
  }

  const scale = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * scale);
  canvas.height = Math.floor(window.innerHeight * scale);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);

  const count = Math.min(120, Math.max(48, Math.floor(window.innerWidth / 14)));
  particles = Array.from({ length: count }, (_, index) => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * 0.34,
    vy: (Math.random() - 0.5) * 0.34,
    r: index % 9 === 0 ? 2.2 : Math.random() * 1.4 + 0.6,
  }));
}

function drawSignal() {
  if (!canvas || !ctx) {
    return;
  }

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  particles.forEach((particle) => {
    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -10 || particle.x > window.innerWidth + 10) {
      particle.vx *= -1;
    }

    if (particle.y < -10 || particle.y > window.innerHeight + 10) {
      particle.vy *= -1;
    }

    if (pointer.active) {
      const dx = pointer.x - particle.x;
      const dy = pointer.y - particle.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 180) {
        particle.x -= dx * 0.0019;
        particle.y -= dy * 0.0019;
      }
    }
  });

  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);

      if (distance < 125) {
        ctx.globalAlpha = (1 - distance / 125) * 0.6;
        ctx.strokeStyle = "#49dcbf";
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
    const pulse = Math.sin(Date.now() * 0.002 + particle.x) * 0.6;
    ctx.fillStyle = particle.r > 2 ? "#8fb3ff" : "#49dcbf";
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, Math.max(0.4, particle.r + pulse * 0.2), 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(drawSignal);
}

if (canvas && ctx) {
  resizeCanvas();
  drawSignal();

  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY, active: true };
  });
  window.addEventListener("pointerleave", () => {
    pointer.active = false;
  });
}

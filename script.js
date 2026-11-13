// Intersection Observer para animações de fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

// Smooth scroll corrigido (ignora href="#" e links que não são âncoras na mesma página)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href && href.length > 1) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  });
});

// --- EFEITO MATRIX (Otimizado com requestAnimationFrame & Resize inteligente) ---
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');
  const fontSize = 14;
  let columns = 0;
  let drops = [];
  let animationFrameId = null;
  let lastDrawTime = 0;
  const fpsInterval = 50; // ~20fps para a cadência ideal do matrix rain

  function initMatrix() {
    if (!canvas.parentElement) return;
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
    columns = Math.max(1, Math.floor(canvas.width / fontSize));
    drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.floor(Math.random() * -50);
    }
  }

  window.addEventListener('resize', initMatrix);
  initMatrix();

  function drawMatrix(currentTime) {
    animationFrameId = requestAnimationFrame(drawMatrix);
    if (!currentTime) currentTime = performance.now();
    const elapsed = currentTime - lastDrawTime;
    if (elapsed < fpsInterval) return;
    lastDrawTime = currentTime - (elapsed % fpsInterval);

    ctx.fillStyle = 'rgba(13, 12, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#c8973a';
    ctx.font = fontSize + 'px "DM Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      if (drops[i] >= 0) {
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      }
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  // Pausa a animação quando a seção Hero não estiver visível (economia de CPU/Bateria)
  const heroSection = document.getElementById('hero');
  if (heroSection && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!animationFrameId) {
            lastDrawTime = performance.now();
            drawMatrix();
          }
        } else {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
          }
        }
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);
  } else {
    drawMatrix();
  }
}

// --- FUNCIONALIDADE DO BOTÃO DE COPIAR E-MAIL ---
const copyBtn = document.getElementById('copy-email-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('gabrielferreira1000gs@gmail.com');
      copyBtn.classList.add('active');
      setTimeout(() => {
        copyBtn.classList.remove('active');
      }, 2000);
    } catch (err) {
      console.error('Falha ao copiar o e-mail: ', err);
    }
  });
}

// --- LÓGICA DO MODAL + BOOT AUTOMÁTICO DO TERMINAL ---
const openTerminalCard = document.getElementById('open-terminal-card');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalOverlay = document.getElementById('terminal-modal');
const outputContainer = document.getElementById('terminal-output-lines');
const terminalBody = document.getElementById('modal-terminal-body');

let hasBooted = false;

if (openTerminalCard && modalOverlay && closeModalBtn) {
  const abrirModal = () => {
    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (!hasBooted) {
      hasBooted = true;
      setTimeout(iniciarBoot, 600);
    }
  };

  const fecharModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };

  openTerminalCard.addEventListener('click', abrirModal);
  openTerminalCard.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      abrirModal();
    }
  });

  closeModalBtn.addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });

  // Fechamento com a tecla Escape
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
      fecharModal();
    }
  });
}

function iniciarBoot() {
  if (!outputContainer) return;
  outputContainer.style.display = 'block';
  const lines = outputContainer.querySelectorAll('p');
  lines.forEach(line => line.classList.add('terminal-line-hidden'));

  let delayAcumulado = 0;
  lines.forEach((line) => {
    setTimeout(() => {
      line.classList.remove('terminal-line-hidden');
      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    }, delayAcumulado);

    const textoDaLinha = line.innerText || line.textContent;
    if (textoDaLinha.includes("./iniciar_portfolio.sh")) {
      delayAcumulado += 700;
    } else if (textoDaLinha.includes("pensando")) {
      delayAcumulado += 800;
    } else if (textoDaLinha.includes("Booting profile") || textoDaLinha.includes("operational")) {
      delayAcumulado += 700;
    } else if (textoDaLinha.includes("gabriel@")) {
      delayAcumulado += 100;
    } else {
      delayAcumulado += Math.floor(Math.random() * 140) + 70;
    }
  });
}

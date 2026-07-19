const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

 

// --- EFEITO MATRIX (Refinado) ---
const canvas = document.getElementById('matrix-canvas');
if (canvas) {
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Letras, números e os clássicos caracteres Katakana do Matrix
  // const chars = '01'.split(''); // Apenas binário para um look mais técnico
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');
  const fontSize = 14;
  const columns = canvas.width / fontSize;
  const drops = [];
  
  // Inicializa as gotas em alturas aleatórias (negativas) para criar o efeito de chuva natural
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.floor(Math.random() * -50); 
  }

  function drawMatrix() {
    ctx.fillStyle = 'rgba(13, 12, 10, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#c8973a'; // O seu dourado
    ctx.font = fontSize + 'px "DM Mono", monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      
      // Só desenha se a gota já tiver entrado na tela
      if (drops[i] >= 0) {
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      }

      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }
  setInterval(drawMatrix, 50);
}


// --- FUNCIONALIDADE DO BOTÃO DE COPIAR E-MAIL ---
const copyBtn = document.getElementById('copy-email-btn');

if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      // Copia o texto para a área de transferência
      await navigator.clipboard.writeText('gabrielferreira1000gs@gmail.com');
      
      // Adiciona a classe que mostra o balão de "Copiado!"
      copyBtn.classList.add('active');
      
      // Remove o balão após 2 segundos
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

let hasBooted = false; // Trava para não rodar a animação duas vezes

if (openTerminalCard && modalOverlay && closeModalBtn) {
  
  // Quando clica no cartão da seção "Sobre"
  openTerminalCard.addEventListener('click', () => {
    modalOverlay.classList.add('active'); // Escurece a tela
    document.body.style.overflow = 'hidden'; // Trava a rolagem da página
    
    // Se for a primeira vez que abre, inicia o boot após 600ms (tempo do modal aparecer)
    if (!hasBooted) {
      hasBooted = true;
      setTimeout(iniciarBoot, 600);
    }
  });

  // Funções de fechar o modal
  const fecharModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
  };
  closeModalBtn.addEventListener('click', fecharModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) fecharModal();
  });
}

// A função mágica que digita as linhas
function iniciarBoot() {
  if (!outputContainer) return;
  
  outputContainer.style.display = 'block';
  const lines = outputContainer.querySelectorAll('p');
  
  // Esconde todas as linhas
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
    
    // Lê o texto para decidir a pausa até imprimir a PRÓXIMA linha
    if (textoDaLinha.includes("./iniciar_portfolio.sh")) {
      delayAcumulado += 800; // Pausa após "digitar" o comando
    }
    else if (textoDaLinha.includes("pensando")) {
      delayAcumulado += 800; // Pausa dramática da IA
    } 
    else if (textoDaLinha.includes("Booting profile") || textoDaLinha.includes("operational")) {
      delayAcumulado += 800;
    } 
    else if (textoDaLinha.includes("gabriel@linux:~$")) {
      delayAcumulado += 100;
    }
    else {
      // Linhas normais caem rápido e de forma aleatória
      delayAcumulado += Math.floor(Math.random() * 170) + 80; 
    }
  });
}

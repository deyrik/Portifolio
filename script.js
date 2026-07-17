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



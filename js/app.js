/* ================= EPISODIOS ================= */

const botones = document.querySelectorAll('.episodios button');
const player  = document.getElementById('player');
const iframe  = player.querySelector("iframe");

const btnAnterior  = document.getElementById('btnAnterior');
const btnActual    = document.getElementById('btnActual');
const btnSiguiente = document.getElementById('btnSiguiente');

const overlay    = document.getElementById("nextOverlay");
const nextCount  = document.getElementById("nextCount");
const cancelNext = document.getElementById("cancelNext");

let vistos = JSON.parse(localStorage.getItem('episodiosVistos')) || [];
let episodioActual = parseInt(localStorage.getItem("episodioActual")) || 0;

let nextTimer = null;
let nextCountdown = null;


/* ================= MARCAR VISTOS ================= */

botones.forEach((btn, index) => {

  if (vistos.includes(btn.dataset.odysee)) {
    btn.classList.add("visto");
  }

  btn.addEventListener("click", () => reproducir(index));
});


/* ================= CONTROLES ================= */

btnAnterior?.addEventListener('click', () => {
  if (episodioActual > 0) reproducir(episodioActual - 1);
});

btnActual?.addEventListener('click', () => {
  reproducir(episodioActual);
});

btnSiguiente?.addEventListener('click', () => {
  if (episodioActual < botones.length - 1) {
    reproducir(episodioActual + 1);
  }
});


/* ================= FUNCIÓN PRINCIPAL ================= */

function reproducir(index){

  episodioActual = index;
  localStorage.setItem("episodioActual", index);

  const btn = botones[index];
  if (!btn) return;

  const ody = btn.dataset.odysee;

  iframe.src = ody + "?autoplay=1";


  /* guardar vistos */

  if (!vistos.includes(ody)){
    vistos.push(ody);
    localStorage.setItem('episodiosVistos', JSON.stringify(vistos));
  }

  botones.forEach(b => b.classList.remove("activo"));
  btn.classList.add("activo","visto");


  /* ================= OVERLAY NEXT ================= */

  clearTimeout(nextTimer);
  clearInterval(nextCountdown);

  overlay?.classList.remove("show");

  if (episodioActual >= botones.length - 1) return;

  nextTimer = setTimeout(() => {

    let segundos = 5;
    nextCount.textContent = segundos;
    overlay.classList.add("show");

    nextCountdown = setInterval(() => {

      segundos--;
      nextCount.textContent = segundos;

      if (segundos <= 0){
        clearInterval(nextCountdown);
        overlay.classList.remove("show");
        reproducir(episodioActual + 1);
      }

    },1000);

  }, 23 * 60 * 1000); // duración episodio


  cancelNext.onclick = () => {
    overlay.classList.remove("show");
    clearInterval(nextCountdown);
  };

  player.scrollIntoView({
    behavior:"smooth",
    block:"center"
  });

}


/* ================= START ================= */

window.addEventListener("load", () => {

  if(botones.length > 0){

    /* evitar error si guardó episodio mayor */
    if(episodioActual >= botones.length){
      episodioActual = 0;
    }

    reproducir(episodioActual);

  }

});